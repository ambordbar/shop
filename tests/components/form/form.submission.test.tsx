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

describe("CheckoutForm - submit errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: "" };
  });

  it("shows alert when cart is empty", async () => {
    setupCartStore([]);
    const orderData = vi.fn();

    render(<CheckoutForm orderData={orderData} />);
    CheckoutFormPage.submit();

    await waitFor(() =>
      expect(CheckoutFormPage.alertModal()).toBeInTheDocument()
    );
    expect(CheckoutFormPage.alertMessage()).toHaveTextContent("Cart is empty");
    expect(orderData).not.toHaveBeenCalled();
    expect(mockClearCart).not.toHaveBeenCalled();
  });

});
