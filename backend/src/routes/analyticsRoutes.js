import express from 'express';
import { protectedRoutes, adminRoute } from '../middleware.js/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsControllers.js';

const router = express.Router();

router.get('/',protectedRoutes,adminRoute, getAnalytics)

export default router