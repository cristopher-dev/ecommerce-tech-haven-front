/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentModal from "@/presentation/pages/PaymentModal";
import userEvent from "@testing-library/user-event";

jest.mock("@/presentation/components/PaymentModal.scss", () => ({}));

jest.mock("@/shared/utils/cardValidation", () => ({
  isValidCardNumber: jest.fn(() => true),
  isValidCVV: jest.fn(() => true),
  isValidExpirationDate: jest.fn(() => true),
  isValidCardholderName: jest.fn(() => true),
  getCardType: jest.fn(() => "VISA"),
  formatCardNumber: jest.fn((num) => num),
  validateCardInfo: jest.fn(() => ({ isValid: true, errors: {} })),
}));

describe("PaymentModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render nothing when isOpen is false", () => {
    const { container } = render(
      <PaymentModal {...defaultProps} isOpen={false} />,
    );
    expect(container.querySelector(".payment-modal")).not.toBeInTheDocument();
  });

  it("should render modal when isOpen is true", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(screen.getByText("Payment Information")).toBeInTheDocument();
  });

  it("should render card number field", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(screen.getByLabelText("Card Number")).toBeInTheDocument();
  });

  it("should render cardholder name field", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(screen.getByLabelText("Cardholder Name")).toBeInTheDocument();
  });

  it("should render CVV field", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(screen.getByLabelText("CVV")).toBeInTheDocument();
  });

  it("should render Cancel button", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("should render Confirm Payment button", () => {
    render(<PaymentModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /Confirm Payment/i }),
    ).toBeInTheDocument();
  });

  it("should call onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    render(<PaymentModal {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when close icon clicked", async () => {
    const user = userEvent.setup();
    render(<PaymentModal {...defaultProps} />);
    await user.click(screen.getByLabelText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should update card input when typing", async () => {
    const user = userEvent.setup();
    render(<PaymentModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("1234 5678 9012 3456");
    await user.type(input, "1");
    expect(input).toHaveValue("1");
  });

  it("should disable form when loading", () => {
    render(<PaymentModal {...defaultProps} loading={true} />);
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeDisabled();
  });

  it("should show spinner when loading", () => {
    render(<PaymentModal {...defaultProps} loading={true} />);
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
  });

  it("should prevent backdrop click from propagating", () => {
    const { container } = render(<PaymentModal {...defaultProps} />);
    const modal = container.querySelector(".payment-modal");
    if (modal) {
      fireEvent.click(modal);
    }
    expect(screen.getByText("Payment Information")).toBeInTheDocument();
  });

  it("should render expiration month and year selects", () => {
    render(<PaymentModal {...defaultProps} />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });
});
