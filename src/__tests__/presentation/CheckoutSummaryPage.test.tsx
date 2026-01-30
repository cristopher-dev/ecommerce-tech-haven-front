/* eslint-disable @typescript-eslint/no-explicit-any */
/* @jsxRuntime classic */
/* @jsx React.createElement */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";
import productsReducer from "@/application/store/slices/productsSlice";
import transactionsReducer from "@/application/store/slices/transactionsSlice";
import deliveriesReducer from "@/application/store/slices/deliveriesSlice";

// Mock components
jest.mock("../components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock("../components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-footer">Footer</div>,
}));

jest.mock("@/infrastructure/api/techHavenApiClient", () => ({
  __esModule: true,
  transactionsApi: {
    create: jest.fn().mockResolvedValue({
      id: "tx-123",
      transactionNumber: "TXN-001",
    }),
    processPayment: jest.fn().mockResolvedValue({}),
  },
}));

import CheckoutSummaryPage from "./CheckoutSummaryPage";

describe("CheckoutSummaryPage", () => {
  const mockDeliveryData = {
    address: "John Doe, 123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    phone: "555-1234",
  };

  const mockPaymentData = {
    cardNumber: "****1111",
    cardholderName: "John Doe",
    expirationMonth: 12,
    expirationYear: 2025,
    cvv: "",
  };

  const mockProduct = {
    id: 1,
    name: "Test Product",
    price: 99.99,
    image: "test.jpg",
    discount: 0,
    description: "Test product",
  };

  const createMockStore = (overrides: any = {}) => {
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
          step: 2,
          deliveryData: mockDeliveryData,
          paymentData: mockPaymentData,
          loading: false,
          error: null,
          cartItems: [
            {
              product: mockProduct,
              quantity: 1,
            },
          ],
          baseFee: 500,
          deliveryFee: 1000,
          ...overrides.checkout,
        },
        cart: {
          items: [
            {
              product: mockProduct,
              quantity: 1,
            },
          ],
          total: 99.99,
          totalItems: 1,
          loading: false,
          error: null,
          ...overrides.cart,
        },
        products: { products: [], loading: false, error: null },
        transactions: { transactions: [], loading: false, error: null },
        deliveries: { deliveries: [], loading: false, error: null },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
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
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("should show order summary heading", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
  });

  it("should display delivery information", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/John Doe, 123 Main St/i)).toBeInTheDocument();
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
  });

  it("should show payment section", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const paymentSections = screen.queryAllByText(/Payment Information/i);
    expect(paymentSections.length).toBeGreaterThan(0);
  });

  it("should show fees and totals", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const subtotalElements = screen.queryAllByText(/Subtotal:/i);
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  it("should show empty cart message when no items", () => {
    const store = createMockStore({
      cart: { items: [] },
      checkout: { cartItems: [] },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it("should render breadcrumb navigation", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  });

  it("should render Place Order button", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const placeOrderButton = screen.getByRole("button", {
      name: /Place Order/i,
    });
    expect(placeOrderButton).toBeInTheDocument();
  });

  it("should render Back to Delivery link", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      screen.getByRole("link", { name: /Back to Delivery/i }),
    ).toBeInTheDocument();
  });

  it("should show progress bar at 66%", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const progressBar = container.querySelector(".progress-bar");
    expect(progressBar?.getAttribute("aria-valuenow")).toBe("66");
  });

  it("should disable Place Order button when loading", () => {
    const store = createMockStore({
      checkout: { loading: true },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const placeOrderButton = screen.getByRole("button", {
      name: /Place Order/i,
    });
    expect(placeOrderButton).toBeDisabled();
  });

  it("should display error message when present", () => {
    const store = createMockStore({
      checkout: { error: "Payment failed" },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/Payment failed/i)).toBeInTheDocument();
  });

  it("should allow dismissing error message", async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      checkout: { error: "Payment failed" },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
    const closeButton = screen.getByRole("button", { name: "" });
    if (closeButton) {
      await user.click(closeButton);
    }
  });
});
