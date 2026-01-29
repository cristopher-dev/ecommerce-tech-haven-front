import { CartRepository } from "../../domain/ports/CartRepository";
import { Cart } from "../../domain/entities/Cart";
import { CartItem } from "../../domain/entities/CartItem";

const CART_STORAGE_KEY = "techhaven_cart";

export class LocalStorageCartRepository implements CartRepository {
  getCart(): Cart {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { items: [] };
  }

  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingIndex = cart.items.findIndex(
      (i) => i.product.id === item.product.id,
    );
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    this.saveCart(cart);
  }

  removeItem(productId: number): void {
    const cart = this.getCart();
    cart.items = cart.items.filter((i) => i.product.id !== productId);
    this.saveCart(cart);
  }

  updateItemQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.saveCart(cart);
      }
    }
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}
