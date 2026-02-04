import purchasedItemsReducer, {
  addToPurchasedItems,
  removePurchasedItem,
  clearPurchasedItems,
  setLoading,
  setError,
  fetchUserTransactions,
} from '@/application/store/slices/purchasedItemsSlice';
import { productsApi, transactionsApi } from '@/infrastructure/api/techHavenApiClient';

jest.mock('@/infrastructure/api/techHavenApiClient', () => ({
  productsApi: {
    getAll: jest.fn(),
  },
  transactionsApi: {
    getAll: jest.fn(),
  },
}));

describe('purchasedItemsSlice', () => {
  const initialState = {
    items: [],
    totalPurchases: 0,
    loading: false,
    error: null,
  };

  test('should return initial state', () => {
    expect(purchasedItemsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle addToPurchasedItems', () => {
    const mockItems = [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Product 1',
          price: 100,
          description: '',
          image: '',
          category: '',
          rating: 0,
          reviews: 0,
        },
        quantity: 2,
      },
    ];
    const action = addToPurchasedItems({ items: mockItems, transactionId: 'tx1' });
    const state = purchasedItemsReducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.totalPurchases).toBe(2);
    expect(state.items[0].transactionId).toBe('tx1');
  });

  test('should handle removePurchasedItem', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        {
          id: '1',
          product: {
            id: 1,
            name: 'Product 1',
            price: 100,
            description: '',
            image: '',
            category: '',
            rating: 0,
            reviews: 0,
          },
          quantity: 2,
          purchaseDate: '2024-01-01',
          transactionId: 'tx1',
        },
      ],
      totalPurchases: 2,
    };

    const state = purchasedItemsReducer(stateWithItems as any, removePurchasedItem(1));

    expect(state.items).toHaveLength(0);
    expect(state.totalPurchases).toBe(0);
  });

  test('should handle clearPurchasedItems', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Product 1',
            price: 100,
            description: '',
            image: '',
            category: '',
            rating: 0,
            reviews: 0,
          },
          quantity: 2,
          purchaseDate: '2024-01-01',
          transactionId: 'tx1',
        },
      ],
      totalPurchases: 2,
    };

    const state = purchasedItemsReducer(stateWithItems as any, clearPurchasedItems());

    expect(state.items).toHaveLength(0);
    expect(state.totalPurchases).toBe(0);
  });

  test('should handle setLoading', () => {
    const state = purchasedItemsReducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);

    const state2 = purchasedItemsReducer(state, setLoading(false));
    expect(state2.loading).toBe(false);
  });

  test('should handle setError', () => {
    const state = purchasedItemsReducer(initialState, setError('Test error'));
    expect(state.error).toBe('Test error');

    const state2 = purchasedItemsReducer(state, setError(null));
    expect(state2.error).toBeNull();
  });

  test('should handle multiple additions', () => {
    let state = initialState;

    state = purchasedItemsReducer(
      state,
      addToPurchasedItems({
        items: [
          {
            id: '1',
            product: {
              id: '1',
              name: 'Product 1',
              price: 100,
              description: '',
              image: '',
              category: '',
              rating: 0,
              reviews: 0,
            },
            quantity: 1,
          },
        ],
        transactionId: 'tx1',
      })
    );

    state = purchasedItemsReducer(
      state,
      addToPurchasedItems({
        items: [
          {
            id: '2',
            product: {
              id: '2',
              name: 'Product 2',
              price: 200,
              description: '',
              image: '',
              category: '',
              rating: 0,
              reviews: 0,
            },
            quantity: 3,
          },
        ],
        transactionId: 'tx2',
      })
    );

    expect(state.items).toHaveLength(2);
    expect(state.totalPurchases).toBe(4);
  });

  test('should handle fetchUserTransactions pending', () => {
    const action = { type: fetchUserTransactions.pending.type };
    const state = purchasedItemsReducer(initialState, action as any);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchUserTransactions fulfilled', () => {
    const mockPayload = [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Product 1',
          price: 100,
          description: '',
          image: '',
          category: '',
          rating: 0,
          reviews: 0,
        },
        quantity: 2,
        purchaseDate: '2024-01-01',
        transactionId: 'tx1',
      },
    ];

    const action = {
      type: fetchUserTransactions.fulfilled.type,
      payload: mockPayload,
    };

    const state = purchasedItemsReducer(initialState, action as any);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.totalPurchases).toBe(2);
  });

  test('should handle fetchUserTransactions rejected', () => {
    const action = {
      type: fetchUserTransactions.rejected.type,
      payload: 'Error message',
    };

    const state = purchasedItemsReducer(initialState, action as any);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error message');
  });

  test('should not remove item if not found', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        {
          id: '1',
          product: {
            id: 1,
            name: 'Product 1',
            price: 100,
            description: '',
            image: '',
            category: '',
            rating: 0,
            reviews: 0,
          },
          quantity: 2,
          purchaseDate: '2024-01-01',
          transactionId: 'tx1',
        },
      ],
      totalPurchases: 2,
    };

    const state = purchasedItemsReducer(stateWithItems as any, removePurchasedItem(999));

    expect(state.items).toHaveLength(1);
    expect(state.totalPurchases).toBe(2);
  });

  describe('fetchUserTransactions thunk', () => {
    it('should fetch transactions and products and filter for user', async () => {
      const mockTransactions = [
        {
          id: 'tx1',
          customerId: 'user1',
          items: [{ productId: 'p1', quantity: 1 }],
          subtotal: 100,
          createdAt: '2024-01-01',
        },
      ];
      const mockProducts = [
        {
          id: 'p1',
          name: 'Product 1',
          price: 100,
          imageUrl: 'img1',
          stock: 10,
          description: 'desc1',
        },
      ];

      (transactionsApi.getAll as jest.Mock).mockResolvedValue(mockTransactions);
      (productsApi.getAll as jest.Mock).mockResolvedValue(mockProducts);

      const dispatch = jest.fn();
      const thunk = fetchUserTransactions('user1');
      await thunk(dispatch, () => ({}), undefined);

      const fulfilledAction = dispatch.mock.calls.find(
        (call) => call[0].type === fetchUserTransactions.fulfilled.type
      );
      expect(fulfilledAction[0].payload).toHaveLength(1);
      expect(fulfilledAction[0].payload[0].product.id).toBe('p1');
    });

    it('should use fallback if no transactions found for user', async () => {
      const mockTransactions = [
        {
          id: 'tx1',
          customerId: 'other',
          items: [{ productId: 'p1', quantity: 1 }],
          subtotal: 100,
          createdAt: '2024-01-01',
        },
      ];
      const mockProducts = [];

      (transactionsApi.getAll as jest.Mock).mockResolvedValue(mockTransactions);
      (productsApi.getAll as jest.Mock).mockResolvedValue(mockProducts);

      const dispatch = jest.fn();
      const thunk = fetchUserTransactions('user1');
      await thunk(dispatch, () => ({}), undefined);

      const fulfilledAction = dispatch.mock.calls.find(
        (call) => call[0].type === fetchUserTransactions.fulfilled.type
      );
      expect(fulfilledAction[0].payload).toHaveLength(1); // Fallback uses slice(0, 10)
    });

    it('should handle product not found for transaction item', async () => {
      const mockTransactions = [
        {
          id: 'tx1',
          customerId: 'user1',
          items: [{ productId: 'missing', quantity: 1 }],
          subtotal: 100,
          createdAt: '2024-01-01',
        },
      ];
      const mockProducts = [];

      (transactionsApi.getAll as jest.Mock).mockResolvedValue(mockTransactions);
      (productsApi.getAll as jest.Mock).mockResolvedValue(mockProducts);

      const dispatch = jest.fn();
      const thunk = fetchUserTransactions('user1');
      await thunk(dispatch, () => ({}), undefined);

      const fulfilledAction = dispatch.mock.calls.find(
        (call) => call[0].type === fetchUserTransactions.fulfilled.type
      );
      expect(fulfilledAction[0].payload[0].product.name).toBe('Product missing');
    });

    it('should handle errors in thunk', async () => {
      (transactionsApi.getAll as jest.Mock).mockRejectedValue(new Error('API Error'));

      const dispatch = jest.fn();
      const thunk = fetchUserTransactions('user1');
      await thunk(dispatch, () => ({}), undefined);

      const rejectedAction = dispatch.mock.calls.find(
        (call) => call[0].type === fetchUserTransactions.rejected.type
      );
      expect(rejectedAction[0].payload).toBe('API Error');
    });

    it('should handle non-Error catch', async () => {
      (transactionsApi.getAll as jest.Mock).mockRejectedValue('String Error');

      const dispatch = jest.fn();
      const thunk = fetchUserTransactions('user1');
      await thunk(dispatch, () => ({}), undefined);

      const rejectedAction = dispatch.mock.calls.find(
        (call) => call[0].type === fetchUserTransactions.rejected.type
      );
      expect(rejectedAction[0].payload).toBe('Failed to fetch transactions');
    });
  });
});
