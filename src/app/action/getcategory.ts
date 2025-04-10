"use server";

import { getProducts } from "./getProducts";

export interface CategoryOption {
  id: string;
  name: string;
}

export async function getCategories(): Promise<CategoryOption[]> {
  try {
    const products = await getProducts();

    // Create a Set to store unique category names
    const uniqueCategories = new Set<string>();

    // Add all categories to the Set (this automatically removes duplicates)
    products.forEach((product) => {
      uniqueCategories.add(product.category);
    });

    // Convert the Set to an array of CategoryOption objects
    const categories: CategoryOption[] = Array.from(uniqueCategories)
      .sort() // Sort categories alphabetically
      .map((category) => ({
        id: category.toLowerCase().replace(/\s+/g, "-"), // Create URL-friendly ID
        name: category,
      }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
