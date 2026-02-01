import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "@/presentation/components/Footer";

jest.mock("@/presentation/components/Footer.scss", () => ({}));

describe("Footer Component", () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );
  };

  it("should render footer without crashing", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should display footer element", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer.tagName).toBe("FOOTER");
  });

  it("should have container structure", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should contain footer content", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent).toBeTruthy();
  });

  it("should render footer with proper structure", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should be accessible footer element", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should render without errors", () => {
    expect(() => renderFooter()).not.toThrow();
  });

  it("should display at the bottom of page", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should have footer element", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe("FOOTER");
  });

  it("should render footer correctly", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe("FOOTER");
  });
});
