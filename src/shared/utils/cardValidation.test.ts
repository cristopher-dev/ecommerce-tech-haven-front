import {
  isValidCardNumber,
  getCardType,
  isValidCVV,
  isValidExpirationDate,
  formatCardNumber,
  maskCardNumber,
  isValidCardholderName,
  validateCardInfo,
  CardType,
} from './cardValidation';

describe('cardValidation', () => {
  describe('isValidCardNumber', () => {
    it('should return true for valid Visa card number', () => {
      expect(isValidCardNumber('4111111111111111')).toBe(true);
    });

    it('should return true for valid Mastercard', () => {
      expect(isValidCardNumber('5555555555554444')).toBe(true);
    });

    it('should return true for valid Amex', () => {
      expect(isValidCardNumber('378282246310005')).toBe(true);
    });

    it('should return false for invalid card number', () => {
      expect(isValidCardNumber('4111111111111112')).toBe(false);
    });

    it('should return false for too short card number', () => {
      expect(isValidCardNumber('411111111')).toBe(false);
    });

    it('should return false for too long card number', () => {
      expect(isValidCardNumber('41111111111111111111')).toBe(false);
    });

    it('should ignore non-digit characters', () => {
      expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
    });
  });

  describe('getCardType', () => {
    it('should detect Visa', () => {
      expect(getCardType('4111111111111111')).toBe('VISA');
    });

    it('should detect Mastercard', () => {
      expect(getCardType('5555555555554444')).toBe('MASTERCARD');
    });

    it('should detect Amex', () => {
      expect(getCardType('378282246310005')).toBe('AMEX');
    });

    it('should return UNKNOWN for unknown type', () => {
      expect(getCardType('1234567890123456')).toBe('UNKNOWN');
    });
  });

  describe('isValidCVV', () => {
    it('should return true for 3-digit CVV on non-Amex', () => {
      expect(isValidCVV('123')).toBe(true);
    });

    it('should return true for 4-digit CVV on Amex', () => {
      expect(isValidCVV('1234', 'AMEX')).toBe(true);
    });

    it('should return false for 4-digit CVV on Visa', () => {
      expect(isValidCVV('1234', 'VISA')).toBe(false);
    });

    it('should return false for 2-digit CVV', () => {
      expect(isValidCVV('12')).toBe(false);
    });
  });

  describe('isValidExpirationDate', () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    it('should return true for future date', () => {
      expect(isValidExpirationDate(currentMonth, currentYear + 1)).toBe(true);
    });

    it('should return true for current month', () => {
      expect(isValidExpirationDate(currentMonth, currentYear)).toBe(true);
    });

    it('should return false for past date', () => {
      expect(isValidExpirationDate(currentMonth - 1, currentYear)).toBe(false);
    });

    it('should return false for invalid month', () => {
      expect(isValidExpirationDate(13, currentYear)).toBe(false);
    });
  });

  describe('formatCardNumber', () => {
    it('should format card number with spaces', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    });

    it('should ignore non-digits', () => {
      expect(formatCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111');
    });
  });

  describe('maskCardNumber', () => {
    it('should mask card number keeping last 4 digits', () => {
      expect(maskCardNumber('4111111111111111')).toBe('************1111');
    });
  });

  describe('isValidCardholderName', () => {
    it('should return true for valid name', () => {
      expect(isValidCardholderName('John Doe')).toBe(true);
    });

    it('should return false for too short name', () => {
      expect(isValidCardholderName('John')).toBe(false);
    });

    it('should return false for single name', () => {
      expect(isValidCardholderName('John')).toBe(false);
    });
  });

  describe('validateCardInfo', () => {
    it('should return valid for correct info', () => {
      const result = validateCardInfo('4111111111111111', 'John Doe', 12, 2030, '123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid info', () => {
      const result = validateCardInfo('4111111111111112', 'John', 1, 2020, '12');
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toContain('cardNumber');
      expect(Object.keys(result.errors)).toContain('holderName');
      expect(Object.keys(result.errors)).toContain('expirationDate');
      expect(Object.keys(result.errors)).toContain('cvv');
    });
  });
});