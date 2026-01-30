/* eslint-disable @typescript-eslint/no-explicit-any */
import productsReducer, {
  setLoading,
  setError,
  setProducts,
  setSelectedProduct,
  updateProductStock,
} from "./productsSlice";
import type { ProductDTO } from "../../../infrastructure/api/techHavenApiClient";

describe("productsSlice", () => {
  const mockProduct: ProductDTO = {
    id: "1",
    name: "Test Product",
    description: "A test product",
    price: 99.99,
    stock: 50,
    imageUrl: "test.jpg",
  };

  const mockProduct2: ProductDTO = {
    id: "2",
    name: "Another Product",
    description: "Another test product",
    price: 149.99,
    stock: 25,
    imageUrl: "another.jpg",
  };

  const initialState = {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null,
  };

  it("should return the initial state", () => {
    expect(productsReducer(undefined, { type: "unknown" } as any)).toEqual(
      initialState,
    );
  });

  it("should set loading state to true", () => {
    const action = setLoading(true);
    const result = productsReducer(initialState, action);

    expect(result.loading).toBe(true);
  });

  it("should set loading state to false", () => {
    const state = {
      items: [],
      loading: true,
      error: null,
      selectedProduct: null,
    };

    const action = setLoading(false);
    const result = productsReducer(state, action);

    expect(result.loading).toBe(false);
  });

  it("should set error message", () => {
    const errorMessage = "Failed to fetch products";
    const action = setError(errorMessage);
    const result = productsReducer(initialState, action);

    expect(result.error).toBe(errorMessage);
  });

  it("should set error to null", () => {
    const state = {
      items: [],
      loading: false,
      error: "Previous error",
      selectedProduct: null,
    };

    const action = setError(null);
    const result = productsReducer(state, action);

    expect(result.error).toBeNull();
  });

  it("should set products and clear error", () => {
    const products = [mockProduct, mockProduct2];
    const state = {
      items: [],
      loading: false,
      error: "Previous error",
      selectedProduct: null,
    };

    const action = setProducts(products);
    const result = productsReducer(state, action);

    expect(result.items).toHaveLength(2);
    expect(result.items).toEqual(products);
    expect(result.error).toBeNull();
  });

  it("should replace existing products", () => {
    const initialProducts = [mockProduct];
    const newProducts = [mockProduct2];
    const state = {
      items: initialProducts,
      loading: false,
      error: null,
      selectedProduct: null,
    };

    const action = setProducts(newProducts);
    const result = productsReducer(state, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("2");
  });

  it("should set selected product", () => {
    const action = setSelectedProduct(mockProduct);
    const result = productsReducer(initialState, action);

    expect(result.selectedProduct).toEqual(mockProduct);
  });

  it("should clear selected product by setting to null", () => {
    const state = {
      items: [],
      loading: false,
      error: null,
      selectedProduct: mockProduct,
    };

    const action = setSelectedProduct(null);
    const result = productsReducer(state, action);

    expect(result.selectedProduct).toBeNull();
  });

  it("should update product stock when product exists", () => {
    const state = {
      items: [mockProduct, mockProduct2],
      loading: false,
      error: null,
      selectedProduct: null,
    };

    const action = updateProductStock({
      productId: "1",
      quantity: 10,
    });
    const result = productsReducer(state, action);

    expect(result.items[0].stock).toBe(40);
    expect(result.items[1].stock).toBe(25);
  });

  it("should not go below zero stock", () => {
    const state = {
      items: [{ ...mockProduct, stock: 5 }],
      loading: false,
      error: null,
      selectedProduct: null,
    };

    const action = updateProductStock({
      productId: "1",
      quantity: 10,
    });
    const result = productsReducer(state, action);

    expect(result.items[0].stock).toBe(0);
  });

  it("should not update stock for non-existent product", () => {
    const state = {
      items: [mockProduct],
      loading: false,
      error: null,
      selectedProduct: null,
    };

    const action = updateProductStock({
      productId: "999",
      quantity: 10,
    });
    const result = productsReducer(state, action);

    expect(result.items[0].stock).toBe(50);
  });

  it("should handle empty products list", () => {
    const action = setProducts([]);
    const result = productsReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.error).toBeNull();
  });
});
