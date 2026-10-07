"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCatalogItems, type CatalogItem } from "@/lib/catalog";
import {
  clientDisplayName,
  createInvoiceDrafts,
  fetchContacts,
  fetchDossiers,
  formatMoney,
  type ContactRow,
  type DossierRow,
} from "@/lib/crm";
import { todayDouala } from "@/lib/expenses";
import { t } from "@/lib/i18n";
import {
  explainInvoiceError,
  installmentLabels,
  invoiceTotal,
  splitEven,
  validateDraft,
  type InstallmentInput,
  type InvoiceLineInput,
} from "@/lib/invoicing";

function emptyLine(): InvoiceLineInput {
  return { catalogItemId: null, label: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 };
}

export default function InvoiceComposer({
  contactId,
  dossierId,
  onClose,
  onSaved,
}: {
  contactId?: string | null;
  dossierId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [dossiers, setDossiers] = useState<DossierRow[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [client, setClient] = useState(contactId ?? "");
  const [dossier, setDossier] = useState(dossierId ?? "");
  const [documentDate, setDocumentDate] = useState(todayDouala());
  const [lines, setLines] = useState<InvoiceLineInput[]>([emptyLine()]);
  const [parts, setParts] = useState<InstallmentInput[]>([
    { label: "Solde", amount: 0, dueDate: "", conditional: false, condition: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([fetchContacts(), fetchDossiers(), fetchCatalogItems()]).then(([people, files, items]) => {
      setContacts(people ?? []);
      setDossiers(files ?? []);
      setCatalog((items ?? []).filter((item) => item.status === "active"));
    });
  }, []);

  const total = invoiceTotal(lines);
  const contact = contacts.find((row) => row.id === client) ?? null;
  const dossierOptions = useMemo(() => {
    return dossiers.filter((row) => {
      if (row.id === dossier) return true;
      if (!client) return false;
      if (row.contact_id === client) return true;
      return Boolean(contact?.company_id && row.company_id === contact.company_id);
    });
  }, [dossiers, dossier, client, contact?.company_id]);

  useEffect(() => {
    setParts((current) => {
      if (current.length !== 1) return current;
      if (current[0].amount === total) return current;
      return [{ ...current[0], amount: total }];
    });
  }, [total]);

  const setLine = (index: number, patch: Partial<InvoiceLineInput>) => {
    setLines((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const applyCatalog = (index: number, itemId: string) => {
    const item = catalog.find((row) => row.id === itemId);
    if (!item) {
      setLine(index, { catalogItemId: null });
      return;
    }
    setLine(index, {
      catalogItemId: item.id,
      label: item.name,
      unitPrice: Number(item.unit_price),
      taxRate: 0,
    });
  };

  const split = () => {
    const amounts = splitEven(total, 3);
    const labels = installmentLabels(3);
    setParts(
      amounts.map((amount, index) => ({
        label: labels[index],
        amount,
        dueDate: "",
        conditional: false,
        condition: "",
      }))
    );
  };

  const save = async () => {
    const invalid = validateDraft({ contactId: client, dossierId: dossier, lines, installments: parts });
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createInvoiceDrafts({
        contact_id: client,
        dossier_id: dossier,
        document_date: documentDate,
        lines: lines.map((row) => ({
          catalog_item_id: row.catalogItemId || null,
          label: row.label.trim(),
          quantity: Number(row.quantity),
          unit_price: Number(row.unitPrice),
          discount: Number(row.discount),
          tax_rate: 0,
        })),
        installments: parts.map((row) => ({
          label: row.label.trim(),
          amount: Math.round(Number(row.amount)),
          due_date: row.dueDate,
          conditional: row.conditional,
          condition: row.condition.trim(),
        })),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(explainInvoiceError(err instanceof Error ? err.message : t("saveFailed")));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("newInvoice")}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">{t("client")}</label>
                <select className="form-select" value={client} onChange={(e) => setClient(e.target.value)}>
                  <option value="">{t("choose")}</option>
                  {contacts.map((row) => (
                    <option key={row.id} value={row.id}>
                      {clientDisplayName(row)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">{t("dossier")}</label>
                <select className="form-select" value={dossier} onChange={(e) => setDossier(e.target.value)}>
                  <option value="">{t("choose")}</option>
                  {dossierOptions.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">{t("issueDate")}</label>
                <input
                  type="date"
                  className="form-control"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                />
              </div>
            </div>

            <h6 className="mb-2">Lignes</h6>
            {lines.map((row, index) => (
              <div className="row g-2 align-items-end mb-2" key={index}>
                <div className="col-md-3">
                  <label className="form-label">{t("catalogService")}</label>
                  <select
                    className="form-select"
                    value={row.catalogItemId ?? ""}
                    onChange={(e) => applyCatalog(index, e.target.value)}
                  >
                    <option value="">{t("freeLine")}</option>
                    {catalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.sku ? `${item.sku} — ` : ""}
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">{t("designation")}</label>
                  <input
                    className="form-control"
                    value={row.label}
                    onChange={(e) => setLine(index, { label: e.target.value })}
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label">{t("quantity")}</label>
                  <input
                    className="form-control"
                    value={row.quantity}
                    onChange={(e) => setLine(index, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t("unitPrice")}</label>
                  <input
                    className="form-control"
                    value={row.unitPrice}
                    onChange={(e) => setLine(index, { unitPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t("discount")}</label>
                  <input
                    className="form-control"
                    value={row.discount}
                    onChange={(e) => setLine(index, { discount: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-1">
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setLines((current) => current.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mb-3" onClick={() => setLines((current) => [...current, emptyLine()])}>
              {t("addLine")}
            </button>
            <p className="fw-semibold">
              {t("invoiceTotalLabel")} : {formatMoney(total)}
            </p>
            <p className="text-muted fs-13">Impôt général synthétique : aucune taxe n&apos;est ajoutée.</p>

            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0">{t("schedule")}</h6>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={split} disabled={!(total > 0)}>
                {t("splitThree")}
              </button>
            </div>
            {parts.map((row, index) => (
              <div className="row g-2 align-items-end mb-2" key={index}>
                <div className="col-md-3">
                  <label className="form-label">Libellé</label>
                  <input
                    className="form-control"
                    value={row.label}
                    onChange={(e) =>
                      setParts((current) => current.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Montant</label>
                  <input
                    className="form-control"
                    value={row.amount}
                    onChange={(e) =>
                      setParts((current) =>
                        current.map((item, i) => (i === index ? { ...item, amount: Number(e.target.value) } : item))
                      )
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t("dueDate")}</label>
                  <input
                    type="date"
                    className="form-control"
                    value={row.dueDate}
                    disabled={row.conditional}
                    onChange={(e) =>
                      setParts((current) =>
                        current.map((item, i) => (i === index ? { ...item, dueDate: e.target.value } : item))
                      )
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={row.conditional}
                      onChange={(e) =>
                        setParts((current) =>
                          current.map((item, i) =>
                            i === index ? { ...item, conditional: e.target.checked, dueDate: e.target.checked ? "" : item.dueDate } : item
                          )
                        )
                      }
                    />
                    <span className="form-check-label">{t("conditional")}</span>
                  </label>
                </div>
                <div className="col-md-3">
                  <label className="form-label">{t("condition")}</label>
                  <input
                    className="form-control"
                    placeholder="si tiré du bassin"
                    value={row.condition}
                    disabled={!row.conditional}
                    onChange={(e) =>
                      setParts((current) =>
                        current.map((item, i) => (i === index ? { ...item, condition: e.target.value } : item))
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setParts((current) => [
                  ...current,
                  { label: "Échéance", amount: 0, dueDate: "", conditional: false, condition: "" },
                ])
              }
            >
              {t("addInstallment")}
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving}>
              {saving ? "Enregistrement…" : t("saveDrafts")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
