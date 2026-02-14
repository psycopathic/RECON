import jwt from "jsonwebtoken";
import {redisWrapper} from '../lib/redis.js'

export const storeRefreshToken = async (userId,refreshToken) => { 
    try {
        // console.log(1)
        await redisWrapper.set(`refresh token :${userId}`,refreshToken,"EX",7*24*60*60);//7 days expiration
        // console.log(1)
    } catch (error) {
        // console.log(2)
        console.log('error while storing refresh token', error.message);
        throw error; // Re-throw to handle in calling function
    }
}