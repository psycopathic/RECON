import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${response.connection.host}`);
    } catch (error) {
        console.log('error while connecting to mongoDB', error.message);
        process.exit(1);
    }
}