import { describe, expect, it } from "vitest";
import { pipelineSlugFor, sanitizePipelineSteps } from "./pipeline-config";

describe("pipeline configurable", () => {
  it("met toujours Clôturé en dernier", () => {
    const steps = sanitizePipelineSteps([
      { key: "done", label: "Clôturé" },
      { key: "soumission", label: "Dépôt de la demande" },
      { key: "consult", label: "Consultation" },
    ]);
    expect(steps.map((s) => s.key)).toEqual(["soumission", "consult", "done"]);
    expect(steps.at(-1)?.label).toBe("Clôturé");
  });

  it("Canada vs Russie", () => {
    expect(pipelineSlugFor("visa", "Immigration Canada")).toBe("visa_canada");
    expect(pipelineSlugFor("visa", "Visa Russie")).toBe("visa_other");
    expect(pipelineSlugFor("chantier")).toBe("generic");
  });
});
