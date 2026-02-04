import {
  productsApi,
  transactionsApi,
  customersApi,
  deliveriesApi,
  authApi,
} from '@/infrastructure/api/techHavenApiClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('techHavenApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (global.fetch as jest.Mock).mockReset();
  });

  describe('productsApi', () => {
    it('should have getAll method', () => {
      expect(productsApi.getAll).toBeDefined();
      expect(typeof productsApi.getAll).toBe('function');
    });

    it('should have getById method', () => {
      expect(productsApi.getById).toBeDefined();
      expect(typeof productsApi.getById).toBe('function');
    });

    it('should have search method', () => {
      expect(productsApi.search).toBeDefined();
      expect(typeof productsApi.search).toBe('function');
    });

    it('should call getAll and return products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1', price: 100, stock: 10, discount: 0 }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await productsApi.getAll();
      expect(result).toEqual(mockProducts);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should call getById with product id', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 100, stock: 10, discount: 0 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await productsApi.getById('1');
      expect(result).toEqual(mockProduct);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/1'),
        expect.any(Object)
      );
    });

    it('should call search with query', async () => {
      const mockResults = [{ id: '1', name: 'Product 1', price: 100, stock: 10, discount: 0 }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const result = await productsApi.search('Product');
      expect(result).toEqual(mockResults);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/search'),
        expect.any(Object)
      );
    });
  });

  describe('transactionsApi', () => {
    it('should have getAll method', () => {
      expect(transactionsApi.getAll).toBeDefined();
      expect(typeof transactionsApi.getAll).toBe('function');
    });

    it('should have getById method', () => {
      expect(transactionsApi.getById).toBeDefined();
      expect(typeof transactionsApi.getById).toBe('function');
    });

    it('should have create method', () => {
      expect(transactionsApi.create).toBeDefined();
      expect(typeof transactionsApi.create).toBe('function');
    });

    it('should have processPayment method', () => {
      expect(transactionsApi.processPayment).toBeDefined();
      expect(typeof transactionsApi.processPayment).toBe('function');
    });

    it('should call create with transaction data', async () => {
      const newTransaction = { id: '1', customerId: 'user1', amount: 100 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => newTransaction,
      });

      const transactionData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerAddress: '123 Main St',
        items: [],
        deliveryInfo: {} as any,
      };

      const result = await transactionsApi.create(transactionData);
      expect(result).toEqual(newTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should call processPayment with transaction id and payment data', async () => {
      const updatedTransaction = { id: '1', customerId: 'user1', status: 'APPROVED' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTransaction,
      });

      const paymentData = {
        cardNumber: '1234567890123456',
        expirationMonth: '12',
        expirationYear: 2025,
        cvv: '123',
        cardholderName: 'John Doe',
      };

      const result = await transactionsApi.processPayment('1', paymentData);
      expect(result).toEqual(updatedTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions/1/process-payment'),
        expect.any(Object)
      );
    });
  });

  describe('customersApi', () => {
    it('should have getAll method', () => {
      expect(customersApi.getAll).toBeDefined();
      expect(typeof customersApi.getAll).toBe('function');
    });

    it('should have getById method', () => {
      expect(customersApi.getById).toBeDefined();
      expect(typeof customersApi.getById).toBe('function');
    });

    it('should have create method', () => {
      expect(customersApi.create).toBeDefined();
      expect(typeof customersApi.create).toBe('function');
    });
  });

  describe('deliveriesApi', () => {
    it('should have getAll method', () => {
      expect(deliveriesApi.getAll).toBeDefined();
      expect(typeof deliveriesApi.getAll).toBe('function');
    });

    it('should have getByTransactionId method', () => {
      expect(deliveriesApi.getByTransactionId).toBeDefined();
      expect(typeof deliveriesApi.getByTransactionId).toBe('function');
    });

    it('should call getByTransactionId with transaction id', async () => {
      const mockDeliveries = [
        {
          id: '1',
          transactionId: 'tx1',
          status: 'PENDING',
          estimatedDate: '2026-02-10',
          address: '123 Main St',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeliveries,
      });

      const result = await deliveriesApi.getByTransactionId('tx1');
      expect(result).toEqual(mockDeliveries);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/deliveries'),
        expect.any(Object)
      );
    });
  });

  describe('authApi', () => {
    it('should have login method', () => {
      expect(authApi.login).toBeDefined();
      expect(typeof authApi.login).toBe('function');
    });

    it('should have register method', () => {
      expect(authApi.register).toBeDefined();
      expect(typeof authApi.register).toBe('function');
    });

    it('should call login with email and password', async () => {
      const loginResponse = {
        token: 'token123',
        email: 'user@example.com',
        role: 'CUSTOMER' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => loginResponse,
      });

      const result = await authApi.login({ email: 'user@example.com', password: 'password123' });
      expect(result).toEqual(loginResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.any(Object)
      );
    });

    it('should call register with user data', async () => {
      const registerResponse = {
        token: 'token123',
        email: 'newuser@example.com',
        role: 'CUSTOMER' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => registerResponse,
      });

      const result = await authApi.register({
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });

      expect(result).toEqual(registerResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.any(Object)
      );
    });
  });
});
