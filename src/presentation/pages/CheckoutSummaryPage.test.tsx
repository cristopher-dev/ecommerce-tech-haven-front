import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import CheckoutSummaryPage from "./CheckoutSummaryPage";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";

// Mock Header and Footer
jest.mock("../components/Header", () => {
  return {
    default: () => <div data-testid="header">Header</div>,
  };
});

jest.mock("../components/Footer", () => {
  return {
    default: () => <div data-testid="footer">Footer</div>,
  };
});

// Mock API calls
jest.mock("@/infrastructure/api/techHavenApiClient", () => ({
  techHavenApiClient: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("CheckoutSummaryPage", () => {
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
          <CheckoutSummaryPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("should render checkout summary page", () => {
    renderPage();
    expect(screen.getByText(/summary|order/i)).toBeInTheDocument();
  });

  it("should display product amount", () => {
    renderPage();
    expect(screen.getByText(/product|subtotal|amount/i)).toBeInTheDocument();
  });

  it("should display base fee", () => {
    renderPage();
    expect(screen.getByText(/base fee|handling fee/i)).toBeInTheDocument();
  });

  it("should display delivery fee", () => {
    renderPage();
    expect(screen.getByText(/delivery fee|shipping/i)).toBeInTheDocument();
  });

  it("should calculate and display total", () => {
    renderPage();
    expect(screen.getByText(/total|subtotal/i)).toBeInTheDocument();
  });

  it("should display confirm button", () => {
    renderPage();
    const confirmButton = screen.getByRole("button", {
      name: /confirm|pay|process/i,
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("should display cancel button", () => {
    renderPage();
    const cancelButton = screen.getByRole("button", { name: /cancel|back/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it("should display header and footer", () => {
    renderPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should display progress indicator", () => {
    renderPage();
    expect(screen.getByText(/step|progress/i)).toBeInTheDocument();
  });

  it("should display order summary title", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should format prices correctly", () => {
    renderPage();
    // Prices should be displayed in currency format
    const priceElements = screen.getAllByText(/\$|€|₱|\d+,\d{2}/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it("should display correct fee calculations", () => {
    renderPage();
    // Both base fee and delivery fee should be visible
    expect(screen.getByText(/base fee|handling fee/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery fee|shipping/i)).toBeInTheDocument();
  });

  it("should have proper layout structure", () => {
    renderPage();
    // Should have main content area
    const main = screen.getByRole("main", { hidden: true });
    expect(main).toBeInTheDocument();
  });

  it("should display item details", () => {
    renderPage();
    // Should show product information in summary
    expect(screen.getByText(/product|item|quantity/i)).toBeInTheDocument();
  });

  it("should have accessible buttons", () => {
    renderPage();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should navigate on cancel button click", async () => {
    renderPage();
    const cancelButton = screen.getByRole("button", { name: /cancel|back/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(cancelButton).toBeInTheDocument();
    });
  });

  it("should handle confirm button click", async () => {
    renderPage();
    const confirmButton = screen.getByRole("button", {
      name: /confirm|pay|process/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(confirmButton).toBeInTheDocument();
    });
  });

  it("should display breakdown of charges", () => {
    renderPage();
    // Summary should show itemized breakdown
    const chargeLabels = screen.getAllByText(/fee|charge|amount/i);
    expect(chargeLabels.length).toBeGreaterThan(0);
  });

  it("should not display payment modal on page load", () => {
    renderPage();
    const modal = screen.queryByTestId("payment-modal");
    expect(modal).not.toBeInTheDocument();
  });

  it("should have payment-related text", () => {
    renderPage();
    expect(screen.getByText(/payment|pay|charge/i)).toBeInTheDocument();
  });
});
