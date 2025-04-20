"use client";
import { createCheckoutSession } from "../action/createCheckoutSession";
import { CustomerInfo, CartItem } from "@/types";
import CheckoutForm from "../components/fireBase/form";

export default function CheckoutPage() {
  const handleCheckout = async (
    customerInfo: CustomerInfo,
    cartItems: CartItem[]
  ) => {
    const url = await createCheckoutSession(customerInfo, cartItems);
    return url;
  };

  return <CheckoutForm orderData={handleCheckout} />;
}
