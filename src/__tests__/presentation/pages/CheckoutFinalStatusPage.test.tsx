import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CheckoutFinalStatusPage from '../../../presentation/pages/CheckoutFinalStatusPage';
import checkoutReducer from '../../../application/store/slices/checkoutSlice';
import purchasedItemsReducer from '../../../application/store/slices/purchasedItemsSlice';
import i18n from '../../../i18n/config';

// Mock Header and Footer
jest.mock('../../../presentation/components/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock('../../../presentation/components/Footer', () => () => (
  <div data-testid="mock-footer">Footer</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CheckoutFinalStatusPage', () => {
  let store: any;

  const preloadedState = {
    checkout: {
      lastTransactionId: 'TEST-12345',
      transactionItems: [
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
      baseFee: 1000,
      deliveryFee: 500,
    },
    purchasedItems: {
      items: [],
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    await i18n.changeLanguage('en');
    store = configureStore({
      reducer: {
        checkout: checkoutReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderPage = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <CheckoutFinalStatusPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders confirmation details correctly', () => {
    renderPage();

    expect(screen.getByText(/Order Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST-12345/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Product 1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$215.00/i).length).toBeGreaterThan(0);
  });

  it('navigates to home when clicking Return Home', () => {
    renderPage();

    const returnBtn = screen.getByText(/Continue Shopping/i);
    fireEvent.click(returnBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects to home if no transaction data after timer', async () => {
    store = configureStore({
      reducer: {
        checkout: checkoutReducer,
        purchasedItems: purchasedItemsReducer,
      },
      preloadedState: {
        checkout: {
          lastTransactionId: null as any,
          transactionItems: [],
          baseFee: 0,
          deliveryFee: 0,
        },
        purchasedItems: { items: [] },
      },
    });

    renderPage();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
