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
import purchasedItemsSlice from '@/application/store/slices/purchasedItemsSlice';
import transactionsSlice from '@/application/store/slices/transactionsSlice';
import wishlistSlice from '@/application/store/slices/wishlistSlice';
import LoginPage from '@/presentation/pages/LoginPage';

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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  let store: ReturnType<typeof configureStore>;

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

    mockNavigate.mockClear();
  });

  it('should render login page with form fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should have prefilled demo credentials', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    expect((emailInput as HTMLInputElement).value).toBe('admin@techhaven.com');
    expect((passwordInput as HTMLInputElement).value).toBe('admin123');
  });

  it('should display form with email and password fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/authPage.login.title/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display welcome message', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/common.welcome/)).toBeInTheDocument();
  });
});
