import {
  authApi,
  CreateTransactionInputDto,
  customersApi,
  deliveriesApi,
  DeliveryDTO,
  ProcessPaymentDto,
  ProductDTO,
  productsApi,
  TransactionDTO,
  transactionsApi,
} from "@/infrastructure/api/techHavenApiClient";

/**
 * Product Repository with request deduplication and caching
 * Prevents multiple identical requests from being made simultaneously
 */
class ProductRepositoryWithCache {
  private static instance: ProductRepositoryWithCache;
  private readonly cache: Map<string, ProductDTO[]> = new Map();
  private readonly pendingRequests: Map<string, Promise<ProductDTO[]>> =
    new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly cacheTimestamps: Map<string, number> = new Map();

  static getInstance(): ProductRepositoryWithCache {
    if (!ProductRepositoryWithCache.instance) {
      ProductRepositoryWithCache.instance = new ProductRepositoryWithCache();
    }
    return ProductRepositoryWithCache.instance;
  }

  private isCacheValid(key: string): boolean {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getAll(): Promise<ProductDTO[]> {
    const cacheKey = "all_products";

    // Return cached data if valid
    if (this.isCacheValid(cacheKey) && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request and store the promise to deduplicate concurrent requests
    const request = productsApi.getAll();
    this.pendingRequests.set(cacheKey, request);

    try {
      const data = await request;
      this.cache.set(cacheKey, data);
      this.cacheTimestamps.set(cacheKey, Date.now());
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getById(id: string): Promise<ProductDTO> {
    const cacheKey = `product_${id}`;

    // Return cached data if valid
    if (this.isCacheValid(cacheKey) && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      const result = await this.pendingRequests.get(cacheKey)!;
      return result[0];
    }

    // Make the request
    const request = productsApi
      .getById(id)
      .then((data) => [data] as unknown as ProductDTO[]);
    this.pendingRequests.set(cacheKey, request);

    try {
      const data = await request;
      this.cache.set(cacheKey, data);
      this.cacheTimestamps.set(cacheKey, Date.now());
      return data[0];
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async search(query: string): Promise<ProductDTO[]> {
    const cacheKey = `search_${query}`;

    // Return cached data if valid
    if (this.isCacheValid(cacheKey) && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request
    const request = productsApi.search(query);
    this.pendingRequests.set(cacheKey, request);

    try {
      const data = await request;
      this.cache.set(cacheKey, data);
      this.cacheTimestamps.set(cacheKey, Date.now());
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
}

/**
 * Tech Haven API Product Repository Adapter
 * Implements the ProductRepository port with caching and deduplication
 */
export class TechHavenApiProductRepository {
  private readonly cacheManager = ProductRepositoryWithCache.getInstance();

  async getAll(): Promise<ProductDTO[]> {
    return this.cacheManager.getAll();
  }

  async getById(id: string): Promise<ProductDTO> {
    return this.cacheManager.getById(id);
  }

  async search(query: string): Promise<ProductDTO[]> {
    return this.cacheManager.search(query);
  }
}

/**
 * Tech Haven API Transaction Repository Adapter
 * Implements the TransactionRepository port
 */
export class TechHavenApiTransactionRepository {
  async getAll(): Promise<TransactionDTO[]> {
    return transactionsApi.getAll();
  }

  async getById(id: string): Promise<TransactionDTO> {
    return transactionsApi.getById(id);
  }

  async create(data: CreateTransactionInputDto): Promise<TransactionDTO> {
    return transactionsApi.create(data);
  }

  async processPayment(
    id: string,
    paymentData: ProcessPaymentDto,
  ): Promise<TransactionDTO> {
    return transactionsApi.processPayment(id, paymentData);
  }
}

/**
 * Tech Haven API Customer Repository Adapter
 * Implements the CustomerRepository port
 */
export class TechHavenApiCustomerRepository {
  async getAll() {
    return customersApi.getAll();
  }

  async getById(id: string) {
    return customersApi.getById(id);
  }

  async create(data: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  }) {
    return customersApi.create(data);
  }
}

/**
 * Tech Haven API Delivery Repository Adapter
 * Implements the DeliveryRepository port
 */
export class TechHavenApiDeliveryRepository {
  async getAll(): Promise<DeliveryDTO[]> {
    return deliveriesApi.getAll();
  }

  async getByTransactionId(transactionId: string): Promise<DeliveryDTO[]> {
    return deliveriesApi.getByTransactionId(transactionId);
  }
}

/**
 * Tech Haven API Auth Repository Adapter
 * Implements the AuthRepository port
 */
export class TechHavenApiAuthRepository {
  async register(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      updatedAt: Date;
    };
    token: string;
  }> {
    const { authApi } = await import("@/infrastructure/api/techHavenApiClient");
    const response = await authApi.register({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        createdAt: new Date(response.user.createdAt),
        updatedAt: new Date(response.user.updatedAt),
      },
      token: response.token,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role?: "ADMIN" | "CUSTOMER" | "USER";
      createdAt: Date;
      updatedAt: Date;
    };
    token: string;
  }> {
    const response = await authApi.login({ email, password });

    const [firstName, lastName] =
      email.split("@")[0].split(".").length > 1
        ? email.split("@")[0].split(".")
        : [email.split("@")[0], "User"];

    return {
      user: {
        id: `user-${Date.now()}`, // Generate ID from response if available
        email: response.email,
        firstName: firstName || "User",
        lastName: lastName || "",
        role: response.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: response.token,
    };
  }
}
