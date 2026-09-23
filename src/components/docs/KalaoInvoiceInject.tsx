"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchInvoices, formatDate, formatMoney, type InvoiceRow } from "@/lib/crm";
import { docHref, isLiveId } from "@/lib/docs";

export default function KalaoInvoiceInject() {
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    void fetchInvoices().then((rows) => {
      if (!rows?.length) return;
      setInvoice((id && rows.find((row) => row.id === id)) || rows[0]);
    });
  }, []);

  if (!invoice || !isLiveId(invoice.id)) return null;
  return (
    <div className="alert alert-light border mb-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <p className="mb-1 fw-semibold">Facture Kalao (live)</p>
          <p className="mb-0">
            {invoice.number ? `#${invoice.number}` : invoice.id.slice(0, 8)} ·{" "}
            {invoice.companies?.name ?? "Client"} · {formatMoney(invoice.amount)} ·
            échéance {formatDate(invoice.due_date)}
          </p>
        </div>
        <Link
          href={docHref("invoice", invoice.id)}
          target="_blank"
          className="btn btn-sm btn-dark"
        >
          <i className="ti ti-printer me-1" />
          Imprimer / PDF
        </Link>
      </div>
    </div>
  );
}
