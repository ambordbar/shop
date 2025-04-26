import { Product } from "@/types";
import { getProducts } from "../../src/app/action/getProducts";
import { expect, Mock } from "vitest";

export class ProductsTestModel {
  static readonly validProduct: Product = {
    id: 1,
    title: "Test Product",
    price: 100,
    description: "A test product",
    category: "test",
    image: "https://example.com/image.jpg",
    rating: { rate: 4.5, count: 100 },
  };

  static createInvalidProduct() {
    return {
      id: 2,
      title: "Invalid Product",
      price: -100,
      description: "",
      category: "",
      image: "not-a-url",
      rating: { rate: -1, count: -50 },
    };
  }

  static createMockApiResponse(count: number = 1): Product[] {
    return Array(count)
      .fill(null)
      .map((_, index) => ({
        ...this.validProduct,
        id: index + 1,
        title: `Test Product ${index + 1}`,
      }));
  }

  static setupMockCache(mockCache: Mock, products: Product[] | null) {
    mockCache.mockResolvedValueOnce(products);
  }

  static setupMockFetch(
    mockFetch: Mock,
    response: { ok: boolean; data?: any; status?: number }
  ) {
    if (response.ok) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response.data),
      });
    } else {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: response.status || 500,
      });
    }
  }

  static verifyProductSchema(product: Product) {
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("title");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("description");
    expect(product).toHaveProperty("category");
    expect(product).toHaveProperty("image");
    expect(product).toHaveProperty("rating");
    expect(product.rating).toHaveProperty("rate");
    expect(product.rating).toHaveProperty("count");
  }

  static async fetchProducts(): Promise<Product[]> {
    return await getProducts();
  }
}
