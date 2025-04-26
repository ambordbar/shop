import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { CartItem, CustomerInfo } from "@/types";

export async function POST(req: NextRequest) {
  const {
    cartItems,
    customerInfo,
  }: {
    cartItems: CartItem[];
    customerInfo: CustomerInfo;
  } = await req.json();

  if (!cartItems?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // ۱. ذخیره موقت سفارش
  const tempOrderId = `temp_${Date.now()}`;
  const tempOrderRef = doc(db, "temp_orders", tempOrderId);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  await setDoc(tempOrderRef, {
    customerInfo,
    items: cartItems,
    total,
    createdAt: new Date().toISOString(),
    status: "pending",
  });

  // ۲. ایجاد سشن پرداخت
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?session_id={CHECKOUT_SESSION_ID}&order_id=${tempOrderId}&clear_cart=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    metadata: {
      tempOrderId,
    },
  });

  // ۳. ذخیره session.id در سند موقت
  await setDoc(tempOrderRef, { stripeSessionId: session.id }, { merge: true });

  return NextResponse.json({ url: session.url });
}
