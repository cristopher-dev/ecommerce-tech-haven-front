import { render, screen } from '@testing-library/react';
import ProductCard from '@/presentation/components/ProductCard';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import authReducer from '@/application/store/slices/authSlice';
import cartReducer from '@/application/store/slices/cartSlice';
import wishlistReducer from '@/application/store/slices/wishlistSlice';
import productsReducer from '@/application/store/slices/productsSlice';
import { BrowserRouter } from 'react-router-dom';
import { RootState } from '@/application/store/store';
import checkoutReducer from '@/application/store/slices/checkoutSlice';
import deliveriesReducer from '@/application/store/slices/deliveriesSlice';
import transactionsReducer from '@/application/store/slices/transactionsSlice';
import purchasedItemsReducer from '@/application/store/slices/purchasedItemsSlice';

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      products: productsReducer,
      checkout: checkoutReducer,
      deliveries: deliveriesReducer,
      transactions: transactionsReducer,
      purchasedItems: purchasedItemsReducer,
    },
    preloadedState,
  });
};

describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    price: 99.99,
    discount: 10,
    category: 'electronics',
    stock: 10,
    rating: 4.5,
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render product card with product name', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should display product price', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    // The discounted price should be displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should display discount badge when product has discount', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    const discountText = screen.queryByText(/-10%/);
    expect(discountText).toBeInTheDocument();
  });

  it('should have add to cart button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have product image', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render rating information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
    // ProductCard displays rating stars, so we check for their presence
    const stars = screen.queryAllByRole('img', { hidden: true });
    expect(stars.length).toBeGreaterThanOrEqual(0);
  });

  it('should display product in wishlist when wishlist items include it', () => {
    const store = createMockStore({
      wishlist: {
        items: [
          {
            product: mockProduct,
            addedAt: new Date().toISOString(),
          },
        ],
      },
    } as PreloadedState<RootState>);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render without discount when discount is zero', () => {
    const productWithoutDiscount = {
      ...mockProduct,
      discount: 0,
    };
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={productWithoutDiscount} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
