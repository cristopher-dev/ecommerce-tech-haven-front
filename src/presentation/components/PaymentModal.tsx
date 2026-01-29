import React, { useState } from "react";
import {
  isValidCardNumber,
  isValidCVV,
  isValidExpirationDate,
  isValidCardholderName,
  getCardType,
  formatCardNumber,
  validateCardInfo,
  type CardType,
} from "@/shared/utils/cardValidation";
import "./PaymentModal.scss";

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
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardholderName: "",
    expirationMonth: 1,
    expirationYear: new Date().getFullYear(),
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
    const value = e.target.value.replace(/\D/g, "").slice(0, 19);
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
    const value = parseInt(e.target.value, 10);
    setFormData({ ...formData, expirationMonth: value });
    validateField("expirationDate", `${value}/${formData.expirationYear}`);
  };

  const handleExpirationYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    setFormData({ ...formData, expirationYear: value });
    validateField("expirationDate", `${formData.expirationMonth}/${value}`);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, cvv: value });
    validateField("cvv", value);
  };

  const validateField = (fieldName: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "cardNumber":
        if (!value || !isValidCardNumber(value as string)) {
          newErrors.cardNumber = "Invalid card number";
        } else {
          delete newErrors.cardNumber;
        }
        break;

      case "cardholderName":
        if (!value || !isValidCardholderName(value as string)) {
          newErrors.cardholderName =
            "Name must be at least 5 characters with first and last name";
        } else {
          delete newErrors.cardholderName;
        }
        break;

      case "expirationDate":
        if (
          !isValidExpirationDate(
            formData.expirationMonth,
            formData.expirationYear,
          )
        ) {
          newErrors.expirationDate = "Invalid or expired date";
        } else {
          delete newErrors.expirationDate;
        }
        break;

      case "cvv":
        if (!value || !isValidCVV(value as string, cardType)) {
          newErrors.cvv =
            cardType === "AMEX"
              ? "CVV must be 4 digits"
              : "CVV must be 3 digits";
        } else {
          delete newErrors.cvv;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="payment-modal-backdrop" onClick={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
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
              />
              {cardType !== "UNKNOWN" && (
                <span className={`card-type-badge ${cardType.toLowerCase()}`}>
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
              <label className="form-label">Expiration Date</label>
              <div className="row g-2">
                <div className="col-6">
                  <select
                    className={`form-select ${touched.expirationDate && errors.expirationDate ? "is-invalid" : ""}`}
                    value={formData.expirationMonth}
                    onChange={handleExpirationMonthChange}
                    onBlur={() => handleBlur("expirationDate")}
                    disabled={loading}
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
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
                      <option key={year} value={year}>
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
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
