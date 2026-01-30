import {
  productsApi,
  transactionsApi,
  customersApi,
  deliveriesApi,
  ProductDTO,
  TransactionDTO,
  CreateTransactionInputDto,
  ProcessPaymentDto,
  DeliveryDTO,
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
