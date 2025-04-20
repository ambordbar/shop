"use client";
import React from "react";
import useCartStore from "../api/Shopping cart/cartStore";
import Image from "next/image";
import { CartItem } from "@/types";
import Link from "next/link";

export default function CartPage() {
  const products = useCartStore((state) => state.products);
  const removeAll = useCartStore((state) => state.removeAllProduct);
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);

  const calculateCartInfo = (products: CartItem[]) => {
    let subtotal = 0;
    let totalItems = 0;

    for (const product of products) {
      const price = Number(product.price);
      const quantity = product.quantity;

      if (isNaN(price) || isNaN(quantity)) {
        console.warn("Invalid data for product:", product);
        continue;
      }

      subtotal += price * quantity;
      totalItems += quantity;
    }

    return { subtotal, totalItems };
  };

  const { subtotal, totalItems } = calculateCartInfo(products);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart Shop
            </h1>
          </header>

          <div className="mt-8">
            <div>
              {products && products.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {products.map((product) => (
                      <li
                        key={product.id}
                        className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white/50 p-4 sm:grid-cols-2"
                      >
                        <Link
                          href={`/products/${product.id}`}
                          className="flex gap-4"
                        >
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={64}
                            height={64}
                            className="rounded-sm object-cover"
                          />

                          <div>
                            <h3 className="text-sm text-gray-900">
                              {product.title}
                            </h3>

                            <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                              <div>
                                <dt className="inline">Category:</dt>
                                <dd className="inline"> {product.category}</dd>
                              </div>

                              <div>
                                <dt className="inline">Price:</dt>
                                <dd className="inline">
                                  {" "}
                                  ${product.price.toFixed(2)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </Link>

                        <div className="flex flex-1 items-center justify-end gap-2">
                          <form className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <input
                              id={`qty-${product.id}`}
                              type="text"
                              readOnly
                              value={product.quantity}
                              className="w-10 text-center border border-gray-300 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => addProduct(product)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </form>

                          <button
                            className="text-gray-600 transition hover:text-red-600"
                            onClick={() => removeProduct(product.id)}
                          >
                            <span className="sr-only">Remove item</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={removeAll}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center">No products in your cart.</p>
              )}
            </div>

            <div className="mt-8 flex justify-end border-t border-gray-200 pt-8">
              <div className="w-screen max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt>Items</dt>
                    <dd>{totalItems}</dd>
                  </div>

                  <div className="flex justify-between !text-base font-medium">
                    <dt>Total</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                  </div>
                </dl>

                <div className="flex justify-end">
                  <Link
                    href="/checkout"
                    className="block rounded-full bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
