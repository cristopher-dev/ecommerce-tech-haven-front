import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ user: { id: 1, email: 'test@test.com' }, token: 'abc' }),
  })
) as jest.Mock;

describe('LoginPage', () => {
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
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        },
      } as any,
    });

    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockClear();
    i18n.changeLanguage('en');
  });

  const renderLoginPage = () =>
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );

  it('should render login page with form fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty email and password', async () => {
    i18n.changeLanguage('en');
    renderLoginPage();
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Login/i });
    await user.click(submitButton);

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });

  it('should show error for invalid email', async () => {
    i18n.changeLanguage('en');
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/Email/i);

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Login/i });
    await user.click(submitButton);

    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
  });

  it('should call navigate on successful login', async () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /Login/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('should display error from store if present', () => {
    store = configureStore({
      reducer: { auth: authSlice },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: 'Invalid credentials',
          isAuthenticated: false,
        },
      } as any,
    });

    renderLoginPage();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
