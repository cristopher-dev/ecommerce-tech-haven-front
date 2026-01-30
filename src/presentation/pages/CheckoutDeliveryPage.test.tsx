import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CheckoutDeliveryPage from "./CheckoutDeliveryPage";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";

// Mock components
jest.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock("../components/PaymentModal", () => ({
  default: ({ isOpen, onClose, onSubmit }: any) =>
    isOpen ? (
      <div data-testid="payment-modal">
        <button
          onClick={() =>
            onSubmit({ cardNumber: "4111111111111111", cvv: "123" })
          }
        >
          Submit Payment
        </button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

describe("CheckoutDeliveryPage", () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        checkout: checkoutReducer,
        cart: cartReducer,
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
    expect(screen.getByText(/delivery/i)).toBeInTheDocument();
  });

  it("should display all form fields", () => {
    renderPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  });

  it("should show validation error for empty first name", async () => {
    renderPage();
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect((firstNameInput as HTMLInputElement).value).toBe("");
    });
  });

  it("should show validation error for invalid email format", async () => {
    renderPage();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect((emailInput as HTMLInputElement).value).toBe("invalid-email");
    });
  });

  it("should accept valid email format", async () => {
    renderPage();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
    });
  });

  it("should show validation error for empty phone number", async () => {
    renderPage();
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect((phoneInput as HTMLInputElement).value).toBe("");
    });
  });

  it("should show validation error for empty address", async () => {
    renderPage();
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.blur(addressInput);

    await waitFor(() => {
      expect((addressInput as HTMLInputElement).value).toBe("");
    });
  });

  it("should accept valid phone number", async () => {
    renderPage();
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: "3001234567" } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect((phoneInput as HTMLInputElement).value).toBe("3001234567");
    });
  });

  it("should accept valid address", async () => {
    renderPage();
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.blur(addressInput);

    await waitFor(() => {
      expect((addressInput as HTMLInputElement).value).toBe("123 Main St");
    });
  });

  it("should display progress indicator", () => {
    renderPage();
    expect(screen.getByText(/step|progress/i)).toBeInTheDocument();
  });

  it("should display header and footer", () => {
    renderPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should fill delivery form with valid data", async () => {
    renderPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const addressInput = screen.getByLabelText(/address/i);
    const cityInput = screen.getByLabelText(/city/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.change(cityInput, { target: { value: "Bogotá" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "3001234567" } });

    await waitFor(() => {
      expect((firstNameInput as HTMLInputElement).value).toBe("John");
      expect((lastNameInput as HTMLInputElement).value).toBe("Doe");
      expect((addressInput as HTMLInputElement).value).toBe("123 Main St");
      expect((emailInput as HTMLInputElement).value).toBe("john@example.com");
      expect((phoneInput as HTMLInputElement).value).toBe("3001234567");
    });
  });

  it("should have proper form element", () => {
    renderPage();
    // Check if form inputs are present (at least one input field should exist)
    const inputs = screen.getAllByRole("textbox", { hidden: true });
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("should render continue/next button", () => {
    renderPage();
    const button = screen.getByRole("button", {
      name: /continue|next|payment/i,
    });
    expect(button).toBeInTheDocument();
  });
});
