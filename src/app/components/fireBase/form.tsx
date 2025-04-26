"use client";

import { useState } from "react";
import useCartStore from "../../api/Shopping cart/cartStore";
import AlertModal from "../../components/AlertBox/alertBox";
import { CustomerInfo, CartItem, CustomerInfoSchema } from "@/types";
import { z } from "zod";

interface CheckoutFormProps {
  orderData: (
    customerInfo: CustomerInfo,
    cartItems: CartItem[]
  ) => Promise<string>;
}

export default function CheckoutForm({ orderData }: CheckoutFormProps) {
  const cartItems = useCartStore((state) => state.products);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      CustomerInfoSchema.parse(customerInfo);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cart empty check
    if (cartItems.length === 0) {
      setAlertType("error");
      setAlertMessage("Cart is empty");
      setShowAlert(true);
      return;
    }

    // Validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const checkoutUrl = await orderData(customerInfo, cartItems);
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
          onClose={() => setShowAlert(false)}
        />
      )}
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Shipping Information
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit}
                data-testid="form"
              >
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
                    data-testid="name-input"
                    placeholder="Your full name"
                    value={customerInfo.name}
                    onChange={handleChange}
                    className={`bg-gray-50 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                  />
                  {errors.name && (
                    <p
                      data-testid="name-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.name}
                    </p>
                  )}
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
                    data-testid="phone-input"
                    placeholder="0900000000"
                    value={customerInfo.phone}
                    onChange={handleChange}
                    className={`bg-gray-50 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                  />
                  {errors.phone && (
                    <p
                      data-testid="phone-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.phone}
                    </p>
                  )}
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
                    data-testid="address-input"
                    placeholder="Your address"
                    value={customerInfo.address}
                    onChange={handleChange}
                    className={`bg-gray-50 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                  />
                  {errors.address && (
                    <p
                      data-testid="address-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.address}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  data-testid="submit-button"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "go to Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
