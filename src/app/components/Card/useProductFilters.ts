import { useMemo } from "react";
import { Product } from "@/types";
import { useFilterStore } from "../filter/filter-store";

/**
 * Custom hook for filtering products based on various filter criteria
 * @param products Array of products to filter
 * @returns Filtered products and filter state
 */
export function useProductFilters(products: Product[]) {
  // Get filter state from the store
  const {
    selectedCategory,
    selectedMinPrice,
    selectedMaxPrice,
    isTopRated,
    priceSort,
    searchQuery,
  } = useFilterStore((state) => ({
    selectedCategory: state.selectedCategory,
    selectedMinPrice: state.selectedMinPrice,
    selectedMaxPrice: state.selectedMaxPrice,
    isTopRated: state.isTopRated,
    priceSort: state.priceSort,
    searchQuery: state.searchQuery,
  }));

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory.id
      );
    }

    // Filter by price range
    if (selectedMinPrice > 0 || selectedMaxPrice < Number.MAX_SAFE_INTEGER) {
      result = result.filter(
        (product) =>
          product.price >= selectedMinPrice && product.price <= selectedMaxPrice
      );
    }

    // Sort by rating if top rated is selected
    if (isTopRated) {
      result.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Sort by price
    if (priceSort) {
      result.sort((a, b) => {
        if (priceSort === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedMinPrice,
    selectedMaxPrice,
    isTopRated,
    priceSort,
    searchQuery,
  ]);

  return {
    filteredProducts,
    filterState: {
      selectedCategory,
      selectedMinPrice,
      selectedMaxPrice,
      isTopRated,
      priceSort,
      searchQuery,
    },
  };
}
