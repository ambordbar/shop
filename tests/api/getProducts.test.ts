import { vi, describe, it, expect, beforeEach } from "vitest";
import { getProducts } from "../../src/app/action/getProducts";
import { getFromCache, setInCache } from "@/lib/redis";
import { ProductsTestModel } from "./products.model";

// Mock redis functions
vi.mock("@/lib/redis", () => ({
  getFromCache: vi.fn(),
  setInCache: vi.fn(),
  CACHE_KEYS: {
    PRODUCTS: "products",
  },
  CACHE_TTL: {
    PRODUCTS: 3600,
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("getProducts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return cached products if available", async () => {
    const mockCachedProducts = ProductsTestModel.createMockApiResponse(1);
    ProductsTestModel.setupMockCache(
      vi.mocked(getFromCache),
      mockCachedProducts
    );

    const products = await ProductsTestModel.fetchProducts();

    expect(products).toEqual(mockCachedProducts);
    expect(getFromCache).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    products.forEach(ProductsTestModel.verifyProductSchema);
  });

  it("should fetch and cache products if not in cache", async () => {
    const mockApiProducts = ProductsTestModel.createMockApiResponse(1);

    ProductsTestModel.setupMockCache(vi.mocked(getFromCache), null);
    ProductsTestModel.setupMockFetch(mockFetch, {
      ok: true,
      data: mockApiProducts,
    });

    const products = await ProductsTestModel.fetchProducts();

    expect(products).toEqual(mockApiProducts);
    expect(getFromCache).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(setInCache).toHaveBeenCalledWith("products", mockApiProducts, 3600);
    products.forEach(ProductsTestModel.verifyProductSchema);
  });

  it("should filter out invalid products from API response", async () => {
    const mockApiResponse = [
      ProductsTestModel.validProduct,
      ProductsTestModel.createInvalidProduct(),
    ];

    ProductsTestModel.setupMockCache(vi.mocked(getFromCache), null);
    ProductsTestModel.setupMockFetch(mockFetch, {
      ok: true,
      data: mockApiResponse,
    });

    const products = await ProductsTestModel.fetchProducts();

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(ProductsTestModel.validProduct);
    products.forEach(ProductsTestModel.verifyProductSchema);
  });

  it("should return empty array on API error", async () => {
    ProductsTestModel.setupMockCache(vi.mocked(getFromCache), null);
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    const products = await ProductsTestModel.fetchProducts();

    expect(products).toEqual([]);
    expect(getFromCache).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should return empty array on invalid API response", async () => {
    ProductsTestModel.setupMockCache(vi.mocked(getFromCache), null);
    ProductsTestModel.setupMockFetch(mockFetch, { ok: false, status: 500 });

    const products = await ProductsTestModel.fetchProducts();

    expect(products).toEqual([]);
    expect(getFromCache).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
