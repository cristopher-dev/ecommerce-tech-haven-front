import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Newsletter from "./Newsletter";

jest.mock("./Newsletter.scss", () => ({}));

describe("Newsletter Component", () => {
  it("should render without crashing", () => {
    render(<Newsletter />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("should display newsletter section", () => {
    const { container } = render(<Newsletter />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have an email input field", () => {
    render(<Newsletter />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("should have a submit button", () => {
    render(<Newsletter />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should accept email input", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    await user.type(input, "test@example.com");
    expect(input.value).toBe("test@example.com");
  });

  it("should clear input after submission", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const button = screen.getByRole("button");

    await user.type(input, "test@example.com");
    await user.click(button);

    expect(input.value).toBe("");
  });

  it("should show success message after submission", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole("button");

    await user.type(input, "test@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/success|subscribed|thank/i)).toBeInTheDocument();
    });
  });

  it("should display newsletter heading", () => {
    render(<Newsletter />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toMatch(/newsletter|subscribe/i);
  });

  it("should display description text", () => {
    render(<Newsletter />);
    const description = screen.getByText(/exclusive|deals|offer/i);
    expect(description).toBeInTheDocument();
  });

  it("should have proper form structure", () => {
    render(<Newsletter />);
    const form = screen.getByRole("button").closest("form");
    expect(form).toBeInTheDocument();
  });

  it("should reset submitted state after timeout", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole("button");

    await user.type(input, "test@example.com");
    await user.click(button);

    const successText = screen.getByText(/success|subscribed|thank/i);
    expect(successText).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText(/success|subscribed|thank/i),
        ).not.toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  });
});
