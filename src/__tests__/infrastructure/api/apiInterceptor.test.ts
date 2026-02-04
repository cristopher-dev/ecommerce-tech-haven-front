import { getAuthToken, withAuthInterceptor } from '@/infrastructure/api/apiInterceptor';

describe('apiInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getAuthToken', () => {
    it('should return null when no token in localStorage', () => {
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('should return token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token-123');
      const token = getAuthToken();
      expect(token).toBe('test-token-123');
    });

    it('should return empty string when token is empty', () => {
      localStorage.setItem('authToken', '');
      const token = getAuthToken();
      expect(token).toBe('');
    });
  });

  describe('withAuthInterceptor', () => {
    it('should return original options when no token available', () => {
      const options = { method: 'GET' };
      const result = withAuthInterceptor(options, '/api/products');

      expect(result).toEqual(options);
    });

    it('should add Authorization header when token available', () => {
      localStorage.setItem('authToken', 'test-token');
      const options = { method: 'GET' };
      const result = withAuthInterceptor(options, '/api/products');

      expect(result.headers).toBeDefined();
      expect((result.headers as any).Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header for login endpoint', () => {
      localStorage.setItem('authToken', 'test-token');
      const options = { method: 'POST' };
      const result = withAuthInterceptor(options, '/auth/login');

      expect((result.headers as any)?.Authorization).toBeUndefined();
    });

    it('should not add Authorization header for register endpoint', () => {
      localStorage.setItem('authToken', 'test-token');
      const options = { method: 'POST' };
      const result = withAuthInterceptor(options, '/auth/register');

      expect((result.headers as any)?.Authorization).toBeUndefined();
    });

    it('should preserve existing headers when adding authorization', () => {
      localStorage.setItem('authToken', 'test-token');
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const result = withAuthInterceptor(options, '/api/products');

      expect((result.headers as any)['Content-Type']).toBe('application/json');
      expect((result.headers as any).Authorization).toBe('Bearer test-token');
    });

    it('should handle undefined options', () => {
      localStorage.setItem('authToken', 'test-token');
      const result = withAuthInterceptor(undefined, '/api/products');

      expect(result.headers).toBeDefined();
      expect((result.headers as any).Authorization).toBe('Bearer test-token');
    });

    it('should handle options with non-object headers', () => {
      localStorage.setItem('authToken', 'test-token');
      const options = { method: 'GET', headers: null };
      const result = withAuthInterceptor(options, '/api/products');

      expect((result.headers as any).Authorization).toBe('Bearer test-token');
    });

    it('should add token to multiple API endpoints', () => {
      localStorage.setItem('authToken', 'token-123');

      const endpoints = ['/api/products', '/api/transactions', '/api/deliveries'];
      endpoints.forEach((endpoint) => {
        const result = withAuthInterceptor({}, endpoint);
        expect((result.headers as any).Authorization).toBe('Bearer token-123');
      });
    });
  });
});
