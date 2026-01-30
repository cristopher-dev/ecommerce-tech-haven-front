import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/domain/entities/CartItem";

interface PaymentData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
}

interface DeliveryData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;
}

interface CheckoutState {
  cartItems: CartItem[];
  paymentData: PaymentData | null;
  deliveryData: DeliveryData | null;
  baseFee: number;
  deliveryFee: number;
  loading: boolean;
  error: string | null;
  step: "product" | "payment" | "summary" | "status";
  lastTransactionId: string | null;
}

const initialState: CheckoutState = {
  cartItems: [],
  paymentData: null,
  deliveryData: null,
  baseFee: 5000, // Base fee in cents
  deliveryFee: 10000, // Delivery fee in cents
  loading: false,
  error: null,
  step: "product",
  lastTransactionId: null,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Cart management
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cartItems.find(
        (item) => item.product.id === action.payload.product.id,
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product.id !== action.payload,
      );
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const item = state.cartItems.find(
        (item) => item.product.id === action.payload.productId,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },

    // Payment data
    setPaymentData: (state, action: PayloadAction<PaymentData | null>) => {
      state.paymentData = action.payload;
    },

    // Delivery data
    setDeliveryData: (state, action: PayloadAction<DeliveryData | null>) => {
      state.deliveryData = action.payload;
    },

    // Checkout flow
    setStep: (state, action: PayloadAction<CheckoutState["step"]>) => {
      state.step = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Transaction tracking
    setLastTransactionId: (state, action: PayloadAction<string>) => {
      state.lastTransactionId = action.payload;
    },
    clearCheckout: (state) => {
      state.cartItems = [];
      state.paymentData = null;
      state.deliveryData = null;
      state.step = "product";
      state.lastTransactionId = null;
      state.error = null;
    },

    // Fees management
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setPaymentData,
  setDeliveryData,
  setStep,
  setLoading,
  setError,
  setLastTransactionId,
  clearCheckout,
  setDeliveryFee,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
