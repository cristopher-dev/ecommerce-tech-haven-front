import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";

interface ProductsState {
  items: ProductDTO[];
  loading: boolean;
  error: string | null;
  selectedProduct: ProductDTO | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductDTO[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    setSelectedProduct: (state, action: PayloadAction<ProductDTO | null>) => {
      state.selectedProduct = action.payload;
    },
    updateProductStock: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const product = state.items.find(
        (p) => p.id === action.payload.productId,
      );
      if (product) {
        product.stock = Math.max(0, product.stock - action.payload.quantity);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setSelectedProduct,
  updateProductStock,
} = productsSlice.actions;

export default productsSlice.reducer;
