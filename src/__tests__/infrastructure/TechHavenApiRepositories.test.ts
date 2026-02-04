import {
  TechHavenApiProductRepository,
  TechHavenApiTransactionRepository,
  TechHavenApiDeliveryRepository,
  TechHavenApiCustomerRepository,
  TechHavenApiAuthRepository,
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

    it('should get all products and use cache', async () => {
      const mockProducts = [{ id: '1', name: 'P1' } as any];
      (techHavenApiClient.productsApi.getAll as jest.Mock).mockResolvedValue(mockProducts);
      const repo = TechHavenApiProductRepository.getInstance();
      (repo as any).cacheManager.cache.clear();
      (repo as any).cacheManager.cacheTimestamps.clear();

      await repo.getAll();
      const result = await repo.getAll();
      expect(result).toEqual(mockProducts);
      expect(techHavenApiClient.productsApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should deduplicate concurrent getAll requests', async () => {
      let resolvePromise: any;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      (techHavenApiClient.productsApi.getAll as jest.Mock).mockReturnValue(delayedPromise);
      const repo = TechHavenApiProductRepository.getInstance();
      (repo as any).cacheManager.cache.clear();
      (repo as any).cacheManager.pendingRequests.clear();

      const call1 = repo.getAll();
      const call2 = repo.getAll();
      resolvePromise([{ id: '1' }]);
      await Promise.all([call1, call2]);
      expect(techHavenApiClient.productsApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should get product by id and use cache', async () => {
      const mockProduct = { id: '1', name: 'P1' } as any;
      (techHavenApiClient.productsApi.getById as jest.Mock).mockResolvedValue(mockProduct);
      const repo = TechHavenApiProductRepository.getInstance();
      (repo as any).cacheManager.cache.clear();

      await repo.getById('1');
      const result = await repo.getById('1');
      expect(result).toEqual(mockProduct);
      expect(techHavenApiClient.productsApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should search products with caching', async () => {
      const mockProducts = [{ id: 's1' } as any];
      (techHavenApiClient.productsApi.search as jest.Mock).mockResolvedValue(mockProducts);
      const repo = TechHavenApiProductRepository.getInstance();
      (repo as any).cacheManager.cache.clear();

      await repo.search('test');
      await repo.search('test');
      expect(techHavenApiClient.productsApi.search).toHaveBeenCalledTimes(1);
    });
  });

  describe('TechHavenApiTransactionRepository', () => {
    it('should return singleton instance', () => {
      const i1 = TechHavenApiTransactionRepository.getInstance();
      const i2 = TechHavenApiTransactionRepository.getInstance();
      expect(i1).toBe(i2);
    });

    it('should get all with deduplication', async () => {
      (techHavenApiClient.transactionsApi.getAll as jest.Mock).mockResolvedValue([]);
      const repo = TechHavenApiTransactionRepository.getInstance();
      (repo as any).cacheManager.pendingRequests.clear();
      await Promise.all([repo.getAll(), repo.getAll()]);
      expect(techHavenApiClient.transactionsApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should get by id', async () => {
      (techHavenApiClient.transactionsApi.getById as jest.Mock).mockResolvedValue({ id: '1' });
      const repo = TechHavenApiTransactionRepository.getInstance();
      const res = await repo.getById('1');
      expect(res.id).toBe('1');
    });

    it('should create and process payment', async () => {
      (techHavenApiClient.transactionsApi.create as jest.Mock).mockResolvedValue({ id: '1' });
      (techHavenApiClient.transactionsApi.processPayment as jest.Mock).mockResolvedValue({
        id: '1',
        status: 'paid',
      });
      const repo = TechHavenApiTransactionRepository.getInstance();
      await repo.create({} as any);
      const res = await repo.processPayment('1', {} as any);
      expect(res.status).toBe('paid');
    });
  });

  describe('TechHavenApiCustomerRepository', () => {
    it('should return singleton instance', () => {
      const i1 = TechHavenApiCustomerRepository.getInstance();
      const i2 = TechHavenApiCustomerRepository.getInstance();
      expect(i1).toBe(i2);
    });

    it('should get all and getById with deduplication', async () => {
      (techHavenApiClient.customersApi.getAll as jest.Mock).mockResolvedValue([]);
      (techHavenApiClient.customersApi.getById as jest.Mock).mockResolvedValue({ id: 'c1' });
      const repo = TechHavenApiCustomerRepository.getInstance();
      (repo as any).cacheManager.pendingRequests.clear();

      await Promise.all([repo.getAll(), repo.getAll()]);
      await Promise.all([repo.getById('c1'), repo.getById('c1')]);

      expect(techHavenApiClient.customersApi.getAll).toHaveBeenCalledTimes(1);
      expect(techHavenApiClient.customersApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should create customer', async () => {
      (techHavenApiClient.customersApi.create as jest.Mock).mockResolvedValue({ id: 'c1' });
      const repo = TechHavenApiCustomerRepository.getInstance();
      const res = await repo.create({ name: 'J' } as any);
      expect(res.id).toBe('c1');
    });
  });

  describe('TechHavenApiDeliveryRepository', () => {
    it('should return singleton instance', () => {
      const i1 = TechHavenApiDeliveryRepository.getInstance();
      const i2 = TechHavenApiDeliveryRepository.getInstance();
      expect(i1).toBe(i2);
    });

    it('should get all and getByTransactionId with deduplication', async () => {
      (techHavenApiClient.deliveriesApi.getAll as jest.Mock).mockResolvedValue([]);
      (techHavenApiClient.deliveriesApi.getByTransactionId as jest.Mock).mockResolvedValue([]);
      const repo = TechHavenApiDeliveryRepository.getInstance();
      (repo as any).cacheManager.pendingRequests.clear();

      await Promise.all([repo.getAll(), repo.getAll()]);
      await Promise.all([repo.getByTransactionId('t1'), repo.getByTransactionId('t1')]);

      expect(techHavenApiClient.deliveriesApi.getAll).toHaveBeenCalledTimes(1);
      expect(techHavenApiClient.deliveriesApi.getByTransactionId).toHaveBeenCalledTimes(1);
    });
  });

  describe('TechHavenApiAuthRepository', () => {
    it('should return singleton instance', () => {
      const i1 = TechHavenApiAuthRepository.getInstance();
      const i2 = TechHavenApiAuthRepository.getInstance();
      expect(i1).toBe(i2);
    });

    it('should login and handle name split (dot case)', async () => {
      (techHavenApiClient.authApi.login as jest.Mock).mockResolvedValue({
        email: 'john.doe@example.com',
        token: 't',
      });
      const repo = TechHavenApiAuthRepository.getInstance();
      const res = await repo.login('john.doe@example.com', 'p');
      expect(res.user.firstName).toBe('john');
      expect(res.user.lastName).toBe('doe');
    });

    it('should login and handle name split (no dot case)', async () => {
      (techHavenApiClient.authApi.login as jest.Mock).mockResolvedValue({
        email: 'johnny@example.com',
        token: 't',
      });
      const repo = TechHavenApiAuthRepository.getInstance();
      const res = await repo.login('johnny@example.com', 'p');
      expect(res.user.firstName).toBe('johnny');
      expect(res.user.lastName).toBe('User');
    });

    it('should register user', async () => {
      (techHavenApiClient.authApi.register as jest.Mock).mockResolvedValue({
        user: {
          id: 'u1',
          email: 'e',
          firstName: 'F',
          lastName: 'L',
          createdAt: '2023',
          updatedAt: '2023',
        },
        token: 't',
      });
      const repo = TechHavenApiAuthRepository.getInstance();
      const res = await repo.register({} as any);
      expect(res.user.id).toBe('u1');
    });
  });
});
