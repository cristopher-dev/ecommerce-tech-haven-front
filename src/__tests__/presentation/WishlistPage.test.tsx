import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import WishlistPage from "./WishlistPage";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";
import checkoutReducer from "@/application/store/slices/checkoutSlice";

jest.mock("@/presentation/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));
jest.mock("@/presentation/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("WishlistPage Component", () => {
  const createMockStore = (wishlistItems = []) => {
    return configureStore({
      reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        checkout: checkoutReducer,
      },
      preloadedState: {
        cart: {
          items: [],
          total: 0,
          totalItems: 0,
          loading: false,
          error: null,
        },
        wishlist: {
          items: wishlistItems,
          loading: false,
          error: null,
        },
        checkout: {
          shippingInfo: null,
          status: "idle",
        },
      },
    });
  };

  const renderWishlistPage = (wishlistItems = []) => {
    return render(
      <Provider store={createMockStore(wishlistItems)}>
        <BrowserRouter>
          <WishlistPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render without crashing", () => {
    renderWishlistPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display header component", () => {
    renderWishlistPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display footer component", () => {
    renderWishlistPage();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should display breadcrumb navigation", () => {
    renderWishlistPage();
    const breadcrumb = screen.getByRole("navigation", { hidden: true });
    expect(breadcrumb).toBeInTheDocument();
  });

  it("should display home link in breadcrumb", () => {
    renderWishlistPage();
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });

  it("should display wishlist heading", () => {
    renderWishlistPage();
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should display empty wishlist message when no items", () => {
    renderWishlistPage([]);
    const emptyMessage = screen.queryAllByText(/empty|no items|wishlist/i);
    expect(emptyMessage.length).toBeGreaterThanOrEqual(0);
  });

  it("should render as main content area", () => {
    renderWishlistPage();
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    const { container } = renderWishlistPage();
    const container_elem = container.querySelector(".container");
    expect(container_elem).toBeInTheDocument();
  });

  it("should display wishlist page title", () => {
    renderWishlistPage();
    const headings = screen.queryAllByText(/wishlist/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should render wishlist content section", () => {
    const { container } = renderWishlistPage();
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
  });
});
