import Redis from "ioredis";

let redis: Redis | null = null;

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.warn(
        "Redis connection failed after 3 attempts, falling back to API"
      );
      return null; // Stop retrying
    }
    return Math.min(times * 100, 3000); // Exponential backoff with max 3 seconds
  },
  lazyConnect: true, // Don't connect immediately
};

try {
  redis = new Redis(redisConfig);

  redis.on("error", (error) => {
    console.warn("Redis connection error:", error);
    redis = null;
  });

  redis.on("connect", () => {
    console.log("Successfully connected to Redis");
  });
} catch (error) {
  console.warn("Failed to initialize Redis:", error);
  redis = null;
}

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
} as const;

// Cache TTL in seconds
export const CACHE_TTL = {
  PRODUCTS: 3600, // 1 hour
  CATEGORIES: 86400, // 24 hours
} as const;

// Generic function to get data from cache
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting data from cache:", error);
    return null;
  }
}

// Generic function to set data in cache
export async function setInCache<T>(
  key: string,
  data: T,
  ttl: number
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("Error setting data in cache:", error);
  }
}

// Generic function to invalidate cache
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
}

export default redis;
