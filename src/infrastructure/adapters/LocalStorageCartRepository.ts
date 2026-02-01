import { Cart } from "@/domain/entities/Cart";
import { CartItem } from "@/domain/entities/CartItem";
import { CartRepository } from "@/domain/ports/CartRepository";

const CART_STORAGE_KEY = "techhaven_cart";

const ensureCartItemId = (item: CartItem, index: number): CartItem => {
  if (!item.id) {
    return {
      ...item,
      id: `${item.product.id}-${index}-${Date.now()}`,
    };
  }
  return item;
};

const ensureProductId = (item: CartItem, index: number): CartItem => {
  if (!item.product) {
    console.warn(`Cart item ${index} has no product, skipping`);
    return item;
  }

  let productId = item.product.id;

  if (!productId && item.id && typeof item.id === "string") {
    const parts = item.id.split("-");
    const extractedId = parts[0];

    const numId = Number.parseInt(extractedId, 10);
    productId = Number.isNaN(numId) ? extractedId : String(numId);
  }

  if (!productId) {
    console.error(
      `Could not determine product ID for cart item ${index}:`,
      item,
    );
    return item;
  }

  return {
    ...item,
    product: {
      ...item.product,
      id: String(productId), // Always convert to string for consistency
    },
  };
};

export class LocalStorageCartRepository implements CartRepository {
  getCart(): Cart {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
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
