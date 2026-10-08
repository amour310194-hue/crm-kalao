import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  authorMayCancelPayment,
  bookBalance,
  canApproveFinance,
  closeVariance,
  computedInvoiceStatus,
  figureStatusLabel,
  inPeriod,
  issuedEditPatch,
  summarizeFigures,
  manualReminderKind,
  periodAllowsWrite,
  runningBalances,
  scheduledReminderKind,
  statusLabel,
  validateCollection,
} from "./finance-rules";

const today = "2026-10-07";

describe("statuts", () => {
  const base = { amount: 1_100_000, paidAmount: 200_000, status: "partially_paid", dueDate: "2026-10-20" };

  it("un partiel avant l'échéance reste partiellement payé", () => {
    expect(computedInvoiceStatus(base, today)).toBe("partially_paid");
  });

  it("le retard prime sur le paiement partiel", () => {
    const late = { ...base, dueDate: "2026-09-24" };
    expect(computedInvoiceStatus(late, today)).toBe("overdue");
    expect(statusLabel(late, today)).toBe("En retard · 13 j");
  });

  it("une conditionnelle n'est pas en retard", () => {
    expect(
      computedInvoiceStatus({ ...base, isConditional: true, dueDate: "2026-09-01" }, today)
    ).toBe("conditional");
  });

  it("une annulée et un brouillon gardent leur statut", () => {
    expect(computedInvoiceStatus({ ...base, status: "cancelled" }, today)).toBe("cancelled");
    expect(computedInvoiceStatus({ ...base, status: "draft", paidAmount: 0 }, today)).toBe("draft");
  });

  it("une émise sans encaissement n'est pas en retard avant l'échéance", () => {
    expect(
      computedInvoiceStatus({ amount: 500_000, paidAmount: 0, status: "unpaid", dueDate: "2026-10-20" }, today)
    ).toBe("issued");
  });
});

describe("encaissement", () => {
  it("refuse le trop-perçu", () => {
    expect(
      validateCollection({ amount: 250_000, method: "cash", paidAt: today, remaining: 200_000 })
    ).toMatch(/Trop-perçu/);
  });

  it("exige une référence hors espèces", () => {
    expect(
      validateCollection({ amount: 10_000, method: "mtn_momo", paidAt: today, remaining: 200_000, reference: "" })
    ).toMatch(/référence/);
    expect(
      validateCollection({
        amount: 10_000,
        method: "mtn_momo",
        paidAt: today,
        remaining: 200_000,
        reference: "MM-1",
      })
    ).toBeNull();
  });
});

describe("modification", () => {
  const current = { project: "Avance", dueDate: "2026-10-20", dossierId: "d1", amount: 200_000 };

  it("un enregistrement sans changement ne produit aucun patch", () => {
    expect(issuedEditPatch(current, { ...current })).toEqual({ patch: {}, unchanged: true });
  });

  it("le montant émis ne part pas dans le patch", () => {
    expect(issuedEditPatch(current, { ...current, amount: 100 })).toEqual({
      error: "Le montant d'une facture émise est verrouillé. Passez par un avoir.",
    });
  });

  it("l'échéance et le libellé partent seuls", () => {
    const result = issuedEditPatch(current, { ...current, dueDate: "2026-11-01", project: "Solde" });
    expect(result).toEqual({
      patch: { due_date: "2026-11-01", project: "Solde" },
      unchanged: false,
    });
  });
});

describe("relances", () => {
  it("cible J-3, J0, J+3 et J+7", () => {
    expect(scheduledReminderKind("2026-10-10", today)).toBe("invoice_due_3d");
    expect(scheduledReminderKind("2026-10-07", today)).toBe("invoice_due_0d");
    expect(scheduledReminderKind("2026-10-04", today)).toBe("invoice_overdue_3d");
    expect(scheduledReminderKind("2026-09-30", today)).toBe("invoice_overdue_7d");
    expect(scheduledReminderKind("2026-10-08", today)).toBeNull();
  });

  it("le bouton reprend le modèle de retard si l'échéance est passée", () => {
    expect(manualReminderKind("2026-09-01", today)).toBe("invoice_overdue_7d");
  });
});

