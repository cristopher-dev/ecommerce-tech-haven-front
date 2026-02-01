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

  private constructor() {}

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
  private static instance: TechHavenApiProductRepository;
  private readonly cacheManager = ProductRepositoryWithCache.getInstance();

  private constructor() {}

  static getInstance(): TechHavenApiProductRepository {
    if (!TechHavenApiProductRepository.instance) {
      TechHavenApiProductRepository.instance =
        new TechHavenApiProductRepository();
    }
    return TechHavenApiProductRepository.instance;
  }

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
 * Transaction Repository with request deduplication
 * Prevents multiple identical requests from being made simultaneously
 */
class TransactionRepositoryWithCache {
  private static instance: TransactionRepositoryWithCache;
  private readonly pendingRequests: Map<string, Promise<TransactionDTO | TransactionDTO[]>> = new Map();

  private constructor() {}

  static getInstance(): TransactionRepositoryWithCache {
    if (!TransactionRepositoryWithCache.instance) {
      TransactionRepositoryWithCache.instance =
        new TransactionRepositoryWithCache();
    }
    return TransactionRepositoryWithCache.instance;
  }

  async getAll(): Promise<TransactionDTO[]> {
    const cacheKey = "all_transactions";

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request and store the promise to deduplicate concurrent requests
    const request = transactionsApi.getAll();
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getById(id: string): Promise<TransactionDTO> {
    const cacheKey = `transaction_${id}`;

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request
    const request = transactionsApi.getById(id);
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async create(data: CreateTransactionInputDto): Promise<TransactionDTO> {
    const request = transactionsApi.create(data);
    return request;
  }

  async processPayment(
    id: string,
    paymentData: ProcessPaymentDto,
  ): Promise<TransactionDTO> {
    const request = transactionsApi.processPayment(id, paymentData);
    return request;
  }
}

/**
 * Tech Haven API Transaction Repository Adapter
 * Implements the TransactionRepository port with deduplication
 */
export class TechHavenApiTransactionRepository {
  private static instance: TechHavenApiTransactionRepository;
  private readonly cacheManager =
    TransactionRepositoryWithCache.getInstance();

  private constructor() {}

  static getInstance(): TechHavenApiTransactionRepository {
    if (!TechHavenApiTransactionRepository.instance) {
      TechHavenApiTransactionRepository.instance =
        new TechHavenApiTransactionRepository();
    }
    return TechHavenApiTransactionRepository.instance;
  }

  async getAll(): Promise<TransactionDTO[]> {
    return this.cacheManager.getAll();
  }

  async getById(id: string): Promise<TransactionDTO> {
    return this.cacheManager.getById(id);
  }

  async create(data: CreateTransactionInputDto): Promise<TransactionDTO> {
    return this.cacheManager.create(data);
  }

  async processPayment(
    id: string,
    paymentData: ProcessPaymentDto,
  ): Promise<TransactionDTO> {
    return this.cacheManager.processPayment(id, paymentData);
  }
}

/**
 * Customer Repository with request deduplication
 * Prevents multiple identical requests from being made simultaneously
 */
class CustomerRepositoryWithCache {
  private static instance: CustomerRepositoryWithCache;
  private readonly pendingRequests: Map<string, Promise<unknown>> = new Map();

  static getInstance(): CustomerRepositoryWithCache {
    if (!CustomerRepositoryWithCache.instance) {
      CustomerRepositoryWithCache.instance = new CustomerRepositoryWithCache();
    }
    return CustomerRepositoryWithCache.instance;
  }

  async getAll() {
    const cacheKey = "all_customers";

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    const request = customersApi.getAll();
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getById(id: string) {
    const cacheKey = `customer_${id}`;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    const request = customersApi.getById(id);
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
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
 * Tech Haven API Customer Repository Adapter
 * Implements the CustomerRepository port with deduplication
 */
export class TechHavenApiCustomerRepository {
  private static instance: TechHavenApiCustomerRepository;
  private readonly cacheManager = CustomerRepositoryWithCache.getInstance();

  private constructor() {}

  static getInstance(): TechHavenApiCustomerRepository {
    if (!TechHavenApiCustomerRepository.instance) {
      TechHavenApiCustomerRepository.instance =
        new TechHavenApiCustomerRepository();
    }
    return TechHavenApiCustomerRepository.instance;
  }

  async getAll() {
    return this.cacheManager.getAll();
  }

  async getById(id: string) {
    return this.cacheManager.getById(id);
  }

  async create(data: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  }) {
    return this.cacheManager.create(data);
  }
}

/**
 * Delivery Repository with request deduplication
 * Prevents multiple identical requests from being made simultaneously
 */
class DeliveryRepositoryWithCache {
  private static instance: DeliveryRepositoryWithCache;
  private readonly pendingRequests: Map<string, Promise<DeliveryDTO | DeliveryDTO[]>> = new Map();

  private constructor() {}

  static getInstance(): DeliveryRepositoryWithCache {
    if (!DeliveryRepositoryWithCache.instance) {
      DeliveryRepositoryWithCache.instance = new DeliveryRepositoryWithCache();
    }
    return DeliveryRepositoryWithCache.instance;
  }

  async getAll(): Promise<DeliveryDTO[]> {
    const cacheKey = "all_deliveries";

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request and store the promise to deduplicate concurrent requests
    const request = deliveriesApi.getAll();
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getByTransactionId(transactionId: string): Promise<DeliveryDTO[]> {
    const cacheKey = `deliveries_${transactionId}`;

    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request
    const request = deliveriesApi.getByTransactionId(transactionId);
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
}

/**
 * Tech Haven API Delivery Repository Adapter
 * Implements the DeliveryRepository port with deduplication
 */
export class TechHavenApiDeliveryRepository {
  private static instance: TechHavenApiDeliveryRepository;
  private readonly cacheManager = DeliveryRepositoryWithCache.getInstance();

  private constructor() {}

  static getInstance(): TechHavenApiDeliveryRepository {
    if (!TechHavenApiDeliveryRepository.instance) {
      TechHavenApiDeliveryRepository.instance =
        new TechHavenApiDeliveryRepository();
    }
    return TechHavenApiDeliveryRepository.instance;
  }

  async getAll(): Promise<DeliveryDTO[]> {
    return this.cacheManager.getAll();
  }

  async getByTransactionId(transactionId: string): Promise<DeliveryDTO[]> {
    return this.cacheManager.getByTransactionId(transactionId);
  }
}

/**
 * Tech Haven API Auth Repository Adapter
 * Implements the AuthRepository port with singleton pattern
 */
export class TechHavenApiAuthRepository {
  private static instance: TechHavenApiAuthRepository;

  private constructor() {}

  static getInstance(): TechHavenApiAuthRepository {
    if (!TechHavenApiAuthRepository.instance) {
      TechHavenApiAuthRepository.instance = new TechHavenApiAuthRepository();
    }
    return TechHavenApiAuthRepository.instance;
  }

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
