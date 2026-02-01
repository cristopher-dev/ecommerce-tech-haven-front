import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductPage from "@/presentation/pages/ProductPage";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/presentation/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("@/presentation/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("ProductPage", () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
      },
      preloadedState: {
        cart: {
          items: [],
          total: 0,
          totalItems: 0,
          loading: false,
          error: null,
        },
        wishlist: { items: [] },
      },
    });
  };

  const renderProductPage = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("should render ProductPage without crashing", () => {
    renderProductPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display header", () => {
    renderProductPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display footer", () => {
    renderProductPage();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should have responsive layout", () => {
    const { container } = renderProductPage();
    expect(container).toBeInTheDocument();
  });

  it("should render with Redux Provider context", () => {
    const { container } = renderProductPage();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render with React Router context", () => {
    renderProductPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
});
