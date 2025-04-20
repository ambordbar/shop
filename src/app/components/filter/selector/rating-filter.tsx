"use client";

import { useFilterStore } from "../filter-store";

export default function RatingFilter() {
  const { isTopRated, setTopRated } = useFilterStore((state) => ({
    isTopRated: state.isTopRated,
    setTopRated: state.setTopRated,
  }));

  const toggleRating = () => {
    setTopRated(!isTopRated);
  };

  return (
    <button
      onClick={toggleRating}
      className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 ${
        isTopRated ? "bg-green-500 text-white border-green-500" : "bg-white"
      }`}
    >
      <span className={isTopRated ? "text-white" : "text-gray-500"}>
        Top Rated
      </span>
      {isTopRated && (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
