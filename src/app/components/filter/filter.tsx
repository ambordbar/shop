"use client";

import SearchBox from "./search";
import CategoryFilter from "./selector/category-filter";
import PriceFilter from "./selector/price-filter";
import RatingFilter from "./selector/rating-filter";
import PriceSortFilter from "./selector/price-sort-filter";
import { useFilterStore } from "./filter-store";
import { useEffect } from "react";
import { Category } from "@/types";

interface FilterProps {
  categories: Category[];
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

  return (
    <div className={`w-full mt-2 ${className}`}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="">
          <SearchBox />
        </div>
        <div className="flex flex-row gap-2 lg:col-span-2">
          <CategoryFilter categories={categories} />
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
          <RatingFilter />
          <PriceSortFilter />
        </div>
      </div>
    </div>
  );
}
