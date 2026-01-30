import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "@/domain/entities/Cart";
import { CartItem } from "@/domain/entities/CartItem";
import { Product } from "@/domain/entities/Product";
import { LocalStorageCartRepository } from "@/infrastructure/adapters/LocalStorageCartRepository";

const cartRepository = new LocalStorageCartRepository();

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: cartRepository.getCart().items,
  total: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

// Generate a unique ID for a cart item
const generateCartItemId = (
  productId: string | number,
  timestamp: number,
): string => {
  // Ensure productId is valid before generating ID
  const validId = String(productId).trim();
  if (
    !validId ||
    validId === "undefined" ||
    validId === "null" ||
    validId === "NaN"
  ) {
    throw new Error(
      `Invalid productId for cart item ID generation: ${productId}`,
    );
  }
  return `${validId}-${timestamp}`;
};

// Calculate total price from items
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
};

// Calculate total items quantity
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: initialState.items,
    total: calculateTotal(initialState.items),
    totalItems: calculateTotalItems(initialState.items),
    loading: false,
    error: null,
  },
  reducers: {
    // Add product to cart
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const { product, quantity: qty = 1 } = action.payload;

      // Validate product has valid ID - defensive checks
      let productId = product?.id;

      // Convert to string and validate
      const productIdStr = String(productId || "").trim();

      if (
        !productIdStr ||
        productIdStr === "undefined" ||
        productIdStr === "null" ||
        productIdStr === "NaN" ||
        productIdStr === ""
      ) {
        console.error("Invalid product for cart:", {
          product,
          received_id: productId,
          productIdStr,
        });
        throw new Error(
          `Cannot add product to cart: invalid or missing product ID`,
        );
      }

      // Ensure product object has a valid id
      const normalizedProduct: Product = {
        ...product,
        id: productIdStr, // Always use string representation
      };

      const existingItem = state.items.find(
        (item) => item.product.id === normalizedProduct.id,
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        // Generate unique ID for new cart item
        const uniqueId = generateCartItemId(
          normalizedProduct.id,
          Date.now() + Math.random(),
        );
        state.items.push({
          id: uniqueId,
          product: normalizedProduct,
          quantity: qty,
        });
      }

      // Update cart in localStorage
      const cart: Cart = { items: state.items };
      cartRepository.saveCart(cart);

      // Recalculate totals
      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );

      // Update cart in localStorage
      const cart: Cart = { items: state.items };
      cartRepository.saveCart(cart);

      // Recalculate totals
      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string | number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== productId,
          );
        } else {
          item.quantity = quantity;
        }

        // Update cart in localStorage
        const cart: Cart = { items: state.items };
        cartRepository.saveCart(cart);

        // Recalculate totals
        state.total = calculateTotal(state.items);
        state.totalItems = calculateTotalItems(state.items);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;

      // Update cart in localStorage
      const cart: Cart = { items: [] };
      cartRepository.saveCart(cart);
    },

    // Set cart from external source (e.g., when loading from localStorage)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.map((item) => ({
        ...item,
        id:
          item.id ||
          generateCartItemId(item.product.id, Date.now() + Math.random()),
      }));
      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
