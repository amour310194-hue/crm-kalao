import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  formatInvoiceNumber,
  installmentLabels,
  invoiceTotal,
  lineTotal,
  splitEven,
  validateDraft,
  validateSchedule,
  type InstallmentInput,
  type InvoiceLineInput,
} from "@/lib/invoicing";

const line = (over: Partial<InvoiceLineInput> = {}): InvoiceLineInput => ({
  label: "Visa Russie",
  quantity: 1,
  unitPrice: 1_500_000,
  discount: 0,
  taxRate: 0,
  ...over,
});

const part = (over: Partial<InstallmentInput> = {}): InstallmentInput => ({
  label: "Solde",
  amount: 1_500_000,
  dueDate: "2026-12-01",
  conditional: false,
  condition: "",
  ...over,
});

describe("facturation", () => {
  it("calcule le total des lignes sans taxe IGS, remise déduite", () => {
    expect(lineTotal(line({ quantity: 2, unitPrice: 100_000, discount: 50_000 }))).toBe(150_000);
    expect(invoiceTotal([line(), line({ unitPrice: 200_000, discount: 0 })])).toBe(1_700_000);
  });

  it("garde la taxe dans le calcul quand un taux est fourni", () => {
    expect(lineTotal(line({ unitPrice: 1000, taxRate: 19.25 }))).toBe(1193);
  });

  it("refuse un échéancier dont la somme diffère du total", () => {
    expect(validateSchedule(1_000, [part({ amount: 400 }), part({ amount: 500, label: "Solde" })])).toMatch(/doit égaler/);
  });

  it("accepte une échéance conditionnelle sans date", () => {
    const error = validateDraft({
      contactId: "c",
      dossierId: "d",
      lines: [line({ unitPrice: 200_000 })],
      installments: [
        part({ amount: 200_000, conditional: true, dueDate: "", condition: "si tiré du bassin" }),
      ],
    });
    expect(error).toBeNull();
  });

  it("découpe sans perdre de franc et numérote FAC-KALAO-2026", () => {
    expect(splitEven(1_000_001, 3)).toEqual([333_333, 333_333, 333_335]);
    expect(installmentLabels(3)).toEqual(["Avance", "2e échéance", "Solde"]);
    expect(formatInvoiceNumber(2026, 1)).toBe("FAC-KALAO-2026-0001");
    expect(formatInvoiceNumber(2026, 26)).toBe("FAC-KALAO-2026-0026");
  });

  it("attribue le numéro dans la même fonction que nextval", () => {
    const sql = readFileSync("supabase/migrations/20261007_v40_invoice_drafts.sql", "utf8");
    expect(sql).toContain("nextval('public.invoice_number_seq')");
    expect(sql).toContain("FAC-KALAO-");
    expect(sql).toContain("legacy_ref");
    expect(sql).toContain("_backup_20261007_invoice_numbers");
    expect(sql).toMatch(/create_invoice_drafts[\s\S]*echeances_total/);
  });
});
