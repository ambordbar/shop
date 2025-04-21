import { NextRequest, NextResponse } from "next/server";
import { saveOrderFromUrl } from "@/app/action/orderManager";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  console.log("Webhook received");
  try {
    const buf = await req.arrayBuffer();
    const payload = Buffer.from(buf).toString("utf8");
    const event = JSON.parse(payload);

    console.log("Event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tempOrderId = session.metadata?.tempOrderId;

      if (!tempOrderId) {
        return NextResponse.json({ error: "No tempOrderId" }, { status: 400 });
      }

      try {
        const orderData = await saveOrderFromUrl(session.id, tempOrderId);
        return NextResponse.json({ success: true, order: orderData });
      } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json(
          { error: "Failed to process order" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}
