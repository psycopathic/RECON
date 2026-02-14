import express from 'express';
import { protectedRoutes } from '../middleware.js/authMiddleware.js';
import { getCoupons, validateCoupon } from '../controllers/couponControllers.js';

const router = express.Router();

router.get('/', protectedRoutes,getCoupons);
router.post('/validate', protectedRoutes,validateCoupon);

export default router;