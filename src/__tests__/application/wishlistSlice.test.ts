/* eslint-disable @typescript-eslint/no-explicit-any */
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setLoading,
  setError,
  setWishlist,
  moveToCart,
} from "./wishlistSlice";
import type { WishlistItem } from "../../../domain/entities/Wishlist";
import type { Product } from "../../../domain/entities/Product";

describe("wishlistSlice", () => {
  const mockProduct: Product = {
    id: 1,
    name: "Test Product",
    price: 29.99,
    image: "test.jpg",
    discount: 10,
  };

  const mockProduct2: Product = {
    id: 2,
    name: "Another Product",
    price: 49.99,
    image: "another.jpg",
    discount: 5,
  };

  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(wishlistReducer(undefined, { type: "unknown" } as any)).toEqual(
      initialState,
    );
  });

  it("should add product to wishlist", () => {
    const action = addToWishlist(mockProduct);
    const result = wishlistReducer(initialState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product).toEqual(mockProduct);
    expect(result.items[0].addedAt).toBeInstanceOf(Date);
  });

  it("should not add duplicate product to wishlist", () => {
    const state = {
      items: [
        {
          product: mockProduct,
          addedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    };

    const action = addToWishlist(mockProduct);
    const result = wishlistReducer(state, action);

    expect(result.items).toHaveLength(1);
  });

  it("should add multiple different products to wishlist", () => {
    let state: any = initialState;

    state = wishlistReducer(state, addToWishlist(mockProduct));
    state = wishlistReducer(state, addToWishlist(mockProduct2));

    expect(state.items).toHaveLength(2);
    expect(state.items[0].product.id).toBe(1);
    expect(state.items[1].product.id).toBe(2);
  });

  it("should remove product from wishlist", () => {
    const state = {
      items: [
        {
          product: mockProduct,
          addedAt: new Date(),
        },
        {
          product: mockProduct2,
          addedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    };

    const action = removeFromWishlist(1);
    const result = wishlistReducer(state, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product.id).toBe(2);
  });

  it("should clear all items from wishlist", () => {
    const state = {
      items: [
        {
          product: mockProduct,
          addedAt: new Date(),
        },
        {
          product: mockProduct2,
          addedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    };

    const action = clearWishlist();
    const result = wishlistReducer(state, action);

    expect(result.items).toHaveLength(0);
  });

  it("should set loading state", () => {
    const action = setLoading(true);
    const result = wishlistReducer(initialState, action);

    expect(result.loading).toBe(true);
  });

  it("should set error message", () => {
    const errorMessage = "Failed to fetch wishlist";
    const action = setError(errorMessage);
    const result = wishlistReducer(initialState, action);

    expect(result.error).toBe(errorMessage);
  });

  it("should set error to null", () => {
    const state = {
      items: [],
      loading: false,
      error: "Some error",
    };

    const action = setError(null);
    const result = wishlistReducer(state, action);

    expect(result.error).toBeNull();
  });

  it("should set wishlist items and clear error", () => {
    const newItems: WishlistItem[] = [
      {
        product: mockProduct,
        addedAt: new Date(),
      },
      {
        product: mockProduct2,
        addedAt: new Date(),
      },
    ];

    const state = {
      items: [],
      loading: false,
      error: "Previous error",
    };

    const action = setWishlist(newItems);
    const result = wishlistReducer(state, action);

    expect(result.items).toHaveLength(2);
    expect(result.error).toBeNull();
  });

  it("should move product from wishlist (moveToCart)", () => {
    const state = {
      items: [
        {
          product: mockProduct,
          addedAt: new Date(),
        },
        {
          product: mockProduct2,
          addedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    };

    const action = moveToCart(1);
    const result = wishlistReducer(state, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product.id).toBe(2);
  });
});
