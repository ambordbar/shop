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
  categories: CategoryOption[];
  minPrice: number;
  maxPrice: number;
  className?: string;
}

export default function Filter({
  categories,
  minPrice,
  maxPrice,
  className = "",
}: FilterProps) {
  const setDefaultPriceRange = useFilterStore(
    (state) => state.setDefaultPriceRange
  );

  useEffect(() => {
    setDefaultPriceRange(minPrice, maxPrice);
  }, [minPrice, maxPrice, setDefaultPriceRange]);

  console.log(minPrice, maxPrice);
  return (
    <div className={`w-full mt-2 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <SearchBox />
        </div>

        <div className="w-full">
          <div className="flex flex-wrap gap-3 justify-end">
            <CategoryFilter categories={categories} />
            <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
            <RatingFilter />
            <PriceSortFilter />
          </div>
        </div>
      </div>
    </div>
  );
}
