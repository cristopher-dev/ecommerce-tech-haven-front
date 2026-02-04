import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from '@/presentation/components/ProtectedRoute';
import authSlice from '@/application/store/slices/authSlice';
import cartSlice from '@/application/store/slices/cartSlice';
import checkoutSlice from '@/application/store/slices/checkoutSlice';
import deliveriesSlice from '@/application/store/slices/deliveriesSlice';
import productsSlice from '@/application/store/slices/productsSlice';
import purchasedItemsSlice from '@/application/store/slices/purchasedItemsSlice';
import transactionsSlice from '@/application/store/slices/transactionsSlice';
import wishlistSlice from '@/application/store/slices/wishlistSlice';
import { UserProfile } from '@/domain/entities/User';

describe('ProtectedRoute', () => {
  const mockUser: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
    role: 'user',
    isActive: true,
  };

  const createStore = (authenticated = false) => {
    return configureStore({
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
      preloadedState: authenticated
        ? {
            auth: {
              user: mockUser,
              token: 'test-token',
              isLoading: false,
              error: null,
              isAuthenticated: true,
            },
            cart: { items: [], loading: false, error: null },
            checkout: {
              cartItems: [],
              paymentData: null,
              deliveryData: null,
              baseFee: 5000,
              deliveryFee: 10000,
              loading: false,
              error: null,
              step: 'product',
              lastTransactionId: null,
              transactionItems: [],
              token: null,
            },
            deliveries: { items: [], loading: false, error: null },
            products: { items: [], loading: false, error: null },
            purchasedItems: { items: [], totalPurchases: 0, loading: false, error: null },
            transactions: { items: [], loading: false, error: null },
            wishlist: { items: [], loading: false, error: null },
          }
        : {
            auth: {
              user: null,
              token: null,
              isLoading: false,
              error: null,
              isAuthenticated: false,
            },
            cart: { items: [], loading: false, error: null },
            checkout: {
              cartItems: [],
              paymentData: null,
              deliveryData: null,
              baseFee: 5000,
              deliveryFee: 10000,
              loading: false,
              error: null,
              step: 'product',
              lastTransactionId: null,
              transactionItems: [],
              token: null,
            },
            deliveries: { items: [], loading: false, error: null },
            products: { items: [], loading: false, error: null },
            purchasedItems: { items: [], totalPurchases: 0, loading: false, error: null },
            transactions: { items: [], loading: false, error: null },
            wishlist: { items: [], loading: false, error: null },
          },
    });
  };

  it('renders children when authenticated', () => {
    const store = createStore(true);
    const { container } = render(
      <Provider store={store}>
        <Router>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </Router>
      </Provider>
    );

    expect(container.textContent).toContain('Protected Content');
  });

  it('navigates when not authenticated', () => {
    const store = createStore(false);
    const { container } = render(
      <Provider store={store}>
        <Router>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </Router>
      </Provider>
    );
    // Component should not render protected content when not authenticated
    expect(container.textContent).not.toContain('Protected Content');
  });
});
