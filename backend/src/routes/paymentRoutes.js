import express from 'express';
import { protectedRoutes } from '../middleware.js/authMiddleware.js';
import { createCheckoutSession, checkoutSession } from '../controllers/paymentControllers.js';

const router = express.Router();

router.post("/createCheckoutSession", protectedRoutes, createCheckoutSession);
router.post('/checkoutSuccess', protectedRoutes, checkoutSession)

export default router;