import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
        }
      } as any
    });

    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  const renderLoginPage = () => render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>
  );

  it('should render login page with form fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty email and password', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: '', name: 'email' } });
    fireEvent.change(passwordInput, { target: { value: '', name: 'password' } });
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    
    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errors = screen.getAllByText('This field is required');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('should show error for invalid email', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email', name: 'email' } });
    fireEvent.blur(emailInput);
    
    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
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
        }
      } as any,
    });
    
    renderLoginPage();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
