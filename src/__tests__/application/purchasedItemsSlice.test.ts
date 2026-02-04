import purchasedItemsReducer, {
  addToPurchasedItems,
  removePurchasedItem,
  clearPurchasedItems,
  setLoading,
  setError,
  fetchUserTransactions,
} from '@/application/store/slices/purchasedItemsSlice';

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
});
