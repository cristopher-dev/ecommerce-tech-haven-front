import { Product } from "@/domain/entities/Product";

export interface CartItem {
  id?: string; // Unique identifier for this cart item instance
  product: Product;
  quantity: number;
}
