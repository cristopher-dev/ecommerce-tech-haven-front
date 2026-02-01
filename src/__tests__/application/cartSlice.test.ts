// Mock LocalStorageCartRepository before importing the slice
jest.mock("@/infrastructure/adapters/LocalStorageCartRepository", () => ({
  LocalStorageCartRepository: jest.fn().mockImplementation(() => ({
    getCart: jest.fn().mockReturnValue({ items: [] }),
    saveCart: jest.fn(),
  })),
}));

import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  setCart,
  setError,
  setLoading,
  updateQuantity,
} from "@/application/store/slices/cartSlice";
import { Product } from "@/domain/entities/Product";

describe("cartSlice", () => {
  const mockProduct: Product = {
    id: 1,
    name: "Test Product",
    price: 10.99,
    image: "test.jpg",
    discount: 0,
  };

  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" } as any)).toEqual({
      items: [],
      total: 0,
      totalItems: 0,
      loading: false,
      error: null,
    });
  });

  it("should add product to cart", () => {
    const action = addToCart({ product: mockProduct, quantity: 2 });
    const result = cartReducer(
      {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
      action,
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product).toEqual(mockProduct);
    expect(result.items[0].quantity).toBe(2);
    expect(result.total).toBe(21.98);
    expect(result.totalItems).toBe(2);
  });

  it("should increase quantity if product already in cart", () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 1 }],
      total: 10.99,
      totalItems: 1,
      loading: false,
      error: null,
    };

    const action = addToCart({ product: mockProduct, quantity: 3 });
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(4);
    expect(result.total).toBe(43.96);
    expect(result.totalItems).toBe(4);
  });

  it("should remove product from cart", () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = removeFromCart(1);
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it("should update quantity", () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = updateQuantity({ productId: 1, quantity: 5 });
    const result = cartReducer(initialState, action);

    expect(result.items[0].quantity).toBe(5);
    expect(result.total).toBe(54.95);
    expect(result.totalItems).toBe(5);
  });

  it("should remove item if quantity is 0 or less", () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = updateQuantity({ productId: 1, quantity: 0 });
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it("should clear cart", () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2 }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = clearCart();
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it("should set cart", () => {
    const newItems = [{ product: mockProduct, quantity: 3 }];
    const action = setCart(newItems);
    const result = cartReducer(
      {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
      action,
    );

    expect(result.items).toEqual(newItems);
    expect(result.total).toBe(32.97);
    expect(result.totalItems).toBe(3);
  });

  it("should set loading", () => {
    const action = setLoading(true);
    const result = cartReducer(
      {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
      action,
    );

    expect(result.loading).toBe(true);
  });

  it("should set error", () => {
    const action = setError("Test error");
    const result = cartReducer(
      {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
      action,
    );

    expect(result.error).toBe("Test error");
  });
});
