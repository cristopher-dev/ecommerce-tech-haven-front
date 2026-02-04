import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/application/store/slices/authSlice';
import cartReducer from '@/application/store/slices/cartSlice';
import wishlistReducer from '@/application/store/slices/wishlistSlice';
import Header from '@/presentation/components/Header';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock TechHavenLogo
jest.mock('@/assets/TechHavenLogo.svg', () => 'test-file-stub');

// Mock fetch
globalThis.fetch = jest.fn();

describe('Header Component', () => {
  const renderHeader = (preloadedState?: any) => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
      } as any,
      preloadedState: preloadedState || {
        auth: { user: null, token: null, status: 'idle', error: null },
        cart: { items: [], total: 0, totalItems: 0 },
        wishlist: { items: [], count: 0 },
      },
    });

    return render(
      <Provider store={testStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo', () => {
    renderHeader();
    const logo = screen.getByAltText(/TechHaven/i);
    expect(logo).toBeInTheDocument();
  });

  it('displays cart count', () => {
    const state = {
      cart: {
        items: [],
        total: 150.5,
        totalItems: 3,
        loading: false,
        error: null,
      },
    };
    renderHeader(state);
    const cartBadges = screen.getAllByText('3');
    expect(cartBadges.length).toBeGreaterThan(0);
    expect(screen.getByText(/\$150\.50/)).toBeInTheDocument();
  });

  it('displays wishlist count', () => {
    const state = {
      wishlist: {
        items: [
          { product: { id: 'p1' }, addedAt: new Date() },
          { product: { id: 'p2' }, addedAt: new Date() },
        ],
        loading: false,
        error: null,
      },
    };
    renderHeader(state);
    const wishlistBadges = screen.getAllByText('2');
    expect(wishlistBadges.length).toBeGreaterThan(0);
  });

  it('toggles language dropdown', () => {
    renderHeader();
    const langButton = screen.getByTitle(/Select Language/i);
    fireEvent.click(langButton);
    expect(screen.getByText(/Español/i)).toBeInTheDocument();
  });

  it('shows login button when user is not logged in', () => {
    renderHeader();
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });

  it('triggers search when form is submitted', () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/header\.search|search products/i);
    fireEvent.change(searchInput, { target: { value: 'laptop' } });

    const form = searchInput.closest('form');
    fireEvent.submit(form!);

    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('search=laptop'));
  });

  it('performs mock login when login button is clicked', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'admin@techhaven.com', role: 'ADMIN', token: 'fake-token' }),
    });

    renderHeader();
    const loginButton = screen.getByText(/Login/i);

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('shows user menu and performs logout', () => {
    const loggedInState = {
      auth: {
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        token: 'fake-token',
        status: 'succeeded',
        error: null,
      },
    };

    renderHeader(loggedInState);

    // Should show John instead of Login
    expect(screen.getByText('John')).toBeInTheDocument();

    // Click on account to show logout
    const accountButton = screen.getByText('John').closest('button');
    fireEvent.click(accountButton!);

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
  });

  it('navigates to categories', () => {
    renderHeader();
    // Use getAllByText and take the first one (the dropdown toggle)
    const categoriesButton = screen.getAllByText(/Categories/i)[0];
    fireEvent.click(categoriesButton);

    const electronicsButton = screen.getByText(/Electronics/i);
    fireEvent.click(electronicsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/product?category=electronics');
  });

  it('navigates to wishlist', () => {
    renderHeader();
    const wishlistLink = screen.getByRole('link', { name: /wishlist/i });
    expect(wishlistLink).toHaveAttribute('href', '/wishlist');
  });

  it('shows cart items and handles remove', () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            product: { id: 'p1', name: 'Product 1', price: 100, image: '' },
            quantity: 2,
          },
        ],
        total: 200,
        totalItems: 2,
        loading: false,
        error: null,
      },
    };

    renderHeader(cartWithItems);

    // Total price should be displayed
    const priceElements = screen.getAllByText(/\$200\.00/);
    expect(priceElements.length).toBeGreaterThan(0);

    // Click cart to show items
    const cartButton = priceElements[0].closest('button');
    fireEvent.click(cartButton!);

    expect(screen.getByText('Product 1')).toBeInTheDocument();

    const removeButton = screen.getAllByRole('button').find((btn) => btn.querySelector('.bi-x'));
    if (removeButton) {
      fireEvent.click(removeButton);
    }
  });
});
