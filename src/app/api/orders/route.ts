import { NextRequest, NextResponse } from "next/server";
import { saveOrderFromUrl } from "@/app/action/orderManager";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    if (!sessionId || !orderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const orderData = await saveOrderFromUrl(sessionId, orderId);
    return NextResponse.json({ success: true, order: orderData });
  } catch (error) {
    console.error("Error verifying order:", error);
    return NextResponse.json(
      { error: "Failed to verify order" },
      { status: 500 }
    );
  }
}
