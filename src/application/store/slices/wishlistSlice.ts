import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WishlistItem } from "@/domain/entities/Wishlist";
import type { Product } from "@/domain/entities/Product";

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(
        (item) => item.product.id === action.payload.id,
      );
      if (!exists) {
        state.items.push({
          product: action.payload,
          addedAt: new Date(),
        });
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.error = null;
    },

    moveToCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setLoading,
  setError,
  setWishlist,
  moveToCart,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
