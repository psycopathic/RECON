import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './src/routes/authRoutes.js';
import productRouter from './src/routes/productRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';
import couponRouter from './src/routes/couponRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import analyticsRouter from './src/routes/analyticsRoutes.js';

import cors from 'cors';
import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.CLIENT_URL 
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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

if(process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.get('*', (req, res) => {
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