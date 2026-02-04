import { render } from "@testing-library/react";
import BrandCarousel from "@/presentation/components/BrandCarousel";

describe("BrandCarousel Component", () => {
  it("should render carousel without crashing", () => {
    const { container } = render(<BrandCarousel />);
    expect(container).toBeInTheDocument();
  });
});
