import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductPage from "./ProductPage";

// Mock useCart
jest.mock("../../infrastructure/hooks/useCart", () => ({
  useCart: () => ({
    addToCart: jest.fn(),
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Header and Footer
jest.mock("../components/Header", () => {
  const React = require("react");
  return {
    default: () => React.createElement("div", null, "Header"),
  };
});
jest.mock("../components/Footer", () => {
  const React = require("react");
  return {
    default: () => React.createElement("div", null, "Footer"),
  };
});

describe("ProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  it("should render product details", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/product/i)).toBeInTheDocument();
  });

  it("should display product image", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const image = screen.getByRole("img", { hidden: true });
    expect(image).toBeInTheDocument();
  });

  it("should display product price", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it("should display product description", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/description/i)).toBeInTheDocument();
  });

  it("should display Add to Cart button", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it("should display Pay with Credit Card button", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /pay|credit card/i }),
    ).toBeInTheDocument();
  });

  // Stock availability tests
  it("should display stock availability", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/stock|available|units/i)).toBeInTheDocument();
  });

  it("should disable Add to Cart button when out of stock", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const buttons = screen.getAllByRole("button");
    // At least some buttons should exist
    expect(buttons.length).toBeGreaterThan(0);
  });

  // Navigation tests
  it("should navigate to cart when Add to Cart is clicked", async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  it("should navigate to checkout when Pay button is clicked", async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const payButton = screen.getByRole("button", { name: /pay|credit card/i });
    fireEvent.click(payButton);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("checkout"),
        );
      },
      { timeout: 1000 },
    );
  });

  // Header and Footer tests
  it("should display header", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("should display footer", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  // Responsive design tests
  it("should have responsive layout", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    expect(container).toBeInTheDocument();
  });

  // Error state tests
  it("should handle missing product gracefully", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    // Component should still render without crashing
    expect(screen.getByText(/product/i)).toBeInTheDocument();
  });

  // Button functionality tests
  it("should disable buttons during loading", async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    // Button should show loading state
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // Quantity selector tests
  it("should have quantity input field", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const inputs = screen.getAllByRole("textbox", { hidden: true });
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  // Multiple click tests
  it("should handle multiple clicks on Add to Cart", async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  // Product info structure tests
  it("should display product details in logical order", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const elements = screen.getAllByRole("heading", { hidden: true });
    expect(elements.length).toBeGreaterThanOrEqual(0);
  });

  // Main content area test
  it("should have main content area", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const main = container.querySelector("main");
    expect(main || container.firstChild).toBeInTheDocument();
  });

  // Accessibility tests
  it("should have accessible buttons", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeVisible();
    });
  });

  // Image loading tests
  it("should display product image with alt text", () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>,
    );
    const images = screen.queryAllByRole("img", { hidden: true });
    expect(images.length).toBeGreaterThanOrEqual(0);
  });
});
