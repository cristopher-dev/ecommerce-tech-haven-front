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
      preloadedState: {
        auth: { user: null, token: null, status: 'idle', error: null },
        cart: { items: [], total: 0, totalItems: 0 },
        wishlist: { items: [], count: 0 },
        ...preloadedState,
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
        count: 2,
      },
    };
    renderHeader(state);
    const wishlistBadges = screen.getAllByText('2');
    expect(wishlistBadges.length).toBeGreaterThan(0);
  });

  it('toggles language dropdown and changes language', () => {
    i18n.changeLanguage('en');
    renderHeader();
    // Search by title or text depending on what RTL sees
    const langButton = screen.getByTitle(/Select Language/i);
    fireEvent.click(langButton);
    const spanishBtn = screen.getByText(/Español/i);
    fireEvent.click(spanishBtn);
    expect(i18n.language).toBe('es');

    fireEvent.click(langButton);
    const englishBtn = screen.getByText(/English/i);
    fireEvent.click(englishBtn);
    expect(i18n.language).toBe('en');
  });

  it('handles search form submission', () => {
    i18n.changeLanguage('en');
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: 'laptop' } });

    const searchForm = searchInput.closest('form');
    fireEvent.submit(searchForm!);

    expect(mockNavigate).toHaveBeenCalledWith('/product?search=laptop');
  });

  it('handles search form submission with empty value', () => {
    renderHeader();
    const searchForm = screen.getByRole('searchbox').closest('form');
    fireEvent.submit(searchForm!);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to categories', () => {
    i18n.changeLanguage('en');
    renderHeader();
    const categoriesBtn = screen.getAllByText(/Categories/i)[0];
    fireEvent.click(categoriesBtn);

    const electronicsBtn = screen.getByText(/Electronics/i);
    fireEvent.click(electronicsBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/product?category=electronics');
  });

  it('performs mock login successfully', async () => {
    i18n.changeLanguage('en');
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        email: 'admin@techhaven.com',
        token: 'mock-token',
        role: 'ADMIN',
      }),
    });

    renderHeader();
    const loginBtn = screen.getByTitle(/Demo: Click to login as Admin/i);

    await act(async () => {
      fireEvent.click(loginBtn);
    });

    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('handles failed mock login', async () => {
    i18n.changeLanguage('en');
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation();

    renderHeader();
    const loginBtn = screen.getByTitle(/Demo: Click to login as Admin/i);

    await act(async () => {
      fireEvent.click(loginBtn);
    });

    expect(spyAlert).toHaveBeenCalled();
    spyConsole.mockRestore();
    spyAlert.mockRestore();
  });

  it('handles logout with timeout', async () => {
    i18n.changeLanguage('en');
    jest.useFakeTimers();
    const state = {
      auth: {
        user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        token: 'token',
      },
    };
    renderHeader(state);

    const userBtn = screen.getByText('John');
    fireEvent.click(userBtn);

    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
    jest.useRealTimers();
  });

  it('covers mouse interactions on wishlist, purchases, and cart', () => {
    i18n.changeLanguage('en');
    renderHeader();

    // Wishlist
    const wishlistLink = screen.getByRole('link', { name: /Wishlist/i });
    fireEvent.mouseEnter(wishlistLink);
    fireEvent.mouseLeave(wishlistLink);
    expect(wishlistLink).toHaveAttribute('href', '/wishlist');

    // Purchases
    const ordersText = i18n.t('common.orders') || 'Orders';
    const purchasesLink = screen.getByRole('link', {
      name: new RegExp(`${ordersText}|Purchases`, 'i'),
    });
    fireEvent.mouseEnter(purchasesLink);
    fireEvent.mouseLeave(purchasesLink);
    expect(purchasesLink).toHaveAttribute('href', '/purchases');

    // Cart button (it's a button, not a link)
    const cartBtn = screen.getByRole('button', { name: /Total/i });
    fireEvent.mouseEnter(cartBtn);
    fireEvent.mouseLeave(cartBtn);
  });

  it('shows cart items and handles remove', () => {
    i18n.changeLanguage('en');
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

    const priceElements = screen.getAllByText(/\$200\.00/);
    expect(priceElements.length).toBeGreaterThan(0);

    const cartButton = priceElements[0].closest('button');
    fireEvent.click(cartButton!);

    expect(screen.getByText('Product 1')).toBeInTheDocument();

    const removeButton = screen.getAllByRole('button').find((btn) => btn.querySelector('.bi-x'));
    if (removeButton) {
      fireEvent.click(removeButton);
    }
  });

  it('navigates to other categories from search bar', () => {
    i18n.changeLanguage('en');
    renderHeader();
    const categoriesBtns = screen.getAllByText(/Categories/i);
    const mainCategoriesBtn = categoriesBtns[0];
    fireEvent.click(mainCategoriesBtn);

    // "All Categories" is both the toggle and an item
    const allBtns = screen.getAllByText(/All Categories/i);
    const allBtnItem = allBtns.find((el) => el.classList.contains('dropdown-item')) || allBtns[1];
    fireEvent.click(allBtnItem);
    expect(mockNavigate).toHaveBeenCalledWith('/product?category=all');

    fireEvent.click(mainCategoriesBtn);
    const fashionBtn = screen.getByText(/Fashion/i);
    fireEvent.click(fashionBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/product?category=fashion');

    fireEvent.click(mainCategoriesBtn);
    const homeBtn = screen.getByText(/Home & Garden/i);
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/product?category=home-garden');

    fireEvent.click(mainCategoriesBtn);
    const sportsBtn = screen.getByText(/Sports/i);
    fireEvent.click(sportsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/product?category=sports');
  });
});
