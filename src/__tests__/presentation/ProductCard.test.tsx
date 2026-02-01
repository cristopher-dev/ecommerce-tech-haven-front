import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductCard from "@/presentation/pages/ProductCard";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

jest.mock("@/presentation/components/ProductCard.scss", () => ({}));

describe("ProductCard Component", () => {
  const mockProduct = {
    id: 1,
    name: "Test Product",
    price: 99.99,
    image: "test.jpg",
    discount: 10,
  };

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

  const renderProductCard = (product = mockProduct) => {
    return render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ProductCard product={product} />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render product card without crashing", () => {
    renderProductCard();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should display product name", () => {
    renderProductCard();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should display product image", () => {
    renderProductCard();
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Test Product");
  });

  it("should display product price", () => {
    renderProductCard();
    const priceText = screen.queryAllByText(/99\.99/);
    expect(priceText.length).toBeGreaterThan(0);
  });

  it("should display discount badge with percentage", () => {
    renderProductCard();
    const discountBadge = screen.getByText(/10%/);
    expect(discountBadge).toBeInTheDocument();
  });

  it("should have add to cart button", () => {
    renderProductCard();
    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeInTheDocument();
  });

  it("should display discounted price when discount exists", () => {
    renderProductCard();
    const discountedPrice = screen.queryAllByText(/89\.99/);
    expect(discountedPrice.length).toBeGreaterThan(0);
  });

  it("should render card with product card modern class", () => {
    const { container } = renderProductCard();
    const card = container.querySelector(".product-card-modern");
    expect(card).toBeInTheDocument();
  });

  it("should have wishlist and add to cart buttons", () => {
    renderProductCard();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should render product without discount correctly", () => {
    const productNoDiscount = { ...mockProduct, discount: 0 };
    renderProductCard(productNoDiscount);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });
});
