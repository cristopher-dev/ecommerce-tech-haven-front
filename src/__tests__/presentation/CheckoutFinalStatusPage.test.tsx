import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";
import productsReducer from "@/application/store/slices/productsSlice";
import transactionsReducer from "@/application/store/slices/transactionsSlice";
import deliveriesReducer from "@/application/store/slices/deliveriesSlice";

jest.mock("@/presentation/components/Header", () => ({
  __esModule: true,
  default: () => <header data-testid="mock-header">Header</header>,
}));

jest.mock("@/presentation/components/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

import CheckoutFinalStatusPage from "@/presentation/pages/CheckoutFinalStatusPage";

describe("CheckoutFinalStatusPage", () => {
  const createMockStore = (transactionId = "TXN123456") => {
    return configureStore({
      reducer: {
        checkout: checkoutReducer,
        cart: cartReducer,
        products: productsReducer,
        transactions: transactionsReducer,
        deliveries: deliveriesReducer,
      },
      preloadedState: {
        checkout: {
          cartItems: [
            {
              product: {
                id: 1,
                name: "Test Product",
                price: 99.99,
                image: "test.jpg",
                description: "Test",
                rating: 5,
                category: "Electronics",
              },
              quantity: 1,
            },
          ],
          paymentData: null,
          deliveryData: null,
          baseFee: 5000,
          deliveryFee: 10000,
          loading: false,
          error: null,
          step: "status" as const,
          lastTransactionId: transactionId,
        },
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
          <CheckoutFinalStatusPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  it("should display header and footer", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutFinalStatusPage />
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
          <CheckoutFinalStatusPage />
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
          <CheckoutFinalStatusPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });
});
