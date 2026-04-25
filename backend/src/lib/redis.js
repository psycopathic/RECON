import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

let redisAvailable = false;
let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    redisAvailable = true;
    console.log("Upstash Redis configured successfully");
  } catch (error) {
    console.log("Failed to initialize Upstash Redis:", error.message);
  }
} else {
  console.log("Upstash Redis credentials not found. Running without Redis.");
}

export const redisWrapper = {
  async get(key) {
    if (!redis || !redisAvailable) return null;
    try {
      return await redis.get(key);
    } catch (error) {
      console.log("Redis get error:", error.message);
      return null;
    }
  },

  async set(key, value, ...args) {
    if (!redis || !redisAvailable) return null;
    try {
      if (args.length > 0 && typeof args[0] === "string" && args[0].startsWith("EX")) {
        const ttl = args[1] || parseInt(args[0].replace("EX", "").trim(), 10);
        return await redis.set(key, value, { ex: ttl });
      }
      return await redis.set(key, value);
    } catch (error) {
      console.log("Redis set error:", error.message);
      return null;
    }
  },

  async del(key) {
    if (!redis || !redisAvailable) return null;
    try {
      return await redis.del(key);
    } catch (error) {
      console.log("Redis del error:", error.message);
      return null;
    }
  },
};

export { redis };
