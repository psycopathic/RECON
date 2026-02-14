import express from 'express';
import { 
    addToCart, 
    getCartProducts, 
    removeAllFromCart, 
    updateQuantity 
} from '../controllers/cartControllers.js';
import { protectedRoutes } from '../middleware.js/authMiddleware.js';

const router = express.Router();

router.get('/', protectedRoutes,getCartProducts);
router.post('/', protectedRoutes,addToCart);
router.delete('/', protectedRoutes,removeAllFromCart);
router.put('/:id',protectedRoutes, updateQuantity);

export default router