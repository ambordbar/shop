"use client";

import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../filter-store";

interface CategoryOption {
  id: string | number;
  name: string;
}

interface CategoryFilterProps {
  categories?: CategoryOption[];
}

export default function CategoryFilter({
  categories = [],
}: CategoryFilterProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useFilterStore((state) => ({
    selectedCategory: state.selectedCategory,
    setSelectedCategory: state.setSelectedCategory,
  }));

  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Category handlers
  const handleCategorySelect = (category: CategoryOption | null) => {
    setSelectedCategory(category);
    setCategoryOpen(false);

    // ここで必要な処理を実行
    console.log("Category selected:", category?.name || "All");
  };

  return (
    <div className="relative" ref={categoryRef}>
      <button
        onClick={() => setCategoryOpen(!categoryOpen)}
        className={`px-4 py-2 border border-gray-400 rounded-lg flex items-center gap-2 ${
          selectedCategory ? "bg-blue-50 border-blue-300" : "bg-white"
        }`}
      >
        <span className={selectedCategory ? "text-blue-600" : "text-gray-500"}>
          Category
        </span>
        {selectedCategory && (
          <span className="text-blue-600">: {selectedCategory.name}</span>
        )}
        {selectedCategory ? (
          <svg
            onClick={(e) => {
              e.stopPropagation();
              handleCategorySelect(null);
            }}
            className="w-4 h-4 cursor-pointer"
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
        ) : (
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {categoryOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg w-56 max-h-60 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md ${
                  selectedCategory?.id === category.id
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
