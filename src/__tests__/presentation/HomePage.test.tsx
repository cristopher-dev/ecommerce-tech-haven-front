import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import HomePage from "@/presentation/pages/HomePage";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/presentation/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));
jest.mock("@/presentation/components/HeroCarousel", () => ({
  __esModule: true,
  default: () => <div data-testid="hero">Hero</div>,
}));
jest.mock("@/presentation/components/PromoBanners", () => ({
  __esModule: true,
  default: () => <div data-testid="promo">Promo</div>,
}));
jest.mock("@/presentation/components/ProductSection", () => ({
  __esModule: true,
  default: () => <div data-testid="section">Section</div>,
}));
jest.mock("@/presentation/components/CategoryCarousel", () => ({
  __esModule: true,
  default: () => <div data-testid="category">Category</div>,
}));
jest.mock("@/presentation/components/BrandCarousel", () => ({
  __esModule: true,
  default: () => <div data-testid="brand">Brand</div>,
}));
jest.mock("@/presentation/components/Features", () => ({
  __esModule: true,
  default: () => <div data-testid="features">Features</div>,
}));
jest.mock("@/presentation/components/Newsletter", () => ({
  __esModule: true,
  default: () => <div data-testid="newsletter">Newsletter</div>,
}));
jest.mock("@/presentation/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));
jest.mock("@/presentation/components/RecentProducts", () => ({
  __esModule: true,
  default: () => <div data-testid="recent">Recent</div>,
}));
jest.mock("@/presentation/components/TopRatedProducts", () => ({
  __esModule: true,
  default: () => <div data-testid="top-rated">TopRated</div>,
}));

describe("HomePage Component", () => {
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

  const renderHomePage = () => {
    return render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render without crashing", () => {
    renderHomePage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display header component", () => {
    renderHomePage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should display hero carousel", () => {
    renderHomePage();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("should display promo banners", () => {
    renderHomePage();
    expect(screen.getByTestId("promo")).toBeInTheDocument();
  });

  it("should display recent products", () => {
    renderHomePage();
    expect(screen.getByTestId("recent")).toBeInTheDocument();
  });

  it("should display category carousel", () => {
    renderHomePage();
    expect(screen.getByTestId("category")).toBeInTheDocument();
  });

  it("should display brand carousel", () => {
    renderHomePage();
    expect(screen.getByTestId("brand")).toBeInTheDocument();
  });

  it("should display features section", () => {
    renderHomePage();
    expect(screen.getByTestId("features")).toBeInTheDocument();
  });

  it("should display top rated products", () => {
    renderHomePage();
    expect(screen.getByTestId("top-rated")).toBeInTheDocument();
  });

  it("should display footer component", () => {
    renderHomePage();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
