import { isValidCardNumber, getCardType, isValidCVV } from '@/shared/utils/cardValidation';

describe('cardValidation utilities', () => {
  describe('isValidCardNumber', () => {
    it('should validate valid VISA card numbers', () => {
      expect(isValidCardNumber('4532015112830366')).toBe(true);
      expect(isValidCardNumber('4532 0151 1283 0366')).toBe(true);
    });

    it('should validate valid Mastercard numbers', () => {
      expect(isValidCardNumber('5555555555554444')).toBe(true);
    });

    it('should validate valid AMEX numbers', () => {
      expect(isValidCardNumber('374245455400126')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(isValidCardNumber('1234567890123456')).toBe(false);
      expect(isValidCardNumber('4532015112830367')).toBe(false);
    });

    it('should reject cards with wrong length', () => {
      expect(isValidCardNumber('123')).toBe(false);
      expect(isValidCardNumber('12345678901234567890123')).toBe(false);
    });

    it('should handle non-digit characters', () => {
      expect(isValidCardNumber('4532 0151 1283 0366')).toBe(true);
      expect(isValidCardNumber('4532-0151-1283-0366')).toBe(true);
    });
  });

  describe('getCardType', () => {
    it('should identify VISA cards', () => {
      expect(getCardType('4532015112830366')).toBe('VISA');
      expect(getCardType('4532 0151 1283 0366')).toBe('VISA');
    });

    it('should identify Mastercard cards', () => {
      expect(getCardType('5425233010103442')).toBe('MASTERCARD');
      expect(getCardType('5525233010103442')).toBe('MASTERCARD');
    });

    it('should identify AMEX cards', () => {
      expect(getCardType('374245455400126')).toBe('AMEX');
      expect(getCardType('378282246310005')).toBe('AMEX');
    });

    it('should return UNKNOWN for unrecognized cards', () => {
      expect(getCardType('1234567890123456')).toBe('UNKNOWN');
      expect(getCardType('6011111111111117')).toBe('UNKNOWN');
    });

    it('should handle non-digit characters', () => {
      expect(getCardType('4532 0151 1283 0366')).toBe('VISA');
    });
  });

  describe('isValidCVV', () => {
    it('should validate 3-digit CVV for standard cards', () => {
      expect(isValidCVV('123')).toBe(true);
      expect(isValidCVV('000')).toBe(true);
      expect(isValidCVV('999')).toBe(true);
    });

    it('should validate 4-digit CVV for AMEX cards', () => {
      expect(isValidCVV('1234', 'AMEX')).toBe(true);
      expect(isValidCVV('0000', 'AMEX')).toBe(true);
    });

    it('should reject 4-digit CVV for non-AMEX cards', () => {
      expect(isValidCVV('1234', 'VISA')).toBe(false);
      expect(isValidCVV('1234', 'MASTERCARD')).toBe(false);
    });

    it('should reject 3-digit CVV for AMEX cards', () => {
      expect(isValidCVV('123', 'AMEX')).toBe(false);
    });

    it('should handle non-digit characters', () => {
      expect(isValidCVV('1a2b3')).toBe(true);
      expect(isValidCVV('1a2b3c4d', 'AMEX')).toBe(true);
    });

    it('should handle empty CVV', () => {
      expect(isValidCVV('')).toBe(false);
    });
  });
});
