import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CartItem } from "@/domain/entities/CartItem";
import {
  transactionsApi,
  productsApi,
  TransactionDTO,
} from "@/infrastructure/api/techHavenApiClient";

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

/**
 * Async thunk to fetch user transactions from API
 */
export const fetchUserTransactions = createAsyncThunk(
  "purchasedItems/fetchUserTransactions",
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch all transactions and products in parallel
      const [transactions, products] = await Promise.all([
        transactionsApi.getAll(),
        productsApi.getAll(),
      ]);

      // Filter transactions for the current user
      const userTransactions = transactions.filter(
        (txn) => txn.customerId === userId,
      );

      // Map transactions to PurchasedItems format
      const purchasedItems: PurchasedItem[] = userTransactions
        .map((txn: TransactionDTO) => {
          const product = products.find((p) => p.id === txn.productId);
          if (!product) {
            console.warn(`Product not found for transaction ${txn.id}`);
            return null;
          }

          return {
            id: txn.id,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.image,
              stock: product.stock,
            },
            quantity: txn.quantity,
            purchaseDate: txn.createdAt,
            transactionId: txn.id,
          } as PurchasedItem;
        })
        .filter((item): item is PurchasedItem => item !== null);

      return purchasedItems;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch transactions",
      );
    }
  },
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalPurchases = action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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
