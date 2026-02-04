import cartReducer from "@/application/store/slices/cartSlice";
import CartPage from "@/presentation/pages/CartPage";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

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

  const createMockStore = (preloadedState) => {
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

  it("should render cart page with header and footer", () => {
    renderCartPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shopping cart/i }),
    ).toBeInTheDocument();
  });

  it("should display product images with correct alt text", () => {
    renderCartPage();
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
    expect(images[0]).toHaveAttribute("alt", "Test Product 1");
    expect(images[1]).toHaveAttribute("alt", "Test Product 2");
  });

  it("should display correct quantities in input fields", () => {
    renderCartPage();
    const inputs = screen.getAllByRole("spinbutton");
    expect((inputs[0]).value).toBe("2");
    expect((inputs[1]).value).toBe("1");
  });

  it("should update quantity when input value changes", async () => {
    renderCartPage();
    const inputs = screen.getAllByRole("spinbutton");
    const firstInput = inputs[0];
    fireEvent.change(firstInput, { target: { value: "5" } });
    await waitFor(() => {
      expect((firstInput).value).toBe("5");
    });
  });

  it("should display all required table headers", () => {
    renderCartPage();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    const removeElements = screen.queryAllByText("Remove");
    expect(removeElements.length).toBeGreaterThan(0);
  });

  it("should render table with responsive class", () => {
    renderCartPage();
    const table = screen.getByRole("table");
    const tableContainer = table.parentElement;
    expect(tableContainer).toHaveClass("table-responsive");
  });
});
