import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";
import productsReducer from "@/application/store/slices/productsSlice";
import transactionsReducer from "@/application/store/slices/transactionsSlice";
import deliveriesReducer from "@/application/store/slices/deliveriesSlice";

// Comprehensive mocks for all dependencies
jest.mock("../components/Header", () => ({
  default: () =>
    React.createElement("header", { "data-testid": "mock-header" }, "Header"),
}));

jest.mock("../components/Footer", () => ({
  default: () =>
    React.createElement("footer", { "data-testid": "mock-footer" }, "Footer"),
}));

jest.mock("../components/PaymentModal", () => ({
  default: () =>
    React.createElement("div", { "data-testid": "mock-modal" }, "Modal"),
}));

import CheckoutDeliveryPage from "./CheckoutDeliveryPage";

describe("CheckoutDeliveryPage", () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        checkout: checkoutReducer,
        cart: cartReducer,
        products: productsReducer,
        transactions: transactionsReducer,
        deliveries: deliveriesReducer,
      },
      preloadedState: {
        checkout: { step: 1, deliveryData: null, paymentData: null },
        cart: {
          items: [],
          total: 0,
          totalItems: 0,
          loading: false,
          error: null,
        },
        products: { products: [], loading: false, error: null },
        transactions: { transactions: [], loading: false, error: null },
        deliveries: { deliveries: [], loading: false, error: null },
      },
    });
  };

  it("should render without crashing", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  it("should have header and footer", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("should render with Redux Provider", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render with React Router", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });
});
