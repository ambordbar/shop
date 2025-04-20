"use server";

import { Product, ProductSchema } from "../../types/index";
import { CACHE_KEYS, CACHE_TTL, getFromCache, setInCache } from "@/lib/redis";

export async function getProducts(): Promise<Product[]> {
  try {
    // Try to get products from cache first
    const cachedProducts = await getFromCache<Product[]>(CACHE_KEYS.PRODUCTS);
    if (cachedProducts) {
      console.log("Returning products from cache");
      return cachedProducts;
    }

    // If not in cache, fetch from API
    const res = await fetch("https://fakestoreapi.com/products");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Validate the data against our schema
    const validatedProducts = data
      .map((product: unknown) => {
        try {
          return ProductSchema.parse(product);
        } catch (error) {
          console.error("Invalid product data:", error);
          return null;
        }
      })
      .filter(
        (product: Product | null): product is Product => product !== null
      );

    // Store in cache
    await setInCache(
      CACHE_KEYS.PRODUCTS,
      validatedProducts,
      CACHE_TTL.PRODUCTS
    );

    return validatedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
