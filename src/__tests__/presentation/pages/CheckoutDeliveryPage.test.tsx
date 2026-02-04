import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '@/application/store/slices/checkoutSlice';
import cartReducer from '@/application/store/slices/cartSlice';
import authReducer from '@/application/store/slices/authSlice';
import CheckoutDeliveryPage from '@/presentation/pages/CheckoutDeliveryPage';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { transactionsApi } from '@/infrastructure/api/techHavenApiClient';

// Mock Header and Footer
jest.mock('@/presentation/components/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock('@/presentation/components/Footer', () => () => (
  <div data-testid="mock-footer">Footer</div>
));

// Mock PaymentModal
jest.mock('@/presentation/components/PaymentModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSubmit, loading }: any) =>
    isOpen ? (
      <div data-testid="mock-payment-modal">
        <button onClick={onClose}>Close</button>
        <button
          onClick={() =>
            onSubmit({
              cardNumber: '1234567812345678',
              cardholderName: 'John Doe',
              expirationMonth: 12,
              expirationYear: 2025,
              cvv: '123',
            })
          }
        >
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    ) : null,
}));

// Mock transactionsApi
jest.mock('@/infrastructure/api/techHavenApiClient', () => ({
  transactionsApi: {
    tokenizeCard: jest.fn(),
  },
}));

const mockedTransactionsApi = transactionsApi as jest.Mocked<typeof transactionsApi>;

describe('CheckoutDeliveryPage', () => {
  let store: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage('en');
    store = configureStore({
      reducer: {
        checkout: checkoutReducer,
        cart: cartReducer,
        auth: authReducer,
      },
      preloadedState: {
        cart: {
          items: [{ product: { id: '1', name: 'P1', price: 100 }, quantity: 1 }],
          total: 100,
          totalItems: 1,
        },
        checkout: {
          step: 'delivery',
          deliveryData: null,
          paymentData: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });
  });

  const renderPage = () => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <CheckoutDeliveryPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders the form fields', () => {
    renderPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderPage();

    // Use the button type or text to click
    const submitButton = screen.getByRole('button', { name: /continue to payment/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows invalid email error', async () => {
    renderPage();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /continue to payment/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email is invalid/i)).toBeInTheDocument();
  });

  it('fills the form and opens payment modal', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });

    const continueButton = screen.getByText(/continue to payment/i);
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-payment-modal')).toBeInTheDocument();
    });
  });

  it('handles payment submission success', async () => {
    mockedTransactionsApi.tokenizeCard.mockResolvedValue({ token: 'mock-token' });

    renderPage();

    // Fill form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText(/continue to payment/i));

    const paymentModal = await screen.findByTestId('mock-payment-modal');
    const submitPaymentButton = screen.getByText(/submit payment/i);

    fireEvent.click(submitPaymentButton);

    await waitFor(() => {
      expect(mockedTransactionsApi.tokenizeCard).toHaveBeenCalled();
    });

    const state = store.getState();
    expect(state.checkout.token).toBe('mock-token');
    expect(state.checkout.step).toBe('summary');
  });

  it('handles payment modal close', async () => {
    renderPage();

    // Fill form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText(/continue to payment/i));

    const closeButton = await screen.findByText(/close/i);
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('mock-payment-modal')).not.toBeInTheDocument();
  });
});
