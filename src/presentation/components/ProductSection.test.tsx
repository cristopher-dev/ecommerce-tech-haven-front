import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductSection from "./ProductSection";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/infrastructure/adapters/TechHavenApiRepositories", () => ({
  TechHavenApiProductRepository: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      {
        id: "1",
        name: "Section Product 1",
        price: 12999,
        imageUrl: "img1.jpg",
      },
      {
        id: "2",
        name: "Section Product 2",
        price: 22999,
        imageUrl: "img2.jpg",
      },
      {
        id: "3",
        name: "Section Product 3",
        price: 32999,
        imageUrl: "img3.jpg",
      },
    ]),
  })),
}));

jest.mock("./ProductSection.scss", () => ({}));

describe("ProductSection Component", () => {
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

  const renderProductSection = (title = "Test Section") => {
    return render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ProductSection title={title} />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render without crashing", async () => {
    renderProductSection();
    await waitFor(() => {
      expect(screen.getByText("Test Section")).toBeInTheDocument();
    });
  });

  it("should display section title", async () => {
    renderProductSection("Custom Title");
    await waitFor(() => {
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });
  });

  it("should show loading state initially", () => {
    renderProductSection();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should load and display products", async () => {
    renderProductSection();
    await waitFor(() => {
      expect(screen.getByText("Section Product 1")).toBeInTheDocument();
    });
  });

  it("should display multiple products", async () => {
    renderProductSection();
    await waitFor(() => {
      expect(screen.getByText("Section Product 1")).toBeInTheDocument();
      expect(screen.getByText("Section Product 2")).toBeInTheDocument();
      expect(screen.getByText("Section Product 3")).toBeInTheDocument();
    });
  });

  it("should render section container", async () => {
    const { container } = renderProductSection();
    await waitFor(() => {
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  it("should have responsive grid layout", async () => {
    const { container } = renderProductSection();
    await waitFor(() => {
      const columns = container.querySelectorAll(".col-lg-3");
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  it("should render title as heading", async () => {
    renderProductSection("Featured Products");
    await waitFor(() => {
      const headings = screen.getAllByRole("heading");
      const titleHeading = headings.find((h) =>
        h.textContent?.includes("Featured Products"),
      );
      expect(titleHeading).toBeInTheDocument();
    });
  });

  it("should hide loading and show content when loaded", async () => {
    renderProductSection();
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Section Product 1")).toBeInTheDocument();
    });
  });

  it("should render all products in grid", async () => {
    renderProductSection();
    await waitFor(() => {
      const products = screen.getAllByText(/Section Product/);
      expect(products.length).toBe(3);
    });
  });
});
