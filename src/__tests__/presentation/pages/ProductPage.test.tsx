import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/application/store/slices/authSlice';
import cartReducer from '@/application/store/slices/cartSlice';
import wishlistReducer from '@/application/store/slices/wishlistSlice';
import ProductPage from '@/presentation/pages/ProductPage';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { TechHavenApiProductRepository } from '@/infrastructure/adapters/TechHavenApiRepositories';

// Mock the repository
jest.mock('@/infrastructure/adapters/TechHavenApiRepositories');

// Mock useSearchParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

// Mock Header and Footer to speed up
jest.mock('@/presentation/components/Header', () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock('@/presentation/components/Footer', () => () => (
  <div data-testid="mock-footer">Footer</div>
));

describe('ProductPage', () => {
  let store: any;
  const mockGetById = jest.fn();
  const mockGetAll = jest.fn();
  const mockSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
      },
      preloadedState: {
        wishlist: { items: [], loading: false, error: null },
      },
    });

    (TechHavenApiProductRepository.getInstance as jest.Mock).mockReturnValue({
      getById: mockGetById,
      getAll: mockGetAll,
      search: mockSearch,
    });
  });

  const renderProductPage = () => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <ProductPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders loading state initially', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('id=1'), jest.fn()]);
    mockGetById.mockReturnValue(new Promise(() => {})); // Never resolves

    renderProductPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product details when id is provided', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('id=1'), jest.fn()]);
    mockGetById.mockResolvedValue({
      id: '1',
      name: 'Test Product',
      price: 10000,
      description: 'Test Description',
      imageUrl: 'test.jpg',
      stock: 10,
      category: 'electronics',
    });

    renderProductPage();

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();

    const addToCartButton = screen.getByText(/add to cart/i);
    fireEvent.click(addToCartButton);

    // Should navigate to cart eventually
    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /adding/i })).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('performs buy now', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('id=1'), jest.fn()]);
    mockGetById.mockResolvedValue({
      id: '1',
      name: 'Test Product',
      price: 10000,
      description: 'Test Description',
      imageUrl: 'test.jpg',
      stock: 10,
      category: 'electronics',
    });

    renderProductPage();

    await waitFor(() => {
      expect(screen.getByText(/buy now/i)).toBeInTheDocument();
    });

    const buyNowButton = screen.getByText(/buy now/i);
    fireEvent.click(buyNowButton);
  });

  it('renders search results when search query is provided', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams('search=laptop'),
      jest.fn(),
    ]);
    mockSearch.mockResolvedValue([
      {
        id: '1',
        name: 'Laptop 1',
        price: 50000,
        imageUrl: 'laptop1.jpg',
        stock: 5,
        description: 'Mock laptop',
        category: 'electronics',
      },
    ]);

    renderProductPage();

    await waitFor(() => {
      expect(screen.getByText(/search results/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Laptop 1')).toBeInTheDocument();

    const wishlistButton = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(wishlistButton);
  });

  it('renders not found state when product does not exist', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('id=999'), jest.fn()]);
    mockGetById.mockResolvedValue(null);

    renderProductPage();

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});
