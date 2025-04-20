"use client";

import { useState } from "react";
import useCartStore from "../../api/Shopping cart/cartStore";
import AlertModal from "../../components/AlertBox/alertBox";
import { CustomerInfo, CartItem } from "@/types";

interface CheckoutFormProps {
  orderData: (
    customerInfo: CustomerInfo,
    cartItems: CartItem[]
  ) => Promise<string>;
}

export default function CheckoutForm({ orderData }: CheckoutFormProps) {
  const cartItems = useCartStore((state) => state.products);
  const clearCart = useCartStore((state) => state.removeAllProduct);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    phone: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShowAlert(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      const checkoutUrl = await orderData(customerInfo, cartItems);
      clearCart();
      window.location.href = checkoutUrl;
    } catch (error: unknown) {
      setAlertType("error");
      setAlertMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showAlert && (
        <AlertModal
          type={alertType}
          message={alertMessage}
          onClose={handleClose}
        />
      )}
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Shipping Information
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your full name"
                    required
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="0900000000"
                    required
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    placeholder="Your address"
                    required
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
