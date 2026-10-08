"use client";

import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { formatMoney, recordPayment } from "@/lib/crm";
import { PAYMENT_METHODS, doualaToday, referenceRequired, remainingDue } from "@/lib/finance-rules";
import { explainInvoiceError } from "@/lib/invoicing";

export function CollectPaymentModal({
  invoiceId,
  number,
  amount,
  paid,
  onClose,
  onDone,
}: {
  invoiceId: string;
  number: string;
  amount: number;
  paid: number;
  onClose: () => void;
  onDone?: () => void;
}) {
  const remaining = remainingDue(amount, paid);
  const [value, setValue] = useState(String(remaining));
  const [method, setMethod] = useState("cash");
  const [paidAt, setPaidAt] = useState(doualaToday());
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await recordPayment({
        invoice_id: invoiceId,
        amount: Number(String(value).replace(/\s/g, "").replace(",", ".")),
        method,
        paid_at: paidAt,
        transaction_id: reference,
        notes,
      });
      onDone?.();
      onClose();
    } catch (err) {
      setError(explainInvoiceError(err instanceof Error ? err.message : "Erreur"));
    } finally {
      setBusy(false);
    }
  };

  const modal = (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1080 }} role="dialog">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={(event) => void submit(event)}>
          <div className="modal-header">
            <h5 className="modal-title">Encaisser {number}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <p className="text-muted">Reste dû : {formatMoney(remaining)}</p>
            <div className="mb-3">
              <label className="form-label">Montant</label>
              <input className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date réelle</label>
              <input type="date" className="form-control" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Mode</label>
              <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                {PAYMENT_METHODS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Référence {referenceRequired(method) ? "" : "(facultative)"}</label>
              <input className="form-control" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="mb-0">
              <label className="form-label">Notes</label>
              <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Enregistrement…" : "Encaisser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

export default function CollectPaymentButton({
  invoiceId,
  number,
  amount,
  paid,
  status,
  onDone,
  variant = "item",
}: {
  invoiceId: string;
  number: string;
  amount: number;
  paid: number;
  status: string;
  onDone?: () => void;
  variant?: "item" | "button";
}) {
  const [open, setOpen] = useState(false);
  const remaining = remainingDue(amount, paid);
  const blocked =
    status === "Brouillon" ||
    status === "Annulée" ||
    status === "draft" ||
    status === "cancelled" ||
    remaining <= 0;
  if (blocked) return null;

  return (
    <>
      <button
        type="button"
        className={variant === "button" ? "btn btn-sm btn-dark" : "dropdown-item"}
        onMouseDown={(event) => event.preventDefault()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <i className="ti ti-cash me-1" /> Encaisser
      </button>
      {open ? (
        <CollectPaymentModal
          invoiceId={invoiceId}
          number={number}
          amount={amount}
          paid={paid}
          onClose={() => setOpen(false)}
          onDone={onDone}
        />
      ) : null}
    </>
  );
}
