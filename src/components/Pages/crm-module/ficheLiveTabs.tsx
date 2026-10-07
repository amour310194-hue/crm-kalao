"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import {
  createActivity,
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
  type PipelineStep,
} from "@/lib/visa-pipeline";
import { pipelineSlugFor, type PipelineSlug } from "@/lib/pipeline-config";
import PipelineEditor from "@/components/crm/PipelineEditor";

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
  const slug: PipelineSlug = pipelineSlugFor(kind, title, notes);
  const [steps, setSteps] = useState<PipelineStep[]>(() => procedurePipeline(kind, title, notes));
  const [canEdit, setCanEdit] = useState(false);
  const [editor, setEditor] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/pipelines", { credentials: "include" });
        const json = (await res.json()) as {
          pipelines?: Record<string, PipelineStep[]>;
          canEdit?: boolean;
        };
        if (cancelled) return;
        const next = json.pipelines?.[slug];
        if (next?.length) setSteps(next);
        setCanEdit(Boolean(json.canEdit));
      } catch {
        if (!cancelled) setSteps(procedurePipeline(kind, title, notes));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, kind, title, notes]);

  const current = normalizePipelineStatus(status, steps);
  const idx = steps.findIndex((step) => step.key === current);
  return (
    <div className="mb-3 pb-3 border-bottom">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h5 className="mb-0">Pipeline de la procédure</h5>
        {canEdit ? (
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditor(true)}>
            Configurer les étapes
          </button>
        ) : null}
      </div>
      <div className="step-progress kalao-pipeline">
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
      </div>
      {editor ? (
        <PipelineEditor
          slug={slug}
          steps={steps}
          onClose={() => setEditor(false)}
          onSaved={(next) => setSteps(next)}
        />
      ) : null}
    </div>
  );
}

export function FicheAddActivity({
  contactId,
  companyId,
  type,
  label,
  onCreated,
}: {
  contactId: string;
  companyId?: string | null;
  type: "note" | "call" | "task" | "email";
  label: string;
  onCreated: (row: ActivityRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button type="button" className="link-primary fw-medium border-0 bg-transparent p-0" onClick={() => setOpen(true)}>
        <i className="ti ti-circle-plus me-1" />
        {label}
      </button>
      {open ? (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.45)" }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{label}</h5>
                <button type="button" className="btn-close" onClick={() => setOpen(false)} />
              </div>
              <div className="modal-body">
                {error ? <div className="alert alert-danger py-2">{error}</div> : null}
                <div className="mb-2">
                  <label className="form-label">Objet</label>
                  <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="mb-0">
                  <label className="form-label">Détail</label>
                  <textarea className="form-control" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>
                  Fermer
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy || !subject.trim()}
                  onClick={async () => {
                    setBusy(true);
                    setError(null);
                    try {
                      const row = await createActivity({
                        type,
                        subject: subject.trim(),
                        notes: notes.trim() || null,
                        contact_id: contactId,
                        company_id: companyId,
                      });
                      onCreated(row);
                      setSubject("");
                      setNotes("");
                      setOpen(false);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
                  {row.notes ? <p className="mb-0 mt-1 text-muted">{row.notes}</p> : null}
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
