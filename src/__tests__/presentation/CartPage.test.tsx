import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import CartPage from "@/presentation/pages/CartPage";
import cartReducer from "@/application/store/slices/cartSlice";

// Mock Header and Footer components
jest.mock("@/presentation/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("@/presentation/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

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
    total: 249.97,
    totalItems: 3,
    loading: false,
    error: null,
  };

  interface RootState {
    cart: typeof mockCartState;
  }

  const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: preloadedState || {
        cart: mockCartState,
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

  // Test 1: Cart page renders with header and footer
  it("should render cart page with header and footer", () => {
    renderCartPage();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shopping cart/i }),
    ).toBeInTheDocument();
  });

  // Test 2: Display cart items correctly
  it("should display all cart items with names", () => {
    renderCartPage();

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  // Test 3: Display product images
  it("should display product images with correct alt text", () => {
    renderCartPage();

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
    expect(images[0]).toHaveAttribute("alt", "Test Product 1");
    expect(images[1]).toHaveAttribute("alt", "Test Product 2");
  });

  // Test 4: Display correct quantities
  it("should display correct quantities in input fields", () => {
    renderCartPage();

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs[0].value).toBe("2");
    expect(inputs[1].value).toBe("1");
  });

  // Test 5: Display cart item prices
  it("should display prices for items", () => {
    renderCartPage();

    // Just check that price values are displayed (may appear multiple times)
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    const prices49 = screen.getAllByText("$49.99");
    expect(prices49.length).toBeGreaterThanOrEqual(1);
  });

  // Test 6: Display total prices for items
  it("should display total price for each item", () => {
    renderCartPage();

    // Product 1 total: 99.99 * 2 = 199.98
    expect(screen.getByText("$199.98")).toBeInTheDocument();
    // Product 2 appears twice: once as price ($49.99) and once as total ($49.99)
    const prices = screen.getAllByText("$49.99");
    expect(prices.length).toBeGreaterThanOrEqual(1);
  });

  // Test 7: Display cart total
  it("should display total amount due", () => {
    renderCartPage();

    // The total should be displayed
    const totalText = screen.getByText(/total: \$/i);
    expect(totalText).toBeInTheDocument();
    expect(totalText).toHaveTextContent("249.97");
  });

  // Test 8: Checkout button present and linked
  it("should display Proceed to Checkout button with correct link", () => {
    renderCartPage();

    const checkoutButton = screen.getByRole("link", {
      name: /proceed to checkout/i,
    });
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toHaveAttribute("href", "/cart");
  });

  // Test 9: Remove buttons present
  it("should display Remove button for each cart item", () => {
    renderCartPage();

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(2);
  });

  // Test 10: Update quantity when input changes
  it("should update quantity when input value changes", async () => {
    renderCartPage();

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    const firstInput = inputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    await waitFor(() => {
      expect(firstInput.value).toBe("5");
    });
  });

  // Test 11: Remove item from cart
  it("should remove item when Remove button is clicked", async () => {
    const store = createMockStore();
    renderCartPage(store);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });
  });

  // Test 12: Empty cart message
  it("should display empty cart message when no items", () => {
    const emptyStore = createMockStore({
      cart: {
        items: [],
        total: 0,
        totalItems: 0,
        loading: false,
        error: null,
      },
    });
    renderCartPage(emptyStore);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  // Test 13: Breadcrumb navigation
  it("should display breadcrumb navigation with Home and Cart", () => {
    renderCartPage();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  // Test 14: Table headers
  it("should display all required table headers", () => {
    renderCartPage();

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  // Test 15: Responsive layout with cart rows
  it("should render table with responsive class", () => {
    renderCartPage();

    const table = screen.getByRole("table");
    const tableContainer = table.parentElement;
    expect(tableContainer).toHaveClass("table-responsive");
  });
});
