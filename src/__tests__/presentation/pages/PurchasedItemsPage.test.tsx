import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import authSlice from '@/application/store/slices/authSlice';
import cartSlice from '@/application/store/slices/cartSlice';
import checkoutSlice from '@/application/store/slices/checkoutSlice';
import deliveriesSlice from '@/application/store/slices/deliveriesSlice';
import productsSlice from '@/application/store/slices/productsSlice';
import purchasedItemsSlice, {
  fetchUserTransactions,
} from '@/application/store/slices/purchasedItemsSlice';
import transactionsSlice from '@/application/store/slices/transactionsSlice';
import wishlistSlice from '@/application/store/slices/wishlistSlice';
import PurchasedItemsPage from '@/presentation/pages/PurchasedItemsPage';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock fetchUserTransactions
jest.mock('@/application/store/slices/purchasedItemsSlice', () => {
  const actual = jest.requireActual('@/application/store/slices/purchasedItemsSlice');
  return {
    ...actual,
    __esModule: true,
    default: actual.default,
    fetchUserTransactions: jest.fn(() => ({
      type: 'purchasedItems/fetchUserTransactions/pending',
    })),
  };
});

describe('PurchasedItemsPage', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
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
    jest.clearAllMocks();
  });

  const renderComponent = (customStore = store) => {
    return render(
      <Provider store={customStore}>
        <BrowserRouter>
          <PurchasedItemsPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render purchased items page title', () => {
    renderComponent();
    expect(screen.getByText('purchasedItemsPage.title')).toBeInTheDocument();
  });

  it('should show loading message when loading is true', () => {
    const loadingStore = configureStore({
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
      preloadedState: {
        purchasedItems: {
          items: [],
          loading: true,
          error: null,
        },
      } as any,
    });

    renderComponent(loadingStore);
    expect(screen.getByText('purchasedItemsPage.loadingMessage')).toBeInTheDocument();
  });

  it('should show error message when error exists', () => {
    const errorMessage = 'Failed to fetch items';
    const errorStore = configureStore({
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
      preloadedState: {
        purchasedItems: {
          items: [],
          loading: false,
          error: errorMessage,
        },
      } as any,
    });

    renderComponent(errorStore);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render transactions list when items exist', () => {
    const mockItems = [
      {
        id: '1',
        product: { id: 'p1', name: 'Product 1', price: 100, image: 'img.jpg' },
        quantity: 2,
        purchaseDate: new Date().toISOString(),
        transactionId: 'TXN-1',
        status: 'APPROVED',
      },
      {
        id: '2',
        product: { id: 'p2', name: 'Product 2', price: 50 },
        quantity: 1,
        purchaseDate: new Date().toISOString(),
        transactionId: 'TXN-2',
        status: 'DECLINED',
      },
      {
        id: '3',
        product: { id: 'p3', name: 'Product 3', price: 20 },
        quantity: 1,
        purchaseDate: new Date().toISOString(),
        transactionId: 'TXN-3',
        status: 'PENDING',
      },
    ];

    const dataStore = configureStore({
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
      preloadedState: {
        purchasedItems: {
          items: mockItems,
          loading: false,
          error: null,
        },
      } as any,
    });

    renderComponent(dataStore);
    expect(screen.getAllByText(/Product 1/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/TXN-1/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/DECLINED/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/PENDING/)[0]).toBeInTheDocument();
  });

  it('should dispatch fetchUserTransactions on mount if user is logged in', () => {
    const userId = 'user-123';
    const authedStore = configureStore({
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
      preloadedState: {
        auth: {
          user: { id: userId, email: 'test@test.com', name: 'Test User', role: 'USER' },
          isAuthenticated: true,
          token: 'token',
          loading: false,
          error: null,
        },
      } as any,
    });

    renderComponent(authedStore);
    expect(fetchUserTransactions).toHaveBeenCalledWith(userId);
  });
});
