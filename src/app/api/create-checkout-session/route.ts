import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { CartItem } from "@/types";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customerInfo } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const tempOrderId = `temp_${Date.now()}`;

    const tempOrderRef = doc(db, "temp_orders", tempOrderId);
    const orderData = {
      customerInfo,
      items: cartItems,
      total: cartItems.reduce(
        (sum: number, item: CartItem) =>
          sum + item.price * (item.quantity || 1),
        0
      ),
      createdAt: new Date(),
      status: "pending",
    };

    await setDoc(tempOrderRef, orderData);

    // ایجاد Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item: CartItem) => ({
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${tempOrderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        tempOrderId,
      },
    });
    // به‌روزرسانی سفارش موقت با شناسه Stripe
    await setDoc(
      tempOrderRef,
      {
        stripeSessionId: session.id,
      },
      { merge: true }
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
