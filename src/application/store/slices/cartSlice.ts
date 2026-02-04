import { Cart } from '@/domain/entities/Cart';
import { CartItem } from '@/domain/entities/CartItem';
import { Product } from '@/domain/entities/Product';
import { LocalStorageCartRepository } from '@/infrastructure/adapters/LocalStorageCartRepository';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const generateCartItemId = (productId: string | number, timestamp: number): string => {
  const validId = String(productId).trim();
  if (!validId || validId === 'undefined' || validId === 'null' || validId === 'NaN') {
    throw new Error(`Invalid productId for cart item ID generation: ${productId}`);
  }
  return `${validId}-${timestamp}`;
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const calculateTotalItems = (items: CartItem[]): number => {
  return items.length;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialState.items,
    total: calculateTotal(initialState.items),
    totalItems: calculateTotalItems(initialState.items),
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity: qty = 1 } = action.payload;

      let productId = product?.id;

      const productIdStr = String(productId || '').trim();

      if (
        !productIdStr ||
        productIdStr === 'undefined' ||
        productIdStr === 'null' ||
        productIdStr === 'NaN' ||
        productIdStr === ''
      ) {
        console.error('Invalid product for cart:', {
          product,
          received_id: productId,
          productIdStr,
        });
        throw new Error(`Cannot add product to cart: invalid or missing product ID`);
      }

      const normalizedProduct: Product = {
        ...product,
        id: productIdStr, // Always use string representation
      };

      const existingItem = state.items.find((item) => item.product.id === normalizedProduct.id);

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        const uniqueId = generateCartItemId(normalizedProduct.id, Date.now() + Math.random());
        state.items.push({
          id: uniqueId,
          product: normalizedProduct,
          quantity: qty,
        });
      }

      const cart: Cart = { items: state.items };
      cartRepository.saveCart(cart);

      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string | number>) => {
      const productIdStr = String(action.payload).trim();
      state.items = state.items.filter((item) => String(item.product.id).trim() !== productIdStr);

      const cart: Cart = { items: state.items };
      cartRepository.saveCart(cart);

      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string | number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const productIdStr = String(productId).trim();
      const item = state.items.find((item) => String(item.product.id).trim() === productIdStr);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) => String(item.product.id).trim() !== productIdStr
          );
        } else {
          item.quantity = quantity;
        }

        const cart: Cart = { items: state.items };
        cartRepository.saveCart(cart);

        state.total = calculateTotal(state.items);
        state.totalItems = calculateTotalItems(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;

      const cart: Cart = { items: [] };
      cartRepository.saveCart(cart);
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.map((item) => ({
        ...item,
        id: item.id || generateCartItemId(item.product.id, Date.now() + Math.random()),
      }));
      state.total = calculateTotal(state.items);
      state.totalItems = calculateTotalItems(state.items);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

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
