"use server";

import { Product, ProductSchema } from "@/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

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

    return validatedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
