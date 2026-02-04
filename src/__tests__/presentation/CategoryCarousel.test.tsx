import { render } from "@testing-library/react";
import CategoryCarousel from "@/presentation/components/CategoryCarousel";
import { BrowserRouter } from "react-router-dom";

describe("CategoryCarousel Component", () => {
  it("should render category carousel without crashing", () => {
    const { container } = render(
      <BrowserRouter>
        <CategoryCarousel />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
