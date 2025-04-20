import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error("Webhook signature verification failed:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tempOrderId = session.metadata?.tempOrderId;

    if (tempOrderId) {
      try {
        // دریافت اطلاعات سفارش موقت از Firebase
        const tempOrderRef = doc(db, "temp_orders", tempOrderId);
        const tempOrderSnap = await getDoc(tempOrderRef);

        if (tempOrderSnap.exists()) {
          const orderData = tempOrderSnap.data();
          // اینجا می‌توانید اطلاعات سفارش را برای ذخیره نهایی آماده کنید
          const finalOrderData = {
            ...orderData,
            status: "completed",
            paymentId: session.payment_intent,
            paidAt: new Date(),
          };

          // اطلاعات آماده است برای ذخیره در جدول سفارش‌های نهایی
          console.log("Order ready for final storage:", finalOrderData);
        }
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
          { error: "Error processing webhook" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
