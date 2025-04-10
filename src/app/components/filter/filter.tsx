"use client";

import SearchBox from "./search";
import CategoryFilter from "./selector/category-filter";
import PriceFilter from "./selector/price-filter";
import RatingFilter from "./selector/rating-filter";
import PriceSortFilter from "./selector/price-sort-filter";
import { useFilterStore } from "./filter-store";
import { useEffect } from "react";

interface CategoryOption {
  id: string | number;
  name: string;
}

interface FilterProps {
  categories?: CategoryOption[];
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

export default function Filter({
  categories = [],
  minPrice = 0,
  maxPrice = 1000,
  className = "",
}: FilterProps) {
  const setDefaultPriceRange = useFilterStore(
    (state) => state.setDefaultPriceRange
  );

  // Initialize default price range from props
  useEffect(() => {
    setDefaultPriceRange(minPrice, maxPrice);
  }, [minPrice, maxPrice, setDefaultPriceRange]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:flex-1">
          <SearchBox />
        </div>

        <div className="w-full md:flex-1">
          <div className="flex flex-wrap gap-3 justify-end">
            <CategoryFilter categories={categories} />
            <PriceFilter />
            <RatingFilter />
            <PriceSortFilter />
          </div>
        </div>
      </div>
    </div>
  );
}
