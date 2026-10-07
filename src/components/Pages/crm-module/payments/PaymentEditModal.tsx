"use client";

import { useState } from "react";
import { cancelPayment, updatePayment } from "@/lib/crm";
import { EXPENSE_METHODS } from "@/lib/expenses";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

export type PaymentEditTarget = {
  key: string;
  InvoiceID: string;
  invoiceId?: string;
  amountValue: number;
  paidAt: string;
  methodValue: string;
  notes: string;
  status: string;
};

export default function PaymentEditModal({
  row,
  onClose,
  onSaved,
}: {
  row: PaymentEditTarget;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(String(row.amountValue));
  const [paidAt, setPaidAt] = useState(String(row.paidAt ?? "").slice(0, 10));
  const [method, setMethod] = useState(row.methodValue || "cash");
  const [notes, setNotes] = useState(row.notes ?? "");
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = row.status === "annule";
  const { run, modal } = useFinanceUnlock();

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
      await updatePayment(row.key, {
        amount: Number(amount.replace(",", ".")),
        method,
        paid_at: paidAt,
        notes,
      });
      onSaved();
      onClose();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const cancel = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
      await cancelPayment(row.key, cancelReason);
      onSaved();
      onClose();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    {modal}
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier l'encaissement {row.InvoiceID}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {cancelled ? (
              <p className="mb-0">Cet encaissement est déjà annulé. Il n'est plus modifiable.</p>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Montant (FCFA)</label>
                  <input className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mode</label>
                  <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                    {EXPENSE_METHODS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className="mb-0">
                  <label className="form-label">Annuler (motif obligatoire)</label>
                  <input
                    className="form-control"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Erreur de saisie, doublon…"
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            {!cancelled ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={cancel}
                  disabled={saving || !cancelReason.trim()}
                >
                  Annuler l'encaissement
                </button>
                <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
