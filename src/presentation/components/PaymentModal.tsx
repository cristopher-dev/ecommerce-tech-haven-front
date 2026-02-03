import amexLogo from "@/assets/amex-logo.svg";
import cardPlaceholder from "@/assets/credit-card-placeholder.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import visaLogo from "@/assets/visa-logo.svg";
import {
  formatCardNumber,
  getCardType,
  isValidCardholderName,
  isValidCardNumber,
  isValidCVV,
  isValidExpirationDate,
  validateCardInfo,
  type CardType,
} from "@/shared/utils/cardValidation";
import "@/styles/components/PaymentModal.scss";
import React, { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_paymentData: PaymentFormData) => void;
  loading?: boolean;
}

export interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit: handleSubmitPayment,
  loading = false,
}: PaymentModalProps) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardholderName: "",
    expirationMonth: currentDate.getMonth() + 1,
    expirationYear: currentDate.getFullYear(),
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const cardType = getCardType(formData.cardNumber);

  const getCardTypeStyles = (type: CardType): string => {
    switch (type) {
      case "VISA":
        return "visa";
      case "MASTERCARD":
        return "mastercard";
      case "AMEX":
        return "amex";
      default:
        return "unknown";
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, "").slice(0, 19);
    setFormData({ ...formData, cardNumber: value });
    validateField("cardNumber", value);
  };

  const handleCardholderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, cardholderName: value });
    validateField("cardholderName", value);
  };

  const handleExpirationMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = Number.parseInt(e.target.value, 10);
    setFormData({ ...formData, expirationMonth: value });
    validateField("expirationDate", `${value}/${formData.expirationYear}`);
  };

  const handleExpirationYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = Number.parseInt(e.target.value, 10);
    setFormData({ ...formData, expirationYear: value });
    validateField("expirationDate", `${formData.expirationMonth}/${value}`);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, cvv: value });
    validateField("cvv", value);
  };

  const validateField = (fieldName: string, value: string | number) => {
    const newErrors = { ...errors };
    let isValid: boolean;
    let errorMessage = "";

    switch (fieldName) {
      case "cardNumber":
        isValid = !!(value && isValidCardNumber(value as string));
        errorMessage = "Invalid card number";
        break;

      case "cardholderName":
        isValid = !!(value && isValidCardholderName(value as string));
        errorMessage =
          "Name must be at least 5 characters with first and last name";
        break;

      case "expirationDate":
        isValid = isValidExpirationDate(
          formData.expirationMonth,
          formData.expirationYear,
        );
        errorMessage = "Invalid or expired date";
        break;

      case "cvv":
        isValid = !!(value && isValidCVV(value as string, cardType));
        errorMessage =
          cardType === "AMEX" ? "CVV must be 4 digits" : "CVV must be 3 digits";
        break;

      default:
        isValid = true;
        break;
    }

    if (isValid) {
      delete newErrors[fieldName];
    } else {
      newErrors[fieldName] = errorMessage;
    }

    setErrors(newErrors);
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateCardInfo(
      formData.cardNumber,
      formData.cardholderName,
      formData.expirationMonth,
      formData.expirationYear,
      formData.cvv,
    );

    setErrors(validation.errors);
    setTouched({
      cardNumber: true,
      cardholderName: true,
      expirationDate: true,
      cvv: true,
    });

    if (validation.isValid) {
      handleSubmitPayment(formData);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      {isOpen && (
        <div
          className="payment-modal-backdrop"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClose();
          }}
          role="button"
          tabIndex={0}
        >
          <dialog
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            aria-label="Payment Information"
          >
            <div className="payment-modal-header">
              <h2>Payment Information</h2>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit} className="payment-modal-body">
              {/* Credit Card Preview */}
              <div className="card-preview-container mb-4">
                <div className="card-preview">
                  <img
                    src={cardPlaceholder}
                    alt="Credit Card"
                    className="card-preview-image"
                  />
                  <div className="card-preview-info">
                    <div className="card-number-display">
                      {formData.cardNumber.replaceAll(/\s/g, "").length > 0
                        ? formatCardNumber(formData.cardNumber)
                            .split(" ")
                            .map((group, i) => (
                              <span
                                key={`${group}-${i}`}
                                className="card-digit-group"
                              >
                                {group}
                              </span>
                            ))
                        : "•••• •••• •••• ••••"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accepted Card Types */}
              <div className="accepted-cards mb-4">
                <p className="accepted-cards-label">Accepted Cards:</p>
                <div className="card-logos">
                  <div className="card-logo">
                    <img src={visaLogo} alt="Visa" title="Visa" />
                  </div>
                  <div className="card-logo">
                    <img
                      src={mastercardLogo}
                      alt="Mastercard"
                      title="Mastercard"
                    />
                  </div>
                  <div className="card-logo">
                    <img
                      src={amexLogo}
                      alt="American Express"
                      title="American Express"
                    />
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div className="form-group mb-3">
                <label htmlFor="cardNumber" className="form-label">
                  Card Number
                </label>
                <div
                  className={`input-group card-input-group ${getCardTypeStyles(cardType)}`}
                >
                  <input
                    type="text"
                    id="cardNumber"
                    className={`form-control ${touched.cardNumber && errors.cardNumber ? "is-invalid" : ""}`}
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(formData.cardNumber)}
                    onChange={handleCardNumberChange}
                    onBlur={() => handleBlur("cardNumber")}
                    disabled={loading}
                    autoComplete="cc-number"
                  />
                  {cardType !== "UNKNOWN" && (
                    <span
                      className={`card-type-badge ${cardType.toLowerCase()}`}
                    >
                      {cardType}
                    </span>
                  )}
                </div>
                {touched.cardNumber && errors.cardNumber && (
                  <div className="invalid-feedback d-block">
                    {errors.cardNumber}
                  </div>
                )}
              </div>

              {/* Cardholder Name */}
              <div className="form-group mb-3">
                <label htmlFor="cardholderName" className="form-label">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  className={`form-control ${touched.cardholderName && errors.cardholderName ? "is-invalid" : ""}`}
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={handleCardholderNameChange}
                  onBlur={() => handleBlur("cardholderName")}
                  disabled={loading}
                  autoComplete="cc-name"
                />
                {touched.cardholderName && errors.cardholderName && (
                  <div className="invalid-feedback d-block">
                    {errors.cardholderName}
                  </div>
                )}
              </div>

              {/* Expiration Date and CVV */}
              <div className="row mb-3">
                <div className="col-md-8">
                  <label htmlFor="expirationMonth" className="form-label">
                    Expiration Date
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <select
                        id="expirationMonth"
                        className={`form-select ${touched.expirationDate && errors.expirationDate ? "is-invalid" : ""}`}
                        value={formData.expirationMonth}
                        onChange={handleExpirationMonthChange}
                        onBlur={() => handleBlur("expirationDate")}
                        disabled={loading}
                      >
                        {months.map((month) => (
                          <option key={`month-${month}`} value={month}>
                            {String(month).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className={`form-select ${touched.expirationDate && errors.expirationDate ? "is-invalid" : ""}`}
                        value={formData.expirationYear}
                        onChange={handleExpirationYearChange}
                        onBlur={() => handleBlur("expirationDate")}
                        disabled={loading}
                      >
                        {years.map((year) => (
                          <option key={`year-${year}`} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {touched.expirationDate && errors.expirationDate && (
                    <div className="invalid-feedback d-block">
                      {errors.expirationDate}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="password"
                    id="cvv"
                    className={`form-control ${touched.cvv && errors.cvv ? "is-invalid" : ""}`}
                    placeholder={cardType === "AMEX" ? "1234" : "123"}
                    maxLength={cardType === "AMEX" ? 4 : 3}
                    value={formData.cvv}
                    onChange={handleCVVChange}
                    onBlur={() => handleBlur("cvv")}
                    disabled={loading}
                    autoComplete="cc-csc"
                  />
                  {touched.cvv && errors.cvv && (
                    <div className="invalid-feedback d-block">{errors.cvv}</div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="payment-modal-footer mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <output className="spinner-border spinner-border-sm me-2" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
};

export default PaymentModal;
