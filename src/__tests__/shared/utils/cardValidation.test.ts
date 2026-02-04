import {
  isValidCardNumber,
  getCardType,
  isValidCVV,
  isValidExpirationDate,
  formatCardNumber,
  maskCardNumber,
  isValidCardholderName,
  validateCardInfo,
} from '@/shared/utils/cardValidation';

describe('Card Validation', () => {
  describe('isValidCardNumber', () => {
    test('should validate Visa card', () => {
      expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
    });
    test('should reject invalid card', () => {
      expect(isValidCardNumber('1234 5678 9012 3456')).toBe(false);
    });
    test('should handle short cards', () => {
      expect(isValidCardNumber('411111111111')).toBe(false);
    });
  });

  describe('getCardType', () => {
    test('should detect Visa', () => {
      expect(getCardType('4111111111111111')).toBe('VISA');
    });
    test('should detect MasterCard', () => {
      expect(getCardType('5500000000000004')).toBe('MASTERCARD');
    });
    test('should detect AmEx', () => {
      expect(getCardType('370000000000002')).toBe('AMEX');
    });
  });

  describe('isValidCVV', () => {
    test('should validate 3-digit CVV', () => {
      expect(isValidCVV('123', 'VISA')).toBe(true);
    });
    test('should validate 4-digit for AmEx', () => {
      expect(isValidCVV('1234', 'AMEX')).toBe(true);
    });
    test('should reject wrong length', () => {
      expect(isValidCVV('12', 'VISA')).toBe(false);
    });
  });

  describe('isValidExpirationDate', () => {
    test('should validate future date', () => {
      const futureYear = new Date().getFullYear() + 2;
      expect(isValidExpirationDate(12, futureYear)).toBe(true);
    });
    test('should reject past date', () => {
      expect(isValidExpirationDate(1, 2020)).toBe(false);
    });
  });

  describe('formatCardNumber', () => {
    test('should format card', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    });
  });

  describe('maskCardNumber', () => {
    test('should mask card', () => {
      const masked = maskCardNumber('4111111111111111');
      expect(masked).toContain('1111');
      expect(masked).toContain('*');
    });
  });

  describe('isValidCardholderName', () => {
    test('should validate proper name', () => {
      expect(isValidCardholderName('John Doe')).toBe(true);
    });
    test('should reject single name', () => {
      expect(isValidCardholderName('John')).toBe(false);
    });
  });

  describe('validateCardInfo', () => {
    test('should validate all fields', () => {
      const futureYear = new Date().getFullYear() + 2;
      const result = validateCardInfo('4111111111111111', 'John Doe', 12, futureYear, '123');
      expect(result.isValid).toBe(true);
    });
    test('should reject invalid card', () => {
      const futureYear = new Date().getFullYear() + 2;
      const result = validateCardInfo('1111111111111111', 'John Doe', 12, futureYear, '123');
      expect(result.isValid).toBe(false);
    });
  });
});
