import { renderHook, act } from '@testing-library/react';
import {
  useProducts,
  useTransactions,
  useDeliveries,
} from '@/infrastructure/hooks/useTechHavenApi';
import {
  TechHavenApiProductRepository,
  TechHavenApiTransactionRepository,
  TechHavenApiDeliveryRepository,
} from '@/infrastructure/adapters/TechHavenApiRepositories';

// Mock the repositories - must be outside describe and prefixed with mock for hoisting if needed,
// but here we define them inside the factory and we'll access them via the imported class.
jest.mock('@/infrastructure/adapters/TechHavenApiRepositories', () => {
  const mockProductRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
  };
  const mockTransactionRepo = {
    getAll: jest.fn(),
    create: jest.fn(),
    processPayment: jest.fn(),
  };
  const mockDeliveryRepo = {
    getAll: jest.fn(),
    getByTransactionId: jest.fn(),
  };

  return {
    TechHavenApiProductRepository: {
      getInstance: () => mockProductRepo,
    },
    TechHavenApiTransactionRepository: {
      getInstance: () => mockTransactionRepo,
    },
    TechHavenApiDeliveryRepository: {
      getInstance: () => mockDeliveryRepo,
    },
  };
});

describe('useTechHavenApi hooks', () => {
  const mockProductRepo = TechHavenApiProductRepository.getInstance();
  const mockTransactionRepo = TechHavenApiTransactionRepository.getInstance();
  const mockDeliveryRepo = TechHavenApiDeliveryRepository.getInstance();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch products successfully', async () => {
      const mockData = [{ id: '1', name: 'Product 1' }];
      (mockProductRepo.getAll as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts());

      await act(async () => {
        await result.current.fetchProducts();
      });

      expect(result.current.products).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle error when fetching products', async () => {
      const errorMessage = 'Failed to fetch products';
      (mockProductRepo.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProducts());

      await act(async () => {
        await result.current.fetchProducts();
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle non-Error exception when fetching products', async () => {
      (mockProductRepo.getAll as jest.Mock).mockRejectedValue('String error');

      const { result } = renderHook(() => useProducts());

      await act(async () => {
        await result.current.fetchProducts();
      });

      expect(result.current.error).toBe('Failed to fetch products');
    });

    it('should fetch product by id successfully', async () => {
      const mockData = { id: '1', name: 'Product 1' };
      (mockProductRepo.getById as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts());

      let product;
      await act(async () => {
        product = await result.current.fetchProductById('1');
      });

      expect(product).toEqual(mockData);
      expect(mockProductRepo.getById).toHaveBeenCalledWith('1');
    });

    it('should handle error when fetching product by id', async () => {
      const errMsg = 'Failed';
      (mockProductRepo.getById as jest.Mock).mockRejectedValue(new Error(errMsg));

      const { result } = renderHook(() => useProducts());

      let product;
      await act(async () => {
        product = await result.current.fetchProductById('1');
      });

      expect(product).toBeNull();
      expect(result.current.error).toBe(errMsg);
    });
  });

  describe('useTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockData = [{ id: '1', total: 100 }];
      (mockTransactionRepo.getAll as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useTransactions());

      await act(async () => {
        await result.current.fetchTransactions();
      });

      expect(result.current.transactions).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle error when fetching transactions', async () => {
      (mockTransactionRepo.getAll as jest.Mock).mockRejectedValue(new Error('Err'));
      const { result } = renderHook(() => useTransactions());
      await act(async () => {
        await result.current.fetchTransactions();
      });
      expect(result.current.error).toBe('Err');
    });

    it('should create transaction successfully', async () => {
      const mockResult = { id: 'new-id' };
      (mockTransactionRepo.create as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useTransactions());

      let created;
      await act(async () => {
        created = await result.current.createTransaction({ items: [] } as any);
      });

      expect(created).toEqual(mockResult);
      expect(mockTransactionRepo.create).toHaveBeenCalled();
    });

    it('should handle error when creating transaction', async () => {
      (mockTransactionRepo.create as jest.Mock).mockRejectedValue(new Error('Failed Create'));
      const { result } = renderHook(() => useTransactions());
      let created;
      await act(async () => {
        created = await result.current.createTransaction({} as any);
      });
      expect(created).toBeNull();
      expect(result.current.error).toBe('Failed Create');
    });

    it('should process payment successfully', async () => {
      const mockResult = { success: true };
      (mockTransactionRepo.processPayment as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useTransactions());

      let paymentResult;
      await act(async () => {
        paymentResult = await result.current.processPayment('1', { cardNumber: '123' } as any);
      });

      expect(paymentResult).toEqual(mockResult);
      expect(mockTransactionRepo.processPayment).toHaveBeenCalledWith('1', { cardNumber: '123' });
    });

    it('should handle error in processPayment', async () => {
      (mockTransactionRepo.processPayment as jest.Mock).mockRejectedValue(
        new Error('Payment Failed')
      );

      const { result } = renderHook(() => useTransactions());

      let paymentResult;
      await act(async () => {
        paymentResult = await result.current.processPayment('1', {} as any);
      });

      expect(paymentResult).toBeNull();
      expect(result.current.error).toBe('Payment Failed');
    });
  });

  describe('useDeliveries', () => {
    it('should fetch deliveries successfully', async () => {
      const mockData = [{ id: 'd1' }];
      (mockDeliveryRepo.getAll as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useDeliveries());

      await act(async () => {
        await result.current.fetchDeliveries();
      });

      expect(result.current.deliveries).toEqual(mockData);
    });

    it('should handle error when fetching deliveries', async () => {
      (mockDeliveryRepo.getAll as jest.Mock).mockRejectedValue(new Error('Fail'));
      const { result } = renderHook(() => useDeliveries());
      await act(async () => {
        await result.current.fetchDeliveries();
      });
      expect(result.current.error).toBe('Fail');
    });

    it('should fetch deliveries by transaction successfully', async () => {
      const mockData = [{ id: 'd1' }];
      (mockDeliveryRepo.getByTransactionId as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useDeliveries());

      let deliveries;
      await act(async () => {
        deliveries = await result.current.fetchDeliveriesByTransaction('t1');
      });

      expect(deliveries).toEqual(mockData);
      expect(mockDeliveryRepo.getByTransactionId).toHaveBeenCalledWith('t1');
    });

    it('should handle error in fetchDeliveriesByTransaction', async () => {
      (mockDeliveryRepo.getByTransactionId as jest.Mock).mockRejectedValue(
        new Error('Fetch failed')
      );

      const { result } = renderHook(() => useDeliveries());

      let deliveries;
      await act(async () => {
        deliveries = await result.current.fetchDeliveriesByTransaction('t1');
      });

      expect(deliveries).toBeNull();
      expect(result.current.error).toBe('Fetch failed');
    });
  });
});
