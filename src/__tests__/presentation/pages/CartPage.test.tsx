import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/application/store/slices/cartSlice';
import CartPage from '@/presentation/pages/CartPage';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

// Mock Header and Footer
jest.mock('@/presentation/components/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock('@/presentation/components/Footer', () => () => (
  <div data-testid="mock-footer">Footer</div>
));

describe('CartPage', () => {
  let store: any;

  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  const renderPage = (preloadedItems = []) => {
    const total = preloadedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: {
        cart: {
          items: preloadedItems,
          total: total,
          totalItems: preloadedItems.length,
          loading: false,
          error: null,
        },
      },
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <CartPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders empty cart message', () => {
    renderPage([]);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 2 },
    ];
    renderPage(items);
    expect(screen.getAllByText('Product 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('$200.00').length).toBeGreaterThanOrEqual(1);
  });

  it('updates quantity on input change', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 1 },
    ];
    renderPage(items);

    // Find input (there are two, one for desktop, one for mobile)
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(3);
  });

  it('removes item when quantity is 0', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 1 },
    ];
    renderPage(items);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '0' } });

    const state = store.getState();
    expect(state.cart.items.length).toBe(0);
  });

  it('removes item on clicking remove button', async () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 1 },
    ];
    renderPage(items);

    // There are multiple remove buttons
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items.length).toBe(0);
    });
  });

  it('increases quantity with + button', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 1 },
    ];
    renderPage(items);

    // The + button is only in mobile view
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(2);
  });

  it('decreases quantity with - button', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 2 },
    ];
    renderPage(items);

    const minusButtons = screen.getAllByText('−'); // Note: it's a minus sign, not a hyphen
    fireEvent.click(minusButtons[0]);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(1);
  });

  it('navigates to checkout', () => {
    const items = [
      { product: { id: '1', name: 'Product 1', price: 100, imageUrl: '' }, quantity: 1 },
    ];
    renderPage(items);

    const checkoutLink = screen.getByText(/checkout/i);
    expect(checkoutLink).toHaveAttribute('href', '/checkout/delivery');
  });
});
