import { vi, describe, it, expect, Mock, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import OrderDetails from "../../../src/app/components/orderStyle/OrderDetails";
import useCartStore from "../../../src/app/api/Shopping cart/cartStore";

// Mock for useSearchParams
const mockSearchParams: {
  session_id: string | null;
  order_id: string | null;
  clear_cart: string | null;
} = {
  session_id: null,
  order_id: null,
  clear_cart: null,
};

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (param: string) =>
      mockSearchParams[param as keyof typeof mockSearchParams],
  }),
}));

vi.mock("../../../src/app/api/Shopping cart/cartStore", () => ({
  default: vi.fn(),
}));

const mockRemoveAll = vi.fn();

describe("OrderDetails Component", () => {
  beforeEach(() => {
    mockRemoveAll.mockClear();
    // Reset search params before each test
    mockSearchParams.session_id = null;
    mockSearchParams.order_id = null;
    mockSearchParams.clear_cart = null;
  });

  it("should clear cart when clear_cart parameter is true", () => {
    // Setup successful payment scenario
    mockSearchParams.session_id = "test_session";
    mockSearchParams.order_id = "test_order";
    mockSearchParams.clear_cart = "true";

    (useCartStore as unknown as Mock).mockImplementation(
      (selector: (state: any) => any) => {
        const state = { removeAllProduct: mockRemoveAll };
        return selector(state);
      }
    );

    render(<OrderDetails />);
    expect(mockRemoveAll).toHaveBeenCalled();
  });

  it("should NOT clear cart when payment is unsuccessful", () => {
    // No need to set mockSearchParams as they're already null from beforeEach

    (useCartStore as unknown as Mock).mockImplementation(
      (selector: (state: any) => any) => {
        const state = { removeAllProduct: mockRemoveAll };
        return selector(state);
      }
    );

    render(<OrderDetails />);
    expect(mockRemoveAll).not.toHaveBeenCalled();
  });
});
