import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { Category } from "@/types/category";

interface FilterState {
  // Configuration values
  minPrice: number;
  maxPrice: number;

  // Filter values
  searchQuery: string;
  selectedCategory: Category | null;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  isTopRated: boolean;
  priceSort: "asc" | "desc" | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setPriceRange: (min: number, max: number) => void;
  setDefaultPriceRange: (min: number, max: number) => void;
  resetPriceRange: () => void;
  setTopRated: (isTopRated: boolean) => void;
  setPriceSort: (sort: "asc" | "desc" | null) => void;
  resetAllFilters: () => void;
}

// Default state values
const defaultState = {
  searchQuery: "",
  selectedCategory: null,
  minPrice: 0,
  maxPrice: 1000,
  selectedMinPrice: 0,
  selectedMaxPrice: 1000,
  isTopRated: false,
  priceSort: null,
};

// Helper to get current URL parameters
const getUrlParams = () => {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

// Helper to update URL parameters
const updateUrlParams = (params: URLSearchParams) => {
  if (typeof window === "undefined") return;
  const newUrl =
    window.location.pathname +
    (params.toString() ? `?${params.toString()}` : "");
  window.history.replaceState(null, "", newUrl);
};

export const useFilterStore = createWithEqualityFn<FilterState>(
  (set) => ({
    ...defaultState,

    setSearchQuery: (query) => {
      const params = getUrlParams();
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      updateUrlParams(params);
      set({ searchQuery: query });
    },

    setSelectedCategory: (category) => {
      const params = getUrlParams();
      if (category) {
        params.set("category", category.id);
      } else {
        params.delete("category");
      }
      updateUrlParams(params);
      set({ selectedCategory: category });
    },

    setPriceRange: (min, max) => {
      const params = getUrlParams();
      if (min > defaultState.selectedMinPrice) {
        params.set("price[min]", min.toString());
      } else {
        params.delete("price[min]");
      }
      if (max < defaultState.selectedMaxPrice) {
        params.set("price[max]", max.toString());
      } else {
        params.delete("price[max]");
      }
      updateUrlParams(params);
      set({ selectedMinPrice: min, selectedMaxPrice: max });
    },

    setDefaultPriceRange: (min, max) => {
      set({ minPrice: min, maxPrice: max });
    },

    resetPriceRange: () => {
      const params = getUrlParams();
      params.delete("price[min]");
      params.delete("price[max]");
      updateUrlParams(params);
      set((state) => ({
        selectedMinPrice: state.minPrice,
        selectedMaxPrice: state.maxPrice,
      }));
    },

    setTopRated: (isTopRated) => {
      const params = getUrlParams();
      if (isTopRated) {
        params.set("top_rated", "1");
      } else {
        params.delete("top_rated");
      }
      updateUrlParams(params);
      set({ isTopRated });
    },

    setPriceSort: (sort) => {
      const params = getUrlParams();
      if (sort) {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
      updateUrlParams(params);
      set({ priceSort: sort });
    },

    resetAllFilters: () => {
      updateUrlParams(new URLSearchParams());
      set({
        searchQuery: "",
        selectedCategory: null,
        selectedMinPrice: defaultState.selectedMinPrice,
        selectedMaxPrice: defaultState.selectedMaxPrice,
        isTopRated: false,
        priceSort: null,
      });
    },
  }),
  shallow
);
