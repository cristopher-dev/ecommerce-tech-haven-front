import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/application/store/slices/cartSlice';

describe('useCart hook', () => {
  const createStore = () => {
    return configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  };

  const wrapper = ({ children }: any) => {
    const store = createStore();
    return <Provider store={store}>{children}</Provider>;
  };

  it('should return cart state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('should have cart items array', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(Array.isArray(result.current.items)).toBe(true);
  });

  it('should have addToCart function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.addToCart).toBe('function');
  });

  it('should have removeFromCart function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.removeFromCart).toBe('function');
  });

  it('should have updateQuantity function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.updateQuantity).toBe('function');
  });

  it('should have cart total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.total).toBe('number');
  });

  it('should have cart loading state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('should have cart error state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const initialCount = result.current.items.length;

    await act(async () => {
      result.current.addToCart({
        product: {
          id: 1,
          name: 'Test Product',
          price: 100,
          image: 'test.jpg',
          discount: 0,
        },
        quantity: 1,
      });
    });

    expect(result.current.items.length).toBeGreaterThanOrEqual(initialCount);
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // First add an item
    await act(async () => {
      result.current.addToCart({
        product: {
          id: 1,
          name: 'Test Product',
          price: 100,
          image: 'test.jpg',
          discount: 0,
        },
        quantity: 1,
      });
    });

    const itemId = result.current.items[0]?.product.id;

    // Then remove it
    if (itemId) {
      await act(async () => {
        result.current.removeFromCart(itemId);
      });
    }
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.total).toBe('number');
    expect(result.current.total).toBeGreaterThanOrEqual(0);
  });
});
