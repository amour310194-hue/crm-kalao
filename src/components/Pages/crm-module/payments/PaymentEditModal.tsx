"use client";

import { useEffect, useState } from "react";
import { cancelPayment, fetchAuditLog, updatePayment } from "@/lib/crm";
import { PAYMENT_METHODS } from "@/lib/finance-rules";
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
  transactionId?: string;
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
  const [paidAt, setPaidAt] = useState(String(row.paidAt ?? "").slice(0, 10));
  const [method, setMethod] = useState(
    PAYMENT_METHODS.some((item) => item.value === row.methodValue) ? row.methodValue : "cash"
  );
  const [reference, setReference] = useState(row.transactionId && row.transactionId !== "—" ? row.transactionId : "");
  const [notes, setNotes] = useState(row.notes ?? "");
  const [reason, setReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [history, setHistory] = useState<{ id: string; action: string; reason: string | null; created_at: string }[]>([]);
  const [tab, setTab] = useState<"edit" | "history">("edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = row.status === "annule";
  const { run, modal } = useFinanceUnlock();

  useEffect(() => {
    void fetchAuditLog("payments", row.key)
      .then((rows) => setHistory((rows ?? []) as typeof history))
      .catch(() => setHistory([]));
  }, [row.key]);

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
        await updatePayment(row.key, {
          amount: row.amountValue,
          method,
          paid_at: paidAt,
          notes,
          transaction_id: reference,
          reason,
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
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button type="button" className={`nav-link ${tab === "edit" ? "active" : ""}`} onClick={() => setTab("edit")}>
                    Fiche
                  </button>
                </li>
                <li className="nav-item">
                  <button type="button" className={`nav-link ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
                    Historique
                  </button>
                </li>
              </ul>
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {tab === "history" ? (
                history.length ? (
                  <ul className="list-unstyled mb-0">
                    {history.map((item) => (
                      <li key={item.id} className="border-bottom py-2">
                        <strong>{item.action}</strong>
                        {item.reason ? <div>{item.reason}</div> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">Aucune trace pour cet encaissement.</p>
                )
              ) : cancelled ? (
                <p className="mb-0">Cet encaissement est déjà annulé. Il n'est plus modifiable.</p>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Montant (FCFA)</label>
                    <input className="form-control" value={row.amountValue} disabled />
                    <div className="form-text">Le montant ne se corrige pas. Annulez l'encaissement, puis saisissez-en un nouveau.</div>
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
                    <label className="form-label">Référence</label>
                    <input className="form-control" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Motif de la modification</label>
                    <input className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Annuler (motif obligatoire)</label>
                    <input
                      className="form-control"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Erreur de saisie, doublon…"
                    />
                    <div className="form-text">L'auteur de l'encaissement ne peut pas l'annuler. Un autre compte direction valide.</div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Fermer
              </button>
              {!cancelled && tab === "edit" ? (
                <>
                  <button type="button" className="btn btn-outline-danger" onClick={() => void cancel()} disabled={saving || !cancelReason.trim()}>
                    Demander l'annulation
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving || !reason.trim()}>
                    {saving ? "Enregistrement…" : "Demander la modification"}
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
