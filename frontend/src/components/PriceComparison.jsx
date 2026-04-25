import React, { useEffect, useState } from "react";
import { ExternalLink, TrendingDown, TrendingUp, Minus, Loader2 } from "lucide-react";
import axios from "../lib/axios.js";

const platformMeta = {
  amazon: {
    label: "Amazon",
    color: "from-orange-500 to-yellow-500",
    bg: "bg-orange-500/10 border-orange-500/20",
    text: "text-orange-400",
  },
  flipkart: {
    label: "Flipkart",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-400",
  },
  snapdeal: {
    label: "Snapdeal",
    color: "from-red-500 to-red-700",
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
  },
  meesho: {
    label: "Meesho",
    color: "from-pink-500 to-purple-500",
    bg: "bg-pink-500/10 border-pink-500/20",
    text: "text-pink-400",
  },
};

const PriceComparison = ({ productId, ourPrice, productName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/products/compare/${productId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchPrices();
  }, [productId]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Compare Prices</h3>
        <div className="w-10 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mb-5" />
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <span className="text-sm text-slate-400">
            Fetching live prices from Amazon, Flipkart, Snapdeal & Meesho...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Compare Prices</h3>
        <div className="w-10 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mb-5" />
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <FallbackLinks productName={productName} ourPrice={ourPrice} />
      </div>
    );
  }

  if (!data) return null;

  const allPrices = [ourPrice];
  const platformCards = (data.platforms || []).map((p) => {
    const meta = platformMeta[p.platform] || {
      label: p.platform,
      color: "from-slate-500 to-slate-700",
      bg: "bg-slate-500/10 border-slate-500/20",
      text: "text-slate-400",
    };
    const results = p.results || [];
    const topResult = results[0] || null;
    if (topResult) allPrices.push(topResult.price);

    return {
      platform: p.platform,
      meta,
      searchUrl: p.searchUrl,
      topResult,
      resultCount: results.length,
      results,
    };
  });

  const avgPrice =
    allPrices.length > 0
      ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length)
      : ourPrice;

  const lowestPrice = Math.min(...allPrices);
  const highestPrice = Math.max(...allPrices);
  const savings = ourPrice - lowestPrice;
  const priceDiff = ourPrice - avgPrice;
  const savingsPercent =
    avgPrice > 0 ? Math.round(((avgPrice - ourPrice) / avgPrice) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">Compare Prices</h3>
        <span className="text-[10px] text-slate-500">
          Live prices &middot; Cached for 6hrs
        </span>
      </div>
      <div className="w-10 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mb-5" />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Market Average
          </p>
          <p className="text-lg font-bold text-white">
            ₹{avgPrice.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Lowest Found
          </p>
          <p className="text-lg font-bold text-emerald-400">
            ₹{lowestPrice.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Highest Found
          </p>
          <p className="text-lg font-bold text-red-400">
            ₹{highestPrice.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            Your Savings
          </p>
          <p
            className={`text-lg font-bold ${
              priceDiff > 0
                ? "text-emerald-400"
                : priceDiff < 0
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {priceDiff > 0 ? (
              <span className="flex items-center gap-1">
                <TrendingDown size={16} />
                ₹{priceDiff.toLocaleString("en-IN")}
              </span>
            ) : priceDiff < 0 ? (
              <span className="flex items-center gap-1">
                <TrendingUp size={16} />
                ₹{Math.abs(priceDiff).toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Minus size={16} />
                Best price
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Our Price Row */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-sky-400 uppercase">R</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Our Store</span>
              {ourPrice <= lowestPrice && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                  Best Price
                </span>
              )}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 uppercase tracking-wider">
                You are here
              </span>
            </div>
            <span className="text-lg font-bold text-gradient">
              ₹{ourPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-500 italic">Current platform</span>
      </div>

      {/* Platform Results */}
      <div className="space-y-3">
        {platformCards.map((card) => {
          const meta = card.meta;
          const topResult = card.topResult;
          const isLowest =
            topResult && topResult.price <= lowestPrice;

          return (
            <div
              key={card.platform}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 gap-3 ${
                isLowest
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-white/5 bg-slate-800/30"
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg ${meta.bg} border flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`text-xs font-bold ${meta.text} uppercase`}
                  >
                    {meta.label.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">
                      {meta.label}
                    </span>
                    {isLowest && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                        Lowest
                      </span>
                    )}
                    {topResult && topResult.rating && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                        ★ {topResult.rating}
                      </span>
                    )}
                  </div>

                  {topResult ? (
                    <>
                      <span className="text-lg font-bold text-gradient">
                        ₹{topResult.price.toLocaleString("en-IN")}
                      </span>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {topResult.title}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">
                      No results found. Click to search manually.
                    </span>
                  )}

                  {card.resultCount > 1 && (
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {card.resultCount} results found
                    </p>
                  )}
                </div>
              </div>

              <a
                href={topResult?.link || card.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r ${meta.color} text-white hover:opacity-90 hover:shadow-lg flex-shrink-0`}
              >
                <>
                  Visit
                  <ExternalLink size={14} />
                </>
              </a>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Prices are fetched live from each platform and cached for 6 hours. Actual
        prices may vary at the time of purchase.
      </p>
    </div>
  );
};

function FallbackLinks({ productName, ourPrice }) {
  const links = [
    {
      label: "Amazon",
      url: `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`,
      color: "from-orange-500 to-yellow-500",
      bg: "bg-orange-500/10 border-orange-500/20",
      text: "text-orange-400",
    },
    {
      label: "Flipkart",
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`,
      color: "from-blue-500 to-blue-700",
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
    },
    {
      label: "Snapdeal",
      url: `https://www.snapdeal.com/search?keyword=${encodeURIComponent(productName)}`,
      color: "from-red-500 to-red-700",
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-400",
    },
    {
      label: "Meesho",
      url: `https://www.meesho.com/search?q=${encodeURIComponent(productName)}`,
      color: "from-pink-500 to-purple-500",
      bg: "bg-pink-500/10 border-pink-500/20",
      text: "text-pink-400",
    },
  ];

  return (
    <div className="space-y-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-800/30 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg ${l.bg} border flex items-center justify-center`}
            >
              <span className={`text-xs font-bold ${l.text}`}>
                {l.label.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-white">{l.label}</span>
          </div>
          <span className="text-xs text-sky-400 flex items-center gap-1">
            Search <Search size={12} />
          </span>
        </a>
      ))}
    </div>
  );
}

export default PriceComparison;
