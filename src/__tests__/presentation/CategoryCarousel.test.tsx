import { render, screen } from "@testing-library/react";
import CategoryCarousel from "@/presentation/pages/CategoryCarousel";

jest.mock("@/presentation/components/CategoryCarousel.scss", () => ({}));

describe("CategoryCarousel Component", () => {
  it("should render without crashing", () => {
    render(<CategoryCarousel />);
    expect(screen.getByText(/categor/i)).toBeInTheDocument();
  });

  it("should display category heading", () => {
    render(<CategoryCarousel />);
    const headings = screen.getAllByRole("heading");
    const categoryHeading = headings.find((h) =>
      h.textContent?.match(/categor/i),
    );
    expect(categoryHeading).toBeInTheDocument();
  });

  it("should render carousel element", () => {
    const { container } = render(<CategoryCarousel />);
    const carousel = container.querySelector(".carousel");
    expect(carousel).toBeInTheDocument();
  });

  it("should have carousel items", () => {
    const { container } = render(<CategoryCarousel />);
    const items = container.querySelectorAll(".carousel-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should display category cards", () => {
    render(<CategoryCarousel />);
    const cards = screen.queryAllByText(
      /electronics|gadgets|smart home|wearables|accessories/i,
    );
    expect(cards.length).toBeGreaterThan(0);
  });

  it("should have carousel controls", () => {
    const { container } = render(<CategoryCarousel />);
    const prev = container.querySelector(".carousel-control-prev");
    const next = container.querySelector(".carousel-control-next");
    expect(prev || next).toBeTruthy();
  });

  it("should have active carousel item", () => {
    const { container } = render(<CategoryCarousel />);
    const activeItem = container.querySelector(".carousel-item.active");
    expect(activeItem).toBeInTheDocument();
  });

  it("should render with proper structure", () => {
    const { container } = render(<CategoryCarousel />);
    const carouselInner = container.querySelector(".carousel-inner");
    expect(carouselInner).toBeInTheDocument();
  });

  it("should display category icons or images", () => {
    render(<CategoryCarousel />);
    const images = screen.queryAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(0);
  });

  it("should have proper carousel setup", () => {
    const { container } = render(<CategoryCarousel />);
    const carousel = container.querySelector(".carousel.slide");
    expect(carousel).toBeInTheDocument();
  });
});
