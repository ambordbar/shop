export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Order {
  uid: string;
  items: CartItem[];
  shipping: {
    name: string;
    address: string;
    phone: string;
  };
  status: "pending" | "completed" | "failed";
  total: number;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
}
