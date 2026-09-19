"use client";

import { useEffect, useMemo, useState } from "react";
import { createCrmRecord, updateCrmRecord } from "@/lib/api/crmClient";
import { lineAmounts, quoteTotalsFromLines } from "@/lib/backend/quote-totals";
import { toIsoDateString } from "@/lib/backend/period";
import { useI18n } from "@/i18n/I18nProvider";

type CatalogOption = {
  id: string;
  name: string;
  unitPrice: number;
  taxRate: number;
  status?: string;
  Status?: string;
  ProductName?: string;
};

type CompanyOption = {
  id?: string;
  key?: string;
  Name?: string;
  name?: string;
};

type QuoteLineDraft = {
  key: string;
  catalogId: string;
  label: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  discountRate: string;
};

export type QuoteEditorRecord = Record<string, unknown> & {
  id?: string;
  key?: string;
  companyId?: string;
  quoteDate?: string;
  validTill?: string;
  quoteDateIso?: string;
  validTillIso?: string;
  number?: string;
  quoteId?: string;
  status?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  lines?: Array<Record<string, unknown>>;
};

type ModalQuotationsProps = {
  open: boolean;
  record: QuoteEditorRecord | null;
  catalog: CatalogOption[];
  companies: CompanyOption[];
  converting?: boolean;
  onClose: () => void;
  onSaved: () => void;
  onConvert?: (record: QuoteEditorRecord) => void;
};

