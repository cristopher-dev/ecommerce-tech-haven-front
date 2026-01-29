import type { Product } from "@/domain/entities/Product";

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Wishlist {
  items: WishlistItem[];
}
