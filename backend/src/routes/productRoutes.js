import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProducts,
  deleteProducts,
  getRecommendedProducts,
  getProductByCategory,
  toggleFeaturedProduct,
} from "../controllers/productControllers.js";
import {
  protectedRoutes,
  adminRoute,
} from "../middleware.js/authMiddleware.js";
const router = express.Router();

router.get("/", protectedRoutes, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectedRoutes, adminRoute, createProducts);
router.patch("/:id", protectedRoutes, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectedRoutes, adminRoute, deleteProducts);

export default router;
