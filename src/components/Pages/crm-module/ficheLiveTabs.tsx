"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import {
  createActivity,
  dossierFlag,
  formatDate,
  formatMoney,
  type ActivityRow,
  type AttachmentRow,
  type DossierRow,
  type InvoiceRow,
  type PaymentRow,
  type QuoteRow,
} from "@/lib/crm";
import { docHref } from "@/lib/docs";
import { fetchInvoiceFigures, toFigureSnapshot } from "@/lib/invoice-figures";
import { summarizeFigures } from "@/lib/finance-rules";
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

function paymentMethodLabel(method: string) {
  if (method === "cash") return "Espèces";
  if (method === "mobile_money") return "Mobile money";
  if (method === "bank_transfer") return "Virement";
  return method;
}

function invoiceStatusLabel(status: string, conditional?: boolean) {
  if (conditional) return "Conditionnelle";
  const map: Record<string, string> = {
    paid: "Payée",
    partially_paid: "Partiel",
    unpaid: "Impayée",
    overdue: "En retard",
    cancelled: "Annulée",
  };
  return map[status] ?? status;
}

function quoteStatusLabel(status: string) {
  const map: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyé",
    accepted: "Accepté",
    rejected: "Refusé",
    expired: "Expiré",
  };
  return map[status] ?? status;
}

function FicheDocRow({
  title,
  detail,
  href,
  badge,
}: {
  title: string;
  detail: string;
  href: string;
  badge: string;
}) {
  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-3 border-bottom">
      <div>
        <span className="badge badge-soft-info me-2">{badge}</span>
        <h6 className="fw-medium fs-14 mb-1 d-inline">{title}</h6>
        <p className="mb-0 text-muted">{detail}</p>
      </div>
      <Link href={href} target="_blank" className="btn btn-sm btn-outline-light">
        Voir
      </Link>
    </div>
  );
}

export function FicheFilesAndFinance({
  files,
  invoices,
  payments,
  quotes,
  dossiers,
  onUpload,
  onRemove,
}: {
  files: AttachmentRow[];
  invoices: InvoiceRow[];
  payments: PaymentRow[];
  quotes: QuoteRow[];
  dossiers: DossierRow[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const invoiceKey = invoices.map((row) => row.id).join(",");
  const [fromView, setFromView] = useState<ReturnType<typeof summarizeFigures> | null>(null);
  useEffect(() => {
    const ids = new Set(invoiceKey ? invoiceKey.split(",") : []);
    void fetchInvoiceFigures()
      .then((rows) => {
        if (!rows) return;
        setFromView(summarizeFigures(rows.filter((row) => ids.has(row.id)).map(toFigureSnapshot)));
      })
      .catch(() => setFromView(null));
  }, [invoiceKey]);
  const billed = fromView?.invoiced ?? invoices.reduce((sum, row) => sum + Number(row.amount), 0);
  const received = fromView?.collected ?? payments.reduce((sum, row) => sum + Number(row.amount), 0);
  const due = fromView?.outstanding ?? 0;
  const otherDocs = dossiers.filter((row) => row.kind === "visa" || Boolean(row.quote_id));

  return (
    <>
      <div className="card border mb-3">
        <div className="card-body pb-0">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="mb-3">
                <h6 className="mb-1">Documents du client</h6>
                <p>
                  Pièces jointes, factures, paiements reçus, devis et autres documents du dossier.
                </p>
                <p className="mb-0 text-muted">
                  Facturé {formatMoney(billed)} · Encaissé {formatMoney(received)}
                  {fromView ? ` · Reste exigible ${formatMoney(due)}` : ""}
                </p>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="mb-3">
                <label className="btn btn-primary mb-0">
                  Ajouter un fichier
                  <input
                    type="file"
                    className="d-none"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        await onUpload(file);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Erreur");
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h6 className="fw-semibold mb-3">Pièces jointes</h6>
      {files.map((file) => (
        <div className="card border shadow-none mb-3" key={file.id}>
          <div className="card-body py-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h6 className="fw-semibold fs-14 mb-1">
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.file_name}
                  </a>
                </h6>
                <p className="mb-0 text-muted">
                  {file.entity_type === "dossier"
                    ? "Dossier"
                    : file.entity_type === "invoice"
                      ? "Facture"
                      : file.entity_type === "quote"
                        ? "Devis"
                        : "Fiche client"}
                  {" · "}
                  {formatDate(file.created_at)}
                </p>
              </div>
              <button
                type="button"
                className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
                onClick={() => void onRemove(file.id).catch((err) => alert(err instanceof Error ? err.message : "Erreur"))}
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {files.length ? null : <p className="text-muted">Aucune pièce jointe.</p>}

      <h6 className="fw-semibold mt-4 mb-3">Factures</h6>
      {invoices.map((row) => (
        <FicheDocRow
          key={row.id}
          badge="Facture"
          title={row.number ? `#${row.number}` : row.id.slice(0, 8)}
          detail={`${row.project || "Prestation"} · ${formatMoney(row.amount)} · Encaissé ${formatMoney(row.paid_amount)} · ${invoiceStatusLabel(row.status, row.is_conditional)} · Échéance ${formatDate(row.due_date)}`}
          href={docHref("invoice", row.id)}
        />
      ))}
      {invoices.length ? null : <p className="text-muted">Aucune facture pour ce client.</p>}

      <h6 className="fw-semibold mt-4 mb-3">Paiements reçus</h6>
      {payments.map((row) => (
        <FicheDocRow
          key={row.id}
          badge="Paiement"
          title={formatMoney(row.amount)}
          detail={`${paymentMethodLabel(row.method)} · ${formatDate(row.paid_at)} · Facture ${row.invoices?.number ? `#${row.invoices.number}` : "—"}`}
          href={docHref("invoice", row.invoice_id)}
        />
      ))}
      {payments.length ? null : <p className="text-muted">Aucun paiement reçu.</p>}

      <h6 className="fw-semibold mt-4 mb-3">Devis et autres documents</h6>
      {quotes.map((row) => (
        <FicheDocRow
          key={row.id}
          badge="Devis"
          title={row.number ? `#${row.number}` : row.id.slice(0, 8)}
          detail={`${row.notes || "Proposition"} · ${quoteStatusLabel(row.status)} · ${formatDate(row.created_at)}`}
          href={docHref("quote", row.id)}
        />
      ))}
      {otherDocs.map((row) => (
        <FicheDocRow
          key={row.id}
          badge={row.kind === "visa" ? "Visa" : "Dossier"}
          title={row.title}
          detail={`${row.kind} · ${formatDate(row.start_at || row.updated_at)}`}
          href={row.kind === "visa" ? docHref("visa", row.id) : `${all_routes.projectDetails}?id=${row.id}`}
        />
      ))}
      {quotes.length || otherDocs.length ? null : (
        <p className="text-muted">Aucun devis ni autre document.</p>
      )}
    </>
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
