import { render } from "@testing-library/react";
import PromoBanners from "@/presentation/components/PromoBanners";

describe("PromoBanners Component", () => {
  it("should render banners without crashing", () => {
    const { container } = render(<PromoBanners />);
    expect(container).toBeInTheDocument();
  });
});