const money = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function emptyLine(): QuoteLineDraft {
  return {
    key: `ql-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    catalogId: "",
    label: "",
    quantity: "1",
    unitPrice: "0",
    taxRate: "18",
    discountRate: "0",
  };
}

function asDraftLines(record: QuoteEditorRecord | null): QuoteLineDraft[] {
  const lines = Array.isArray(record?.lines) ? record.lines : [];
  if (!lines.length) return [emptyLine()];
  return lines.map((line, index) => ({
    key: String(line.id || line.key || `line-${index}`),
    catalogId: String(line.catalogId ?? ""),
    label: String(line.label ?? ""),
    quantity: String(line.quantity ?? 1),
    unitPrice: String(line.unitPrice ?? 0),
    taxRate: String(line.taxRate ?? 18),
    discountRate: String(line.discountRate ?? 0),
  }));
}

function catalogActive(item: CatalogOption) {
  return item.status === "active" || item.Status === "Active" || !item.status;
}

const ModalQuotations = ({
  open,
  record,
  catalog,
  companies,
  converting = false,
  onClose,
  onSaved,
  onConvert,
}: ModalQuotationsProps) => {
  const { t } = useI18n();
  const [companyId, setCompanyId] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [validTill, setValidTill] = useState("");
  const [lines, setLines] = useState<QuoteLineDraft[]>([emptyLine()]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCompanyId(String(record?.companyId ?? ""));
    setQuoteDate(toIsoDateString(record?.quoteDateIso ?? record?.quoteDate) ?? new Date().toISOString().slice(0, 10));
    setValidTill(toIsoDateString(record?.validTillIso ?? record?.validTill) ?? "");
    setLines(asDraftLines(record));
    setError("");
  }, [open, record]);

  const totals = useMemo(
    () =>
      quoteTotalsFromLines(
        lines.map((line) => ({
          quantity: Number(line.quantity) || 0,
          unitPrice: Number(line.unitPrice) || 0,
          taxRate: Number(line.taxRate) || 0,
          discountRate: Number(line.discountRate) || 0,
        }))
      ),
    [lines]
  );

  if (!open) return null;

  const invoiceNumber = String(record?.invoiceNumber || "");
  const canConvert = Boolean(record?.id || record?.key);

  const applyCatalog = (key: string, catalogId: string) => {
    const item = catalog.find((row) => row.id === catalogId);
    setLines((prev) =>
      prev.map((line) =>
        line.key === key
          ? {
              ...line,
              catalogId,
              label: item?.name || item?.ProductName || "",
              unitPrice: String(item?.unitPrice ?? 0),
              taxRate: String(item?.taxRate ?? 18),
            }
          : line
      )
    );
  };

  const updateLine = (key: string, field: keyof QuoteLineDraft, value: string) => {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, [field]: value } : line)));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payloadLines = lines
      .filter((line) => line.catalogId || line.label)
      .map((line) => ({
        catalogId: line.catalogId,
        label: line.label,
        quantity: Number(line.quantity) || 0,
        unitPrice: Number(line.unitPrice) || 0,
        taxRate: Number(line.taxRate) || 0,
        discountRate: Number(line.discountRate) || 0,
      }));
    if (!companyId) {
      setError("Choisissez un client.");
      return;
    }
    if (!payloadLines.length || payloadLines.every((line) => line.quantity <= 0)) {
      setError("Ajoutez au moins une ligne catalogue.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { companyId, quoteDate, validTill, lines: payloadLines };
    try {
      const id = record?.id || record?.key;
      if (id) {
        await updateCrmRecord("quotations", String(id), payload);
      } else {
        await createCrmRecord("quotations", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(15,23,42,.45)" }} role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <form onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">{t(record ? "Edit Quotation" : "Add Quotation")}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fermer" />
            </div>
            <div className="modal-body">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {invoiceNumber ? (
                <div className="alert alert-success mb-3">
                  {t("Invoice")} {invoiceNumber}
                </div>
              ) : null}
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">{t("Client")}</label>
                  <select
                    className="form-select"
                    required
                    value={companyId}
                    onChange={(event) => setCompanyId(event.target.value)}
                  >
                    <option value="">{t("Select")}</option>
                    {companies.map((company) => {
                      const id = String(company.id || company.key || "");
                      return (
                        <option key={id} value={id}>
                          {company.Name || company.name || id}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("Quote Date")}</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={quoteDate}
                    onChange={(event) => setQuoteDate(event.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("Valid Till")}</label>
                  <input
                    type="date"
                    className="form-control"
                    min={quoteDate || undefined}
                    value={validTill}
                    onChange={(event) => setValidTill(event.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive custom-table table-nowrap">
                <table className="table table-nowrap align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>{t("Product")}</th>
                      <th style={{ width: 88 }}>{t("Quantity")}</th>
                      <th style={{ width: 120 }}>{t("Unit Price")}</th>
                      <th style={{ width: 88 }}>{t("Tax %")}</th>
                      <th style={{ width: 88 }}>{t("Discount")}</th>
                      <th className="text-end">{t("HT")}</th>
                      <th className="text-end">{t("TVA")}</th>
                      <th className="text-end">{t("TTC")}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => {
                      const amounts = lineAmounts({
                        quantity: Number(line.quantity) || 0,
                        unitPrice: Number(line.unitPrice) || 0,
                        taxRate: Number(line.taxRate) || 0,
                        discountRate: Number(line.discountRate) || 0,
                      });
                      const options = catalog.filter(
                        (item) => catalogActive(item) || item.id === line.catalogId
                      );
                      return (
                        <tr key={line.key}>
                          <td>
                            <select
                              className="form-select"
                              value={line.catalogId}
                              onChange={(event) => applyCatalog(line.key, event.target.value)}
                            >
                              <option value="">{t("Select")}</option>
                              {options.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name || item.ProductName} · TVA {item.taxRate}%
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              step="1"
                              value={line.quantity}
                              onChange={(event) => updateLine(line.key, "quantity", event.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              step="0.01"
                              value={line.unitPrice}
                              onChange={(event) => updateLine(line.key, "unitPrice", event.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              step="0.01"
                              value={line.taxRate}
                              onChange={(event) => updateLine(line.key, "taxRate", event.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={line.discountRate}
                              onChange={(event) => updateLine(line.key, "discountRate", event.target.value)}
                            />
                          </td>
                          <td className="text-end text-nowrap">{money.format(amounts.ht)}</td>
                          <td className="text-end text-nowrap">{money.format(amounts.tva)}</td>
                          <td className="text-end text-nowrap fw-semibold">{money.format(amounts.ttc)}</td>
                          <td>
                            {lines.length > 1 ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger border-0"
                                onClick={() => setLines((prev) => prev.filter((item) => item.key !== line.key))}
                                aria-label={t("Delete")}
                              >
                                <i className="ti ti-xbox-x" />
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 mb-3"
                onClick={() => setLines((prev) => [...prev, emptyLine()])}
              >
                <i className="ti ti-plus me-1" />
                {t("Add New")}
              </button>

              <div className="card mb-0">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between mb-2 fw-semibold">
                    <span>{t("HT")}</span>
                    <span>{money.format(totals.ht)}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2 fw-semibold">
                    <span>{t("TVA")}</span>
                    <span>{money.format(totals.tva)}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between fw-semibold fs-16">
                    <span>{t("TTC")}</span>
                    <span>{money.format(totals.ttc)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                {t("Cancel")}
              </button>
              {canConvert && !invoiceNumber && onConvert && record ? (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={saving || converting}
                  onClick={() => onConvert(record)}
                >
                  {converting ? "..." : t("Convert to Invoice")}
                </button>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "..." : t("Save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalQuotations;
