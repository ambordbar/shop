"use server";

import { Category } from "@/types";
import { CACHE_KEYS, CACHE_TTL, getFromCache, setInCache } from "@/lib/redis";

export async function getCategories(): Promise<Category[]> {
  try {
    // Try to get categories from cache first
    const cachedCategories = await getFromCache<Category[]>(
      CACHE_KEYS.CATEGORIES
    );
    if (cachedCategories) {
      console.log("Returning categories from cache");
      return cachedCategories;
    }

    const res = await fetch("https://fakestoreapi.com/products/categories");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const categories: Category[] = data.map((category: string) => ({
      id: category.toLowerCase().replace(/\s+/g, "-"),
      name: category,
    }));

    // Store in cache
    await setInCache(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.CATEGORIES);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
