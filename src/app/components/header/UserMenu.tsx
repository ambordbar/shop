"use client";

import Image from "next/image";
import Link from "next/link";
import { UserMenuItem } from "./types";
import { useState } from "react";

interface UserMenuProps {
  items: UserMenuItem[];
}

export function UserMenu({ items }: UserMenuProps) {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <div className="hidden md:relative md:block">
      <button
        type="button"
        className="overflow-hidden rounded-full border border-gray-300 shadow-inner flex items-center justify-center"
        onClick={() => setShowPopUp(!showPopUp)}
      >
        <span className="sr-only">Toggle dashboard menu</span>
        <Image
          src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="User avatar"
          width={40}
          height={40}
          className="size-10 object-cover"
        />
      </button>

      {showPopUp && (
        <div
          className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className="p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-2">
            <form method="POST" action="#">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                role="menuitem"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
