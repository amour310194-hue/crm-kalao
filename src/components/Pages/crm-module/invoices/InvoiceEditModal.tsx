"use client";

import { useState } from "react";
import { cancelInvoice, updateInvoice } from "@/lib/crm";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

export type InvoiceEditTarget = {
  key: string;
  Invoice_ID: string;
  amountValue: number;
  Due_Date: string;
  project: string;
  Status: string;
};

export default function InvoiceEditModal({
  row,
  onClose,
  onSaved,
}: {
  row: InvoiceEditTarget;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { run, modal } = useFinanceUnlock();
  const [amount, setAmount] = useState(String(row.amountValue));
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState(row.project === "—" ? "" : row.project);
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = row.Status === "Annulée";

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
        await updateInvoice(row.key, {
          amount: Number(amount.replace(",", ".")),
          due_date: dueDate || null,
          project: project || null,
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
        await cancelInvoice(row.key, cancelReason);
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
              <h5 className="modal-title">Modifier la facture {row.Invoice_ID}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {cancelled ? (
                <p className="mb-0">Cette facture est déjà annulée. Elle n’est plus modifiable.</p>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Montant (FCFA)</label>
                    <input className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Échéance</label>
                    <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Libellé</label>
                    <input className="form-control" value={project} onChange={(e) => setProject(e.target.value)} />
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
                    onClick={() => void cancel()}
                    disabled={saving || !cancelReason.trim()}
                  >
                    Annuler la facture
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving}>
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
