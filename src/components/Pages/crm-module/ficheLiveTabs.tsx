"use client";
import Link from "next/link";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import {
  dossierFlag,
  formatDate,
  type ActivityRow,
  type DossierRow,
} from "@/lib/crm";
import {
  normalizePipelineStatus,
  PIPELINE_STEP_CLS,
  pipelineStatusLabel,
  procedurePipeline,
} from "@/lib/visa-pipeline";

function activityIcon(type: string) {
  if (type === "call") return { icon: "ti ti-phone", bg: "bg-success" };
  if (type === "email") return { icon: "ti ti-mail-code", bg: "bg-info" };
  if (type === "note") return { icon: "ti ti-notes", bg: "bg-warning" };
  return { icon: "ti ti-alarm-minus", bg: "bg-primary" };
}

export function FichePipeline({
  status,
  kind,
  title,
  notes,
  onPick,
}: {
  status?: string | null;
  kind?: string | null;
  title?: string | null;
  notes?: string | null;
  onPick?: (status: string) => void;
}) {
  const steps = procedurePipeline(kind, title, notes);
  const current = normalizePipelineStatus(status, steps);
  const idx = steps.findIndex((step) => step.key === current);
  return (
    <div className="mb-3 pb-3 border-bottom">
      <h5 className="mb-3">Pipeline de la procédure</h5>
      <div className="step-progress d-flex flex-wrap gap-2">
        {steps.map((step, i) => (
          <div
            key={step.key}
            className={`step ${idx < 0 || i <= idx ? PIPELINE_STEP_CLS[i % PIPELINE_STEP_CLS.length] : "bg-light text-muted"}`}
            role={onPick ? "button" : undefined}
            onClick={onPick ? () => onPick(step.key) : undefined}
          >
            {step.label}
          </div>
        ))}
        <div className="step bg-transparent" />
      </div>
    </div>
  );
}

export function LiveActivityCards({
  rows,
  empty,
}: {
  rows: ActivityRow[];
  empty: string;
}) {
  if (!rows.length) return <p className="mb-0 text-muted">{empty}</p>;
  return (
    <>
      {rows.map((row) => {
        const look = activityIcon(row.type);
        return (
          <div className="card border shadow-none mb-3" key={row.id}>
            <div className="card-body p-3">
              <div className="d-flex flex-wrap row-gap-2">
                <span className={`avatar avatar-md flex-shrink-0 rounded me-2 ${look.bg}`}>
                  <i className={`${look.icon} fs-20`} />
                </span>
                <div>
                  <h6 className="fw-medium fs-14 mb-1">{row.subject}</h6>
                  <p className="mb-0">{formatDate(row.due_at ?? row.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function FicheDossierList({ dossiers }: { dossiers: DossierRow[] }) {
  if (!dossiers.length) {
    return <p className="mb-0 text-muted">Aucun dossier.</p>;
  }
  return (
    <>
      {dossiers.map((dossier) => {
        const destination = dossierFlag(dossier);
        return (
          <div
            key={dossier.id}
            className="d-flex align-items-center justify-content-between mb-3"
          >
            <div className="d-flex align-items-center">
              <Link
                href={`${all_routes.projectDetails}?id=${dossier.id}`}
                className="avatar border rounded-circle me-2"
              >
                <ImageWithBasePath
                  src={destination?.src ?? "assets/img/projects/kalao-visa.jpg"}
                  alt={destination?.label ?? dossier.title}
                  className="w-auto h-auto"
                />
              </Link>
              <div>
                <h6 className="fw-medium mb-1">
                  <Link href={`${all_routes.projectDetails}?id=${dossier.id}`}>
                    {dossier.title}
                  </Link>
                </h6>
                <p className="mb-0">
                  {destination?.label ?? dossier.kind}
                  {" · "}
                  {pipelineStatusLabel(dossier.status, dossier.kind, dossier.title, dossier.notes)}
                </p>
              </div>
            </div>
            <Link
              href={`${all_routes.projectDetails}?id=${dossier.id}`}
              className="link-primary fw-medium"
            >
              Ouvrir
            </Link>
          </div>
        );
      })}
    </>
  );
}

export function FicheSuiviTab({ dossiers }: { dossiers: DossierRow[] }) {
  return (
    <div className="tab-pane fade" id="tab_6">
      <div className="card mb-0">
        <div className="card-header">
          <h5 className="fw-semibold mb-0">Suivi</h5>
        </div>
        <div className="card-body">
          {dossiers.length ? (
            dossiers.map((dossier) => (
              <div className="card border shadow-none mb-3" key={dossier.id}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <div>
                      <h6 className="fw-medium fs-14 mb-1">{dossier.title}</h6>
                      <p className="mb-0">
                        Pipeline : {pipelineStatusLabel(dossier.status, dossier.kind, dossier.title, dossier.notes)}
                      </p>
                    </div>
                    <Link
                      href={`${all_routes.projectDetails}?id=${dossier.id}`}
                      className="btn btn-sm btn-outline-light"
                    >
                      Jalons, pièces, dossier
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="mb-0 text-muted">Aucun dossier à suivre.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FicheDossierTab({ dossiers }: { dossiers: DossierRow[] }) {
  return (
    <div className="tab-pane fade" id="tab_7">
      <div className="card mb-0">
        <div className="card-header">
          <h5 className="fw-semibold mb-0">Dossier</h5>
        </div>
        <div className="card-body">
          <FicheDossierList dossiers={dossiers} />
        </div>
      </div>
    </div>
  );
}

export const FICHE_EXTRA_TABS = (
  <>
    <li className="nav-item" role="presentation">
      <Link
        href="#tab_6"
        data-bs-toggle="tab"
        aria-expanded="false"
        className="nav-link border-3"
        aria-selected="false"
        tabIndex={-1}
        role="tab"
      >
        <span className="d-md-inline-block">
          <i className="ti ti-flag me-1" />
          Suivi
        </span>
      </Link>
    </li>
    <li className="nav-item" role="presentation">
      <Link
        href="#tab_7"
        data-bs-toggle="tab"
        aria-expanded="false"
        className="nav-link border-3"
        aria-selected="false"
        tabIndex={-1}
        role="tab"
      >
        <span className="d-md-inline-block">
          <i className="ti ti-edit me-1" />
          Dossier
        </span>
      </Link>
    </li>
  </>
);
