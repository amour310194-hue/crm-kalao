"use client";

import { useEffect, useState } from "react";
import { createCrmRecord, updateCrmRecord } from "@/lib/api/crmClient";
import { fieldsFor } from "@/lib/forms/resourceFields";
import { useI18n } from "@/i18n/I18nProvider";
import { nightsBetween, toIsoDateString } from "@/lib/backend/period";

type KalaoFormModalProps = {
  resource: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  record?: Record<string, unknown> | null;
};

const KalaoFormModal = ({ resource, open, onClose, onSaved, record }: KalaoFormModalProps) => {
  const { t } = useI18n();
  const fields = fieldsFor(resource);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const next: Record<string, string> = {};
    fields.forEach((field) => {
      const value = record?.[field.name];
      if (field.type === "date") {
        next[field.name] = toIsoDateString(value) ?? "";
      } else {
        next[field.name] = value == null ? "" : String(value);
      }
    });
    setValues(next);
    setError("");
  }, [open, record, resource]);

  if (!open) {
    return null;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload: Record<string, unknown> = {};
    fields.forEach((field) => {
      const raw = values[field.name] ?? "";
      payload[field.name] = field.type === "number" ? Number(raw || 0) : raw;
    });
    if (resource === "travel") {
      const nights = nightsBetween(payload.departureDate, payload.returnDate);
      if (nights == null) {
        setError("Indiquez une date de départ et de retour.");
        setSaving(false);
        return;
      }
      if (nights < 0) {
        setError("La date de retour doit être après le départ.");
        setSaving(false);
        return;
      }
    }
    try {
      if (record?.id || record?.key) {
        await updateCrmRecord(resource, String(record.id || record.key), payload);
      } else {
        await createCrmRecord(resource, payload);
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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">{t(record ? "Edit" : "Add")} {t(resource)}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Fermer" />
            </div>
            <div className="modal-body">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="row">
                {fields.map((field) => (
                  <div className={`${field.wide ? "col-12" : "col-md-6"} mb-3`} key={field.name}>
                    <label className="form-label">{t(field.label)}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="form-control"
                        rows={3}
                        required={field.required}
                        value={values[field.name] ?? ""}
                        onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="form-select"
                        required={field.required}
                        value={values[field.name] ?? field.options?.[0] ?? ""}
                        onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      >
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {t(option)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        min={
                          field.name === "returnDate"
                            ? values.departureDate || undefined
                            : field.name === "pax"
                              ? "1"
                              : undefined
                        }
                        required={field.required}
                        value={values[field.name] ?? ""}
                        onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                {t("Cancel")}
              </button>
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

export default KalaoFormModal;
