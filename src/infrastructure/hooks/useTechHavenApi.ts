import { useState, useCallback } from "react";
import {
  ProductDTO,
  TransactionDTO,
  CreateTransactionInputDto,
  ProcessPaymentDto,
  DeliveryDTO,
} from "@/infrastructure/api/techHavenApiClient";
import {
  TechHavenApiProductRepository,
  TechHavenApiTransactionRepository,
  TechHavenApiDeliveryRepository,
} from "@/infrastructure/adapters/TechHavenApiRepositories";

// Initialize repositories
const productRepository = new TechHavenApiProductRepository();
const transactionRepository = new TechHavenApiTransactionRepository();
const deliveryRepository = new TechHavenApiDeliveryRepository();

/**
 * Hook to manage product data from Tech Haven API
 */
export function useProducts() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productRepository.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productRepository.getById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts, fetchProductById };
}

/**
 * Hook to manage transaction data from Tech Haven API
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionRepository.getAll();
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(
    async (data: CreateTransactionInputDto) => {
      setLoading(true);
      setError(null);
      try {
        const result = await transactionRepository.create(data);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create transaction",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const processPayment = useCallback(
    async (id: string, paymentData: ProcessPaymentDto) => {
      setLoading(true);
      setError(null);
      try {
        const result = await transactionRepository.processPayment(
          id,
          paymentData,
        );
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process payment",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    processPayment,
  };
}

/**
 * Hook to manage delivery data from Tech Haven API
 */
export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryRepository.getAll();
      setDeliveries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch deliveries",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveriesByTransaction = useCallback(
    async (transactionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await deliveryRepository.getByTransactionId(transactionId);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch deliveries",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    deliveries,
    loading,
    error,
    fetchDeliveries,
    fetchDeliveriesByTransaction,
  };
}
