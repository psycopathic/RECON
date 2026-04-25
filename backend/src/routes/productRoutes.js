import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProducts,
  deleteProducts,
  getRecommendedProducts,
  getProductByCategory,
  toggleFeaturedProduct,
  searchProducts,
  getSingleProduct,
  updatePriceComparison,
  comparePrices,
} from "../controllers/productControllers.js";
import {
  protectedRoutes,
  adminRoute,
} from "../middleware.js/authMiddleware.js";
const router = express.Router();

router.get("/", protectedRoutes, adminRoute, getAllProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/compare/:id", comparePrices);
router.get("/:id", getSingleProduct);
router.post("/", protectedRoutes, adminRoute, createProducts);
router.patch("/:id", protectedRoutes, adminRoute, toggleFeaturedProduct);
router.put("/:id/price-comparison", protectedRoutes, adminRoute, updatePriceComparison);
router.delete("/:id", protectedRoutes, adminRoute, deleteProducts);

export default router;
