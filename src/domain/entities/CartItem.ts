import { Product } from "@/domain/entities/Product";

export interface CartItem {
  product: Product;
  quantity: number;
}
