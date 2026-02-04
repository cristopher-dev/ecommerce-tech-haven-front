import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from '@/presentation/components/PaymentModal';

// Mock assets
jest.mock('@/assets/amex-logo.svg', () => 'amex-svg');
jest.mock('@/assets/credit-card-placeholder.svg', () => 'placeholder-svg');
jest.mock('@/assets/mastercard-logo.svg', () => 'mastercard-svg');
jest.mock('@/assets/visa-logo.svg', () => 'visa-svg');

describe('PaymentModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    loading: false,
  };

  const renderPaymentModal = (props = {}) => {
    return render(<PaymentModal {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    renderPaymentModal();
    expect(screen.getByText(/Payment Information/i)).toBeInTheDocument();
  });

  it('returns null if not open', () => {
    const { container } = renderPaymentModal({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });

  it('handles card number changes and formatting', () => {
    renderPaymentModal();
    const cardInput = screen.getByLabelText(/Card Number/i);
    fireEvent.change(cardInput, { target: { value: '4242424242424242' } });
    expect(cardInput).toHaveValue('4242 4242 4242 4242');
  });

  it('handles name changes', () => {
    renderPaymentModal();
    const nameInput = screen.getByLabelText(/Cardholder Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('updates expiration date selects', () => {
    const { container } = renderPaymentModal();
    const monthSelect = container.querySelector('#expirationMonth');
    const yearSelect = container.querySelectorAll('select')[1];

    fireEvent.change(monthSelect!, { target: { value: '12' } });
    fireEvent.change(yearSelect!, { target: { value: '2028' } });

    expect(monthSelect).toHaveValue('12');
    expect(yearSelect).toHaveValue('2028');
  });

  it('handles CVV changes with length limit', () => {
    renderPaymentModal();
    const cvvInput = screen.getByLabelText(/CVV/i);
    fireEvent.change(cvvInput, { target: { value: '12345' } });
    expect(cvvInput).toHaveValue('1234');
  });

  it('shows validation errors on blur for empty fields', async () => {
    renderPaymentModal();

    const cardInput = screen.getByLabelText(/Card Number/i);
    fireEvent.blur(cardInput);
    expect(await screen.findByText(/Invalid card number/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Cardholder Name/i);
    fireEvent.blur(nameInput);
    expect(await screen.findByText(/Name must be at least 5 characters/i)).toBeInTheDocument();

    const cvvInput = screen.getByLabelText(/CVV/i);
    fireEvent.blur(cvvInput);
    expect(await screen.findByText(/CVV must be 3 digits/i)).toBeInTheDocument();
  });

  it('handles AMEX specific CVV validation', async () => {
    renderPaymentModal();
    const cardInput = screen.getByLabelText(/Card Number/i);
    const cvvInput = screen.getByLabelText(/CVV/i);

    // Enter a valid-looking AMEX number prefix/length
    fireEvent.change(cardInput, { target: { value: '341234567890123' } });
    fireEvent.blur(cvvInput);

    expect(await screen.findByText(/CVV must be 4 digits/i)).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    renderPaymentModal();

    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: '4242424242424242' },
    });
    fireEvent.change(screen.getByLabelText(/Cardholder Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: /Confirm Payment/i });
    fireEvent.click(submitBtn);

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = renderPaymentModal();
    const backdrop = container.querySelector('.payment-modal-backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed on backdrop', () => {
    const { container } = renderPaymentModal();
    const backdrop = container.querySelector('.payment-modal-backdrop');
    if (backdrop) {
      fireEvent.keyDown(backdrop, { key: 'Escape', code: 'Escape' });
    }
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('stops propagation when modal content is clicked', () => {
    const { container } = renderPaymentModal();
    const dialog = container.querySelector('.payment-modal');
    if (dialog) {
      fireEvent.click(dialog);
    }
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('prevents interactions while loading', () => {
    renderPaymentModal({ loading: true });

    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    const backdrop = document.querySelector('.payment-modal-backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
