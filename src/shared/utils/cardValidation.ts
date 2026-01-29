/**
 * Card validation utilities for credit card processing
 * Includes Luhn algorithm, CVV validation, card type detection
 */

export type CardType = "VISA" | "MASTERCARD" | "AMEX" | "UNKNOWN";

/**
 * Luhn Algorithm: Validates credit card numbers
 * @param cardNumber - The card number to validate
 * @returns true if valid, false otherwise
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Detects the card type based on card number
 * @param cardNumber - The card number
 * @returns The detected card type
 */
export const getCardType = (cardNumber: string): CardType => {
  const digits = cardNumber.replace(/\D/g, "");

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(digits)) {
    return "VISA";
  }

  if (/^5[1-5][0-9]{14}$/.test(digits)) {
    return "MASTERCARD";
  }

  if (/^3[47][0-9]{13}$/.test(digits)) {
    return "AMEX";
  }

  return "UNKNOWN";
};

/**
 * Validates CVV/CVC code
 * @param cvv - The CVV code
 * @param cardType - The card type (affects length requirements)
 * @returns true if valid, false otherwise
 */
export const isValidCVV = (
  cvv: string,
  cardType: CardType = "UNKNOWN",
): boolean => {
  const digits = cvv.replace(/\D/g, "");

  // AMEX uses 4-digit CVV, others use 3
  if (cardType === "AMEX") {
    return digits.length === 4;
  }

  return digits.length === 3;
};

/**
 * Validates expiration date
 * @param month - Expiration month (1-12)
 * @param year - Expiration year (YY or YYYY format)
 * @returns true if valid, false otherwise
 */
export const isValidExpirationDate = (month: number, year: number): boolean => {
  if (month < 1 || month > 12) {
    return false;
  }

  // Convert 2-digit year to 4-digit
  let fullYear = year;
  if (year < 100) {
    fullYear = year < 30 ? 2000 + year : 1900 + year; // Assume 20xx for 00-29, 19xx for 30-99
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Check if expiration is in the future
  if (fullYear > currentYear) {
    return true;
  }

  if (fullYear === currentYear && month >= currentMonth) {
    return true;
  }

  return false;
};

/**
 * Formats card number with spaces (e.g., 4111 1111 1111 1111)
 * @param cardNumber - The unformatted card number
 * @returns Formatted card number
 */
export const formatCardNumber = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.replace(/(\d{4})/g, "$1 ").trim();
};

/**
 * Masks card number for display (e.g., **** **** **** 1111)
 * @param cardNumber - The card number to mask
 * @returns Masked card number
 */
export const maskCardNumber = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  const masked = "*".repeat(digits.length - 4);
  return `${masked}${last4}`.replace(/(\d{4})/g, "$1 ").trim();
};

/**
 * Validates cardholder name
 * @param name - The cardholder name
 * @returns true if valid, false otherwise
 */
export const isValidCardholderName = (name: string): boolean => {
  const trimmed = name.trim();
  // Must have at least 2 parts (first and last name) and be at least 5 characters
  return trimmed.length >= 5 && trimmed.split(/\s+/).length >= 2;
};

/**
 * Validates all card information
 * @param cardNumber - The card number
 * @param holderName - The cardholder name
 * @param expirationMonth - Expiration month
 * @param expirationYear - Expiration year
 * @param cvv - CVV code
 * @returns Object with validation result and error messages
 */
export const validateCardInfo = (
  cardNumber: string,
  holderName: string,
  expirationMonth: number,
  expirationYear: number,
  cvv: string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!cardNumber || !isValidCardNumber(cardNumber)) {
    errors.cardNumber = "Invalid card number";
  }

  if (!holderName || !isValidCardholderName(holderName)) {
    errors.holderName =
      "Cardholder name must be at least 5 characters with first and last name";
  }

  if (!isValidExpirationDate(expirationMonth, expirationYear)) {
    errors.expirationDate = "Card has expired or invalid date";
  }

  const cardType = getCardType(cardNumber);
  if (!cvv || !isValidCVV(cvv, cardType)) {
    errors.cvv =
      cardType === "AMEX" ? "CVV must be 4 digits" : "CVV must be 3 digits";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
