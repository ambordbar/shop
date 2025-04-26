import React from "react";
import { vi, describe, it, beforeEach, expect, Mock } from "vitest";
import { render, waitFor } from "@testing-library/react";
import CheckoutForm from "../../../src/app/components/fireBase/form";
import CheckoutFormPage from "./form.page";
import useCartStore from "../../../src/app/api/Shopping cart/cartStore";
import { Product } from "@/types";

vi.mock("../../../src/app/api/Shopping cart/cartStore", () => ({
  default: vi.fn(),
}));

const mockClearCart = vi.fn();
function setupCartStore(products: Product[]) {
  (useCartStore as unknown as Mock).mockImplementation(
    (selector: (state: any) => any) => {
      const state = { products, removeAllProduct: mockClearCart };
      return selector(state);
    }
  );
}

describe("CheckoutForm - Validation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: "" };
  });

  it("should show validation errors for all fields with invalid data", async () => {
    setupCartStore([
      {
        id: 1,
        title: "Test Product",
        price: 100,
        description: "Test Description",
        category: "Test Category",
        image: "https://example.com/image.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ]);

    const orderData = vi.fn();
    render(<CheckoutForm orderData={orderData} />);

    await CheckoutFormPage.fillName("123");
    await CheckoutFormPage.fillPhone("abc");
    await CheckoutFormPage.fillAddress("@wv.com");

    CheckoutFormPage.submit();

    expect(CheckoutFormPage.nameError()).toHaveTextContent(
      "Name can only contain letters and spaces"
    );
    expect(CheckoutFormPage.phoneError()).toHaveTextContent(
      "Phone number can only contain numbers"
    );
    expect(CheckoutFormPage.addressError()).toHaveTextContent(
      "Address can only contain letters, numbers and spaces"
    );

    expect(orderData).not.toHaveBeenCalled();
  });

  it("should successfully submit form with valid data and redirect to payment", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Test Product",
        price: 100,
        description: "Test Description",
        category: "Test Category",
        image: "https://example.com/image.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ];
    setupCartStore(mockProducts);

    const mockCheckoutUrl = "https://checkout.stripe.com/abc123";
    const orderData = vi.fn().mockResolvedValue(mockCheckoutUrl);

    render(<CheckoutForm orderData={orderData} />);

    await CheckoutFormPage.fillName("John Doe");
    await CheckoutFormPage.fillPhone("09123456789");
    await CheckoutFormPage.fillAddress("123 Main St");

    CheckoutFormPage.submit();

    await waitFor(() => {
      expect(orderData).toHaveBeenCalledWith(
        {
          name: "John Doe",
          phone: "09123456789",
          address: "123 Main St",
        },
        mockProducts
      );
    });

    await waitFor(() => {
      expect(window.location.href).toMatch(
        /^https:\/\/checkout\.stripe\.com\//
      );
    });
  });
});
