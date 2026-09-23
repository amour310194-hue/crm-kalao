"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  explainRemind,
  fetchInvoices,
  formatDate,
  formatMoney,
  markInvoiceUnpaid,
  recordPayment,
  remindInvoiceById,
  type InvoiceRow,
} from "@/lib/crm";
import { docHref, isLiveId } from "@/lib/docs";

export default function KalaoInvoiceInject() {
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    void fetchInvoices().then((rows) => {
      if (!rows?.length) return;
      setInvoice((id && rows.find((row) => row.id === id)) || rows[0]);
    });
  };

  useEffect(() => {
    load();
  }, []);

  if (!invoice || !isLiveId(invoice.id)) return null;
  const remaining = Math.max(0, Number(invoice.amount) - Number(invoice.paid_amount));
  return (
    <div className="alert alert-light border mb-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <p className="mb-1 fw-semibold">Facture Kalao (live)</p>
          <p className="mb-0">
            {invoice.number ? `#${invoice.number}` : invoice.id.slice(0, 8)} ·{" "}
            {invoice.companies?.name ?? "Client"} · {formatMoney(invoice.amount)} ·
            encaissé {formatMoney(invoice.paid_amount)} · reste {formatMoney(remaining)} ·
            échéance {formatDate(invoice.due_date)}
          </p>
          {msg ? <p className="mb-0 mt-1 text-muted">{msg}</p> : null}
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {remaining > 0 ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={async () => {
                try {
                  await recordPayment({ invoice_id: invoice.id, amount: remaining });
                  setMsg(`Encaissé ${formatMoney(remaining)}.`);
                  load();
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Erreur");
                }
              }}
            >
              Encaisser le reste
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={async () => {
                try {
                  await markInvoiceUnpaid(invoice.id);
                  setMsg("Facture remise impayée.");
                  load();
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Erreur");
                }
              }}
            >
              Remettre impayée
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
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
            Imprimer / PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
