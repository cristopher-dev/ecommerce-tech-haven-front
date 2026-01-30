import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/domain/entities/CartItem";

interface PurchasedItem extends CartItem {
  purchaseDate: string;
  transactionId: string;
}

interface PurchasedItemsState {
  items: PurchasedItem[];
  totalPurchases: number;
  loading: boolean;
  error: string | null;
}

const initialState: PurchasedItemsState = {
  items: [],
  totalPurchases: 0,
  loading: false,
  error: null,
};

const purchasedItemsSlice = createSlice({
  name: "purchasedItems",
  initialState,
  reducers: {
    // Add items to purchased history
    addToPurchasedItems: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        transactionId: string;
      }>,
    ) => {
      const { items, transactionId } = action.payload;
      const purchaseDate = new Date().toISOString();

      const purchasedItems: PurchasedItem[] = items.map((item) => ({
        ...item,
        purchaseDate,
        transactionId,
      }));

      state.items = [...state.items, ...purchasedItems];
      state.totalPurchases += items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },

    // Remove purchased item
    removePurchasedItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );
      if (item) {
        state.totalPurchases -= item.quantity;
      }
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },

    // Clear all purchased items
    clearPurchasedItems: (state) => {
      state.items = [];
      state.totalPurchases = 0;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToPurchasedItems,
  removePurchasedItem,
  clearPurchasedItems,
  setLoading,
  setError,
} = purchasedItemsSlice.actions;

export default purchasedItemsSlice.reducer;
