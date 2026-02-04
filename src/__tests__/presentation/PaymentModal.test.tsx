import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock SVG imports
jest.mock('@/assets/amex-logo.svg', () => 'amex-logo.svg');
jest.mock('@/assets/credit-card-placeholder.svg', () => 'credit-card-placeholder.svg');
jest.mock('@/assets/mastercard-logo.svg', () => 'mastercard-logo.svg');
jest.mock('@/assets/visa-logo.svg', () => 'visa-logo.svg');

// Mock SCSS import
jest.mock('@/styles/components/PaymentModal.scss', () => ({}));

import PaymentModal from '@/presentation/components/PaymentModal';

describe('PaymentModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPaymentModal = (props: any = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      loading: false,
      ...props,
    };
    return render(<PaymentModal {...defaultProps} />);
  };

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      renderPaymentModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render dialog when isOpen is true', () => {
      renderPaymentModal();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have correct dialog aria label', () => {
      renderPaymentModal();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Payment Information');
    });
  });

  describe('Modal Header', () => {
    it('should display Payment Information title', () => {
      renderPaymentModal();
      expect(screen.getByText('Payment Information')).toBeInTheDocument();
    });

    it('should have a close button', () => {
      renderPaymentModal();
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      renderPaymentModal();
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal when close button is disabled during loading', () => {
      renderPaymentModal({ loading: true });
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeDisabled();
    });
  });

  describe('Form Fields', () => {
    it('should have card number input field', () => {
      renderPaymentModal();
      const cardNumberInput = screen.getByRole('textbox', { name: /card number/i });
      expect(cardNumberInput).toBeInTheDocument();
    });

    it('should have cardholder name input field', () => {
      renderPaymentModal();
      const nameInput = screen.getByRole('textbox', { name: /cardholder name/i });
      expect(nameInput).toBeInTheDocument();
    });

    it('should have expiration date selects', () => {
      renderPaymentModal();
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2); // month and year
    });

    it('should have CVV input field', () => {
      renderPaymentModal();
      const cvvInput = screen.getByLabelText('CVV');
      expect(cvvInput).toBeInTheDocument();
    });

    it('should have submit and cancel buttons', () => {
      renderPaymentModal();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3); // close, cancel, submit
    });
  });

  describe('Card Number Input', () => {
    it('should accept numeric input only', async () => {
      renderPaymentModal();
      const input = screen.getByRole('textbox', { name: /card number/i });
      await userEvent.type(input, '4532abc123456789');
      expect(input).toHaveValue('4532 1234 5678 9');
    });

    it('should limit card number to 19 characters', async () => {
      renderPaymentModal();
      const input = screen.getByRole('textbox', { name: /card number/i });
      await userEvent.type(input, '45321234567890123456789012345');
      expect((input as HTMLInputElement).value.replaceAll(/\s/g, '')).toHaveLength(19);
    });
  });

  describe('Cardholder Name Input', () => {
    it('should accept text input', async () => {
      renderPaymentModal();
      const input = screen.getByRole('textbox', { name: /cardholder name/i });
      await userEvent.type(input, 'John Doe');
      expect(input).toHaveValue('John Doe');
    });
  });

  describe('CVV Input', () => {
    it('should accept numeric input only', async () => {
      renderPaymentModal();
      const input = screen.getByLabelText('CVV');
      await userEvent.type(input, '123abc');
      expect(input).toHaveValue('123');
    });

    it('should limit CVV to 3 characters for non-AMEX cards', async () => {
      renderPaymentModal();
      const input = screen.getByLabelText('CVV');
      await userEvent.type(input, '12345');
      // For non-AMEX, CVV is limited to 3
      expect((input as HTMLInputElement).value).toHaveLength(3);
    });
  });

  describe('Month/Year Selects', () => {
    it('should have multiple select fields for date inputs', () => {
      renderPaymentModal();
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2); // month and year
      const monthSelect = selects[0];
      const monthOptions = (monthSelect as HTMLSelectElement).querySelectorAll('option');
      expect(monthOptions.length).toBeGreaterThanOrEqual(12);
    });

    it('should populate year select with future years', () => {
      renderPaymentModal();
      const selects = screen.getAllByRole('combobox');
      // Second select should be year (first is month)
      const yearSelect = selects[1];
      const options = (yearSelect as HTMLSelectElement).querySelectorAll('option');
      expect(options.length).toBeGreaterThanOrEqual(12);
    });
  });

  describe('Accepted Cards Display', () => {
    it('should display accepted cards section', () => {
      renderPaymentModal();
      expect(screen.getByText('Accepted Cards:')).toBeInTheDocument();
    });
  });

  describe('Card Preview', () => {
    it('should display card preview container', () => {
      renderPaymentModal();
      const preview = document.querySelector('.card-preview-container');
      expect(preview).toBeInTheDocument();
    });

    it('should display card placeholder image', () => {
      renderPaymentModal();
      const cardImage = screen.getByAltText('Credit Card');
      expect(cardImage).toBeInTheDocument();
    });

    it('should display placeholder card number when empty', () => {
      renderPaymentModal();
      const preview = document.querySelector('.card-number-display');
      expect(preview?.textContent).toContain('•••• •••• •••• ••••');
    });
  });

  describe('Loading State', () => {
    it('should display form when not loading', () => {
      renderPaymentModal({ loading: false });
      expect(screen.getByRole('textbox', { name: /card number/i })).not.toBeDisabled();
    });

    it('should disable form inputs when loading', () => {
      renderPaymentModal({ loading: true });
      const cardInput = screen.getByRole('textbox', { name: /card number/i });
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(cardInput).toBeDisabled();
      expect(closeButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role for dialog', () => {
      renderPaymentModal();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have accessible close button', () => {
      renderPaymentModal();
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('should have payment modal footer', () => {
      renderPaymentModal();
      const footer = document.querySelector('.payment-modal-footer');
      expect(footer).toBeInTheDocument();
    });
  });
});
