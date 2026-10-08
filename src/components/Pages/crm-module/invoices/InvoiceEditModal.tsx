"use client";

import { useEffect, useState } from "react";
import { cancelInvoice, deleteDraftInvoice, fetchAuditLog, fetchDossiers, fetchInvoiceLines, saveDraftLines, updateInvoice } from "@/lib/crm";
import { lineTotal, validateLine, type InvoiceLineInput } from "@/lib/invoicing";
import { t } from "@/lib/i18n";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

export type InvoiceEditTarget = {
  key: string;
  Invoice_ID: string;
  amountValue: number;
  Due_Date: string;
  dueDateIso?: string;
  project: string;
  Status: string;
  dossierId?: string;
  storedStatus?: string;
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
  const draft = row.storedStatus === "draft" || row.Status === "Brouillon";
  const cancelled = row.storedStatus === "cancelled" || row.Status === "Annulée";
  const initialDue = row.dueDateIso || (/^\d{4}-\d{2}-\d{2}/.test(row.Due_Date) ? row.Due_Date.slice(0, 10) : "");
  const [dueDate, setDueDate] = useState(initialDue);
  const [project, setProject] = useState(row.project === "—" ? "" : row.project);
  const [dossierId, setDossierId] = useState(row.dossierId ?? "");
  const [dossiers, setDossiers] = useState<{ id: string; title: string }[]>([]);
  const [reason, setReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [history, setHistory] = useState<{ id: string; action: string; reason: string | null; created_at: string }[]>([]);
  const [tab, setTab] = useState<"edit" | "history">("edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<InvoiceLineInput[]>([]);

  useEffect(() => {
    if (!draft) return;
    void fetchInvoiceLines(row.key).then((rows) => {
      setLines(
        rows.length
          ? rows.map((line) => ({
              catalogItemId: line.catalog_item_id,
              label: line.label,
              quantity: Number(line.quantity),
              unitPrice: Number(line.unit_price),
              discount: Number(line.discount),
              taxRate: Number(line.tax_rate),
            }))
          : [{ label: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 }]
      );
    });
  }, [draft, row.key]);

  useEffect(() => {
    void fetchDossiers().then((rows) => {
      setDossiers((rows ?? []).map((item) => ({ id: item.id, title: item.title })));
    });
    void fetchAuditLog("invoices", row.key)
      .then((rows) => setHistory((rows ?? []) as typeof history))
      .catch(() => setHistory([]));
  }, [row.key]);

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
        if (draft) {
          for (const line of lines) {
            const invalid = validateLine(line);
            if (invalid) throw new Error(invalid);
          }
          await saveDraftLines(row.key, lines);
        }
        await updateInvoice(row.key, {
          due_date: dueDate || null,
          project: project || null,
          dossier_id: dossierId || null,
          amount: draft ? undefined : row.amountValue,
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

  const remove = async () => {
    setError(null);
    setSaving(true);
    try {
      await run(async () => {
        await deleteDraftInvoice(row.key);
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier la facture {row.Invoice_ID}</h5>
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
                        <span className="text-muted"> · {item.created_at?.slice(0, 16).replace("T", " ")}</span>
                        {item.reason ? <div>{item.reason}</div> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">Aucune trace pour cette facture.</p>
                )
              ) : cancelled ? (
                <p className="mb-0">Cette facture est déjà annulée. Elle n’est plus modifiable.</p>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Montant (FCFA)</label>
                    <input className="form-control" value={row.amountValue} disabled />
                    <div className="form-text">
                      {draft
                        ? "Le total vient des lignes. Il n'est pas saisi ici."
                        : "Montant verrouillé. Pour le corriger : annuler les encaissements, annuler la facture (un avoir est créé), puis émettre une nouvelle facture."}
                    </div>
                  </div>
                  {draft ? (
                    <div className="mb-3">
                      <label className="form-label">{t("draftLines")}</label>
                      {lines.map((line, index) => (
                        <div className="row g-2 mb-2" key={index}>
                          <div className="col-md-4">
                            <input
                              className="form-control"
                              placeholder={t("designation")}
                              value={line.label}
                              onChange={(event) =>
                                setLines((current) =>
                                  current.map((item, i) => (i === index ? { ...item, label: event.target.value } : item))
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="number"
                              className="form-control"
                              placeholder={t("quantity")}
                              value={line.quantity}
                              onChange={(event) =>
                                setLines((current) =>
                                  current.map((item, i) =>
                                    i === index ? { ...item, quantity: Number(event.target.value) } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="number"
                              className="form-control"
                              placeholder={t("unitPrice")}
                              value={line.unitPrice}
                              onChange={(event) =>
                                setLines((current) =>
                                  current.map((item, i) =>
                                    i === index ? { ...item, unitPrice: Number(event.target.value) } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="number"
                              className="form-control"
                              placeholder={t("discount")}
                              value={line.discount}
                              onChange={(event) =>
                                setLines((current) =>
                                  current.map((item, i) =>
                                    i === index ? { ...item, discount: Number(event.target.value) } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2 d-flex align-items-center justify-content-between">
                            <span>{lineTotal(line)}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-link"
                              onClick={() => setLines((current) => current.filter((_, i) => i !== index))}
                            >
                              {t("removeLine")}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setLines((current) => [
                            ...current,
                            { label: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 },
                          ])
                        }
                      >
                        {t("addLine")}
                      </button>
                      <div className="form-text">
                        {t("invoiceTotalLabel")} : {lines.reduce((sum, line) => sum + lineTotal(line), 0)} FCFA
                      </div>
                    </div>
                  ) : null}
                  <div className="mb-3">
                    <label className="form-label">Échéance</label>
                    <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Libellé</label>
                    <input className="form-control" value={project} onChange={(e) => setProject(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dossier</label>
                    <select className="form-select" value={dossierId} onChange={(e) => setDossierId(e.target.value)}>
                      <option value="">Choisir</option>
                      {dossiers.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {draft ? null : (
                    <div className="mb-3">
                      <label className="form-label">Motif de la modification</label>
                      <input className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} />
                      <div className="form-text">Toute modification d'une facture émise attend la validation d'un autre compte direction.</div>
                    </div>
                  )}
                  {draft ? null : (
                    <div className="mb-0">
                      <label className="form-label">Annuler (motif obligatoire)</label>
                      <input
                        className="form-control"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Erreur de saisie, doublon…"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Fermer
              </button>
              {tab === "edit" && draft ? (
                <button type="button" className="btn btn-outline-danger" onClick={() => void remove()} disabled={saving}>
                  Supprimer le brouillon
                </button>
              ) : null}
              {tab === "edit" && !cancelled && !draft ? (
                <button type="button" className="btn btn-outline-danger" onClick={() => void cancel()} disabled={saving || !cancelReason.trim()}>
                  Demander l'annulation
                </button>
              ) : null}
              {tab === "edit" && !cancelled ? (
                <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving || (!draft && !reason.trim())}>
                  {saving ? "Enregistrement…" : draft ? "Enregistrer" : "Demander la modification"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
