vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../src/components/Button";
import { describe, it, vi, expect } from "vitest";

describe("Button component", () => {
  it("renders button with label", () => {
    render(<Button label="Click me" />);

    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button label="Click me" onClick={handleClick} />);

    const button = screen.getByRole("button");

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled button", () => {
    render(<Button label="Disabled" disabled />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("renders as link when href is provided", () => {
    render(<Button label="Go home" href="/home" />);

    const link = screen.getByRole("link", { name: /go home/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
  });

  it("applies delete styles when delete prop is true", () => {
    render(<Button label="Delete" delete />);

    const button = screen.getByRole("button");

    expect(button.className).toContain("border-red-500");
  });
});
