import { render, screen } from "@testing-library/react";
import PromoBanners from "./PromoBanners";

jest.mock("./PromoBanners.scss", () => ({}));

describe("PromoBanners Component", () => {
  it("should render without crashing", () => {
    render(<PromoBanners />);
    expect(screen.getByText("Get 20% Off")).toBeInTheDocument();
  });

  it("should display both promo banners", () => {
    render(<PromoBanners />);
    expect(screen.getByText("Get 20% Off")).toBeInTheDocument();
    expect(screen.getByText("Exclusive Deals")).toBeInTheDocument();
  });

  it("should display promo descriptions", () => {
    render(<PromoBanners />);
    expect(screen.getByText("On your first purchase")).toBeInTheDocument();
    expect(screen.getByText("Limited time offers")).toBeInTheDocument();
  });

  it("should have action buttons", () => {
    render(<PromoBanners />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });

  it("should have Claim Now button", () => {
    render(<PromoBanners />);
    const claimButton = screen.getByRole("button", { name: /claim now/i });
    expect(claimButton).toBeInTheDocument();
  });

  it("should have Shop Now button", () => {
    render(<PromoBanners />);
    const shopButton = screen.getByRole("button", { name: /shop now/i });
    expect(shopButton).toBeInTheDocument();
  });

  it("should display promo images", () => {
    render(<PromoBanners />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
  });

  it("should have correct image alt texts", () => {
    render(<PromoBanners />);
    expect(screen.getByAltText("Promo 1")).toBeInTheDocument();
    expect(screen.getByAltText("Promo 2")).toBeInTheDocument();
  });

  it("should render with proper container structure", () => {
    const { container } = render(<PromoBanners />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have two column layout", () => {
    const { container } = render(<PromoBanners />);
    const columns = container.querySelectorAll(".col-md-6");
    expect(columns.length).toBe(2);
  });
});
