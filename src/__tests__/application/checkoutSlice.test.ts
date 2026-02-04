import { configureStore } from "@reduxjs/toolkit";
import checkoutSlice, {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setPaymentData,
  clearPaymentData,
  clearPaymentSensitiveData,
  setDeliveryData,
  setStep,
  setLoading,
  setError,
  setLastTransactionId,
  setTransactionItems,
  setToken,
  clearCheckout,
  setDeliveryFee,
} from "@/application/store/slices/checkoutSlice";

describe("checkoutSlice", () => {
  let store: any;

  const mockProduct = {
    id: 1,
    name: "Test Product",
    price: 10000,
    rating: 4.5,
    description: "Test product description",
    image: "test.jpg",
  };

  const mockCartItem = {
    product: mockProduct,
    quantity: 1,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: { checkout: checkoutSlice },
    });
  });

  describe("cart operations", () => {
    it("should handle addToCart", () => {
      store.dispatch(addToCart(mockCartItem));
      const state = store.getState().checkout;

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].product.id).toBe(mockProduct.id);
      expect(state.cartItems[0].quantity).toBe(1);
    });

    it("should increase quantity when adding duplicate product", () => {
      store.dispatch(addToCart(mockCartItem));
      store.dispatch(addToCart(mockCartItem));
      const state = store.getState().checkout;

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].quantity).toBe(2);
    });

    it("should handle removeFromCart", () => {
      store.dispatch(addToCart(mockCartItem));
      store.dispatch(removeFromCart(mockProduct.id));
      const state = store.getState().checkout;

      expect(state.cartItems).toHaveLength(0);
    });

    it("should handle updateCartItemQuantity", () => {
      store.dispatch(addToCart(mockCartItem));
      store.dispatch(updateCartItemQuantity({ productId: mockProduct.id, quantity: 5 }));
      const state = store.getState().checkout;

      expect(state.cartItems[0].quantity).toBe(5);
    });

    it("should handle clearCart", () => {
      store.dispatch(addToCart(mockCartItem));
      store.dispatch(clearCart());
      const state = store.getState().checkout;

      expect(state.cartItems).toHaveLength(0);
    });
  });

  describe("payment operations", () => {
    const mockPaymentData = {
      cardNumber: "4111111111111111",
      cardholderName: "John Doe",
      expirationMonth: 12,
      expirationYear: 2025,
      cvv: "123",
    };

    it("should handle setPaymentData", () => {
      store.dispatch(setPaymentData(mockPaymentData));
      const state = store.getState().checkout;

      expect(state.paymentData).toEqual(mockPaymentData);
    });

    it("should handle clearPaymentData", () => {
      store.dispatch(setPaymentData(mockPaymentData));
      store.dispatch(clearPaymentData());
      const state = store.getState().checkout;

      expect(state.paymentData).toBeNull();
    });

    it("should handle clearPaymentSensitiveData", () => {
      store.dispatch(setPaymentData(mockPaymentData));
      store.dispatch(clearPaymentSensitiveData());
      const state = store.getState().checkout;

      expect(state.paymentData?.cvv).toBe("");
      expect(state.paymentData?.cardNumber).toBe("4111111111111111");
    });
  });

  describe("delivery operations", () => {
    const mockDeliveryData = {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      email: "john@example.com",
      phone: "+1234567890",
    };

    it("should handle setDeliveryData", () => {
      store.dispatch(setDeliveryData(mockDeliveryData));
      const state = store.getState().checkout;

      expect(state.deliveryData).toEqual(mockDeliveryData);
    });

    it("should handle setDeliveryFee", () => {
      store.dispatch(setDeliveryFee(15000));
      const state = store.getState().checkout;

      expect(state.deliveryFee).toBe(15000);
    });
  });

  describe("checkout state operations", () => {
    it("should handle setStep", () => {
      store.dispatch(setStep("payment"));
      const state = store.getState().checkout;

      expect(state.step).toBe("payment");
    });

    it("should handle setLoading", () => {
      store.dispatch(setLoading(true));
      let state = store.getState().checkout;
      expect(state.loading).toBe(true);

      store.dispatch(setLoading(false));
      state = store.getState().checkout;
      expect(state.loading).toBe(false);
    });

    it("should handle setError", () => {
      const errorMsg = "Payment failed";
      store.dispatch(setError(errorMsg));
      const state = store.getState().checkout;

      expect(state.error).toBe(errorMsg);
    });

    it("should clear error with null", () => {
      store.dispatch(setError("Some error"));
      store.dispatch(setError(null));
      const state = store.getState().checkout;

      expect(state.error).toBeNull();
    });
  });

  describe("transaction operations", () => {
    it("should handle setLastTransactionId", () => {
      const txnId = "TXN-12345";
      store.dispatch(setLastTransactionId(txnId));
      const state = store.getState().checkout;

      expect(state.lastTransactionId).toBe(txnId);
    });

    it("should handle setTransactionItems", () => {
      const items = [mockCartItem, { product: { ...mockProduct, id: 2 }, quantity: 2 }];
      store.dispatch(setTransactionItems(items));
      const state = store.getState().checkout;

      expect(state.transactionItems).toHaveLength(2);
      expect(state.transactionItems[0].product.id).toBe(1);
    });

    it("should handle setToken", () => {
      const token = "test-checkout-token";
      store.dispatch(setToken(token));
      const state = store.getState().checkout;

      expect(state.token).toBe(token);
    });
  });

  describe("clearCheckout", () => {
    it("should reset all checkout state", () => {
      // Setup complex state
      store.dispatch(addToCart(mockCartItem));
      store.dispatch(setPaymentData({ cardNumber: "4111", cardholderName: "Test", expirationMonth: 12, expirationYear: 2025, cvv: "123" }));
      store.dispatch(setDeliveryData({ firstName: "John", lastName: "Doe", address: "123 St", city: "NY", state: "NY", postalCode: "10001", email: "test@test.com", phone: "123" }));
      store.dispatch(setStep("summary"));
      store.dispatch(setLastTransactionId("TXN-123"));
      store.dispatch(setToken("token-123"));

      // Clear
      store.dispatch(clearCheckout());
      const state = store.getState().checkout;

      expect(state.cartItems).toHaveLength(0);
      expect(state.paymentData).toBeNull();
      expect(state.deliveryData).toBeNull();
      expect(state.step).toBe("product");
      expect(state.lastTransactionId).toBeNull();
      expect(state.transactionItems).toHaveLength(0);
      expect(state.token).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("initial state", () => {
    it("should return the initial state", () => {
      const state = store.getState().checkout;

      expect(state.cartItems).toEqual([]);
      expect(state.paymentData).toBeNull();
      expect(state.deliveryData).toBeNull();
      expect(state.step).toBe("product");
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
