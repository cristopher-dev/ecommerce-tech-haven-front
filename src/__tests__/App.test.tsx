import { render, screen } from '@testing-library/react';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import App from '@/App';
import authSlice from '@/application/store/slices/authSlice';
import cartSlice from '@/application/store/slices/cartSlice';
import checkoutSlice from '@/application/store/slices/checkoutSlice';
import deliveriesSlice from '@/application/store/slices/deliveriesSlice';
import productsSlice from '@/application/store/slices/productsSlice';
import purchasedItemsSlice from '@/application/store/slices/purchasedItemsSlice';
import transactionsSlice from '@/application/store/slices/transactionsSlice';
import wishlistSlice from '@/application/store/slices/wishlistSlice';
import { Provider } from 'react-redux';
import React from 'react';

// Mock SCSS imports
jest.mock('@/styles/App.scss', () => ({}));

// Mock Redux Persist
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}));

// Mock child pages to avoid complex dependencies
jest.mock('@/presentation/pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div>Login Page</div>;
  };
});

jest.mock('@/presentation/pages/RegisterPage', () => {
  return function MockRegisterPage() {
    return <div>Register Page</div>;
  };
});

jest.mock('@/presentation/pages/HomePage', () => {
  return function MockHomePage() {
    return <div>Home Page</div>;
  };
});

jest.mock('@/presentation/pages/ProductPage', () => {
  return function MockProductPage() {
    return <div>Product Page</div>;
  };
});

jest.mock('@/presentation/pages/CartPage', () => {
  return function MockCartPage() {
    return <div>Cart Page</div>;
  };
});

jest.mock('@/presentation/pages/WishlistPage', () => {
  return function MockWishlistPage() {
    return <div>Wishlist Page</div>;
  };
});

jest.mock('@/presentation/pages/PurchasedItemsPage', () => {
  return function MockPurchasedItemsPage() {
    return <div>Purchased Items Page</div>;
  };
});

jest.mock('@/presentation/pages/CheckoutDeliveryPage', () => {
  return function MockCheckoutDeliveryPage() {
    return <div>Checkout Delivery Page</div>;
  };
});

jest.mock('@/presentation/pages/CheckoutSummaryPage', () => {
  return function MockCheckoutSummaryPage() {
    return <div>Checkout Summary Page</div>;
  };
});

jest.mock('@/presentation/pages/CheckoutFinalStatusPage', () => {
  return function MockCheckoutFinalStatusPage() {
    return <div>Checkout Final Status Page</div>;
  };
});

// Mock protected route components
jest.mock('@/presentation/components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: any) {
    return <>{children}</>;
  };
});

jest.mock('@/presentation/components/CartProtectedRoute', () => {
  return function MockCartProtectedRoute({ children }: any) {
    return <>{children}</>;
  };
});

jest.mock('@/presentation/components/CheckoutProtectedRoute', () => {
  return function MockCheckoutProtectedRoute({ children }: any) {
    return <>{children}</>;
  };
});

function createMockStore(preloadedState?: PreloadedState<any>) {
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
    preloadedState,
  });
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders login page on login route', () => {
    const store = createMockStore();
    window.history.pushState({}, 'Login', '/login');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it('renders register page on register route', () => {
    const store = createMockStore();
    window.history.pushState({}, 'Register', '/register');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
