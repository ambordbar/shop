"use server";

import { CustomerInfo, CartItem } from "@/types";

export async function createCheckoutSession(
  customerInfo: CustomerInfo,
  cartItems: CartItem[]
): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems, customerInfo }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }
  const { url } = await response.json();
  return url;
}
