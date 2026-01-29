/* eslint-disable no-unused-vars */
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";

export interface CartRepository {
  getCart(): Cart;
  addItem(item: CartItem): void;
  removeItem(productId: number): void;
  updateItemQuantity(productId: number, quantity: number): void;
}
