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
 * Tech Haven API Product Repository Adapter
 * Implements the ProductRepository port
 */
export class TechHavenApiProductRepository {
  async getAll(): Promise<ProductDTO[]> {
    return productsApi.getAll();
  }

  async getById(id: string): Promise<ProductDTO> {
    return productsApi.getById(id);
  }

  async search(query: string): Promise<ProductDTO[]> {
    return productsApi.search(query);
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

    // Extract email name and role from the login response
    // Format: "name@domain.com" -> firstName: "name", lastName: "domain.com"
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
