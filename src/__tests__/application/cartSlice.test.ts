jest.mock('@/infrastructure/adapters/LocalStorageCartRepository', () => ({
  LocalStorageCartRepository: jest.fn().mockImplementation(() => ({
    getCart: jest.fn().mockReturnValue({ items: [] }),
    saveCart: jest.fn(),
  })),
}));

import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  setCart,
  setError,
  setLoading,
  updateQuantity,
} from '@/application/store/slices/cartSlice';
import { Product } from '@/domain/entities/Product';

describe('cartSlice', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    image: 'test.jpg',
    discount: 0,
  };

  it('should return the initial state', () => {
    const state = cartReducer(undefined, { type: 'unknown' });
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalItems).toBe(0);
  });

  it('should add product to cart', () => {
    const action = addToCart({ product: mockProduct, quantity: 2 });
    const result = cartReducer(
      {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
      action
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product.id).toEqual('1');
    expect(result.items[0].quantity).toBe(2);
    expect(result.total).toBe(21.98);
    expect(result.totalItems).toBe(1);
  });

  it('should increase quantity if product already in cart', () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 1, id: 'test-id' }],
      total: 10.99,
      totalItems: 1,
      loading: false,
      error: null,
    };

    const action = addToCart({ product: mockProduct, quantity: 3 });
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(4);
    expect(result.total).toBe(43.96);
  });

  it('should remove product from cart', () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2, id: 'test-id' }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = removeFromCart('1');
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should clear cart', () => {
    const initialState = {
      items: [{ product: mockProduct, quantity: 2, id: 'test-id' }],
      total: 21.98,
      totalItems: 2,
      loading: false,
      error: null,
    };

    const action = clearCart();
    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it('should set loading', () => {
    const state = cartReducer(
      { items: [], total: 0, totalItems: 0, loading: false, error: null },
      setLoading(true)
    );
    expect(state.loading).toBe(true);
  });

  it('should set error', () => {
    const state = cartReducer(
      { items: [], total: 0, totalItems: 0, loading: false, error: null },
      setError('Test error')
    );
    expect(state.error).toBe('Test error');
  });
});
