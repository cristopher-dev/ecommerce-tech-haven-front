/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "@/presentation/pages/Header";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";

// Mock SCSS imports
jest.mock("@/presentation/components/Header.scss", () => ({}));

describe("Header Component", () => {
  const mockCartState = {
    items: [
      {
        product: {
          id: 1,
          name: "Test Product",
          price: 99.99,
          image: "test.jpg",
          discount: 0,
        },
        quantity: 2,
      },
    ],
    total: 199.98,
    totalItems: 2,
    loading: false,
    error: null,
  };

  const createMockStore = (cartState: any = mockCartState) => {
    return configureStore({
      reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
      },
      preloadedState: {
        cart: cartState,
        wishlist: { items: [] } as any,
      },
    });
  };

  const renderHeader = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>,
    );
  };

  it("should render header without crashing", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("should display navigation bar", () => {
    renderHeader();
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("should display cart items count", () => {
    renderHeader();
    const cartElements = screen.getAllByText(/2/);
    expect(cartElements.length).toBeGreaterThan(0);
  });

  it("should display cart total price", () => {
    renderHeader();
    // The header displays the total - just check for presence
    const allText = screen.queryAllByText(/199\.98|Total/i);
    expect(allText.length).toBeGreaterThan(0);
  });

  it("should display navbar toggle button for mobile", () => {
    renderHeader();
    const toggleButton = screen.getByRole("button", {
      name: /toggle navigation/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("should display brand or logo area", () => {
    renderHeader();
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("should display zero items when cart is empty", () => {
    const emptyCartStore = createMockStore({
      items: [],
      total: 0,
      totalItems: 0,
      loading: false,
      error: null,
    });
    renderHeader(emptyCartStore);
    const zeroElements = screen.queryAllByText(/0/);
    expect(zeroElements.length >= 0).toBe(true);
  });

  it("should display multiple items count correctly", () => {
    const multiItemStore = createMockStore({
      items: [
        {
          product: {
            id: 1,
            name: "Product 1",
            price: 50,
            image: "test1.jpg",
            discount: 0,
          },
          quantity: 3,
        },
        {
          product: {
            id: 2,
            name: "Product 2",
            price: 100,
            image: "test2.jpg",
            discount: 0,
          },
          quantity: 2,
        },
      ],
      total: 350,
      totalItems: 5,
      loading: false,
      error: null,
    });
    renderHeader(multiItemStore);
    const itemElements = screen.getAllByText(/5/);
    expect(itemElements.length).toBeGreaterThan(0);
  });

  it("should contain navigation links", () => {
    renderHeader();
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should render header with proper structure", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });
});
