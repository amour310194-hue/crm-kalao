import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261007_v39_forbid_invoice_payment_delete.sql",
  "utf8"
);

const surfaces = [
  "src/components/Pages/crm-module/invoices/invoicesList.tsx",
  "src/components/Pages/crm-module/invoices/invoicesGrid.tsx",
  "src/components/Pages/crm-module/payments/payments.tsx",
  "src/components/Pages/crm-module/payments/modal/modalPayments.tsx",
  "src/components/docs/KalaoInvoiceInject.tsx",
  "src/lib/crm.ts",
].map((file) => readFileSync(file, "utf8")).join("\n");

const forbidden = [
  "Mark as Paid",
  "Mark as Partially Paid",
  "Mark ad Unpaid",
  "Mark as Unpaid",
  "Add New Invoice",
  "delete_invoices",
  "delete_payments",
  "Encaisser le reste",
  "Remettre impayée",
  "Yes, Delete",
  "markInvoicePaid",
  "markInvoiceUnpaid",
  "deleteInvoice",
];

describe("suppression factures et paiements", () => {
  it("interdit le DELETE par trigger pour tous les rôles", () => {
    expect(migration).toContain("raise exception 'suppression_interdite'");
    expect(migration).toContain("before delete on public.invoices");
    expect(migration).toContain("before delete on public.payments");
    expect(migration).toContain("enable always trigger invoices_forbid_delete");
    expect(migration).toContain("enable always trigger payments_forbid_delete");
    expect(migration).toContain("revoke delete on table public.invoices");
    expect(migration).toContain("revoke delete on table public.payments");
    expect(migration).toContain("from public, anon, authenticated, service_role");
  });

  it("ne propose plus les actions du template sur les écrans facture et paiement", () => {
    for (const label of forbidden) {
      expect(surfaces, label).not.toContain(label);
    }
  });
});
