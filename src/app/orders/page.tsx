import { Suspense } from "react";
import OrderDetails from "../components/orderStyle/OrderDetails";
import OrdersLoading from "./loading";

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrderDetails />
    </Suspense>
  );
}
