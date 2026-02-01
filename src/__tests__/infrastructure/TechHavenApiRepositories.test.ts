import {
  TechHavenApiProductRepository,
  TechHavenApiTransactionRepository,
  TechHavenApiCustomerRepository,
  TechHavenApiDeliveryRepository,
} from "@/infrastructure/TechHavenApiRepositories";
import * as apiClient from "@/infrastructure/api/techHavenApiClient";

// Mock the API client
jest.mock("@/infrastructure/api/techHavenApiClient");

describe("TechHavenApiRepositories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TechHavenApiProductRepository", () => {
    let repository: TechHavenApiProductRepository;

    beforeEach(() => {
      repository = new TechHavenApiProductRepository();
    });

    describe("getAll", () => {
      it("should return all products from API", async () => {
        const mockProducts = [
          {
            id: "1",
            name: "Laptop",
            description: "High-performance laptop",
            price: 999.99,
            stock: 10,
          },
          {
            id: "2",
            name: "Mouse",
            description: "Wireless mouse",
            price: 29.99,
            stock: 50,
          },
        ];

        (apiClient.productsApi.getAll as jest.Mock).mockResolvedValueOnce(
          mockProducts,
        );

        const result = await repository.getAll();

        expect(result).toEqual(mockProducts);
        expect(apiClient.productsApi.getAll).toHaveBeenCalled();
      });

      it("should handle empty product list", async () => {
        (apiClient.productsApi.getAll as jest.Mock).mockResolvedValueOnce([]);

        const result = await repository.getAll();

        expect(result).toEqual([]);
      });

      it("should propagate API errors", async () => {
        const error = new Error("API Error");
        (apiClient.productsApi.getAll as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getAll()).rejects.toThrow("API Error");
      });

      it("should handle network errors", async () => {
        const error = new Error("Network error");
        (apiClient.productsApi.getAll as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getAll()).rejects.toThrow("Network error");
      });

      it("should be called multiple times independently", async () => {
        const mockProducts = [
          { id: "1", name: "Product 1", description: "", price: 100, stock: 5 },
        ];

        (apiClient.productsApi.getAll as jest.Mock).mockResolvedValue(
          mockProducts,
        );

        const result1 = await repository.getAll();
        const result2 = await repository.getAll();

        expect(result1).toEqual(mockProducts);
        expect(result2).toEqual(mockProducts);
        expect(apiClient.productsApi.getAll).toHaveBeenCalledTimes(2);
      });
    });

    describe("getById", () => {
      it("should return a product by ID", async () => {
        const mockProduct = {
          id: "1",
          name: "Laptop",
          description: "High-performance laptop",
          price: 999.99,
          stock: 10,
        };

        (apiClient.productsApi.getById as jest.Mock).mockResolvedValueOnce(
          mockProduct,
        );

        const result = await repository.getById("1");

        expect(result).toEqual(mockProduct);
        expect(apiClient.productsApi.getById).toHaveBeenCalledWith("1");
      });

      it("should pass correct ID to API", async () => {
        const mockProduct = {
          id: "test-id",
          name: "Test Product",
          description: "Test",
          price: 50,
          stock: 20,
        };

        (apiClient.productsApi.getById as jest.Mock).mockResolvedValueOnce(
          mockProduct,
        );

        await repository.getById("test-id");

        expect(apiClient.productsApi.getById).toHaveBeenCalledWith("test-id");
      });

      it("should throw error when product not found", async () => {
        const error = new Error("Product not found");
        (apiClient.productsApi.getById as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getById("999")).rejects.toThrow(
          "Product not found",
        );
      });

      it("should handle invalid ID format", async () => {
        const error = new Error("Invalid product ID");
        (apiClient.productsApi.getById as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getById("invalid")).rejects.toThrow(
          "Invalid product ID",
        );
      });

      it("should work with different ID types", async () => {
        const mockProduct = {
          id: "uuid-1234",
          name: "Product",
          description: "",
          price: 100,
          stock: 5,
        };

        (apiClient.productsApi.getById as jest.Mock).mockResolvedValueOnce(
          mockProduct,
        );

        const result = await repository.getById("uuid-1234");

        expect(result.id).toBe("uuid-1234");
        expect(apiClient.productsApi.getById).toHaveBeenCalledWith("uuid-1234");
      });
    });
  });

  describe("TechHavenApiTransactionRepository", () => {
    let repository: TechHavenApiTransactionRepository;

    beforeEach(() => {
      repository = new TechHavenApiTransactionRepository();
    });

    describe("getAll", () => {
      it("should return all transactions from API", async () => {
        const mockTransactions = [
          {
            id: "1",
            customerId: "1",
            productId: "1",
            quantity: 2,
            amount: 1999.98,
            status: "COMPLETED" as const,
            transactionNumber: "TXN001",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ];

        (apiClient.transactionsApi.getAll as jest.Mock).mockResolvedValueOnce(
          mockTransactions,
        );

        const result = await repository.getAll();

        expect(result).toEqual(mockTransactions);
        expect(apiClient.transactionsApi.getAll).toHaveBeenCalled();
      });

      it("should handle empty transaction list", async () => {
        (apiClient.transactionsApi.getAll as jest.Mock).mockResolvedValueOnce(
          [],
        );

        const result = await repository.getAll();

        expect(result).toEqual([]);
      });

      it("should propagate API errors", async () => {
        const error = new Error("API Error");
        (apiClient.transactionsApi.getAll as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getAll()).rejects.toThrow("API Error");
      });
    });

    describe("getById", () => {
      it("should return a transaction by ID", async () => {
        const mockTransaction = {
          id: "1",
          customerId: "1",
          productId: "1",
          quantity: 2,
          amount: 1999.98,
          status: "COMPLETED" as const,
          transactionNumber: "TXN001",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        (apiClient.transactionsApi.getById as jest.Mock).mockResolvedValueOnce(
          mockTransaction,
        );

        const result = await repository.getById("1");

        expect(result).toEqual(mockTransaction);
        expect(apiClient.transactionsApi.getById).toHaveBeenCalledWith("1");
      });

      it("should throw error when transaction not found", async () => {
        const error = new Error("Transaction not found");
        (apiClient.transactionsApi.getById as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getById("999")).rejects.toThrow(
          "Transaction not found",
        );
      });
    });

    describe("create", () => {
      it("should create a transaction successfully", async () => {
        const createData = {
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerAddress: "123 Main St",
          productId: "1",
          quantity: 2,
        };

        const mockResponse = {
          id: "1",
          customerId: "1",
          productId: "1",
          quantity: 2,
          amount: 1999.98,
          status: "PENDING" as const,
          transactionNumber: "TXN001",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        (apiClient.transactionsApi.create as jest.Mock).mockResolvedValueOnce(
          mockResponse,
        );

        const result = await repository.create(createData);

        expect(result).toEqual(mockResponse);
        expect(apiClient.transactionsApi.create).toHaveBeenCalledWith(
          createData,
        );
      });

      it("should handle validation errors on create", async () => {
        const createData = {
          customerName: "",
          customerEmail: "invalid",
          customerAddress: "",
          productId: "",
          quantity: 0,
        };

        const error = new Error("Invalid transaction data");
        (apiClient.transactionsApi.create as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.create(createData)).rejects.toThrow(
          "Invalid transaction data",
        );
      });

      it("should handle insufficient stock error", async () => {
        const createData = {
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerAddress: "123 Main St",
          productId: "1",
          quantity: 1000,
        };

        const error = new Error("Insufficient stock");
        (apiClient.transactionsApi.create as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.create(createData)).rejects.toThrow(
          "Insufficient stock",
        );
      });

      it("should pass correct data to API", async () => {
        const createData = {
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerAddress: "456 Oak Ave",
          productId: "2",
          quantity: 1,
        };

        const mockResponse = {
          id: "2",
          customerId: "2",
          productId: "2",
          quantity: 1,
          amount: 29.99,
          status: "PENDING" as const,
          transactionNumber: "TXN002",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
        };

        (apiClient.transactionsApi.create as jest.Mock).mockResolvedValueOnce(
          mockResponse,
        );

        await repository.create(createData);

        expect(apiClient.transactionsApi.create).toHaveBeenCalledWith(
          createData,
        );
      });
    });

    describe("processPayment", () => {
      it("should process payment successfully", async () => {
        const paymentData = {
          status: "COMPLETED" as const,
        };

        const mockResponse = {
          id: "1",
          customerId: "1",
          productId: "1",
          quantity: 2,
          amount: 1999.98,
          status: "COMPLETED" as const,
          transactionNumber: "TXN001",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        (
          apiClient.transactionsApi.processPayment as jest.Mock
        ).mockResolvedValueOnce(mockResponse);

        const result = await repository.processPayment("1", paymentData);

        expect(result).toEqual(mockResponse);
        expect(apiClient.transactionsApi.processPayment).toHaveBeenCalledWith(
          "1",
          paymentData,
        );
      });

      it("should handle payment failure", async () => {
        const paymentData = {
          status: "FAILED" as const,
          errorMessage: "Card declined",
        };

        const mockResponse = {
          id: "1",
          customerId: "1",
          productId: "1",
          quantity: 2,
          amount: 1999.98,
          status: "FAILED" as const,
          transactionNumber: "TXN001",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        (
          apiClient.transactionsApi.processPayment as jest.Mock
        ).mockResolvedValueOnce(mockResponse);

        const result = await repository.processPayment("1", paymentData);

        expect(result.status).toBe("FAILED");
        expect(apiClient.transactionsApi.processPayment).toHaveBeenCalledWith(
          "1",
          paymentData,
        );
      });

      it("should throw error when transaction not found", async () => {
        const paymentData = {
          status: "COMPLETED" as const,
        };

        const error = new Error("Transaction not found");
        (
          apiClient.transactionsApi.processPayment as jest.Mock
        ).mockRejectedValueOnce(error);

        await expect(
          repository.processPayment("999", paymentData),
        ).rejects.toThrow("Transaction not found");
      });

      it("should pass transaction ID and payment data correctly", async () => {
        const paymentData = {
          paymentGatewayTransactionId: "paymentgateway-123",
          status: "COMPLETED" as const,
        };

        const mockResponse = {
          id: "1",
          customerId: "1",
          productId: "1",
          quantity: 1,
          amount: 100,
          status: "COMPLETED" as const,
          transactionNumber: "TXN001",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        };

        (
          apiClient.transactionsApi.processPayment as jest.Mock
        ).mockResolvedValueOnce(mockResponse);

        await repository.processPayment("1", paymentData);

        expect(apiClient.transactionsApi.processPayment).toHaveBeenCalledWith(
          "1",
          paymentData,
        );
      });
    });
  });

  describe("TechHavenApiCustomerRepository", () => {
    let repository: TechHavenApiCustomerRepository;

    beforeEach(() => {
      repository = new TechHavenApiCustomerRepository();
    });

    describe("getAll", () => {
      it("should return all customers from API", async () => {
        const mockCustomers = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            address: "123 Main St",
            phone: "555-1234",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            address: "456 Oak Ave",
          },
        ];

        (apiClient.customersApi.getAll as jest.Mock).mockResolvedValueOnce(
          mockCustomers,
        );

        const result = await repository.getAll();

        expect(result).toEqual(mockCustomers);
        expect(apiClient.customersApi.getAll).toHaveBeenCalled();
      });

      it("should handle empty customer list", async () => {
        (apiClient.customersApi.getAll as jest.Mock).mockResolvedValueOnce([]);

        const result = await repository.getAll();

        expect(result).toEqual([]);
      });

      it("should propagate API errors", async () => {
        const error = new Error("API Error");
        (apiClient.customersApi.getAll as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getAll()).rejects.toThrow("API Error");
      });
    });

    describe("getById", () => {
      it("should return a customer by ID", async () => {
        const mockCustomer = {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          address: "123 Main St",
          phone: "555-1234",
        };

        (apiClient.customersApi.getById as jest.Mock).mockResolvedValueOnce(
          mockCustomer,
        );

        const result = await repository.getById("1");

        expect(result).toEqual(mockCustomer);
        expect(apiClient.customersApi.getById).toHaveBeenCalledWith("1");
      });

      it("should throw error when customer not found", async () => {
        const error = new Error("Customer not found");
        (apiClient.customersApi.getById as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getById("999")).rejects.toThrow(
          "Customer not found",
        );
      });
    });

    describe("create", () => {
      it("should create a customer successfully", async () => {
        const createData = {
          name: "John Doe",
          email: "john@example.com",
          address: "123 Main St",
          phone: "555-1234",
        };

        const mockResponse = {
          id: "1",
          ...createData,
        };

        (apiClient.customersApi.create as jest.Mock).mockResolvedValueOnce(
          mockResponse,
        );

        const result = await repository.create(createData);

        expect(result).toEqual(mockResponse);
        expect(apiClient.customersApi.create).toHaveBeenCalledWith(createData);
      });

      it("should handle validation errors on create", async () => {
        const createData = {
          name: "",
          email: "invalid-email",
          address: "",
        };

        const error = new Error("Invalid customer data");
        (apiClient.customersApi.create as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.create(createData)).rejects.toThrow(
          "Invalid customer data",
        );
      });

      it("should handle duplicate email error", async () => {
        const createData = {
          name: "John Doe",
          email: "existing@example.com",
          address: "123 Main St",
        };

        const error = new Error("Email already exists");
        (apiClient.customersApi.create as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.create(createData)).rejects.toThrow(
          "Email already exists",
        );
      });

      it("should create customer with optional phone field", async () => {
        const createData = {
          name: "Jane Smith",
          email: "jane@example.com",
          address: "456 Oak Ave",
          phone: "555-5678",
        };

        const mockResponse = {
          id: "2",
          ...createData,
        };

        (apiClient.customersApi.create as jest.Mock).mockResolvedValueOnce(
          mockResponse,
        );

        const result = await repository.create(createData);

        expect(result.phone).toBe("555-5678");
        expect(apiClient.customersApi.create).toHaveBeenCalledWith(createData);
      });

      it("should create customer without optional phone field", async () => {
        const createData = {
          name: "Jane Smith",
          email: "jane@example.com",
          address: "456 Oak Ave",
        };

        const mockResponse = {
          id: "2",
          ...createData,
        };

        (apiClient.customersApi.create as jest.Mock).mockResolvedValueOnce(
          mockResponse,
        );

        const result = await repository.create(createData);

        expect(result.id).toBe("2");
        expect(apiClient.customersApi.create).toHaveBeenCalledWith(createData);
      });
    });
  });

  describe("TechHavenApiDeliveryRepository", () => {
    let repository: TechHavenApiDeliveryRepository;

    beforeEach(() => {
      repository = new TechHavenApiDeliveryRepository();
    });

    describe("getAll", () => {
      it("should return all deliveries from API", async () => {
        const mockDeliveries = [
          {
            id: "1",
            transactionId: "1",
            status: "IN_TRANSIT" as const,
            estimatedDate: "2024-01-15",
            address: "123 Main St",
          },
          {
            id: "2",
            transactionId: "2",
            status: "DELIVERED" as const,
            estimatedDate: "2024-01-10",
            address: "456 Oak Ave",
          },
        ];

        (apiClient.deliveriesApi.getAll as jest.Mock).mockResolvedValueOnce(
          mockDeliveries,
        );

        const result = await repository.getAll();

        expect(result).toEqual(mockDeliveries);
        expect(apiClient.deliveriesApi.getAll).toHaveBeenCalled();
      });

      it("should handle empty deliveries list", async () => {
        (apiClient.deliveriesApi.getAll as jest.Mock).mockResolvedValueOnce([]);

        const result = await repository.getAll();

        expect(result).toEqual([]);
      });

      it("should propagate API errors", async () => {
        const error = new Error("API Error");
        (apiClient.deliveriesApi.getAll as jest.Mock).mockRejectedValueOnce(
          error,
        );

        await expect(repository.getAll()).rejects.toThrow("API Error");
      });
    });

    describe("getByTransactionId", () => {
      it("should return deliveries by transaction ID", async () => {
        const mockDeliveries = [
          {
            id: "1",
            transactionId: "1",
            status: "IN_TRANSIT" as const,
            estimatedDate: "2024-01-15",
            address: "123 Main St",
          },
        ];

        (
          apiClient.deliveriesApi.getByTransactionId as jest.Mock
        ).mockResolvedValueOnce(mockDeliveries);

        const result = await repository.getByTransactionId("1");

        expect(result).toEqual(mockDeliveries);
        expect(apiClient.deliveriesApi.getByTransactionId).toHaveBeenCalledWith(
          "1",
        );
      });

      it("should return empty array when no deliveries found", async () => {
        (
          apiClient.deliveriesApi.getByTransactionId as jest.Mock
        ).mockResolvedValueOnce([]);

        const result = await repository.getByTransactionId("999");

        expect(result).toEqual([]);
      });

      it("should throw error on API failure", async () => {
        const error = new Error("Internal server error");
        (
          apiClient.deliveriesApi.getByTransactionId as jest.Mock
        ).mockRejectedValueOnce(error);

        await expect(repository.getByTransactionId("1")).rejects.toThrow(
          "Internal server error",
        );
      });

      it("should pass transaction ID correctly", async () => {
        const mockDeliveries = [
          {
            id: "1",
            transactionId: "test-tx-123",
            status: "PENDING" as const,
            estimatedDate: "2024-01-20",
            address: "789 Elm St",
          },
        ];

        (
          apiClient.deliveriesApi.getByTransactionId as jest.Mock
        ).mockResolvedValueOnce(mockDeliveries);

        await repository.getByTransactionId("test-tx-123");

        expect(apiClient.deliveriesApi.getByTransactionId).toHaveBeenCalledWith(
          "test-tx-123",
        );
      });
    });
  });

  describe("Repository Integration", () => {
    it("should create instances independently", () => {
      const productRepo1 = new TechHavenApiProductRepository();
      const productRepo2 = new TechHavenApiProductRepository();

      expect(productRepo1).not.toBe(productRepo2);
    });

    it("should handle concurrent API calls", async () => {
      const productRepo = new TechHavenApiProductRepository();
      const transactionRepo = new TechHavenApiTransactionRepository();

      const mockProduct = {
        id: "1",
        name: "Product",
        description: "",
        price: 100,
        stock: 5,
      };

      const mockTransaction = {
        id: "1",
        customerId: "1",
        productId: "1",
        quantity: 1,
        amount: 100,
        status: "COMPLETED" as const,
        transactionNumber: "TXN001",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      (apiClient.productsApi.getById as jest.Mock).mockResolvedValueOnce(
        mockProduct,
      );
      (apiClient.transactionsApi.getById as jest.Mock).mockResolvedValueOnce(
        mockTransaction,
      );

      const [product, transaction] = await Promise.all([
        productRepo.getById("1"),
        transactionRepo.getById("1"),
      ]);

      expect(product).toEqual(mockProduct);
      expect(transaction).toEqual(mockTransaction);
    });
  });
});
