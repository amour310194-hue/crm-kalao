import { describe, expect, it } from "vitest";
import {
  normalizePipelineStatus,
  pipelineStatusLabel,
  procedurePipeline,
  visaIncludesBiometrics,
} from "./visa-pipeline";

describe("pipeline procédures visa", () => {
  it("inclut la biométrie seulement pour le Canada", () => {
    expect(visaIncludesBiometrics("Visa Canada")).toBe(true);
    expect(visaIncludesBiometrics("Visa Russie")).toBe(false);
    expect(visaIncludesBiometrics("Visa Allemagne")).toBe(false);

    const canada = procedurePipeline("visa", "Procédure Canada");
    expect(canada.some((s) => s.key === "biometrie")).toBe(true);
    expect(canada).toHaveLength(10);

    const russie = procedurePipeline("visa", "Procédure Russie");
    expect(russie.some((s) => s.key === "biometrie")).toBe(false);
    expect(russie).toHaveLength(9);
  });

  it("mappe les anciens statuts plan/design/develop vers le pipeline visa", () => {
    const steps = procedurePipeline("visa", "Visa Russie");
    expect(normalizePipelineStatus("plan", steps)).toBe("consult");
    expect(normalizePipelineStatus("design", steps)).toBe("documents");
    expect(normalizePipelineStatus("develop", steps)).toBe("constitution");
    expect(pipelineStatusLabel("plan", "visa", "Russie")).toBe("Consultation et éligibilité");
  });

  it("reporte la biométrie hors Canada vers le dépôt", () => {
    const steps = procedurePipeline("visa", "Visa Russie");
    expect(normalizePipelineStatus("biometrie", steps)).toBe("soumission");
  });
});
