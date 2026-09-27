"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CaptureField } from "@/lib/capture-submit";
import { KALAO_LOGO_URL } from "@/lib/org";

interface Props {
  slug: string;
  title: string;
  description: string | null;
  fields: CaptureField[];
  successMessage: string | null;
}

export default function CaptureFormClient({ slug, title, description, fields, successMessage }: Props) {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`/api/capture/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          utm_source: searchParams.get("utm_source") ?? "",
          utm_medium: searchParams.get("utm_medium") ?? "",
          utm_campaign: searchParams.get("utm_campaign") ?? "",
          utm_content: searchParams.get("utm_content") ?? "",
        }),
      });
      const data = (await res.json()) as { ok: boolean };
      setStatus(data.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0 p-4 text-center" style={{ maxWidth: 480 }}>
          <p className="mb-0">{successMessage || "Merci, votre demande a bien été envoyée."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: 480, width: "100%" }}>
        <div className="text-center mb-3">
          <img src={KALAO_LOGO_URL} alt="Kalao" style={{ height: 40 }} />
        </div>
        <h5 className="mb-1">{title}</h5>
        {description ? <p className="text-muted mb-3">{description}</p> : null}
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
          {/* Piège à robots : champ invisible pour un humain, jamais rempli par lui. */}
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
          {status === "error" ? (
            <p className="text-danger small mb-3">Une erreur est survenue, réessayez.</p>
          ) : null}
          <button type="submit" className="btn btn-primary w-100" disabled={status === "sending"}>
            {status === "sending" ? "Envoi…" : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
