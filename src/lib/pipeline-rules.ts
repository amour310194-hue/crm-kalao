/** Conditions de passage et score prospect. Les autres pôles ne sont pas bloqués. */

export type StageNeed = "advance_paid" | "checklist_complete";

export const VISA_STAGE_REQUIRES: Record<string, StageNeed> = {
  ouverture: "advance_paid",
  soumission: "checklist_complete",
};

export function stageAdvanceBlock(input: {
  kind?: string | null;
  nextKey: string;
  advancePaid: boolean;
  checklistComplete: boolean;
}): string | null {
  if (input.kind !== "visa") return null;
  const need = VISA_STAGE_REQUIRES[input.nextKey];
  if (need === "advance_paid" && !input.advancePaid) {
    return "L'ouverture exige une facture d'avance payée.";
  }
  if (need === "checklist_complete" && !input.checklistComplete) {
    return "Le dépôt exige la checklist de pièces complète.";
  }
  return null;
}

export function leadScore(input: {
  phone?: string | null;
  email?: string | null;
  budget?: number | null;
  source?: string | null;
  hasActivity?: boolean;
}): number {
  let score = 0;
  if (input.phone?.trim() && input.email?.trim()) score += 30;
  if (Number(input.budget) > 0) score += 25;
  if (input.source?.trim()) score += 15;
  if (input.hasActivity) score += 30;
  return score;
}

export function passportAlert(expiresAt: string | null | undefined, today: string): boolean {
  if (!expiresAt) return false;
  const expires = expiresAt.slice(0, 10);
  const limit = new Date(`${today}T12:00:00Z`);
  limit.setUTCMonth(limit.getUTCMonth() + 6);
  const limitIso = limit.toISOString().slice(0, 10);
  return expires <= limitIso;
}
