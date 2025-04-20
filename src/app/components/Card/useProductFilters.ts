import { useMemo, useEffect } from "react";
import { Product } from "@/types";
import { useFilterStore } from "../filter/filter-store";
import { getCategories } from "@/app/action/getcategory";

/**
 * Custom hook for filtering products based on various filter criteria
 * @param products Array of products to filter
 * @returns Filtered products and filter state
 */
export function useProductFilters(products: Product[]) {
  // Get filter state and actions from the store
  const {
    selectedCategory,
    selectedMinPrice,
    selectedMaxPrice,
    isTopRated,
    priceSort,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    setTopRated,
    setPriceSort,
  } = useFilterStore((state) => ({
    selectedCategory: state.selectedCategory,
    selectedMinPrice: state.selectedMinPrice,
    selectedMaxPrice: state.selectedMaxPrice,
    isTopRated: state.isTopRated,
    priceSort: state.priceSort,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setPriceRange: state.setPriceRange,
    setTopRated: state.setTopRated,
    setPriceSort: state.setPriceSort,
  }));

  // Read filter values from URL on page load and refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Set search query
    const searchQuery = params.get("q");
    if (searchQuery) {
      setSearchQuery(searchQuery);
    }

    // Set category with name
    const categoryId = params.get("category");
    if (categoryId) {
      getCategories().then((categories) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          setSelectedCategory(category);
        }
      });
    }

    // Set price range
    const minPrice = params.get("price[min]");
    const maxPrice = params.get("price[max]");
    if (minPrice && maxPrice) {
      setPriceRange(Number(minPrice), Number(maxPrice));
    }

    // Set top rated
    const topRated = params.get("top_rated");
    if (topRated === "1") {
      setTopRated(true);
    }

    // Set price sort
    const sort = params.get("sort");
    if (sort === "asc" || sort === "desc") {
      setPriceSort(sort);
    }
  }, [
    setPriceRange,
    setPriceSort,
    setSearchQuery,
    setSelectedCategory,
    setTopRated,
  ]);

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
