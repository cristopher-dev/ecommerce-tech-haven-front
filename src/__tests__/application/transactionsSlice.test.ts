import transactionsReducer, {
  clearCurrentTransaction,
  setCreatingTransaction,
  setCurrentTransaction,
  setError,
  setLoading,
  setProcessingPayment,
  setTransactions,
  updateTransactionStatus,
} from "@/application/store/slices/transactionsSlice";
import type { TransactionDTO } from "../../../infrastructure/api/techHavenApiClient";

describe("transactionsSlice", () => {
  const mockTransaction: TransactionDTO = {
    id: "TXN001",
    orderId: "ORD001",
    amount: 299.99,
    currency: "USD",
    status: "PENDING",
    paymentMethod: "CREDIT_CARD",
    createdAt: new Date().toISOString(),
  };

  const mockTransaction2: TransactionDTO = {
    id: "TXN002",
    orderId: "ORD002",
    amount: 199.99,
    currency: "USD",
    status: "COMPLETED",
    paymentMethod: "DEBIT_CARD",
    createdAt: new Date().toISOString(),
  };

  const initialState = {
    currentTransaction: null,
    transactions: [],
    loading: false,
    error: null,
    creatingTransaction: false,
    processingPayment: false,
  };

  it("should return the initial state", () => {
    expect(transactionsReducer(undefined, { type: "unknown" } as any)).toEqual(
      initialState,
    );
  });

  it("should set loading state", () => {
    const action = setLoading(true);
    const result = transactionsReducer(initialState, action);

    expect(result.loading).toBe(true);
  });

  it("should set error message", () => {
    const errorMessage = "Transaction failed";
    const action = setError(errorMessage);
    const result = transactionsReducer(initialState, action);

    expect(result.error).toBe(errorMessage);
  });

  it("should clear error by setting to null", () => {
    const state = {
      currentTransaction: null,
      transactions: [],
      loading: false,
      error: "Previous error",
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = setError(null);
    const result = transactionsReducer(state, action);

    expect(result.error).toBeNull();
  });

  it("should set transactions list and clear error", () => {
    const transactions = [mockTransaction, mockTransaction2];
    const state = {
      currentTransaction: null,
      transactions: [],
      loading: false,
      error: "Previous error",
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = setTransactions(transactions);
    const result = transactionsReducer(state, action);

    expect(result.transactions).toHaveLength(2);
    expect(result.error).toBeNull();
  });

  it("should set current transaction and clear error", () => {
    const action = setCurrentTransaction(mockTransaction);
    const result = transactionsReducer(initialState, action);

    expect(result.currentTransaction).toEqual(mockTransaction);
    expect(result.error).toBeNull();
  });

  it("should clear current transaction and keep previous error", () => {
    const state = {
      currentTransaction: mockTransaction,
      transactions: [],
      loading: false,
      error: "Previous error",
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = setCurrentTransaction(null);
    const result = transactionsReducer(state, action);

    expect(result.currentTransaction).toBeNull();
    expect(result.error).toBe("Previous error");
  });

  it("should set creating transaction state", () => {
    const action = setCreatingTransaction(true);
    const result = transactionsReducer(initialState, action);

    expect(result.creatingTransaction).toBe(true);
  });

  it("should set processing payment state", () => {
    const action = setProcessingPayment(true);
    const result = transactionsReducer(initialState, action);

    expect(result.processingPayment).toBe(true);
  });

  it("should update transaction status in current transaction", () => {
    const state = {
      currentTransaction: mockTransaction,
      transactions: [],
      loading: false,
      error: null,
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = updateTransactionStatus({
      transactionId: "TXN001",
      status: "COMPLETED",
    });
    const result = transactionsReducer(state, action);

    expect(result.currentTransaction?.status).toBe("COMPLETED");
  });

  it("should update transaction status in transactions list", () => {
    const state = {
      currentTransaction: null,
      transactions: [mockTransaction, mockTransaction2],
      loading: false,
      error: null,
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = updateTransactionStatus({
      transactionId: "TXN001",
      status: "FAILED",
    });
    const result = transactionsReducer(state, action);

    expect(result.transactions[0].status).toBe("FAILED");
    expect(result.transactions[1].status).toBe("COMPLETED");
  });

  it("should update transaction status in both current and list", () => {
    const state = {
      currentTransaction: mockTransaction,
      transactions: [mockTransaction, mockTransaction2],
      loading: false,
      error: null,
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = updateTransactionStatus({
      transactionId: "TXN001",
      status: "COMPLETED",
    });
    const result = transactionsReducer(state, action);

    expect(result.currentTransaction?.status).toBe("COMPLETED");
    expect(result.transactions[0].status).toBe("COMPLETED");
  });

  it("should clear current transaction", () => {
    const state = {
      currentTransaction: mockTransaction,
      transactions: [],
      loading: false,
      error: "Some error",
      creatingTransaction: false,
      processingPayment: false,
    };

    const action = clearCurrentTransaction();
    const result = transactionsReducer(state, action);

    expect(result.currentTransaction).toBeNull();
    expect(result.error).toBeNull();
  });

  it("should handle multiple state changes in sequence", () => {
    let state = initialState;

    state = transactionsReducer(state, setLoading(true));
    state = transactionsReducer(state, setCreatingTransaction(true));
    state = transactionsReducer(state, setCurrentTransaction(mockTransaction));
    state = transactionsReducer(state, setLoading(false));
    state = transactionsReducer(state, setCreatingTransaction(false));

    expect(state.currentTransaction).toEqual(mockTransaction);
    expect(state.loading).toBe(false);
    expect(state.creatingTransaction).toBe(false);
  });
});
