import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/infrastructure/useCart";

describe("useCart hook", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current).toBeDefined();
    expect(Array.isArray(result.current.cart.items)).toBe(true);
    expect(result.current.cart.items).toHaveLength(0);
  });

  it("should add item to cart", async () => {
    const { result } = renderHook(() => useCart());

    const product = {
      id: 1,
      name: "Test Product",
      price: 100,
      image: "test.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].product.id).toBe(1);
    expect(result.current.cart.items[0].quantity).toBe(1);
  });

  it("should increase quantity when adding same product twice", async () => {
    const { result } = renderHook(() => useCart());

    const product = {
      id: 1,
      name: "Test Product",
      price: 100,
      image: "test.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(3);
  });

  it("should remove item from cart", async () => {
    const { result } = renderHook(() => useCart());

    const product = {
      id: 1,
      name: "Test Product",
      price: 100,
      image: "test.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart.items).toHaveLength(1);

    await act(async () => {
      result.current.removeFromCart(1);
    });

    expect(result.current.cart.items).toHaveLength(0);
  });

  it("should update item quantity", async () => {
    const { result } = renderHook(() => useCart());

    const product = {
      id: 1,
      name: "Test Product",
      price: 100,
      image: "test.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart.items[0].quantity).toBe(1);

    await act(async () => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cart.items[0].quantity).toBe(5);
  });

  it("should calculate total items correctly", async () => {
    const { result } = renderHook(() => useCart());

    const product1 = {
      id: 1,
      name: "Product 1",
      price: 100,
      image: "test1.jpg",
      discount: 0,
    };

    const product2 = {
      id: 2,
      name: "Product 2",
      price: 50,
      image: "test2.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product1, 2);
      result.current.addToCart(product2, 3);
    });

    expect(result.current.getTotalItems()).toBe(5);
  });

  it("should calculate total price correctly", async () => {
    const { result } = renderHook(() => useCart());

    const product1 = {
      id: 1,
      name: "Product 1",
      price: 100,
      image: "test1.jpg",
      discount: 0,
    };

    const product2 = {
      id: 2,
      name: "Product 2",
      price: 50,
      image: "test2.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product1, 2); // 2 * 100 = 200
      result.current.addToCart(product2, 1); // 1 * 50 = 50
    });

    expect(result.current.getTotalPrice()).toBe(250);
  });

  it("should handle multiple different products", async () => {
    const { result } = renderHook(() => useCart());

    const product1 = {
      id: 1,
      name: "Product 1",
      price: 100,
      image: "test1.jpg",
      discount: 0,
    };

    const product2 = {
      id: 2,
      name: "Product 2",
      price: 50,
      image: "test2.jpg",
      discount: 0,
    };

    const product3 = {
      id: 3,
      name: "Product 3",
      price: 75,
      image: "test3.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product1, 1);
      result.current.addToCart(product2, 2);
      result.current.addToCart(product3, 1);
    });

    expect(result.current.cart.items).toHaveLength(3);
    expect(result.current.getTotalItems()).toBe(4);
    expect(result.current.getTotalPrice()).toBe(275);
  });

  it("should persist cart to localStorage using techhaven_cart key", async () => {
    const { result } = renderHook(() => useCart());

    const product = {
      id: 1,
      name: "Test Product",
      price: 100,
      image: "test.jpg",
      discount: 0,
    };

    await act(async () => {
      result.current.addToCart(product, 1);
    });

    const savedCart = localStorage.getItem("techhaven_cart");
    expect(savedCart).toBeTruthy();
    const parsedCart = JSON.parse(savedCart!);
    expect(parsedCart.items).toHaveLength(1);
  });

  it("should load cart from localStorage on initialization", () => {
    const mockCart = {
      items: [
        {
          product: {
            id: 1,
            name: "Persisted Product",
            price: 99.99,
            image: "persisted.jpg",
            discount: 0,
          },
          quantity: 2,
        },
      ],
    };

    localStorage.setItem("techhaven_cart", JSON.stringify(mockCart));

    const { result } = renderHook(() => useCart());

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].product.name).toBe("Persisted Product");
    expect(result.current.cart.items[0].quantity).toBe(2);
  });
});
