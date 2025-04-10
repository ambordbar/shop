import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  persist,
  createJSONStorage,
  StateStorage,
  PersistOptions,
} from "zustand/middleware";
import { StateCreator } from "zustand";

// Define the types
interface CategoryOption {
  id: string | number;
  name: string;
}

// Type for persisted state (excluding functions and configuration values)
type PersistedFilterState = {
  searchQuery: string;
  selectedCategory: CategoryOption | null;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  isTopRated: boolean;
  priceSort: "asc" | "desc" | null;
};

interface FilterState extends PersistedFilterState {
  // Configuration values
  minPrice: number;
  maxPrice: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryOption | null) => void;
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

const getUrlSearch = () => {
  if (typeof window === "undefined") return "";
  return window.location.search.slice(1);
};

// Helper to check if state differs from default
const hasNonDefaultValues = (state: Partial<FilterState>): boolean => {
  return Object.entries(state).some(([key, value]) => {
    if (key === "minPrice" || key === "maxPrice") return false; // Skip these as they're configuration
    return (
      JSON.stringify(value) !==
      JSON.stringify(defaultState[key as keyof typeof defaultState])
    );
  });
};

const stateToUrlParams = (state: PersistedFilterState): URLSearchParams => {
  const params = new URLSearchParams();

  if (state.searchQuery) {
    params.set("q", state.searchQuery);
  }

  if (state.selectedCategory) {
    params.set("category", state.selectedCategory.id.toString());
  }

  if (state.selectedMinPrice > defaultState.selectedMinPrice) {
    params.set("price[min]", state.selectedMinPrice.toString());
  }

  if (state.selectedMaxPrice < defaultState.selectedMaxPrice) {
    params.set("price[max]", state.selectedMaxPrice.toString());
  }

  if (state.isTopRated) {
    params.set("has_top_rate", "1");
  }

  if (state.priceSort) {
    params.set("sort", state.priceSort === "asc" ? "price_asc" : "price_desc");
  }

  return params;
};

const urlParamsToState = (
  params: URLSearchParams
): Partial<PersistedFilterState> => {
  const state: Partial<PersistedFilterState> = {};

  const searchQuery = params.get("q");
  if (searchQuery) {
    state.searchQuery = searchQuery;
  }

  const categoryId = params.get("category");
  if (categoryId) {
    state.selectedCategory = { id: categoryId, name: "" }; // name will be populated by the component
  }

  const minPrice = params.get("price[min]");
  if (minPrice) {
    state.selectedMinPrice = Number(minPrice);
  }

  const maxPrice = params.get("price[max]");
  if (maxPrice) {
    state.selectedMaxPrice = Number(maxPrice);
  }

  const hasTopRate = params.get("has_top_rate");
  if (hasTopRate === "1") {
    state.isTopRated = true;
  }

  const sort = params.get("sort");
  if (sort === "price_asc") {
    state.priceSort = "asc";
  } else if (sort === "price_desc") {
    state.priceSort = "desc";
  }

  return state;
};

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    if (typeof window === "undefined") return "";

    // Get state from URL parameters
    const searchParams = new URLSearchParams(getUrlSearch());
    const stateFromUrl = urlParamsToState(searchParams);

    if (Object.keys(stateFromUrl).length > 0) {
      return JSON.stringify({ state: stateFromUrl });
    }

    // Fallback to localStorage
    const localValue = localStorage.getItem(key);
    if (localValue) {
      try {
        const parsed = JSON.parse(localValue);
        if (parsed.state && hasNonDefaultValues(parsed.state)) {
          return localValue;
        }
      } catch (e) {
        console.error("Error parsing localStorage state:", e);
      }
    }

    return "";
  },

  setItem: (key, newValue): void => {
    if (typeof window === "undefined") return;

    try {
      const parsed = JSON.parse(newValue);

      if (parsed.state && hasNonDefaultValues(parsed.state)) {
        // Update URL with clean parameters
        const params = stateToUrlParams(parsed.state);
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState(null, "", newUrl);

        // Update localStorage
        localStorage.setItem(key, newValue);
      } else {
        // If all values are default, clean up URL and storage
        window.history.replaceState(null, "", window.location.pathname);
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error("Error processing state:", e);
    }
  },

  removeItem: (key): void => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", window.location.pathname);
    localStorage.removeItem(key);
  },
};

type FilterStorePersist = (
  config: StateCreator<FilterState>,
  options: PersistOptions<FilterState, PersistedFilterState>
) => StateCreator<FilterState>;

export const useFilterStore = createWithEqualityFn<FilterState>(
  (persist as FilterStorePersist)(
    (
      set: (
        partial:
          | Partial<FilterState>
          | ((state: FilterState) => Partial<FilterState>)
      ) => void
    ) => ({
      ...defaultState,

      // Actions
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSelectedCategory: (category: CategoryOption | null) =>
        set({ selectedCategory: category }),
      setPriceRange: (min: number, max: number) =>
        set({
          selectedMinPrice: min,
          selectedMaxPrice: max,
        }),
      setDefaultPriceRange: (min: number, max: number) =>
        set((state) => ({
          minPrice: min,
          maxPrice: max,
          selectedMinPrice:
            state.selectedMinPrice === defaultState.selectedMinPrice
              ? min
              : state.selectedMinPrice,
          selectedMaxPrice:
            state.selectedMaxPrice === defaultState.selectedMaxPrice
              ? max
              : state.selectedMaxPrice,
        })),
      resetPriceRange: () =>
        set((state: FilterState) => ({
          selectedMinPrice: state.minPrice,
          selectedMaxPrice: state.maxPrice,
        })),
      setTopRated: (isTopRated: boolean) => set({ isTopRated }),
      setPriceSort: (sort: "asc" | "desc" | null) => set({ priceSort: sort }),
      resetAllFilters: () =>
        set((state: FilterState) => ({
          searchQuery: "",
          selectedCategory: null,
          selectedMinPrice: state.minPrice,
          selectedMaxPrice: state.maxPrice,
          isTopRated: false,
          priceSort: null,
        })),
    }),
    {
      name: "filter-store",
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state: FilterState): PersistedFilterState => ({
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        selectedMinPrice: state.selectedMinPrice,
        selectedMaxPrice: state.selectedMaxPrice,
        isTopRated: state.isTopRated,
        priceSort: state.priceSort,
      }),
    }
  ),
  shallow
);
