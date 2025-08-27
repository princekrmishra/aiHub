/**
 * Tests for App.jsx
 * Test framework: Vitest
 * Test utilities: React Testing Library + @testing-library/jest-dom
 * Note: Created on 2025-08-27 based on PR diff contents.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import App from "./App";

/* ===== Comprehensive tests (happy paths, edge cases) ===== */
describe("App", () => {
  it("renders heading and instructional copy", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /vite \+ react/i })).toBeInTheDocument();
    expect(
      screen.getByText(/edit\s+src\/App\.jsx\s+and save to test HMR/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/click on the vite and react logos to learn more/i)
    ).toBeInTheDocument();
  });

  it("renders external links with correct URLs and target", () => {
    render(<App />);
    const viteLink = screen.getByRole("link", { name: /vite logo/i });
    const reactLink = screen.getByRole("link", { name: /react logo/i });
    expect(viteLink).toHaveAttribute("href", "https://vite.dev");
    expect(viteLink).toHaveAttribute("target", "_blank");
    expect(reactLink).toHaveAttribute("href", "https://react.dev");
    expect(reactLink).toHaveAttribute("target", "_blank");
  });

  it("renders logo images with correct alt text and classes", () => {
    render(<App />);
    const viteImg = screen.getByAltText(/vite logo/i);
    const reactImg = screen.getByAltText(/react logo/i);
    expect(viteImg).toBeInTheDocument();
    expect(viteImg).toHaveClass("logo");
    expect(reactImg).toBeInTheDocument();
    expect(reactImg).toHaveClass("logo");
    expect(reactImg).toHaveClass("react");
  });

  it("shows initial count and increments on click (happy path)", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", { name: /count is 0/i });
    await user.click(button);
    expect(button).toHaveTextContent(/count is 1/i);
    await user.click(button);
    await user.click(button);
    expect(button).toHaveTextContent(/count is 3/i);
  });

  it("supports keyboard activation via Enter key", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", { name: /count is 0/i });
    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveTextContent(/count is 1/i);
  });
});