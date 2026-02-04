import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CheckoutSummaryPage from '../../../presentation/pages/CheckoutSummaryPage';
import cartReducer from '../../../application/store/slices/cartSlice';
import checkoutReducer from '../../../application/store/slices/checkoutSlice';
import productsReducer from '../../../application/store/slices/productsSlice';
import purchasedItemsReducer from '../../../application/store/slices/purchasedItemsSlice';
import { transactionsApi } from '../../../infrastructure/api/techHavenApiClient';
import i18n from '../../../i18n/config';

// Mock Header and Footer
jest.mock('../../../presentation/components/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock('../../../presentation/components/Footer', () => () => (
  <div data-testid="mock-footer">Footer</div>
));

// Mock transitionsApi
jest.mock('../../../infrastructure/api/techHavenApiClient', () => ({
  transactionsApi: {
    create: jest.fn(),
    processPayment: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CheckoutSummaryPage', () => {
  let store: any;

  const preloadedState = {
    cart: {
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Product 1',
            price: 100,
            stock: 10,
            description: 'Desc 1',
            category: 'Cat 1',
            rating: { rate: 4.5, count: 10 },
            image: 'img1.jpg',
            brand: 'Brand 1',
          },
          quantity: 2,
        },
      ],
    },
    checkout: {
      step: 'summary',
      deliveryData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'City',
        state: 'State',
        postalCode: '12345',
      },
      paymentData: {
        cardNumber: '1234 5678 1234 5678',
        cardholderName: 'John Doe',
        expirationMonth: 12,
        expirationYear: 2025,
        cvv: '123',
      },
      baseFee: 1000, // $10.00
      deliveryFee: 500, // $5.00
      loading: false,
      error: null,
    },
    products: {
      items: [{ id: '1', name: 'Product 1', price: 100, stock: 10 }],
    },
    purchasedItems: {
      items: [],
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage('en');
    store = configureStore({
      reducer: {
        cart: cartReducer,
        checkout: checkoutReducer,
        products: productsReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState,
    });
  });

  const renderPage = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <CheckoutSummaryPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders order summary details correctly', () => {
    renderPage();

    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Product 1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();

    expect(screen.getAllByText(/\$200.00/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\$10.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5.00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$215.00/i).length).toBeGreaterThan(0);
  });

  it('shows empty cart message if no items', () => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        checkout: checkoutReducer,
        products: productsReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState: {
        ...preloadedState,
        cart: { items: [] },
        checkout: { ...preloadedState.checkout, cartItems: [] },
      },
    });

    renderPage();

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it('handles successful order placement', async () => {
    (transactionsApi.create as jest.Mock).mockResolvedValue({
      id: 'trans-123',
      status: 'success',
    });
    (transactionsApi.processPayment as jest.Mock).mockResolvedValue({
      transactionId: 'payment-123',
      status: 'completed',
    });

    renderPage();

    const placeOrderBtn = screen.getByText(/Place Order/i);
    fireEvent.click(placeOrderBtn);

    await waitFor(() => {
      expect(transactionsApi.create).toHaveBeenCalled();
      expect(transactionsApi.processPayment).toHaveBeenCalledWith('trans-123', expect.any(Object));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/checkout/final');
    });

    // Check if cart is cleared in store
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('shows error if transaction creation fails', async () => {
    (transactionsApi.create as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderPage();

    const placeOrderBtn = screen.getByText(/Place Order/i);
    fireEvent.click(placeOrderBtn);

    expect(await screen.findByText(/API Error/i)).toBeInTheDocument();
  });

  it('shows error if payment processing fails', async () => {
    (transactionsApi.create as jest.Mock).mockResolvedValue({
      id: 'trans-123',
      status: 'success',
    });
    (transactionsApi.processPayment as jest.Mock).mockRejectedValue(new Error('Payment Failed'));

    renderPage();

    const placeOrderBtn = screen.getByText(/Place Order/i);
    fireEvent.click(placeOrderBtn);

    expect(await screen.findByText(/Payment Failed/i)).toBeInTheDocument();
  });

  it('shows error if delivery data is missing', async () => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        checkout: checkoutReducer,
        products: productsReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState: {
        ...preloadedState,
        checkout: {
          ...preloadedState.checkout,
          deliveryData: null as any,
        },
      },
    });

    renderPage();

    const placeOrderBtn = screen.getByText(/Place Order/i);
    fireEvent.click(placeOrderBtn);

    expect(await screen.findByText(/Missing payment or delivery information/i)).toBeInTheDocument();
  });

  it('validates customer email format before sending', async () => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        checkout: checkoutReducer,
        products: productsReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState: {
        ...preloadedState,
        checkout: {
          ...preloadedState.checkout,
          deliveryData: {
            ...preloadedState.checkout.deliveryData,
            email: 'invalid-email',
          },
        },
      },
    });

    renderPage();

    const placeOrderBtn = screen.getByText(/Place Order/i);
    fireEvent.click(placeOrderBtn);

    expect(await screen.findByText(/customerEmail must be an email/i)).toBeInTheDocument();
  });
});
