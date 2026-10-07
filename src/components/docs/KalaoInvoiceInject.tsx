"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  explainRemind,
  fetchInvoices,
  formatDate,
  formatMoney,
  remindInvoiceById,
  type InvoiceRow,
} from "@/lib/crm";
import CollectPaymentButton from "@/components/Pages/crm-module/invoices/CollectPaymentButton";
import { docHref, isLiveId } from "@/lib/docs";

export default function KalaoInvoiceInject() {
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    void fetchInvoices().then((rows) => {
      if (!rows?.length) return;
      setInvoice((id && rows.find((row) => row.id === id)) || rows[0]);
    });
  }, []);

  if (!invoice || !isLiveId(invoice.id)) return null;
  const remaining = Math.max(0, Number(invoice.amount) - Number(invoice.paid_amount));
  return (
    <div className="alert alert-light border mb-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <p className="mb-1 fw-semibold">Facture Kalao</p>
          <p className="mb-0">
            {invoice.number ? `#${invoice.number}` : invoice.id.slice(0, 8)} ·{" "}
            {invoice.companies?.name ?? "Client"} · {formatMoney(invoice.amount)} ·
            encaissé {formatMoney(invoice.paid_amount)} · reste {formatMoney(remaining)} ·
            échéance {formatDate(invoice.due_date)}
          </p>
          {msg ? <p className="mb-0 mt-1 text-muted">{msg}</p> : null}
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <CollectPaymentButton
            variant="button"
            invoiceId={invoice.id}
            number={invoice.number ? `#${invoice.number}` : "Brouillon"}
            amount={Number(invoice.amount)}
            paid={Number(invoice.paid_amount)}
            status={invoice.status === "draft" ? "Brouillon" : invoice.status === "cancelled" ? "Annulée" : "Émise"}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            disabled={!(invoice.contacts?.email || invoice.companies?.email)}
            title={invoice.contacts?.email || invoice.companies?.email ? "Envoyer la relance" : "Ce client n'a pas d'adresse e-mail."}
            onClick={async () => {
              try {
                const result = await remindInvoiceById(invoice.id);
                setMsg(explainRemind(result));
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "Erreur");
              }
            }}
          >
            Relancer
          </button>
          <Link
            href={docHref("invoice", invoice.id)}
            target="_blank"
            className="btn btn-sm btn-dark"
          >
            <i className="ti ti-printer me-1" />
            Imprimer
          </Link>
        </div>
      </div>
    </div>
  );
}
