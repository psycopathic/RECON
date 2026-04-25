import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './src/routes/authRoutes.js';
import productRouter from './src/routes/productRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';
import couponRouter from './src/routes/couponRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import analyticsRouter from './src/routes/analyticsRoutes.js';
import addressRouter from './src/routes/addressRoutes.js';
import notificationRouter from './src/routes/notificationRoutes.js';
import cors from 'cors';
import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file in development, use Render's env vars in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '.env') });
} else {
    // In production (Render), env vars are already set, just call config without path
    dotenv.config();
}

const app = express();
const port = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "https://recon-2-bjrm.onrender.com";

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? CLIENT_URL
        : "http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:"100mb"}));
app.use(cookieParser());

if(process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
}

app.use('/api/auth',authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/address', addressRouter);
app.use('/api/notifications', notificationRouter);

if(process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Backend is running! Frontend at http://localhost:5173')
    });
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    connectDB();
})
