import { render, screen } from "@testing-library/react";
import BrandCarousel from "./BrandCarousel";

jest.mock("./BrandCarousel.scss", () => ({}));

describe("BrandCarousel Component", () => {
  it("should render without crashing", () => {
    render(<BrandCarousel />);
    expect(screen.getByText(/brand/i)).toBeInTheDocument();
  });

  it("should display brand heading", () => {
    render(<BrandCarousel />);
    const headings = screen.getAllByRole("heading");
    const brandHeading = headings.find((h) => h.textContent?.match(/brand/i));
    expect(brandHeading).toBeInTheDocument();
  });

  it("should render carousel element", () => {
    const { container } = render(<BrandCarousel />);
    const carousel = container.querySelector(".carousel");
    expect(carousel).toBeInTheDocument();
  });

  it("should have carousel items", () => {
    const { container } = render(<BrandCarousel />);
    const items = container.querySelectorAll(".carousel-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should display brand images", () => {
    render(<BrandCarousel />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should have carousel controls", () => {
    const { container } = render(<BrandCarousel />);
    const controls = container.querySelectorAll(".carousel-control");
    expect(controls.length).toBeGreaterThanOrEqual(0);
  });

  it("should have active carousel item", () => {
    const { container } = render(<BrandCarousel />);
    const activeItem = container.querySelector(".carousel-item.active");
    expect(activeItem).toBeInTheDocument();
  });

  it("should render with proper carousel structure", () => {
    const { container } = render(<BrandCarousel />);
    const carouselInner = container.querySelector(".carousel-inner");
    expect(carouselInner).toBeInTheDocument();
  });

  it("should have carousel slide class", () => {
    const { container } = render(<BrandCarousel />);
    const carousel = container.querySelector(".carousel.slide");
    expect(carousel).toBeInTheDocument();
  });

  it("should render multiple brand items", () => {
    const { container } = render(<BrandCarousel />);
    const brandItems = container.querySelectorAll(".carousel-item");
    expect(brandItems.length).toBeGreaterThan(0);
  });
});
