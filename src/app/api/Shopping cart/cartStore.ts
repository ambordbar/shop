import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";

interface CartState {
  products: CartItem[];
  addProduct: (product: Product) => void;
  removeAllProduct: () => void;
  removeProduct: (product: number) => void;
  clearCart: () => void;
}

type Persist = [["zustand/persist", CartState]];

const useCartStore = create<CartState, Persist>(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => {
        set((state) => {
          const existingProduct = state.products.find(
            (p) => p.id === product.id
          );
          if (existingProduct) {
            return {
              products: state.products.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
              ),
            };
          }
          return {
            products: [...state.products, { ...product, quantity: 1 }],
          };
        });
      },
      removeAllProduct: () => {
        set({ products: [] });
      },
      removeProduct: (productId) => {
        set((state) => {
          const index = state.products.findIndex((p) => p.id === productId);
          if (index === -1) return state;
          const product = state.products[index];
          if (product.quantity > 1) {
            return {
              products: state.products.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
              ),
            };
          }
          const newProducts = [...state.products];
          newProducts.splice(index, 1);
          return { products: newProducts };
        });
      },
      clearCart: () => {
        set({ products: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
