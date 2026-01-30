import { LocalStorageCartRepository } from "./LocalStorageCartRepository";
import type { Cart } from "@/domain/entities/Cart";
import type { CartItem } from "@/domain/entities/CartItem";

describe("LocalStorageCartRepository", () => {
  let repository: LocalStorageCartRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageCartRepository();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should get empty cart initially", () => {
    const cart = repository.getCart();
    expect(cart.items).toEqual([]);
  });

  it("should add item to cart", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].product.id).toBe(1);
  });

  it("should increase quantity if product already exists", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item);
    repository.addItem(item);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  it("should remove item from cart", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item);
    repository.removeItem(1);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(0);
  });

  it("should update item quantity", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item);
    repository.updateItemQuantity(1, 5);
    const cart = repository.getCart();
    expect(cart.items[0].quantity).toBe(5);
  });

  it("should remove all items when removing multiple times", () => {
    const item1: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    const item2: CartItem = {
      product: {
        id: 2,
        name: "Product 2",
        price: 199.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item1);
    repository.addItem(item2);
    repository.removeItem(1);
    repository.removeItem(2);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(0);
  });

  it("should persist cart to localStorage", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item);
    const stored = localStorage.getItem("techhaven_cart");
    expect(stored).toBeDefined();
    expect(stored).toContain("Product 1");
  });

  it("should load cart from localStorage", () => {
    const cart: Cart = {
      items: [
        {
          product: {
            id: 1,
            name: "Product 1",
            price: 99.99,
            image: "img.jpg",
            discount: 0,
          },
          quantity: 2,
        },
      ],
    };
    localStorage.setItem("techhaven_cart", JSON.stringify(cart));
    const loaded = repository.getCart();
    expect(loaded.items.length).toBe(1);
    expect(loaded.items[0].quantity).toBe(2);
  });

  it("should handle multiple items", () => {
    const item1: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    const item2: CartItem = {
      product: {
        id: 2,
        name: "Product 2",
        price: 199.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 1,
    };
    repository.addItem(item1);
    repository.addItem(item2);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(2);
  });

  it("should correctly identify and update existing items", () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 2,
    };
    repository.addItem(item);
    const itemToAdd: CartItem = {
      product: {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "img.jpg",
        discount: 0,
      },
      quantity: 3,
    };
    repository.addItem(itemToAdd);
    const cart = repository.getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(5);
  });
});
