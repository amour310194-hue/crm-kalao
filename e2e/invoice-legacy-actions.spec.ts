import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const root = resolve(__dirname, "..");

const surfaces = [
  "src/components/Pages/crm-module/invoices/invoicesList.tsx",
  "src/components/Pages/crm-module/invoices/invoicesGrid.tsx",
  "src/components/Pages/crm-module/payments/payments.tsx",
  "src/components/Pages/crm-module/payments/modal/modalPayments.tsx",
  "src/components/docs/KalaoInvoiceInject.tsx",
  "src/lib/crm.ts",
];

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

test("les écrans facture et paiement ne proposent plus les actions du template", () => {
  const blob = surfaces.map((file) => readFileSync(resolve(root, file), "utf8")).join("\n");
  for (const label of forbidden) {
    expect(blob, label).not.toContain(label);
  }
});
