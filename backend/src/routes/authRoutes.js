import express from 'express';
import { signup, login, logout, refreshToken, profile } from '../controllers/authControllers.js';
import { protectedRoutes } from '../middleware.js/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refreshToken', refreshToken)
router.get('/profile', protectedRoutes, profile)

export default router;