import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CartPage from "./CartPage";
import cartReducer from "@/application/store/slices/cartSlice";

// Mock Header and Footer
jest.mock("../components/Header", () => {
  return {
    default: () => <div data-testid="header">Header</div>,
  };
});

jest.mock("../components/Footer", () => {
  return {
    default: () => <div data-testid="footer">Footer</div>,
  };
});

describe("CartPage", () => {
  const mockCartState = {
    items: [
      {
        product: {
          id: 1,
          name: "Test Product 1",
          price: 99.99,
          image: "test1.jpg",
          discount: 0,
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          name: "Test Product 2",
          price: 49.99,
          image: "test2.jpg",
          discount: 10,
        },
        quantity: 1,
      },
    ],
  };

  const createMockStore = (initialState = mockCartState) => {
    return configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: {
        cart: initialState,
      },
    });
  };

  const renderCartPage = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("should render cart page with header and footer", () => {
    renderCartPage();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shopping cart/i }),
    ).toBeInTheDocument();
  });

  it("should display cart items", () => {
    renderCartPage();

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("should display product images", () => {
    renderCartPage();

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute("alt", "Test Product 1");
    expect(images[1]).toHaveAttribute("alt", "Test Product 2");
  });

  it("should display correct quantities", () => {
    renderCartPage();

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs[0].value).toBe("2");
    expect(inputs[1].value).toBe("1");
  });

  it("should display correct totals for items", () => {
    renderCartPage();

    // Product 1: 99.99 * 2 = 199.98
    // Product 2: 49.99 * 1 = 49.99
    expect(screen.getByText("$199.98")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("should display cart total", () => {
    renderCartPage();

    // Total: 199.98 + 49.99 = 249.97
    expect(screen.getByText(/total: \$249\.97/i)).toBeInTheDocument();
  });

  it('should display "Proceed to Checkout" button', () => {
    renderCartPage();

    const checkoutButton = screen.getByRole("link", {
      name: /proceed to checkout/i,
    });
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toHaveAttribute("href", "/checkout/delivery");
  });

  it('should display "Remove" buttons for each item', () => {
    renderCartPage();

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(2);
  });

  it("should update quantity when input changes", async () => {
    renderCartPage();

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    const firstInput = inputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    await waitFor(() => {
      expect(firstInput.value).toBe("5");
    });
  });

  it("should remove item when Remove button is clicked", async () => {
    const store = createMockStore();
    renderCartPage(store);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });
  });

  it("should display empty cart message when no items", () => {
    const emptyStore = createMockStore({ items: [] });
    renderCartPage(emptyStore);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should display breadcrumb navigation", () => {
    renderCartPage();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("should have correct table headers", () => {
    renderCartPage();

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should handle quantity change to zero", async () => {
    renderCartPage();

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "0" } });

    // Should not remove item (that's handled by parent component)
    await waitFor(() => {
      expect(inputs[0].value).toBe("0");
    });
  });

  it("should calculate correct subtotal and total", () => {
    renderCartPage();

    // With current items:
    // Item 1: 99.99 * 2 = 199.98
    // Item 2: 49.99 * 1 = 49.99
    // Total = 249.97
    const totalText = screen.getByText(/total: \$249\.97/i);
    expect(totalText).toBeInTheDocument();
  });
});
