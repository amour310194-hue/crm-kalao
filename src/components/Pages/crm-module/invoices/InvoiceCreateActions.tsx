"use client";

import { useState } from "react";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { t } from "@/lib/i18n";
import InvoiceComposer from "./InvoiceComposer";

export default function InvoiceCreateActions({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Link href={all_routes.invoiceGaps} className="btn btn-outline-primary">
        {t("invoicesToComplete")}
      </Link>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        <i className="ti ti-square-rounded-plus-filled me-1" />
        {t("newInvoice")}
      </button>
      {open ? <InvoiceComposer onClose={() => setOpen(false)} onSaved={onDone} /> : null}
    </>
  );
}
