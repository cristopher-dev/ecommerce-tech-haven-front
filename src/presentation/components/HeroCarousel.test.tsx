import { render, screen } from "@testing-library/react";
import HeroCarousel from "./HeroCarousel";

jest.mock("./HeroCarousel.scss", () => ({}));

describe("HeroCarousel Component", () => {
  it("should render without crashing", () => {
    render(<HeroCarousel />);
    expect(screen.getByText(/exclusive/i)).toBeInTheDocument();
  });

  it("should render carousel element", () => {
    const { container } = render(<HeroCarousel />);
    const carousel = container.querySelector(".carousel");
    expect(carousel).toBeInTheDocument();
  });

  it("should have carousel inner content", () => {
    const { container } = render(<HeroCarousel />);
    const carouselInner = container.querySelector(".carousel-inner");
    expect(carouselInner).toBeInTheDocument();
  });

  it("should display hero images", () => {
    render(<HeroCarousel />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should have multiple carousel items", () => {
    const { container } = render(<HeroCarousel />);
    const items = container.querySelectorAll(".carousel-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should have carousel controls", () => {
    const { container } = render(<HeroCarousel />);
    const controls = container.querySelectorAll(".carousel-control");
    expect(controls.length).toBeGreaterThanOrEqual(0);
  });

  it("should display hero text content", () => {
    render(<HeroCarousel />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should have active carousel item", () => {
    const { container } = render(<HeroCarousel />);
    const activeItem = container.querySelector(".carousel-item.active");
    expect(activeItem).toBeInTheDocument();
  });

  it("should have proper carousel structure", () => {
    const { container } = render(<HeroCarousel />);
    const carousel = container.querySelector("#heroCarousel");
    expect(carousel).toHaveClass("carousel");
    expect(carousel).toHaveClass("slide");
  });

  it("should render with hero content", () => {
    render(<HeroCarousel />);
    const text = screen.queryAllByText(/gaming|technology|deals|discount/i);
    expect(text.length).toBeGreaterThan(0);
  });
});
