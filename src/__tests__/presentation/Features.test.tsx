import { render, screen } from "@testing-library/react";
import Features from "@/presentation/pages/Features";

jest.mock("@/presentation/components/Features.scss", () => ({}));

describe("Features Component", () => {
  it("should render without crashing", () => {
    render(<Features />);
    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
  });

  it("should display all feature titles", () => {
    render(<Features />);
    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
    expect(screen.getByText("Money Back Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Online Support")).toBeInTheDocument();
    expect(screen.getByText("Secure Payment")).toBeInTheDocument();
  });

  it("should display all feature descriptions", () => {
    render(<Features />);
    expect(screen.getByText("On orders over $50")).toBeInTheDocument();
    expect(screen.getByText("30 days return policy")).toBeInTheDocument();
    expect(screen.getByText("24/7 customer service")).toBeInTheDocument();
    expect(screen.getByText("100% secure transactions")).toBeInTheDocument();
  });

  it("should display all feature icons", () => {
    const { container } = render(<Features />);
    const icons = container.querySelectorAll("div");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should render feature items in a row", () => {
    const { container } = render(<Features />);
    const rows = container.querySelectorAll(".row");
    expect(rows.length).toBe(1);
  });

  it("should render with proper structure and styling", () => {
    const { container } = render(<Features />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have correct number of feature columns", () => {
    const { container } = render(<Features />);
    const columns = container.querySelectorAll(".col-md-3");
    expect(columns.length).toBe(4);
  });

  it("should have Free Shipping feature with icon", () => {
    const { container } = render(<Features />);
    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
    const feature = screen.getByText("Free Shipping").closest("div");
    expect(feature?.textContent).toContain("🚚");
  });

  it("should display Money Back Guarantee feature", () => {
    const { container } = render(<Features />);
    expect(screen.getByText("Money Back Guarantee")).toBeInTheDocument();
    const feature = screen.getByText("Money Back Guarantee").closest("div");
    expect(feature?.textContent).toContain("💰");
  });

  it("should display all features with proper container structure", () => {
    const { container } = render(<Features />);
    const featureContainers = container.querySelectorAll(".col-sm-6");
    expect(featureContainers.length).toBe(4);
  });
});
