"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { fetchCrmFiles, fetchCrmRecord, updateCrmRecord, uploadCrmFile } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";
import { formatDisplayDate, nightsBetween } from "@/lib/backend/period";
import Link from "next/link";

const VISA_STEPS = ["Dossier ouvert", "Pièces", "Dépôt", "Entretien", "Décision", "Visa obtenu"];

type KalaoFicheProps = {
  resource: string;
  id: string;
  title: string;
  backHref: string;
  kind: "travel" | "immigration";
};

function fieldValue(record: Record<string, unknown> | null, ...keys: string[]) {
  if (!record) return "";
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim() !== "") return String(value);
  }
  return "";
}

const KalaoFiche = ({ resource, id, title, backHref, kind }: KalaoFicheProps) => {
  const { t } = useI18n();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [files, setFiles] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [row, attachments] = await Promise.all([
        fetchCrmRecord<Record<string, unknown>>(resource, id),
        fetchCrmFiles(kind, id),
      ]);
      setRecord(row);
      setFiles(attachments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fiche introuvable");
    }
  };

  useEffect(() => {
    void load();
  }, [resource, id]);

  const advanceVisa = async (step: string) => {
    await updateCrmRecord(resource, id, { step, status: step });
    await load();
  };

  const onUpload = async (file: File) => {
    await uploadCrmFile(file, kind, id);
    await load();
  };

  const departure = fieldValue(record, "departureDate");
  const returnDate = fieldValue(record, "returnDate");
  const nights = nightsBetween(departure, returnDate);
  const itinerary = fieldValue(record, "itinerary");
  const pax = fieldValue(record, "pax") || "1";

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader title={title} showModuleTile moduleTitle="Métiers" showExport={false} />
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <div className="mb-3">
          <Link href={backHref} className="btn btn-outline-light">
            {t("Back")}
          </Link>
        </div>
        <div className="row">
          <div className="col-lg-7">
            {kind === "travel" ? (
              <>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">{t("Quote ID")}</span>
                      <strong>{fieldValue(record, "number") || "—"}</strong>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">{t("Client")}</span>
                      <strong>{fieldValue(record, "accountName", "Client") || "—"}</strong>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">{t("Destination")}</span>
                      <strong>{fieldValue(record, "destination") || "—"}</strong>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">{t("Status")}</span>
                      <strong>{fieldValue(record, "status") || "—"}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span className="text-muted">{t("Amount")}</span>
                      <strong>
                        {record?.amount != null
                          ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                              Number(record.amount) || 0,
                            )
                          : "—"}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h6 className="mb-3">{t("Itinerary")}</h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-3">
                        <div className="text-muted small">{t("Pax")}</div>
                        <strong>{pax}</strong>
                      </div>
                      <div className="col-md-3">
                        <div className="text-muted small">{t("Departure Date")}</div>
                        <strong>{formatDisplayDate(departure) || "—"}</strong>
                      </div>
                      <div className="col-md-3">
                        <div className="text-muted small">{t("Return Date")}</div>
                        <strong>{formatDisplayDate(returnDate) || "—"}</strong>
                      </div>
                      <div className="col-md-3">
                        <div className="text-muted small">{t("Nights")}</div>
                        <strong>{nights == null || nights < 0 ? "—" : nights}</strong>
                      </div>
                    </div>
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {itinerary || "—"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="card-body">
                  {record
                    ? Object.entries(record)
                        .filter(([key]) => !["id", "image"].includes(key))
                        .map(([key, value]) => (
                          <div className="d-flex justify-content-between border-bottom py-2" key={key}>
                            <span className="text-muted">{t(key)}</span>
                            <strong>{String(value ?? "—")}</strong>
                          </div>
                        ))
                    : t("Loading")}
                </div>
              </div>
            )}
            {kind === "immigration" ? (
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-3">{t("Visa workflow")}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {VISA_STEPS.map((step) => (
                      <button
                        key={step}
                        type="button"
                        className={`btn btn-sm ${record?.step === step ? "btn-primary" : "btn-outline-light"}`}
                        onClick={() => void advanceVisa(step)}
                      >
                        {t(step)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-3">{t("Attachments")}</h6>
                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void onUpload(file);
                  }}
                />
                <ul className="list-group">
                  {files.map((file) => (
                    <li className="list-group-item d-flex justify-content-between" key={String(file.id)}>
                      <a href={String(file.url)} target="_blank" rel="noreferrer">
                        {String(file.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KalaoFiche;
