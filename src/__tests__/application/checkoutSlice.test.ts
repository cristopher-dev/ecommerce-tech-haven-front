import checkoutReducer, {
  setStep,
  setDeliveryData,
  setPaymentData,
  clearCheckout,
  addToCart,
  setLoading,
  setError,
} from "@/application/store/slices/checkoutSlice";

describe("checkoutSlice", () => {
  const initialState = {
    cartItems: [],
    paymentData: null,
    deliveryData: null,
    baseFee: 5000,
    deliveryFee: 10000,
    loading: false,
    error: null,
    step: "product" as const,
    lastTransactionId: null,
    transactionItems: [],
  };

  it("should return the initial state", () => {
    expect(checkoutReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should handle setStep to payment", () => {
    const actual = checkoutReducer(initialState, setStep("payment"));
    expect(actual.step).toBe("payment");
  });

  it("should handle setStep to summary", () => {
    const actual = checkoutReducer(initialState, setStep("summary"));
    expect(actual.step).toBe("summary");
  });

  it("should handle setDeliveryData", () => {
    const deliveryData = {
      address: "123 Main St",
      city: "Bogotá",
      state: "DC",
      postalCode: "110111",
      phone: "3001234567",
    };
    const actual = checkoutReducer(initialState, setDeliveryData(deliveryData));
    expect(actual.deliveryData).toEqual(deliveryData);
  });

  it("should handle setPaymentData", () => {
    const paymentData = {
      cardNumber: "4111111111111111",
      cardholderName: "John Doe",
      expirationMonth: 12,
      expirationYear: 2025,
      cvv: "123",
    };
    const actual = checkoutReducer(initialState, setPaymentData(paymentData));
    expect(actual.paymentData).toEqual(paymentData);
  });

  it("should handle clearCheckout", () => {
    const stateWithData = {
      ...initialState,
      step: "summary" as const,
      deliveryData: {
        address: "123 Main St",
        city: "Bogotá",
        state: "DC",
        postalCode: "110111",
        phone: "3001234567",
      },
      paymentData: {
        cardNumber: "4111",
        cardholderName: "John",
        expirationMonth: 12,
        expirationYear: 2025,
        cvv: "123",
      },
    };
    const actual = checkoutReducer(stateWithData, clearCheckout());
    expect(actual).toEqual(initialState);
  });

  it("should handle setLoading", () => {
    const actual = checkoutReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it("should handle setError", () => {
    const actual = checkoutReducer(initialState, setError("Test error"));
    expect(actual.error).toBe("Test error");
  });
});
