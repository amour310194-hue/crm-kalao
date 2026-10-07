import { GENERIC_PIPELINE, VISA_PIPELINE, type PipelineStep } from "@/lib/visa-pipeline";
import { isCanadaProcedure } from "@/lib/org";

export type PipelineSlug = "visa_canada" | "visa_other" | "generic";

export const PIPELINE_DEFAULTS: Record<PipelineSlug, PipelineStep[]> = {
  visa_canada: VISA_PIPELINE,
  visa_other: VISA_PIPELINE.filter((step) => step.key !== "biometrie"),
  generic: GENERIC_PIPELINE,
};

export const PIPELINE_SLUG_LABEL: Record<PipelineSlug, string> = {
  visa_canada: "Visa — Canada (avec biométrie)",
  visa_other: "Visa — autres pays (sans biométrie)",
  generic: "Autres dossiers",
};

export function pipelineSlugFor(kind?: string | null, ...texts: (string | null | undefined)[]): PipelineSlug {
  if (kind === "visa") {
    return isCanadaProcedure(...texts) ? "visa_canada" : "visa_other";
  }
  return "generic";
}

export function sanitizePipelineSteps(steps: PipelineStep[]): PipelineStep[] {
  const cleaned = steps
    .map((step, i) => ({
      key: String(step.key || `etape_${i + 1}`)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_") || `etape_${i + 1}`,
      label: String(step.label || "").trim() || `Étape ${i + 1}`,
    }))
    .filter((step, i, all) => all.findIndex((other) => other.key === step.key) === i);
  const cloture = cleaned.filter((s) => s.key === "done" || /clôtur|clotur/i.test(s.label));
  const rest = cleaned.filter((s) => s.key !== "done" && !/clôtur|clotur/i.test(s.label));
  const end = cloture[0] ?? { key: "done", label: "Clôturé" };
  return [...rest, end];
}

export function parsePipelineMap(raw: unknown): Record<PipelineSlug, PipelineStep[]> {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const next = { ...PIPELINE_DEFAULTS };
  (Object.keys(PIPELINE_DEFAULTS) as PipelineSlug[]).forEach((slug) => {
    const rows = obj[slug];
    if (Array.isArray(rows) && rows.length) {
      next[slug] = sanitizePipelineSteps(rows as PipelineStep[]);
    }
  });
  return next;
}
