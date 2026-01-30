import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TopRatedProducts from "./TopRatedProducts";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/infrastructure/adapters/TechHavenApiRepositories", () => ({
  TechHavenApiProductRepository: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: "1", name: "Top Product 1", price: 19999, imageUrl: "img1.jpg" },
      { id: "2", name: "Top Product 2", price: 29999, imageUrl: "img2.jpg" },
      { id: "3", name: "Top Product 3", price: 39999, imageUrl: "img3.jpg" },
      { id: "4", name: "Top Product 4", price: 49999, imageUrl: "img4.jpg" },
    ]),
  })),
}));

jest.mock("./TopRatedProducts.scss", () => ({}));

describe("TopRatedProducts Component", () => {
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

  const renderTopRatedProducts = () => {
    return render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TopRatedProducts />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render without crashing", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      expect(screen.getByText(/top|rated|products/i)).toBeInTheDocument();
    });
  });

  it("should display loading state initially", () => {
    renderTopRatedProducts();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should load and display products", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      expect(screen.getByText("Top Product 1")).toBeInTheDocument();
    });
  });

  it("should display multiple products after loading", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      expect(screen.getByText("Top Product 1")).toBeInTheDocument();
      expect(screen.getByText("Top Product 2")).toBeInTheDocument();
    });
  });

  it("should have product cards for each product", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      const productNames = screen.getAllByText(/Top Product/);
      expect(productNames.length).toBeGreaterThan(0);
    });
  });

  it("should render responsive grid layout", async () => {
    const { container } = renderTopRatedProducts();
    await waitFor(() => {
      const columns = container.querySelectorAll(".col-lg-3");
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  it("should display section element", async () => {
    const { container } = renderTopRatedProducts();
    await waitFor(() => {
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  it("should have heading element", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it("should display loading then products", async () => {
    const { container } = renderTopRatedProducts();
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Top Product 1")).toBeInTheDocument();
    });
  });

  it("should render all products in grid", async () => {
    renderTopRatedProducts();
    await waitFor(() => {
      expect(screen.getByText("Top Product 1")).toBeInTheDocument();
      expect(screen.getByText("Top Product 2")).toBeInTheDocument();
      expect(screen.getByText("Top Product 3")).toBeInTheDocument();
      expect(screen.getByText("Top Product 4")).toBeInTheDocument();
    });
  });
});
