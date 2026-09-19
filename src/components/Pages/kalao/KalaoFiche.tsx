"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { fetchCrmFiles, fetchCrmRecord, updateCrmRecord, uploadCrmFile } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";

const VISA_STEPS = ["Dossier ouvert", "Pièces", "Dépôt", "Entretien", "Décision", "Visa obtenu"];

type KalaoFicheProps = {
  resource: string;
  id: string;
  title: string;
  backHref: string;
  kind: "travel" | "immigration";
};

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
