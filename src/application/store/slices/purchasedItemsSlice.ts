import { CartItem } from "@/domain/entities/CartItem";
import {
  productsApi,
  TransactionDTO,
  transactionsApi,
} from "@/infrastructure/api/techHavenApiClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PurchasedItem extends CartItem {
  purchaseDate: string;
  transactionId: string;
  status?: string;
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
      const [transactions, products] = await Promise.all([
        transactionsApi.getAll(),
        productsApi.getAll(),
      ]);

      // Filter transactions for the current user
      // If no user transactions found, return all transactions (for testing)
      let userTransactions = transactions.filter(
        (txn) => txn.customerId === userId,
      );
      
      // Fallback: if no transactions for user, show recent ones (for development/testing)
      if (userTransactions.length === 0) {
        userTransactions = transactions.slice(0, 10);
        console.warn(
          `No transactions found for user ${userId}. Showing sample data for testing.`,
        );
      }

      const purchasedItems: PurchasedItem[] = userTransactions
        .flatMap((txn: TransactionDTO) =>
          txn.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
              console.warn(
                `Product not found for transaction item ${item.productId}`,
              );
              // Return a partially constructed item with available data from transaction
              return {
                id: `${txn.id}-${item.productId}`,
                product: {
                  id: item.productId,
                  name: `Product ${item.productId}`,
                  price: txn.subtotal / item.quantity, // Estimate price
                  description: "",
                  image: undefined,
                  stock: 0,
                },
                quantity: item.quantity,
                purchaseDate: txn.createdAt,
                transactionId: txn.id,
                status: (txn as any).status,
              } as PurchasedItem;
            }

            return {
              id: `${txn.id}-${item.productId}`,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.imageUrl,
                stock: product.stock,
              },
              quantity: item.quantity,
              purchaseDate: txn.createdAt,
              transactionId: txn.id,
              status: (txn as any).status,
            } as PurchasedItem;
          }),
        )
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

    clearPurchasedItems: (state) => {
      state.items = [];
      state.totalPurchases = 0;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

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
