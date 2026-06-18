import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/layout/theme-toggle";

describe("ThemeToggle", () => {
  it("renders a theme toggle button with a French aria-label", () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Changer de thème");
    // Default (unmounted/light) aria-label is the "dark" option.
    expect(button.getAttribute("aria-label")).toMatch(/Thème/);
  });
});
