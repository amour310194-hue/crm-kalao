import { isCanadaProcedure } from "@/lib/org";

export type PipelineStep = { key: string; label: string };

export const GENERIC_PIPELINE: PipelineStep[] = [
  { key: "plan", label: "Consultation et éligibilité" },
  { key: "design", label: "Collecte des documents" },
  { key: "develop", label: "Constitution du dossier" },
  { key: "done", label: "Clôturé" },
];

/** 10 étapes visa. La biométrie n’existe que pour le Canada. */
export const VISA_PIPELINE: PipelineStep[] = [
  { key: "consult", label: "Consultation et éligibilité" },
  { key: "ouverture", label: "Ouverture de dossier" },
  { key: "documents", label: "Collecte des documents" },
  { key: "constitution", label: "Constitution du dossier" },
  { key: "soumission", label: "Dépôt de la demande" },
  { key: "biometrie", label: "Biométrie" },
  { key: "traitement", label: "Traitement" },
  { key: "decision", label: "Décision" },
  { key: "retrait", label: "Retrait du visa" },
  { key: "done", label: "Clôturé" },
];

const LEGACY_TO_VISA: Record<string, string> = {
  plan: "consult",
  design: "documents",
  develop: "constitution",
  done: "done",
};

export const PIPELINE_STEP_CLS = [
  "bg-indigo",
  "bg-cyan",
  "bg-success",
  "bg-orange",
  "bg-primary",
  "bg-info",
  "bg-warning",
  "bg-danger",
  "bg-purple",
  "bg-dark",
];

export function visaIncludesBiometrics(...texts: (string | null | undefined)[]): boolean {
  return isCanadaProcedure(...texts);
}

export function procedurePipeline(
  kind?: string | null,
  ...texts: (string | null | undefined)[]
): PipelineStep[] {
  if (kind === "visa") {
    if (visaIncludesBiometrics(...texts)) return VISA_PIPELINE;
    return VISA_PIPELINE.filter((step) => step.key !== "biometrie");
  }
  return GENERIC_PIPELINE;
}

export function normalizePipelineStatus(
  status: string | null | undefined,
  steps: PipelineStep[]
): string {
  if (!status) return "";
  if (status === "cancelled") return status;
  const keys = new Set(steps.map((step) => step.key));
  if (keys.has(status)) return status;
  const mapped = LEGACY_TO_VISA[status] ?? status;
  if (keys.has(mapped)) return mapped;
  if (mapped === "biometrie") return "soumission";
  return status;
}

export function pipelineStatusLabel(
  status: string | null | undefined,
  kind?: string | null,
  ...texts: (string | null | undefined)[]
): string {
  if (!status) return "—";
  if (status === "cancelled") return "Annulé";
  const steps = procedurePipeline(kind, ...texts);
  const key = normalizePipelineStatus(status, steps);
  return (
    steps.find((step) => step.key === key)?.label ??
    GENERIC_PIPELINE.find((step) => step.key === status)?.label ??
    status
  );
}
