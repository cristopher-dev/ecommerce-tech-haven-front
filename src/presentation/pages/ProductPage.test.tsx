import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductPage from './ProductPage';

// Mock useCart
jest.mock('../../infrastructure/hooks/useCart', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock Header and Footer
jest.mock('../components/Header', () => {
  const React = require('react');
  return {
    default: () => React.createElement('div', null, 'Header'),
  };
});
jest.mock('../components/Footer', () => {
  const React = require('react');
  return {
    default: () => React.createElement('div', null, 'Footer'),
  };
});

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render product details', () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('$99.00')).toBeInTheDocument();
    expect(screen.getByText('Description of the product.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('should show loading state when adding to cart', async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for the timeout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    }, { timeout: 600 });
  });

  it('should show toast notification when adding to cart', async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Added to Cart')).toBeInTheDocument();
      expect(screen.getByText(/has been added to your cart/)).toBeInTheDocument();
    });
  });

  it('should hide toast after 4 seconds', async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Added to Cart')).toBeInTheDocument();
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Added to Cart')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});