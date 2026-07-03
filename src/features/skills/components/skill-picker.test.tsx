import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SkillPicker } from "@/features/skills/components/skill-picker";

// The picker fetches via useSkills (next-auth + react-query); stub it with a fixed list.
vi.mock("@/features/skills/use-skills", () => ({
  useSkills: () => ({
    data: {
      data: [
        { id: "s1", name: "Go", category: "Backend" },
        { id: "s2", name: "React", category: "Frontend" },
      ],
      total: 2,
      page: 1,
      pageSize: 200,
    },
    isLoading: false,
  }),
}));

describe("SkillPicker", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(<SkillPicker value={[]} onChange={vi.fn()} />);
    expect(screen.getByText("Sélectionner des compétences…")).toBeInTheDocument();
  });

  it("shows a count label and the selected chips", () => {
    render(<SkillPicker value={["s1"]} onChange={vi.fn()} />);
    // Trigger label reflects the count…
    expect(screen.getByText(/1 sélectionnée/)).toBeInTheDocument();
    // …and the selected skill renders as a chip.
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("removes a selected skill via its chip button", () => {
    const onChange = vi.fn();
    render(<SkillPicker value={["s1", "s2"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Retirer Go/ }));
    expect(onChange).toHaveBeenCalledWith(["s2"]);
  });
});
