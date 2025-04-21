import { promises as fs } from "fs";
import path from "path";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export interface OrderData {
  id: string;
  stripeSessionId: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
  total: number;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  paymentStatus: string;
}

interface OrdersFile {
  orders: OrderData[];
}

const ORDERS_FILE = path.join(process.cwd(), "src/data/orders.json");

export async function saveOrder(orderData: OrderData): Promise<void> {
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
    console.log("Order saved successfully:", orderData.id);
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
}

export async function getOrders(): Promise<OrderData[]> {
  try {
    const fileContent = await fs.readFile(ORDERS_FILE, "utf-8");
    const data: OrdersFile = JSON.parse(fileContent);
    return data.orders || [];
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<OrderData | null> {
  const orders = await getOrders();
  return orders.find((order) => order.id === orderId) || null;
}

export async function saveOrderFromUrl(
  sessionId: string,
  tempOrderId: string
): Promise<OrderData> {
  try {
    // خواندن اطلاعات سفارش موقت از Firebase
    const tempOrderRef = doc(db, "temp_orders", tempOrderId);
    const snap = await getDoc(tempOrderRef);

    if (!snap.exists()) {
      throw new Error("Temp order not found");
    }

    const tempOrder = snap.data();

    // ساخت آبجکت OrderData
    const orderData: OrderData = {
      id: sessionId,
      stripeSessionId: sessionId,
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total: tempOrder.total,
      customerInfo: tempOrder.customerInfo,
      items: tempOrder.items,
      paymentStatus: "paid",
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
