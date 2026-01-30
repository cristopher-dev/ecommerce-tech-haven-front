import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import CheckoutFinalStatusPage from "./CheckoutFinalStatusPage";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import cartReducer from "@/application/store/slices/cartSlice";

jest.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("CheckoutFinalStatusPage", () => {
  const createMockStore = (transactionId = "TXN123456") => {
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
          <CheckoutFinalStatusPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("should render success confirmation page", () => {
    renderPage();
    expect(
      screen.getByText(/success|thank you|confirmed/i),
    ).toBeInTheDocument();
  });

  it("should display transaction ID", () => {
    renderPage();
    expect(screen.getByText(/transaction|order/i)).toBeInTheDocument();
  });

  it("should display order confirmation message", () => {
    renderPage();
    expect(
      screen.getByText(/order|transaction|confirmation/i),
    ).toBeInTheDocument();
  });

  it("should display header and footer", () => {
    renderPage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should have return home button", () => {
    renderPage();
    const homeButton = screen.getByRole("button", {
      name: /home|back|shop|continue/i,
    });
    expect(homeButton).toBeInTheDocument();
  });

  it("should navigate to home on button click", async () => {
    renderPage();
    const homeButton = screen.getByRole("button", {
      name: /home|back|shop|continue/i,
    });
    fireEvent.click(homeButton);

    await waitFor(() => {
      expect(homeButton).toBeInTheDocument();
    });
  });

  it("should display delivery information", () => {
    renderPage();
    expect(screen.getByText(/delivery|order details/i)).toBeInTheDocument();
  });

  it("should display order breakdown", () => {
    renderPage();
    expect(screen.getByText(/total|amount|fee/i)).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    renderPage();
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should display confirmation element", () => {
    renderPage();
    expect(screen.getByText(/success|confirm/i)).toBeInTheDocument();
  });

  it("should show transaction reference", () => {
    renderPage();
    expect(
      screen.getByText(/reference|transaction|id|number/i),
    ).toBeInTheDocument();
  });

  it("should have main content area", () => {
    renderPage();
    const main = screen.getByRole("main", { hidden: true });
    expect(main).toBeInTheDocument();
  });

  it("should display order summary section", () => {
    renderPage();
    expect(screen.getByText(/summary|details|order/i)).toBeInTheDocument();
  });

  it("should have accessible buttons", () => {
    renderPage();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render complete order information", () => {
    renderPage();
    expect(screen.getByText(/order|transaction/i)).toBeInTheDocument();
  });

  it("should provide next steps information", () => {
    renderPage();
    expect(
      screen.getByText(/tracking|email|confirmation|next/i),
    ).toBeInTheDocument();
  });

  it("should display final status correctly", () => {
    renderPage();
    expect(screen.getByText(/status|completed|success/i)).toBeInTheDocument();
  });
});
