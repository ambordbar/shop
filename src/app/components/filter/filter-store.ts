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

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    if (typeof window === "undefined") return "";

    // Check URL first
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch());
      const storedValue = searchParams.get(key);
      if (storedValue) {
        try {
          const parsed = JSON.parse(storedValue);
          // Only return if there are non-default values
          if (parsed.state && hasNonDefaultValues(parsed.state)) {
            return storedValue;
          }
        } catch (e) {
          console.error("Error parsing URL state:", e);
        }
      }
    }

    // Fallback to localStorage
    const localValue = localStorage.getItem(key);
    if (localValue) {
      try {
        const parsed = JSON.parse(localValue);
        // Only return if there are non-default values
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
      // Only update URL and storage if there are non-default values
      if (parsed.state && hasNonDefaultValues(parsed.state)) {
        // Update URL
        const searchParams = new URLSearchParams(getUrlSearch());
        searchParams.set(key, newValue);
        window.history.replaceState(null, "", `?${searchParams.toString()}`);

        // Update localStorage
        localStorage.setItem(key, newValue);
      } else {
        // If all values are default, remove from URL and storage
        const searchParams = new URLSearchParams(getUrlSearch());
        searchParams.delete(key);
        window.history.replaceState(
          null,
          "",
          searchParams.toString()
            ? `?${searchParams.toString()}`
            : window.location.pathname
        );
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error("Error processing state:", e);
    }
  },
  removeItem: (key): void => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.delete(key);
    window.history.replaceState(
      null,
      "",
      searchParams.toString()
        ? `?${searchParams.toString()}`
        : window.location.pathname
    );
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
        set({
          minPrice: min,
          maxPrice: max,
          selectedMinPrice: min,
          selectedMaxPrice: max,
        }),
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
