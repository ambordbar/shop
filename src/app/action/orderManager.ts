import { promises as fs } from "fs";
import path from "path";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { Order } from "@/types";

interface OrdersFile {
  orders: Order[];
}

const ORDERS_FILE = path.join(process.cwd(), "src/data/orders.json");

export async function saveOrder(orderData: Order): Promise<void> {
  try {
    let ordersFile: OrdersFile = { orders: [] };

    try {
      const fileContent = await fs.readFile(ORDERS_FILE, "utf-8");
      ordersFile = JSON.parse(fileContent);
    } catch (error) {
      console.log("Creating new orders file", error);
    }

    // اگر orders وجود نداشت، آن را ایجاد کن
    if (!ordersFile.orders) {
      ordersFile.orders = [];
    }

    ordersFile.orders.push(orderData);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(ordersFile, null, 2));
    console.log("Order saved successfully:", orderData.uid);
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const fileContent = await fs.readFile(ORDERS_FILE, "utf-8");
    const data: OrdersFile = JSON.parse(fileContent);
    return data.orders || [];
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((order) => order.uid === orderId) || null;
}

export async function saveOrderFromUrl(
  sessionId: string,
  tempOrderId: string
): Promise<Order> {
  try {
    // خواندن اطلاعات سفارش موقت از Firebase
    const tempOrderRef = doc(db, "temp_orders", tempOrderId);
    const snap = await getDoc(tempOrderRef);

    if (!snap.exists()) {
      throw new Error("Temp order not found");
    }

    const tempOrder = snap.data();

    // ساخت آبجکت OrderData
    const orderData: Order = {
      uid: sessionId,
      stripeSessionId: sessionId,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      total: tempOrder.total,
      shipping: tempOrder.customerInfo,
      items: tempOrder.items,
    };

    // ذخیره در فایل JSON
    await saveOrder(orderData);

    // علامت‌گذاری سفارش موقت به عنوان حذف شده
    await setDoc(tempOrderRef, { deleted: true }, { merge: true });

    return orderData;
  } catch (error) {
    console.error("Error saving order from URL:", error);
    throw error;
  }
}
