"use client";

import { useFilterStore } from "./filter-store";

export default function SearchBox() {
  const { searchQuery, setSearchQuery } = useFilterStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="search product to find this"
        className="w-full px-4 py-2 text-md border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center gap-2 m-1 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="search"
      >
        <span className="text-sm">Search</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
