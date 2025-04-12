"use server";

import { getProducts } from "./getProducts";

interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export async function getMinAndMaxPrice(): Promise<PriceRange> {
  try {
    const products = await getProducts();

    if (products.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
      };
    }

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

    return {
      minPrice,
      maxPrice,
    };
  } catch (error) {
    console.error("Error calculating price range:", error);

    return {
      minPrice: 0,
      maxPrice: 1000,
    };
  }
}
