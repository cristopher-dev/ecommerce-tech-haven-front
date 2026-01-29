/**
 * Tech Haven API Client
 * Adapter for consuming the Tech Haven Payment API
 * Base URL: http://localhost:3000/api
 */

const API_BASE_URL =
  (import.meta as unknown as Record<string, Record<string, string>>).env
    ?.VITE_TECH_HAVEN_API_URL || "http://localhost:3000/api";

// Types for API requests and responses
export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface CustomerDTO {
  id: string;
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
 * Makes an API request with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: Record<string, unknown> = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(typeof options.headers === "object" ? options.headers : {}),
    },
    ...options,
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

export default {
  productsApi,
  transactionsApi,
  customersApi,
  deliveriesApi,
};
