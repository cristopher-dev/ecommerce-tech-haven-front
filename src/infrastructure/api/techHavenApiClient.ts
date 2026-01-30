/**
 * Tech Haven API Client
 * Adapter for consuming the Tech Haven Payment API
 * Base URL: http://localhost:3001/api
 */

import { getApiBaseUrl } from "./getApiBaseUrl";
import { withAuthInterceptor } from "./apiInterceptor";

const API_BASE_URL = getApiBaseUrl();

// Types for API requests and responses
export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequestDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "USER";
}

export interface AuthResponseDTO {
  user: UserDTO;
  token: string;
  expiresIn: number;
}

export interface CustomerDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface CreateCustomerInputDto {
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface CardDataDto {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
}

export interface CreateTransactionInputDto {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  productId: string;
  quantity: number;
  cardData?: CardDataDto;
}

export interface TransactionDTO {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  transactionNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPaymentDto {
  wompiTransactionId?: string;
  status: "COMPLETED" | "FAILED";
  errorMessage?: string;
}

export interface DeliveryDTO {
  id: string;
  transactionId: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
  estimatedDate: string;
  address: string;
}

/**
 * Makes an API request with error handling and automatic auth token injection
 */
async function apiRequest<T>(
  endpoint: string,
  options: Record<string, unknown> = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Apply auth interceptor to automatically add token
  const enhancedOptions = withAuthInterceptor(options);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(typeof enhancedOptions.headers === "object"
        ? enhancedOptions.headers
        : {}),
    },
    ...enhancedOptions,
  } as unknown as Record<string, unknown>);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Products API
 */
export const productsApi = {
  /**
   * Get all products
   */
  async getAll(): Promise<ProductDTO[]> {
    return apiRequest<ProductDTO[]>("/products");
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<ProductDTO> {
    return apiRequest<ProductDTO>(`/products/${id}`);
  },
};

/**
 * Transactions API
 */
export const transactionsApi = {
  /**
   * Get all transactions
   */
  async getAll(): Promise<TransactionDTO[]> {
    return apiRequest<TransactionDTO[]>("/transactions");
  },

  /**
   * Get a single transaction by ID
   */
  async getById(id: string): Promise<TransactionDTO> {
    return apiRequest<TransactionDTO>(`/transactions/${id}`);
  },

  /**
   * Create a new transaction
   * @param data Transaction data including customer, product, and quantity info
   */
  async create(data: CreateTransactionInputDto): Promise<TransactionDTO> {
    return apiRequest<TransactionDTO>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Process payment for a transaction
   * @param id Transaction ID
   * @param paymentData Payment processing information
   */
  async processPayment(
    id: string,
    paymentData: ProcessPaymentDto,
  ): Promise<TransactionDTO> {
    return apiRequest<TransactionDTO>(`/transactions/${id}/process-payment`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    });
  },
};

/**
 * Customers API
 */
export const customersApi = {
  /**
   * Get all customers
   */
  async getAll(): Promise<CustomerDTO[]> {
    return apiRequest<CustomerDTO[]>("/customers");
  },

  /**
   * Get a single customer by ID
   */
  async getById(id: string): Promise<CustomerDTO> {
    return apiRequest<CustomerDTO>(`/customers/${id}`);
  },

  /**
   * Create a new customer
   * @param data Customer data
   */
  async create(data: CreateCustomerInputDto): Promise<CustomerDTO> {
    return apiRequest<CustomerDTO>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Deliveries API
 */
export const deliveriesApi = {
  /**
   * Get all deliveries
   */
  async getAll(): Promise<DeliveryDTO[]> {
    return apiRequest<DeliveryDTO[]>("/deliveries");
  },

  /**
   * Get deliveries for a specific transaction
   */
  async getByTransactionId(transactionId: string): Promise<DeliveryDTO[]> {
    return apiRequest<DeliveryDTO[]>(
      `/deliveries?transactionId=${transactionId}`,
    );
  },
};

/**
 * Auth API
 */
export const authApi = {
  /**
   * Register a new user
   * @param data Registration data
   */
  async register(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
    return apiRequest<AuthResponseDTO>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user
   * @param data Login credentials
   * Returns JWT token valid for 24h along with user info
   */
  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    return apiRequest<LoginResponseDTO>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify token validity
   * Token is automatically injected via interceptor
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    return apiRequest<{ valid: boolean }>("/auth/verify", {
      method: "GET",
    });
  },

  /**
   * Get current user profile
   * Token is automatically injected via interceptor
   */
  async getProfile(): Promise<UserDTO> {
    return apiRequest<UserDTO>("/auth/profile", {
      method: "GET",
    });
  },
};

export default {
  productsApi,
  transactionsApi,
  customersApi,
  deliveriesApi,
  authApi,
};
