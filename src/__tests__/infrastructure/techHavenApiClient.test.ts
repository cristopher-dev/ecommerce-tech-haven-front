/* global process */
import {
  CreateCustomerInputDto,
  CreateTransactionInputDto,
  CustomerDTO,
  customersApi,
  deliveriesApi,
  DeliveryDTO,
  ProcessPaymentDto,
  ProductDTO,
  productsApi,
  TransactionDTO,
  transactionsApi,
} from '@/infrastructure/api/techHavenApiClient';

globalThis.fetch = jest.fn();

describe('TechHaven API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VITE_TECH_HAVEN_API_URL = 'http://localhost:3000/api';
  });

  describe('productsApi', () => {
    describe('getAll', () => {
      it('should fetch all products successfully', async () => {
        const mockProducts: ProductDTO[] = [
          {
            id: '1',
            name: 'Laptop',
            description: 'High-performance laptop',
            price: 999.99,
            stock: 10,
            discount: 0,
          },
          {
            id: '2',
            name: 'Mouse',
            description: 'Wireless mouse',
            price: 29.99,
            stock: 50,
            discount: 0,
          },
        ];

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockProducts,
        });

        const result = await productsApi.getAll();

        expect(result).toEqual(mockProducts);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/products',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });

      it('should throw error when fetch fails', async () => {
        const errorMessage = 'Network error';
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: errorMessage }),
        });

        await expect(productsApi.getAll()).rejects.toThrow(errorMessage);
      });

      it('should handle JSON parse errors gracefully', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => {
            throw new Error('JSON parse error');
          },
        });

        await expect(productsApi.getAll()).rejects.toThrow('Unknown error');
      });
    });

    describe('getById', () => {
      it('should fetch a product by ID successfully', async () => {
        const mockProduct: ProductDTO = {
          id: '1',
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
          stock: 10,
          discount: 0,
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct,
        });

        const result = await productsApi.getById('1');

        expect(result).toEqual(mockProduct);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/products/1',
          expect.any(Object)
        );
      });

      it('should throw error when product not found', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Product not found' }),
        });

        await expect(productsApi.getById('999')).rejects.toThrow('Product not found');
      });

      it('should handle invalid product ID', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Invalid product ID' }),
        });

        await expect(productsApi.getById('invalid')).rejects.toThrow('Invalid product ID');
      });
    });
  });

  describe('transactionsApi', () => {
    const getMockTransaction = (): TransactionDTO => ({
      id: '1',
      transactionId: '1',
      orderId: '1',
      status: 'APPROVED',
      amount: 1999.98,
      baseFee: 0,
      deliveryFee: 10,
      subtotal: 1999.98,
      items: [],
      customer: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
      },
      deliveryInfo: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        phone: '555-1234',
      },
      delivery: {
        id: '1',
        status: 'PENDING',
        estimatedDays: 3,
        carrier: 'FedEx',
      },
      timeline: {
        createdAt: '2024-01-01T00:00:00Z',
      },
    });

    describe('getAll', () => {
      it('should fetch all transactions successfully', async () => {
        const mockTransactions: TransactionDTO[] = [getMockTransaction()];

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockTransactions,
        });

        const result = await transactionsApi.getAll();

        expect(result).toEqual(mockTransactions);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/transactions',
          expect.any(Object)
        );
      });

      it('should handle server error gracefully', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: async () => ({ message: 'Service unavailable' }),
        });

        await expect(transactionsApi.getAll()).rejects.toThrow('Service unavailable');
      });
    });

    describe('getById', () => {
      it('should fetch a transaction by ID successfully', async () => {
        const mockTransaction: TransactionDTO = getMockTransaction();

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockTransaction,
        });

        const result = await transactionsApi.getById('1');

        expect(result).toEqual(mockTransaction);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/transactions/1',
          expect.any(Object)
        );
      });

      it('should throw error when transaction not found', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Transaction not found' }),
        });

        await expect(transactionsApi.getById('999')).rejects.toThrow('Transaction not found');
      });
    });

    describe('create', () => {
      it('should create a transaction successfully', async () => {
        const createData: CreateTransactionInputDto = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerAddress: '123 Main St',
          items: [{ productId: '1', quantity: 2 }],
          deliveryInfo: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            phone: '555-1234',
          },
        };

        const mockResponse: TransactionDTO = {
          ...getMockTransaction(),
          status: 'PENDING',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await transactionsApi.create(createData);

        expect(result).toEqual(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/transactions',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(createData),
          })
        );
      });

      it('should handle validation errors when creating transaction', async () => {
        const createData: CreateTransactionInputDto = {
          customerName: '',
          customerEmail: 'invalid-email',
          customerAddress: '',
          items: [],
          deliveryInfo: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            phone: '',
          },
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Invalid transaction data' }),
        });

        await expect(transactionsApi.create(createData)).rejects.toThrow(
          'Invalid transaction data'
        );
      });

      it('should handle insufficient stock error', async () => {
        const createData: CreateTransactionInputDto = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerAddress: '123 Main St',
          items: [{ productId: '1', quantity: 1000 }],
          deliveryInfo: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            phone: '555-1234',
          },
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Insufficient stock' }),
        });

        await expect(transactionsApi.create(createData)).rejects.toThrow('Insufficient stock');
      });
    });

    describe('processPayment', () => {
      it('should process payment successfully', async () => {
        const paymentData: ProcessPaymentDto = {
          cardNumber: '4111111111111111',
          expirationMonth: '12',
          expirationYear: 2025,
          cvv: '123',
          cardholderName: 'John Doe',
        };

        const mockResponse: TransactionDTO = {
          ...getMockTransaction(),
          status: 'APPROVED',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await transactionsApi.processPayment('1', paymentData);

        expect(result).toEqual(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/transactions/1/process-payment',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(paymentData),
          })
        );
      });

      it('should handle payment failure', async () => {
        const paymentData: ProcessPaymentDto = {
          cardNumber: '4111111111111111',
          expirationMonth: '12',
          expirationYear: 2025,
          cvv: '123',
          cardholderName: 'John Doe',
        };

        const mockResponse: TransactionDTO = {
          ...getMockTransaction(),
          status: 'FAILED',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await transactionsApi.processPayment('1', paymentData);

        expect(result.status).toBe('FAILED');
      });

      it('should throw error when transaction not found for payment', async () => {
        const paymentData: ProcessPaymentDto = {
          cardNumber: '4111111111111111',
          expirationMonth: '12',
          expirationYear: 2025,
          cvv: '123',
          cardholderName: 'John Doe',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Transaction not found' }),
        });

        await expect(transactionsApi.processPayment('999', paymentData)).rejects.toThrow(
          'Transaction not found'
        );
      });
    });
  });

  describe('customersApi', () => {
    describe('getAll', () => {
      it('should fetch all customers successfully', async () => {
        const mockCustomers: CustomerDTO[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St',
            phone: '555-1234',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            address: '456 Oak Ave',
          },
        ];

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCustomers,
        });

        const result = await customersApi.getAll();

        expect(result).toEqual(mockCustomers);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/customers',
          expect.any(Object)
        );
      });

      it('should handle empty customer list', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        const result = await customersApi.getAll();

        expect(result).toEqual([]);
      });
    });

    describe('getById', () => {
      it('should fetch a customer by ID successfully', async () => {
        const mockCustomer: CustomerDTO = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          phone: '555-1234',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCustomer,
        });

        const result = await customersApi.getById('1');

        expect(result).toEqual(mockCustomer);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/customers/1',
          expect.any(Object)
        );
      });

      it('should throw error when customer not found', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Customer not found' }),
        });

        await expect(customersApi.getById('999')).rejects.toThrow('Customer not found');
      });
    });

    describe('create', () => {
      it('should create a customer successfully', async () => {
        const createData: CreateCustomerInputDto = {
          name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          phone: '555-1234',
        };

        const mockResponse: CustomerDTO = {
          id: '1',
          ...createData,
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await customersApi.create(createData);

        expect(result).toEqual(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/customers',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(createData),
          })
        );
      });

      it('should handle validation errors when creating customer', async () => {
        const createData: CreateCustomerInputDto = {
          name: '',
          email: 'invalid-email',
          address: '',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Invalid customer data' }),
        });

        await expect(customersApi.create(createData)).rejects.toThrow('Invalid customer data');
      });

      it('should handle duplicate email error', async () => {
        const createData: CreateCustomerInputDto = {
          name: 'John Doe',
          email: 'existing@example.com',
          address: '123 Main St',
        };

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: async () => ({ message: 'Email already exists' }),
        });

        await expect(customersApi.create(createData)).rejects.toThrow('Email already exists');
      });
    });
  });

  describe('deliveriesApi', () => {
    describe('getAll', () => {
      it('should fetch all deliveries successfully', async () => {
        const mockDeliveries: DeliveryDTO[] = [
          {
            id: '1',
            transactionId: '1',
            status: 'IN_TRANSIT',
            estimatedDate: '2024-01-15',
            address: '123 Main St',
          },
          {
            id: '2',
            transactionId: '2',
            status: 'DELIVERED',
            estimatedDate: '2024-01-10',
            address: '456 Oak Ave',
          },
        ];

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockDeliveries,
        });

        const result = await deliveriesApi.getAll();

        expect(result).toEqual(mockDeliveries);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/deliveries',
          expect.any(Object)
        );
      });

      it('should handle empty deliveries list', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        const result = await deliveriesApi.getAll();

        expect(result).toEqual([]);
      });
    });

    describe('getByTransactionId', () => {
      it('should fetch deliveries by transaction ID successfully', async () => {
        const mockDeliveries: DeliveryDTO[] = [
          {
            id: '1',
            transactionId: '1',
            status: 'IN_TRANSIT',
            estimatedDate: '2024-01-15',
            address: '123 Main St',
          },
        ];

        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockDeliveries,
        });

        const result = await deliveriesApi.getByTransactionId('1');

        expect(result).toEqual(mockDeliveries);
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/deliveries?transactionId=1',
          expect.any(Object)
        );
      });

      it('should return empty array when no deliveries found', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        const result = await deliveriesApi.getByTransactionId('999');

        expect(result).toEqual([]);
      });

      it('should throw error on API failure', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Internal server error' }),
        });

        await expect(deliveriesApi.getByTransactionId('1')).rejects.toThrow(
          'Internal server error'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(productsApi.getAll()).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Request timeout'));

      await expect(transactionsApi.getAll()).rejects.toThrow('Request timeout');
    });

    it('should include custom headers in requests', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await customersApi.getAll();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });
});
