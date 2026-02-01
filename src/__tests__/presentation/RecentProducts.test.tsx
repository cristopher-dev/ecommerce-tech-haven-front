import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RecentProducts from "@/presentation/pages/RecentProducts";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/infrastructure/adapters/TechHavenApiRepositories", () => ({
  TechHavenApiProductRepository: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: "1", name: "Product 1", price: 9999, imageUrl: "img1.jpg" },
      { id: "2", name: "Product 2", price: 19999, imageUrl: "img2.jpg" },
      { id: "3", name: "Product 3", price: 29999, imageUrl: "img3.jpg" },
      { id: "4", name: "Product 4", price: 39999, imageUrl: "img4.jpg" },
      { id: "5", name: "Product 5", price: 49999, imageUrl: "img5.jpg" },
    ]),
  })),
}));

jest.mock("@/presentation/components/RecentProducts.scss", () => ({}));

describe("RecentProducts Component", () => {
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
        wishlist: {
          items: [],
          loading: false,
          error: null,
        },
      },
    });
  };

  const renderRecentProducts = () => {
    return render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <RecentProducts />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render without crashing", async () => {
    renderRecentProducts();
    await waitFor(() => {
      expect(screen.getByText("Recent Products")).toBeInTheDocument();
    });
  });

  it("should display Recent Products heading", async () => {
    renderRecentProducts();
    await waitFor(() => {
      expect(screen.getByText("Recent Products")).toBeInTheDocument();
    });
  });

  it("should display loading spinner initially", () => {
    renderRecentProducts();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should load and display products", async () => {
    renderRecentProducts();
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
  });

  it("should display all 5 products after loading", async () => {
    renderRecentProducts();
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
      expect(screen.getByText("Product 3")).toBeInTheDocument();
      expect(screen.getByText("Product 4")).toBeInTheDocument();
      expect(screen.getByText("Product 5")).toBeInTheDocument();
    });
  });

  it("should have navigation buttons", async () => {
    renderRecentProducts();
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should display discount badges for products", async () => {
    renderRecentProducts();
    await waitFor(() => {
      const badges = screen.queryAllByText(/-\d+%/);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it("should render section with correct class", async () => {
    const { container } = renderRecentProducts();
    await waitFor(() => {
      const section = container.querySelector(".recent-products");
      expect(section).toBeInTheDocument();
    });
  });

  it("should have loading and product states", async () => {
    renderRecentProducts();
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
  });

  it("should structure products in responsive grid", async () => {
    const { container } = renderRecentProducts();
    await waitFor(() => {
      const columns = container.querySelectorAll(".col-lg-3");
      expect(columns.length).toBe(5);
    });
  });
});
