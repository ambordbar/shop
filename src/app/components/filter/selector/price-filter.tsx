"use client";

import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../filter-store";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
}

export default function PriceFilter({ minPrice, maxPrice }: PriceFilterProps) {
  const [priceOpen, setPriceOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });

  const {
    selectedMinPrice,
    selectedMaxPrice,
    setPriceRange: storeSetPriceRange,
    resetPriceRange,
  } = useFilterStore((state) => ({
    selectedMinPrice: state.selectedMinPrice,
    selectedMaxPrice: state.selectedMaxPrice,
    setPriceRange: state.setPriceRange,
    resetPriceRange: state.resetPriceRange,
  }));

  // Initialize local state from store
  useEffect(() => {
    setPriceRange({
      min: selectedMinPrice,
      max: selectedMaxPrice,
    });
  }, [selectedMinPrice, selectedMaxPrice]);

  const priceRef = useRef<HTMLDivElement>(null);
  const minRangeRef = useRef<HTMLInputElement>(null);
  const maxRangeRef = useRef<HTMLInputElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  const rangeTrackRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setPriceOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update visual range track when values change
  useEffect(() => {
    if (priceOpen && rangeTrackRef.current) {
      const leftPercent =
        ((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100;
      const rightPercent =
        100 - ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100;

      rangeTrackRef.current.style.left = `${leftPercent}%`;
      rangeTrackRef.current.style.right = `${rightPercent}%`;
    }
  }, [priceRange.min, priceRange.max, minPrice, maxPrice, priceOpen]);

  // Sync input fields with range
  useEffect(() => {
    if (minInputRef.current) {
      minInputRef.current.value = priceRange.min.toString();
    }
    if (maxInputRef.current) {
      maxInputRef.current.value = priceRange.max.toString();
    }
  }, [priceRange.min, priceRange.max]);

  // Handle range input changes
  const handleRangeChange = (isMin: boolean, value: number) => {
    // Prevent update spam with a small timeout
    setTimeout(() => {
      if (isMin) {
        // Ensure min doesn't exceed max
        const newMin = Math.min(value, priceRange.max);
        setPriceRange((prev) => ({ ...prev, min: newMin }));
      } else {
        // Ensure max doesn't go below min
        const newMax = Math.max(value, priceRange.min);
        setPriceRange((prev) => ({ ...prev, max: newMax }));
      }
    }, 0);
  };

  // Handle input field changes
  const handleInputChange = (isMin: boolean, value: number) => {
    // Enforce min/max constraints
    const constrainedValue = Math.max(minPrice, Math.min(maxPrice, value));

    if (isMin) {
      // Ensure min doesn't exceed max
      const newMin = Math.min(constrainedValue, priceRange.max);
      setPriceRange((prev) => ({ ...prev, min: newMin }));

      // Update range slider
      if (minRangeRef.current) {
        minRangeRef.current.value = newMin.toString();
      }
    } else {
      // Ensure max doesn't go below min
      const newMax = Math.max(constrainedValue, priceRange.min);
      setPriceRange((prev) => ({ ...prev, max: newMax }));

      // Update range slider
      if (maxRangeRef.current) {
        maxRangeRef.current.value = newMax.toString();
      }
    }
  };

  const handlePriceApply = () => {
    storeSetPriceRange(priceRange.min, priceRange.max);
    setPriceOpen(false);
  };

  // Calculate tooltip positions
  const getTooltipPosition = (isMin: boolean) => {
    const value = isMin ? priceRange.min : priceRange.max;
    const percent = ((value - minPrice) / (maxPrice - minPrice)) * 100;
    return `calc(${percent}% - 20px)`; // Adjust for tooltip width
  };

  const handleClearSort = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetPriceRange();
  };

  const isFiltered = selectedMinPrice > minPrice || selectedMaxPrice < maxPrice;

  return (
    <div className="relative" ref={priceRef}>
      <button
        onClick={() => setPriceOpen(!priceOpen)}
        className={`px-4 py-2 border border-gray-400 rounded-lg flex items-center gap-2 ${
          isFiltered ? "bg-green-500 border-green-500" : "bg-white"
        }`}
      >
        <span className={isFiltered ? "text-white" : "text-gray-500"}>
          Price
        </span>
        {isFiltered && (
          <span className="text-white">
            : ${selectedMinPrice} - ${selectedMaxPrice}
          </span>
        )}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke={isFiltered ? "white" : "currentColor"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {isFiltered && (
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

      {priceOpen && (
        <div className="absolute right-0 z-50 mt-1 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="space-y-4 mt-8">
            {/* Custom dual range slider */}
            <div className="relative h-2 bg-gray-200 rounded-full mb-6 mt-6">
              {/* Colored track between thumbs */}
              <div
                ref={rangeTrackRef}
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${
                    ((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100
                  }%`,
                  right: `${
                    100 -
                    ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100
                  }%`,
                }}
              ></div>

              {/* Min range thumb tooltip */}
              <div
                className="absolute bg-white border ms-7 border-gray-200 text-sm text-gray-800 py-1 px-2 rounded-lg mb-3 -mt-10"
                style={{
                  left: getTooltipPosition(true),
                  transform: "translateX(-50%)",
                  zIndex: 5,
                }}
              >
                ${priceRange.min}
              </div>

              {/* Max range thumb tooltip */}
              <div
                className="absolute bg-white border border-gray-200 text-sm text-gray-800 py-1 px-2 rounded-lg mb-3 -mt-10"
                style={{
                  left: getTooltipPosition(false),
                  transform: "translateX(-50%)",
                  zIndex: 5,
                }}
              >
                ${priceRange.max}
              </div>

              {/* حل مشکل تداخل اسلایدرها با تکنیک جدید */}
              <div className="relative">
                {/* اسلایدر Min با تعامل‌پذیری فقط در سمت چپ */}
                <input
                  ref={minRangeRef}
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  value={priceRange.min}
                  onChange={(e) =>
                    handleRangeChange(true, Number(e.target.value))
                  }
                  className="absolute w-full h-8 bg-transparent appearance-none cursor-e-resize"
                  style={{
                    WebkitAppearance: "none",
                    appearance: "none",
                    pointerEvents: "none",
                  }}
                />

                {/* اسلایدر Max با تعامل‌پذیری فقط در سمت راست */}
                <input
                  ref={maxRangeRef}
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  value={priceRange.max}
                  onChange={(e) =>
                    handleRangeChange(false, Number(e.target.value))
                  }
                  className="absolute w-full h-8 bg-transparent appearance-none cursor-w-resize"
                  style={{
                    WebkitAppearance: "none",
                    appearance: "none",
                    pointerEvents: "none",
                  }}
                />

                {/* ناحیه‌های تعامل‌پذیر برای هر اسلایدر */}
                <div
                  className="absolute left-0 top-0 h-8"
                  style={{
                    width: `calc(${
                      ((priceRange.min - minPrice) / (maxPrice - minPrice)) *
                      100
                    }% + 12px)`,
                    pointerEvents: "auto",
                  }}
                  onMouseDown={() => {
                    if (minRangeRef.current) {
                      minRangeRef.current.focus();
                      minRangeRef.current.style.pointerEvents = "auto";

                      // به‌روزرسانی دستی با کلیک
                      document.addEventListener("mousemove", handleMinMove);
                      document.addEventListener(
                        "mouseup",
                        () => {
                          document.removeEventListener(
                            "mousemove",
                            handleMinMove
                          );
                          if (minRangeRef.current) {
                            minRangeRef.current.style.pointerEvents = "none";
                          }
                        },
                        { once: true }
                      );
                    }
                  }}
                ></div>

                <div
                  className="absolute right-0 top-0 h-8"
                  style={{
                    width: `calc(${
                      100 -
                      ((priceRange.max - minPrice) / (maxPrice - minPrice)) *
                        100
                    }% + 12px)`,
                    pointerEvents: "auto",
                  }}
                  onMouseDown={() => {
                    if (maxRangeRef.current) {
                      maxRangeRef.current.focus();
                      maxRangeRef.current.style.pointerEvents = "auto";

                      // به‌روزرسانی دستی با کلیک
                      document.addEventListener("mousemove", handleMaxMove);
                      document.addEventListener(
                        "mouseup",
                        () => {
                          document.removeEventListener(
                            "mousemove",
                            handleMaxMove
                          );
                          if (maxRangeRef.current) {
                            maxRangeRef.current.style.pointerEvents = "none";
                          }
                        },
                        { once: true }
                      );
                    }
                  }}
                ></div>
              </div>
            </div>

            {/* Input fields */}
            <div className="flex flex-row space-x-4 mt-2">
              <div className="basis-1/2">
                <label
                  htmlFor="min-price-input"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Min price:
                </label>
                <input
                  id="min-price-input"
                  ref={minInputRef}
                  type="number"
                  defaultValue={priceRange.min}
                  min={minPrice}
                  max={maxPrice}
                  onChange={(e) =>
                    handleInputChange(true, Number(e.target.value))
                  }
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="basis-1/2">
                <label
                  htmlFor="max-price-input"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Max price:
                </label>
                <input
                  id="max-price-input"
                  ref={maxInputRef}
                  type="number"
                  defaultValue={priceRange.max}
                  min={minPrice}
                  max={maxPrice}
                  onChange={(e) =>
                    handleInputChange(false, Number(e.target.value))
                  }
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Apply button */}
            <div className="pt-2">
              <button
                onClick={handlePriceApply}
                className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function handleMinMove(e: MouseEvent) {
  const slider = document.querySelector(
    'input[type="range"]:first-of-type'
  ) as HTMLInputElement;
  if (!slider) return;

  const rect = slider.getBoundingClientRect();
  const percent = Math.min(
    Math.max(0, (e.clientX - rect.left) / rect.width),
    1
  );
  const minPrice = Number(slider.min);
  const maxPrice = Number(slider.max);
  const value = minPrice + percent * (maxPrice - minPrice);

  slider.value = value.toString();
  slider.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleMaxMove(e: MouseEvent) {
  const slider = document.querySelector(
    'input[type="range"]:nth-of-type(2)'
  ) as HTMLInputElement;
  if (!slider) return;

  const rect = slider.getBoundingClientRect();
  const percent = Math.min(
    Math.max(0, (e.clientX - rect.left) / rect.width),
    1
  );
  const minPrice = Number(slider.min);
  const maxPrice = Number(slider.max);
  const value = minPrice + percent * (maxPrice - minPrice);

  slider.value = value.toString();
  slider.dispatchEvent(new Event("input", { bubbles: true }));
}
