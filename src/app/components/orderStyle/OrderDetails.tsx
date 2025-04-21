"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { OrderData } from "@/app/action/orderManager";

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyOrder = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");

        if (!sessionId || !orderId) {
          setError("Missing order information");
          return;
        }

        const response = await fetch(
          `/api/orders?session_id=${sessionId}&order_id=${orderId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify order");
        }

        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    verifyOrder();
  }, [searchParams]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return null;
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Order Confirmation
            </h1>
          </header>

          <div className="rounded-lg border border-gray-100 bg-white/50 p-6">
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  Order ID: <span className="font-medium">{order.id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>Name: {order.customerInfo.name}</p>
                <p>Phone: {order.customerInfo.phone}</p>
                <p className="col-span-2">
                  Address: {order.customerInfo.address}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Order Items
              </h3>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="rounded-sm object-cover"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer: Payment & Total */}
            <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="text-sm text-gray-600">
                Payment Status:{" "}
                <span
                  className={`font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-900">
                Total: ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
