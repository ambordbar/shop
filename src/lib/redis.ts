import Redis from "ioredis";

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

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
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("Error setting data in cache:", error);
  }
}

// Generic function to invalidate cache
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
}

export default redis;
