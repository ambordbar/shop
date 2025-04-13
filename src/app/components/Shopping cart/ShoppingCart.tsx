import React from "react";

interface EmptyButtonProps {
  count?: number;
}

const EmptyButton: React.FC<EmptyButtonProps> = ({ count = 0 }) => {
  return (
    <a
      className="group flex items-center justify-between gap-3 rounded-md border border-current px-4 py-2 text-gray-600 text-sm transition-colors hover:bg-gray-600 focus:ring-2 focus:outline-none duration-300"
      href="#"
    >
      <span className="font-medium transition-colors group-hover:text-white">
        shopping cart
      </span>

      <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-600 bg-white text-sm font-medium">
        {count}
      </span>
    </a>
  );
};

export default EmptyButton;
