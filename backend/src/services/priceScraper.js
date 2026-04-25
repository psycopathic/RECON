import * as cheerio from "cheerio";

const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function cleanPrice(raw) {
  if (!raw) return null;
  const match = raw.match(/[\d,]+\.?\d*/);
  if (!match) return null;
  const cleaned = match[0].replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) || num === 0 ? null : num;
}

async function fetchPage(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractGooglePrices(html, platformDomain) {
  const $ = cheerio.load(html);
  const results = [];

  $("div.sh-dgr__grid-result, div[data-docid], div[class*='grid-result']").slice(0, 5).each((_, el) => {
    const titleEl = $(el).find("h3, span.CcL8Nc, a[class*='sh-nq__title']");
    const title = titleEl.text().trim();
    const priceRaw = $(el).find("span.a8Pemb, span[class*='OFFNJ']").text().trim();
    const price = cleanPrice(priceRaw);
    const linkEl = $(el).find("a.shntl, a[href*='" + platformDomain + "'], a[href*='shopping']");
    const link = linkEl.attr("href") || null;
    const ratingRaw = $(el).find("span.Rsc7Yb, span[class*='Rsc7Yb']").text().trim();
    const ratingMatch = ratingRaw.match(/(\d+\.?\d*)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    if (title && price) {
      results.push({ title, price, link, rating });
    }
  });

  return results;
}

async function scrapeViaGoogle(query, platform, domain) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+site:${domain}&tbm=shop&tbs=mr:1,local_avail:1`;
  const html = await fetchPage(googleUrl);
  if (!html) return [];

  try {
    return extractGooglePrices(html, domain);
  } catch {
    return [];
  }
}

async function scrapeAmazon(query) {
  const html = await fetchPage(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`);
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  if (!html) return { platform: "amazon", searchUrl, results: [] };

  try {
    const $ = cheerio.load(html);
    const results = [];

    $("div[data-component-type='s-search-result'], div.s-result-item").slice(0, 5).each((_, el) => {
      const title = $(el).find("h2 span, h2 a span").first().text().trim();
      const priceWhole = $(el).find("span.a-price-whole").first().text().replace(/[^\d]/g, "");
      const priceFrac = $(el).find("span.a-price-fraction").first().text().trim();
      const rawPrice = priceFrac ? `${priceWhole}.${priceFrac}` : priceWhole;
      const price = rawPrice ? parseFloat(rawPrice) : null;
      const linkEl = $(el).find("h2 a").first();
      const link = linkEl.attr("href")
        ? `https://www.amazon.in${linkEl.attr("href").split("?")[0]}`
        : null;
      const ratingEl = $(el).find("span.a-icon-alt").first().text();
      const ratingMatch = ratingEl.match(/(\d+\.?\d*)/);
      const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

      if (title && price && price > 0) {
        results.push({ title, price, link, rating });
      }
    });

    return { platform: "amazon", searchUrl, results };
  } catch {
    return { platform: "amazon", searchUrl, results: [] };
  }
}

async function scrapeFlipkart(query) {
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
  const html = await fetchPage(searchUrl);
  if (!html) return { platform: "flipkart", searchUrl, results: [] };

  try {
    const $ = cheerio.load(html);
    const results = [];

    $("div._1AtVbE, div.tUxRFH, div[class*='_1sdMkc']").slice(0, 5).each((_, el) => {
      const title =
        $(el).find("div._4rR01T, a.wjcEIp, div.KzDlHZ").first().text().trim() ||
        $(el).find("a.IRpwTa, a.s1Q9rs").first().text().trim();
      const priceRaw = $(el).find("div._30jeq3, div.Nx9iqj").first().text().trim();
      const price = cleanPrice(priceRaw);
      const linkEl = $(el).find("a[href*='/p/']").first();
      const href = linkEl.attr("href");
      const link = href
        ? `https://www.flipkart.com${href.split("?")[0]}`
        : null;
      const ratingRaw = $(el).find("div._3LWZlK, div.XQDdHH").first().text().trim();
      const rating = parseFloat(ratingRaw) || null;

      if (title && price && price > 0) {
        results.push({ title, price, link, rating });
      }
    });

    return { platform: "flipkart", searchUrl, results };
  } catch {
    return { platform: "flipkart", searchUrl, results: [] };
  }
}

async function scrapeSnapdeal(query) {
  const searchUrl = `https://www.snapdeal.com/search?keyword=${encodeURIComponent(query)}`;
  const html = await fetchPage(searchUrl);
  if (!html) return { platform: "snapdeal", searchUrl, results: [] };

  try {
    const $ = cheerio.load(html);
    const results = [];

    $("div.product-tuple-listing, div.product-tuple-inner").slice(0, 5).each((_, el) => {
      const title =
        $(el).find("p.product-title").attr("title") ||
        $(el).find("p.product-title").text().trim();
      const priceRaw = $(el).find("span.product-price").first().text().trim();
      const price = cleanPrice(priceRaw);
      const linkEl = $(el).find("a.dp-widget-link").first();
      const href = linkEl.attr("href") || "";
      const link = href.startsWith("http")
        ? href.split("?")[0]
        : `https://www.snapdeal.com${href.split("?")[0]}`;

      if (title && price && price > 0) {
        results.push({ title, price, link, rating: null });
      }
    });

    return { platform: "snapdeal", searchUrl, results };
  } catch {
    return { platform: "snapdeal", searchUrl, results: [] };
  }
}

async function scrapeMeesho(query) {
  const searchUrl = `https://www.meesho.com/search?q=${encodeURIComponent(query)}`;
  return { platform: "meesho", searchUrl, results: [] };
}

function generateFallbackData(query) {
  return {
    amazon: {
      platform: "amazon",
      searchUrl: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
      results: [],
    },
    flipkart: {
      platform: "flipkart",
      searchUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
      results: [],
    },
    snapdeal: {
      platform: "snapdeal",
      searchUrl: `https://www.snapdeal.com/search?keyword=${encodeURIComponent(query)}`,
      results: [],
    },
    meesho: {
      platform: "meesho",
      searchUrl: `https://www.meesho.com/search?q=${encodeURIComponent(query)}`,
      results: [],
    },
  };
}

export async function scrapeAllPlatforms(query) {
  const [amazon, flipkart, snapdeal, meesho] = await Promise.allSettled([
    scrapeAmazon(query),
    scrapeFlipkart(query),
    scrapeSnapdeal(query),
    scrapeMeesho(query),
  ]);

  const extract = (result, fallbackPlatform) =>
    result.status === "fulfilled" && result.value
      ? result.value
      : { platform: fallbackPlatform, searchUrl: "", results: [] };

  const platforms = [
    extract(amazon, "amazon"),
    extract(flipkart, "flipkart"),
    extract(snapdeal, "snapdeal"),
    extract(meesho, "meesho"),
  ];

  for (const p of platforms) {
    if (!p.searchUrl) {
      const fallback = generateFallbackData(query)[p.platform];
      p.searchUrl = fallback.searchUrl;
    }
  }

  const allPrices = platforms.flatMap((p) =>
    (p.results || []).map((r) => r.price).filter((pr) => pr && pr > 0)
  );

  const avgPrice =
    allPrices.length > 0
      ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length)
      : null;

  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;
  const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : null;

  return {
    query,
    platforms,
    averagePrice: avgPrice,
    lowestPrice,
    highestPrice,
    totalResults: allPrices.length,
    scrapedAt: new Date().toISOString(),
  };
}
