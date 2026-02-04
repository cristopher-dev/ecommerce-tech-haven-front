import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  useAppDispatch,
  useAppSelector,
  useProductsState,
  useTransactionsState,
  useDeliveriesState,
  useCheckoutState,
  useWishlistState,
  useCart,
  useWishlist,
} from '@/application/store/hooks';
import authSlice from '@/application/store/slices/authSlice';
import cartSlice from '@/application/store/slices/cartSlice';
import checkoutSlice from '@/application/store/slices/checkoutSlice';
import deliveriesSlice from '@/application/store/slices/deliveriesSlice';
import productsSlice from '@/application/store/slices/productsSlice';
import purchasedItemsSlice from '@/application/store/slices/purchasedItemsSlice';
import transactionsSlice from '@/application/store/slices/transactionsSlice';
import wishlistSlice from '@/application/store/slices/wishlistSlice';
import React from 'react';

describe('Redux Hooks', () => {
  const mockStore = configureStore({
    reducer: {
      auth: authSlice,
      cart: cartSlice,
      checkout: checkoutSlice,
      deliveries: deliveriesSlice,
      products: productsSlice,
      purchasedItems: purchasedItemsSlice,
      transactions: transactionsSlice,
      wishlist: wishlistSlice,
    },
  });

  const wrapper = ({ children }: any) =>
    React.createElement(Provider, { store: mockStore }, children);

  it('useAppDispatch should return dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('useAppSelector should return selector hook', () => {
    const { result } = renderHook(() => useAppSelector((state) => state.auth), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('useProductsState should return products state', () => {
    const { result } = renderHook(() => useProductsState(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.items).toBeDefined();
  });

  it('useTransactionsState should return transactions state', () => {
    const { result } = renderHook(() => useTransactionsState(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('useDeliveriesState should return deliveries state', () => {
    const { result } = renderHook(() => useDeliveriesState(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.items).toBeDefined();
  });

  it('useCheckoutState should return checkout state', () => {
    const { result } = renderHook(() => useCheckoutState(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.cartItems).toBeDefined();
  });

  it('useWishlistState should return wishlist state', () => {
    const { result } = renderHook(() => useWishlistState(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.items).toBeDefined();
  });

  it('useCart should return cart items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('useWishlist should return wishlist items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    expect(result.current).toBeDefined();
  });
});
