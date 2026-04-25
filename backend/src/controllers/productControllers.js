import Product from "../models/productModel.js";
import { redisWrapper as redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import { scrapeAllPlatforms } from "../services/priceScraper.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProduct");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    //.lean() is used to convert the mongoose object to a plain javascript object
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //store in redis for future quick access
    await redis.set("featuredProduct", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProducts = async (req, res) => {
  try {
    const { name, description, price, image, category, priceComparisons } = req.body;
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      priceComparisons: priceComparisons || [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ message: "Product not found" });
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("image deleted");
      } catch (error) {
        console.log("error deleting image from cloduinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const product = await Product.aggregate([
      {
        $sample: ({ size: 4 })
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1
        }
      }
    ])
    res.json(product);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }
    const regex = new RegExp(q.trim(), "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    });
    res.json(products);
  } catch (error) {
    console.log("Error in searchProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeatureProductCache();
      res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeatureProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProduct", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log("Error in getSingleProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePriceComparison = async (req, res) => {
  try {
    const { priceComparisons } = req.body;
    if (!Array.isArray(priceComparisons)) {
      return res.status(400).json({ message: "priceComparisons must be an array" });
    }

    for (const entry of priceComparisons) {
      if (!entry.platform || !entry.price || !entry.url) {
        return res.status(400).json({ message: "Each entry must have platform, price, and url" });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { priceComparisons },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error in updatePriceComparison controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const comparePrices = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cacheKey = `priceCompare:${product.name}`;
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.json({ ...parsed, ourPrice: product.price, productName: product.name });
    }

    const data = await scrapeAllPlatforms(product.name);

    await redis.set(cacheKey, JSON.stringify(data), "EX", 21600).catch(() => {});

    res.json({ ...data, ourPrice: product.price, productName: product.name });
  } catch (error) {
    console.log("Error in comparePrices controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};