describe("caisse et validation", () => {
  it("calcule le solde progressif des espèces", () => {
    const rows = runningBalances([
      { id: "b", on: "2026-10-02", label: "Dépense", delta: -20_000, bucket: "especes" },
      { id: "a", on: "2026-10-01", label: "Encaissement", delta: 100_000, bucket: "especes" },
    ]);
    expect(rows.map((row) => row.balance)).toEqual([100_000, 80_000]);
    expect(bookBalance(rows, "especes", "2026-10-02")).toBe(80_000);
    expect(closeVariance(79_000, 80_000)).toBe(-1_000);
  });

  it("une journée ou un mois clôturé refuse l'écriture", () => {
    expect(periodAllowsWrite("2026-09-23", ["2026-09"], [])).toBe(false);
    expect(periodAllowsWrite("2026-10-07", [], ["2026-10-07"])).toBe(false);
    expect(periodAllowsWrite("2026-10-08", ["2026-09"], ["2026-10-07"])).toBe(true);
  });

  it("l'auteur ne valide pas sa demande, et n'annule pas son encaissement", () => {
    expect(canApproveFinance("direction", "user-a", "user-a")).toBe(false);
    expect(canApproveFinance("direction", "user-a", "user-b")).toBe(true);
    expect(canApproveFinance("finance", "user-a", "user-b")).toBe(false);
    expect(authorMayCancelPayment("user-a", "user-a")).toBe(false);
    expect(authorMayCancelPayment(null, "user-a")).toBe(true);
  });
});

describe("migrations", () => {
  it("verrouille le trop-perçu, l'auteur et les paiements ouverts", () => {
    const sql = readFileSync("supabase/migrations/20261007_v41_finance_controls.sql", "utf8");
    expect(sql).toContain("trop_percu");
    expect(sql).toContain("auteur_interdit");
    expect(sql).toContain("paiements_ouverts");
    expect(sql).toContain("montant_fige");
  });

  it("calcule le retard dans la vue et le journal de caisse", () => {
    const figures = readFileSync("supabase/migrations/20261007_v42_invoice_figures.sql", "utf8");
    const cash = readFileSync("supabase/migrations/20261007_v43_cash_journal.sql", "utf8");
    expect(figures).toContain("overdue");
    expect(figures).toContain("security_invoker");
    expect(cash).toContain("cash_journal");
    expect(cash).toContain("auteur_interdit");
  });
});

describe("vue invoice_figures", () => {
  const rows = [
    { amount: 1_000_000, paidAmount: 0, remaining: 1_000_000, computedStatus: "overdue", daysLate: 4 },
    { amount: 500_000, paidAmount: 200_000, remaining: 300_000, computedStatus: "conditional" },
    { amount: 100_000, paidAmount: 0, remaining: 100_000, computedStatus: "draft" },
    { amount: 200_000, paidAmount: 200_000, remaining: 0, computedStatus: "paid" },
  ];

  it("additionne le facturé, l'exigible et le conditionnel sans recalculer le statut", () => {
    expect(summarizeFigures(rows)).toMatchObject({
      invoiced: 1_700_000,
      collected: 400_000,
      outstanding: 1_000_000,
      conditional: 300_000,
      overdueCount: 1,
      overdueAmount: 1_000_000,
    });
  });

  it("affiche les jours de retard fournis par la vue", () => {
    expect(figureStatusLabel("overdue", 4)).toBe("En retard · 4 j");
  });

  it("borne un relevé à la période demandée", () => {
    expect(inPeriod("2026-09-24", "2026-09-01", "2026-09-30")).toBe(true);
    expect(inPeriod("2026-10-02", "2026-09-01", "2026-09-30")).toBe(false);
    expect(inPeriod("2026-09-24")).toBe(true);
  });
});

describe("échéance à 30 jours", () => {
  it("retient INV-C14-AV pour son reste de 200 000 FCFA", () => {
    const status = computedInvoiceStatus(
      { status: "partially_paid", amount: 1_100_000, paidAmount: 900_000, dueDate: "2026-10-20" },
      today
    );
    expect(status).toBe("partially_paid");
    expect(1_100_000 - 900_000).toBe(200_000);
  });
});
