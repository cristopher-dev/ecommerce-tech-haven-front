import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CheckoutDeliveryPage from "./CheckoutDeliveryPage";
import checkoutReducer from "@/application/store/slices/checkoutSlice";

// Mock components
jest.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock("../components/PaymentModal", () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="payment-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

describe("CheckoutDeliveryPage", () => {
  const mockCheckoutState = {
    currentStep: "delivery",
    cartItems: [],
    deliveryData: null,
    paymentData: null,
    baseFee: 500,
    deliveryFee: 1000,
    lastTransactionId: null,
    loading: false,
    error: null,
  };

  const createMockStore = (initialState = mockCheckoutState) => {
    return configureStore({
      reducer: {
        checkout: checkoutReducer,
      },
      preloadedState: {
        checkout: initialState,
      },
    });
  };

  const renderPage = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutDeliveryPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("should render delivery form", () => {
    renderPage();
    expect(screen.getByText(/delivery information/i)).toBeInTheDocument();
  });

  it("should display all form fields", () => {
    renderPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  });

  it("should show validation error for empty required fields", async () => {
    renderPage();
    const submitButton = screen.getByRole("button", {
      name: /continue to payment/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it("should validate email format", async () => {
    renderPage();
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", {
      name: /continue to payment/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it("should display progress bar", () => {
    renderPage();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it("should display header and footer", () => {
    renderPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should have proper breadcrumb", () => {
    renderPage();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });
});
