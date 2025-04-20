"use client";

import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../filter-store";

export default function PriceSortFilter() {
  const [sortOpen, setSortOpen] = useState(false);
  const { priceSort, setPriceSort } = useFilterStore((state) => ({
    priceSort: state.priceSort,
    setPriceSort: state.setPriceSort,
  }));

  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePriceSort = (sortType: "asc" | "desc") => {
    const newSort = priceSort === sortType ? null : sortType;
    setPriceSort(newSort);
    setSortOpen(false);
  };

  const handleClearSort = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPriceSort(null);
  };

  return (
    <div className="relative" ref={sortRef}>
      <button
        onClick={() => setSortOpen(!sortOpen)}
        className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 ${
          priceSort ? "bg-green-500 border-green-500" : "bg-white"
        }`}
      >
        <span className={priceSort ? "text-white" : "text-gray-500"}>
          {priceSort === "asc"
            ? "Lowest Price"
            : priceSort === "desc"
            ? "Highest Price"
            : "Sort by Price"}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke={priceSort ? "white" : "currentColor"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {priceSort && (
          <span
            onClick={handleClearSort}
            className="text-white hover:text-gray-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        )}
      </button>

      {sortOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg w-48">
          <button
            onClick={() => handlePriceSort("asc")}
            className={`w-full px-4 py-2 rounded-lg text-right hover:bg-gray-100 ${
              priceSort === "asc" ? "bg-green-50" : ""
            }`}
          >
            Lowest Price
          </button>
          <div className="w-full h-px bg-gray-300"></div>
          <button
            onClick={() => handlePriceSort("desc")}
            className={`w-full px-4 py-2 text-right rounded-lg hover:bg-gray-100 ${
              priceSort === "desc" ? "bg-green-50" : ""
            }`}
          >
            Highest Price
          </button>
        </div>
      )}
    </div>
  );
}
