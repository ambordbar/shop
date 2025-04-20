"use client";

import React from "react";
import useCartStore from "../../api/Shopping cart/cartStore";
import { Product } from "@/types";

interface ClientAddToCartProps {
  product: Product;
}

export default function ClientAddToCart({ product }: ClientAddToCartProps) {
  const addProduct = useCartStore((state) => state.addProduct);

  return (
    <button
      type="button"
      className="rounded-sm bg-yellow-400 p-4 text-lg font-medium hover:bg-yellow-500"
      onClick={() => addProduct(product)}
    >
      Add to cart
    </button>
  );
}
