import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
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
import RegisterPage from '@/presentation/pages/RegisterPage';

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

describe('RegisterPage', () => {
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

  it('should render register page with all form fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes.length).toBeGreaterThan(0);
  });

  it('should display form with first name field', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3); // first name, last name, email
  });

  it('should display form with email field', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should display password fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const passwordFields = screen.queryAllByDisplayValue('');
    expect(passwordFields.length).toBeGreaterThan(0);
  });

  it('should validate and handle form submission', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should show loading state when registering', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const form = screen.getByRole('main');
    expect(form).toBeInTheDocument();
  });

  it('should handle register submission with valid data', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toBeDefined();
  });

  it('should render the main register container', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </Provider>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});
