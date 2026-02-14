import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();

let redis = null;
let redisAvailable = false;

// Only initialize Redis if the URL is properly formatted
if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_URL.startsWith('redis://')) {
  redis = new Redis(process.env.UPSTASH_REDIS_URL);

  redis.on("connect",()=>{
      console.log("Redis is connected");
      redisAvailable = true;
  })

  redis.on("error", (error) => {
      console.log("Redis connection error:", error.message);
      redisAvailable = false;
  });

  redis.on("ready", () => {
      console.log("Redis is ready to accept connections");
      redisAvailable = true;
  });

  // Graceful error handling for connection issues
  redis.on('reconnecting', () => {
      console.log('Redis reconnecting...');
      redisAvailable = false;
  });
} else {
  console.log("Redis URL not configured or invalid format. Running without Redis session storage.");
}

// Export a safe wrapper that handles null redis
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
      return await redis.set(key, value, ...args);
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
  }
};

// Keep the original export for backward compatibility
export { redis };