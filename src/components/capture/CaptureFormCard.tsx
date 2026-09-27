"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { CaptureField } from "@/lib/capture-submit";
import { KALAO_LOGO_URL } from "@/lib/org";

type Status = "idle" | "sending" | "sent" | "error";

export function CaptureFormCard({
  title,
  description,
  fields,
  successMessage,
  preview = false,
  compact = false,
  onLiveSubmit,
}: {
  title: string;
  description: string | null;
  fields: CaptureField[];
  successMessage: string | null;
  preview?: boolean;
  compact?: boolean;
  onLiveSubmit?: (values: Record<string, string>) => Promise<boolean>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (preview || !onLiveSubmit) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const ok = await onLiveSubmit(values);
      setStatus(ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const card = (
    <div className={`card shadow-sm border-0 ${compact ? "p-3" : "p-4"}`} style={{ maxWidth: 480, width: "100%" }}>
      {preview ? (
        <div className="badge bg-warning text-dark mb-3">Prévisualisation — aucun lead ne sera créé</div>
      ) : null}
      {status === "sent" ? (
        <div className="text-center py-2">
          <p className="mb-0">{successMessage || "Merci, votre demande a bien été envoyée."}</p>
          {preview ? (
            <button type="button" className="btn btn-link btn-sm mt-2" onClick={() => setStatus("idle")}>
              Revenir au formulaire
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="text-center mb-3">
            <img src={KALAO_LOGO_URL} alt="Kalao" style={{ height: 40 }} />
          </div>
          <h5 className="mb-1">{title || (preview ? "Titre du formulaire" : "")}</h5>
          {description ? (
            <p className="text-muted mb-3">{description}</p>
          ) : preview ? (
            <p className="text-muted mb-3 small">Aucune description</p>
          ) : null}
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="mb-3" key={field.key}>
                <label className="form-label">
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValue(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                    className="form-control"
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValue(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
            {!preview ? (
              <input
                type="text"
                name="company_website"
                value={values.company_website ?? ""}
                onChange={(e) => setValue("company_website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                aria-hidden="true"
              />
            ) : null}
            {status === "error" ? (
              <p className="text-danger small mb-3">Une erreur est survenue, réessayez.</p>
            ) : null}
            <button type="submit" className="btn btn-primary w-100" disabled={status === "sending"}>
              {status === "sending" ? "Envoi…" : "Envoyer"}
            </button>
          </form>
        </>
      )}
    </div>
  );

  if (compact) return card;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      {card}
    </div>
  );
}
