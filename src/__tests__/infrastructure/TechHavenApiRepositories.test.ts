import {
  TechHavenApiProductRepository,
  TechHavenApiTransactionRepository,
  TechHavenApiDeliveryRepository,
} from '@/infrastructure/adapters/TechHavenApiRepositories';
import * as techHavenApiClient from '@/infrastructure/api/techHavenApiClient';

jest.mock('@/infrastructure/api/techHavenApiClient');

describe('TechHavenApiRepositories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TechHavenApiProductRepository', () => {
    it('should return singleton instance', () => {
      const instance1 = TechHavenApiProductRepository.getInstance();
      const instance2 = TechHavenApiProductRepository.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should get all products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          description: '',
          image: '',
          category: '',
          rating: 0,
          reviews: 0,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          description: '',
          image: '',
          category: '',
          rating: 0,
          reviews: 0,
        },
      ];

      (techHavenApiClient.productsApi.getAll as jest.Mock).mockResolvedValue(mockProducts);

      const repo = TechHavenApiProductRepository.getInstance();
      const result = await repo.getAll();

      expect(result).toEqual(mockProducts);
      expect(techHavenApiClient.productsApi.getAll).toHaveBeenCalled();
    });

    it('should get product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        price: 100,
        description: '',
        image: '',
        category: '',
        rating: 0,
        reviews: 0,
      };

      (techHavenApiClient.productsApi.getById as jest.Mock).mockResolvedValue(mockProduct);

      const repo = TechHavenApiProductRepository.getInstance();
      const result = await repo.getById('1');

      expect(result).toEqual(mockProduct);
      expect(techHavenApiClient.productsApi.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('TechHavenApiTransactionRepository', () => {
    it('should return singleton instance', () => {
      const instance1 = TechHavenApiTransactionRepository.getInstance();
      const instance2 = TechHavenApiTransactionRepository.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should get all transactions', async () => {
      const mockTransactions = [
        { id: '1', customerId: 'user1', subtotal: 100, tax: 10, total: 110, items: [] },
        { id: '2', customerId: 'user2', subtotal: 200, tax: 20, total: 220, items: [] },
      ];

      (techHavenApiClient.transactionsApi.getAll as jest.Mock).mockResolvedValue(mockTransactions);

      const repo = TechHavenApiTransactionRepository.getInstance();
      const result = await repo.getAll();

      expect(result).toEqual(mockTransactions);
      expect(techHavenApiClient.transactionsApi.getAll).toHaveBeenCalled();
    });

    it('should get transaction by id', async () => {
      const mockTransaction = {
        id: '1',
        customerId: 'user1',
        subtotal: 100,
        tax: 10,
        total: 110,
        items: [],
      };

      (techHavenApiClient.transactionsApi.getById as jest.Mock).mockResolvedValue(mockTransaction);

      const repo = TechHavenApiTransactionRepository.getInstance();
      const result = await repo.getById('1');

      expect(result).toEqual(mockTransaction);
      expect(techHavenApiClient.transactionsApi.getById).toHaveBeenCalledWith('1');
    });

    it('should create transaction', async () => {
      const newTransaction = {
        id: '1',
        customerId: 'user1',
        subtotal: 100,
        tax: 10,
        total: 110,
        items: [],
      };

      (techHavenApiClient.transactionsApi.create as jest.Mock).mockResolvedValue(newTransaction);

      const repo = TechHavenApiTransactionRepository.getInstance();
      const dto = { customerId: 'user1', items: [] } as any;
      const result = await repo.create(dto);

      expect(result).toEqual(newTransaction);
      expect(techHavenApiClient.transactionsApi.create).toHaveBeenCalledWith(dto);
    });

    it('should handle transaction API errors', async () => {
      const error = new Error('Transaction API Error');

      (techHavenApiClient.transactionsApi.getAll as jest.Mock).mockRejectedValue(error);

      const repo = TechHavenApiTransactionRepository.getInstance();

      await expect(repo.getAll()).rejects.toThrow('Transaction API Error');
    });
  });

  describe('TechHavenApiDeliveryRepository', () => {
    it('should return singleton instance', () => {
      const instance1 = TechHavenApiDeliveryRepository.getInstance();
      const instance2 = TechHavenApiDeliveryRepository.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should get all deliveries', async () => {
      const mockDeliveries = [
        { id: '1', name: 'Standard', description: 'Standard shipping', cost: 10 },
        { id: '2', name: 'Express', description: 'Express shipping', cost: 25 },
      ];

      (techHavenApiClient.deliveriesApi.getAll as jest.Mock).mockResolvedValue(mockDeliveries);

      const repo = TechHavenApiDeliveryRepository.getInstance();
      const result = await repo.getAll();

      expect(result).toEqual(mockDeliveries);
      expect(techHavenApiClient.deliveriesApi.getAll).toHaveBeenCalled();
    });

    it('should get deliveries by transaction id', async () => {
      const mockDeliveries = [
        { id: '1', name: 'Standard', description: 'Standard shipping', cost: 10 },
      ];

      (techHavenApiClient.deliveriesApi.getByTransactionId as jest.Mock).mockResolvedValue(
        mockDeliveries
      );

      const repo = TechHavenApiDeliveryRepository.getInstance();
      const result = await repo.getByTransactionId('tx1');

      expect(result).toEqual(mockDeliveries);
      expect(techHavenApiClient.deliveriesApi.getByTransactionId).toHaveBeenCalledWith('tx1');
    });

    it('should handle delivery API errors', async () => {
      const error = new Error('Delivery API Error');

      (techHavenApiClient.deliveriesApi.getAll as jest.Mock).mockRejectedValue(error);

      const repo = TechHavenApiDeliveryRepository.getInstance();

      await expect(repo.getAll()).rejects.toThrow('Delivery API Error');
    });
  });
});
