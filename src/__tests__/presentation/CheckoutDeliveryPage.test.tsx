/* eslint-disable @typescript-eslint/no-explicit-any */
/* @jsxRuntime classic */
/* @jsx React.createElement */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
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

jest.mock("../components/PaymentModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-modal">Modal</div>,
}));

import CheckoutDeliveryPage from "./CheckoutDeliveryPage";

describe("CheckoutDeliveryPage", () => {
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
          step: 1,
          deliveryData: null,
          paymentData: null,
          loading: false,
          error: null,
          ...overrides.checkout,
        },
        cart: {
          items: [],
          total: 0,
          totalItems: 0,
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

  it("should render first name field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

  it("should render last name field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  it("should render address field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  it("should render city field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  });

  it("should render zip code field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
  });

  it("should render email field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("should render phone field", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it("should render Continue to Payment button", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      screen.getByRole("button", { name: /Continue to Payment/i }),
    ).toBeInTheDocument();
  });

  it("should render Back to Cart link", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      screen.getByRole("link", { name: /Back to Cart/i }),
    ).toBeInTheDocument();
  });

  it("should render breadcrumb with Home", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it("should render progress bar element", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    const progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toBeInTheDocument();
  });

  it("should render payment modal component", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("should render with Redux", () => {
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
});
