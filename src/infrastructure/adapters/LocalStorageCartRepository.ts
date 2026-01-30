import { CartRepository } from "@/domain/ports/CartRepository";
import { Cart } from "@/domain/entities/Cart";
import { CartItem } from "@/domain/entities/CartItem";

const CART_STORAGE_KEY = "techhaven_cart";

// Generate a unique ID for a cart item if it doesn't have one
const ensureCartItemId = (item: CartItem, index: number): CartItem => {
  if (!item.id) {
    return {
      ...item,
      id: `${item.product.id}-${index}-${Date.now()}`,
    };
  }
  return item;
};

// Ensure product has an ID (fallback from item.id if necessary)
const ensureProductId = (item: CartItem, index: number): CartItem => {
  // If product.id is missing, try to extract from item.id
  if (!item.product?.id && item.id && typeof item.id === "string") {
    const parts = item.id.split("-");
    const extractedId = parseInt(parts[0], 10);
    if (!isNaN(extractedId)) {
      return {
        ...item,
        product: {
          ...item.product,
          id: extractedId,
        },
      };
    }
  }
  return item;
};

export class LocalStorageCartRepository implements CartRepository {
  getCart(): Cart {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      // Ensure all items have unique IDs and product IDs are present
      cart.items = cart.items
        .map((item: CartItem, index: number) => ensureProductId(item, index))
        .map((item: CartItem, index: number) => ensureCartItemId(item, index));
      return cart;
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
