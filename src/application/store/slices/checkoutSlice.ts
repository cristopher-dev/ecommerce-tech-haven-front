import type { CartItem } from "@/domain/entities/CartItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  transactionItems: CartItem[];
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
  transactionItems: [],
};

const ensureCartItemId = (item: CartItem): CartItem => {
  if (!item.id) {
    return {
      ...item,
      id: `${item.product.id}-${Date.now()}-${Math.random()}`,
    };
  }
  return item;
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemWithId = ensureCartItemId(action.payload);
      const existingItem = state.cartItems.find(
        (item) => item.product.id === itemWithId.product.id,
      );
      if (existingItem) {
        existingItem.quantity += itemWithId.quantity;
      } else {
        state.cartItems.push(itemWithId);
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

    setPaymentData: (state, action: PayloadAction<PaymentData | null>) => {
      state.paymentData = action.payload;
    },
    clearPaymentData: (state) => {
      state.paymentData = null;
    },
    clearPaymentSensitiveData: (state) => {
      if (state.paymentData) {
        state.paymentData.cvv = "";
      }
    },

    setDeliveryData: (state, action: PayloadAction<DeliveryData | null>) => {
      state.deliveryData = action.payload;
    },

    setStep: (state, action: PayloadAction<CheckoutState["step"]>) => {
      state.step = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setLastTransactionId: (state, action: PayloadAction<string>) => {
      state.lastTransactionId = action.payload;
    },
    setTransactionItems: (state, action: PayloadAction<CartItem[]>) => {
      state.transactionItems = action.payload;
    },
    clearCheckout: (state) => {
      state.cartItems = [];
      state.paymentData = null;
      state.deliveryData = null;
      state.step = "product";
      state.lastTransactionId = null;
      state.transactionItems = [];
      state.error = null;
    },

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
  clearPaymentData,
  clearPaymentSensitiveData,
  setDeliveryData,
  setStep,
  setLoading,
  setError,
  setLastTransactionId,
  setTransactionItems,
  clearCheckout,
  setDeliveryFee,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
