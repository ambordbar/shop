"use server";

import { getProducts } from "./getProducts";

interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export async function getMinAndMaxPrice(): Promise<PriceRange> {
  try {
    const products = await getProducts();

    // If no products, return default range
    if (products.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 1000,
      };
    }

    // Find min and max prices
    let minPrice = products[0].price;
    let maxPrice = products[0].price;

    for (const product of products) {
      if (product.price < minPrice) {
        minPrice = product.price;
      }
      if (product.price > maxPrice) {
        maxPrice = product.price;
      }
    }

    // Round the prices for better UX
    // Round down minPrice to nearest 10
    minPrice = Math.floor(minPrice / 10) * 10;
    // Round up maxPrice to nearest 10
    maxPrice = Math.ceil(maxPrice / 10) * 10;

    return {
      minPrice,
      maxPrice,
    };
  } catch (error) {
    console.error("Error calculating price range:", error);
    // Return default range in case of error
    return {
      minPrice: 0,
      maxPrice: 1000,
    };
  }
}
