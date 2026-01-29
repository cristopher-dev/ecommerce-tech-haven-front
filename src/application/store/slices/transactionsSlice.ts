import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  TransactionDTO,
  CreateTransactionInputDto,
} from "../../infrastructure/api/techHavenApiClient";

interface TransactionState {
  currentTransaction: TransactionDTO | null;
  transactions: TransactionDTO[];
  loading: boolean;
  error: string | null;
  creatingTransaction: boolean;
  processingPayment: boolean;
}

const initialState: TransactionState = {
  currentTransaction: null,
  transactions: [],
  loading: false,
  error: null,
  creatingTransaction: false,
  processingPayment: false,
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTransactions: (state, action: PayloadAction<TransactionDTO[]>) => {
      state.transactions = action.payload;
      state.error = null;
    },
    setCurrentTransaction: (
      state,
      action: PayloadAction<TransactionDTO | null>,
    ) => {
      state.currentTransaction = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setCreatingTransaction: (state, action: PayloadAction<boolean>) => {
      state.creatingTransaction = action.payload;
    },
    setProcessingPayment: (state, action: PayloadAction<boolean>) => {
      state.processingPayment = action.payload;
    },
    updateTransactionStatus: (
      state,
      action: PayloadAction<{
        transactionId: string;
        status: "PENDING" | "COMPLETED" | "FAILED";
      }>,
    ) => {
      if (state.currentTransaction?.id === action.payload.transactionId) {
        state.currentTransaction.status = action.payload.status;
      }
      const transaction = state.transactions.find(
        (t) => t.id === action.payload.transactionId,
      );
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setTransactions,
  setCurrentTransaction,
  setCreatingTransaction,
  setProcessingPayment,
  updateTransactionStatus,
  clearCurrentTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
