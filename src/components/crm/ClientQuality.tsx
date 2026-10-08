"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/core/common/page-header/pageHeader";
import {
  clientDisplayName,
  fetchAuditLog,
  fetchClients,
  fetchContacts,
  fetchLeads,
  createContact,
  updateLead,
  formatDate,
  type ContactRow,
} from "@/lib/crm";
import { CSV_FIELDS, canRestore, parseCsv, previewImport } from "@/lib/clients";
import {
  archiveCommercial,
  fetchArchived,
  fetchListViews,
  mergeContacts,
  restoreCommercial,
  saveListView,
  tagContacts,
} from "@/lib/commercial";
import { downloadXlsx } from "@/lib/excel";

const FIELD_LABELS: Record<(typeof CSV_FIELDS)[number], string> = {
  first_name: "Prénom",
  last_name: "Nom",
  phone: "Téléphone",
  email: "E-mail",
  job_title: "Profession",
  city: "Ville",
  nationality: "Nationalité",
  source: "Source",
};

export function ClientHistory() {
  const [id, setId] = useState<string | null>(null);
  const [rows, setRows] = useState<{ id: string; action: string; reason: string | null; created_at: string }[]>([]);
  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get("id");
    setId(current);
    if (!current) return;
    void fetchAuditLog("contacts", current)
      .then((data) => setRows((data ?? []) as typeof rows))
      .catch(() => setRows([]));
  }, []);
  if (!id) return null;
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h6 className="mb-0">Historique des modifications</h6>
      </div>
      <div className="card-body">
        {rows.length ? (
          <ul className="list-unstyled mb-0">
            {rows.map((row) => (
              <li key={row.id} className="border-bottom py-2">
                <strong>{row.action}</strong>
                <span className="text-muted"> · {formatDate(row.created_at)}</span>
                {row.reason ? <div>{row.reason}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">Aucune modification enregistrée.</p>
        )}
      </div>
    </div>
  );
}

export function ClientImport() {
  const [text, setText] = useState("prenom;nom;telephone;email\n");
  const [mapping, setMapping] = useState<Record<string, number>>({
    first_name: 0,
    last_name: 1,
    phone: 2,
    email: 3,
  });
  const [existing, setExisting] = useState<ContactRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    void fetchContacts().then((rows) => setExisting(rows ?? []));
  }, []);
  const table = useMemo(() => parseCsv(text), [text]);
  const report = useMemo(() => previewImport(table, mapping, existing), [table, mapping, existing]);
  const headers = table[0] ?? [];

  const commit = async () => {
    setMessage(null);
    let created = 0;
    for (const row of report.ok) {
      await createContact({
        first_name: row.first_name || "Client",
        last_name: row.last_name || "—",
        phone: row.phone,
        email: row.email || null,
        job_title: row.job_title || null,
        city: row.city || null,
        nationality: row.nationality || null,
        source: row.source || null,
      });
      created += 1;
    }
    setMessage(`${created} fiche${created > 1 ? "s" : ""} créée${created > 1 ? "s" : ""}. ${report.errors.length} erreur${report.errors.length > 1 ? "s" : ""}, ${report.duplicates.length} doublon${report.duplicates.length > 1 ? "s" : ""} laissé${report.duplicates.length > 1 ? "s" : ""} de côté.`);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <PageHeader title="Import clients" showModuleTile={false} />
        <div className="card">
          <div className="card-body">
            <p>Collez un CSV. Les doublons et les lignes invalides ne sont pas importés. Aucune coordonnée n'est inventée.</p>
            <textarea className="form-control mb-3" rows={8} value={text} onChange={(event) => setText(event.target.value)} />
            <div className="row g-2 mb-3">
              {CSV_FIELDS.map((field) => (
                <div className="col-md-3" key={field}>
                  <label className="form-label">{FIELD_LABELS[field]}</label>
                  <select
                    className="form-select"
                    value={mapping[field] ?? ""}
                    onChange={(event) =>
                      setMapping((current) => ({
                        ...current,
                        [field]: event.target.value === "" ? -1 : Number(event.target.value),
                      }))
                    }
                  >
                    <option value="">Ignorer</option>
                    {headers.map((header, index) => (
                      <option key={header + index} value={index}>
                        {header || `Colonne ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <p>
              {report.ok.length} prêtes · {report.errors.length} erreurs · {report.duplicates.length} doublons
            </p>
            {report.errors.map((error) => (
              <div key={error.line} className="text-danger">
                Ligne {error.line} : {error.message}
              </div>
            ))}
            {report.duplicates.map((row) => (
              <div key={row.line} className="text-warning">
                Ligne {row.line} : doublon {row.name}
              </div>
            ))}
            {message ? <div className="alert alert-info mt-3">{message}</div> : null}
            <button type="button" className="btn btn-primary mt-3" disabled={!report.ok.length} onClick={() => void commit()}>
              Importer les lignes valides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientMerge() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [keep, setKeep] = useState("");
  const [drop, setDrop] = useState("");
  const [tag, setTag] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [viewName, setViewName] = useState("");
  const [views, setViews] = useState<{ id: string; name: string; filters: Record<string, string> }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => {
    void fetchClients().then((data) => setRows(data ?? []));
    void fetchListViews("clients").then(setViews).catch(() => setViews([]));
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <PageHeader title="Fusion et actions" showModuleTile={false} />
        {message ? <div className="alert alert-info">{message}</div> : null}
        <div className="card mb-3">
          <div className="card-header"><h6 className="mb-0">Fusionner deux fiches</h6></div>
          <div className="card-body">
            <p>La fiche conservée récupère les dossiers, factures, activités et l'historique. La fiche en double reste en base, marquée comme fusionnée.</p>
            <div className="row g-2">
              <div className="col-md-5">
                <label className="form-label">Conserver</label>
                <select className="form-select" value={keep} onChange={(event) => setKeep(event.target.value)}>
                  <option value="">Choisir</option>
                  {rows.map((row) => (
                    <option key={row.id} value={row.id}>{clientDisplayName(row)}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Fusionner dans la précédente</label>
                <select className="form-select" value={drop} onChange={(event) => setDrop(event.target.value)}>
                  <option value="">Choisir</option>
                  {rows.filter((row) => row.id !== keep).map((row) => (
                    <option key={row.id} value={row.id}>{clientDisplayName(row)}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!keep || !drop}
                  onClick={() => {
                    void mergeContacts(keep, drop)
                      .then(() => {
                        setMessage("Fusion enregistrée.");
                        load();
                      })
                      .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Fusion impossible"));
                  }}
                >
                  Fusionner
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h6 className="mb-0">Étiqueter, exporter, vue enregistrée</h6></div>
          <div className="card-body">
            <div className="d-flex gap-2 flex-wrap mb-3">
              <input className="form-control" style={{ maxWidth: 220 }} placeholder="Étiquette" value={tag} onChange={(event) => setTag(event.target.value)} />
              <button
                type="button"
                className="btn btn-outline-dark"
                disabled={!picked.length || !tag.trim()}
                onClick={() => void tagContacts(picked, tag).then(() => setMessage("Étiquette ajoutée."))}
              >
                Étiqueter la sélection
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  downloadXlsx(
                    "clients-kalao",
                    ["Client", "Téléphone", "E-mail", "Ville"],
                    rows
                      .filter((row) => !picked.length || picked.includes(row.id))
                      .map((row) => [clientDisplayName(row), row.phone ?? "", row.email ?? "", row.city ?? ""])
                  )
                }
              >
                Exporter
              </button>
              <input className="form-control" style={{ maxWidth: 220 }} placeholder="Nom de la vue" value={viewName} onChange={(event) => setViewName(event.target.value)} />
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={!viewName.trim()}
                onClick={() =>
                  void saveListView("clients", viewName, { coordonnees: picked.length ? "selection" : "toutes" })
                    .then(() => {
                      setMessage("Vue enregistrée.");
                      load();
                    })
                    .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Vue non enregistrée"))
                }
              >
                Enregistrer la vue
              </button>
            </div>
            {views.length ? (
              <p className="text-muted">Vues : {views.map((view) => view.name).join(", ")}</p>
            ) : null}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={picked.includes(row.id)}
                          onChange={(event) =>
                            setPicked((current) =>
                              event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id)
                            )
                          }
                        />
                      </td>
                      <td>{clientDisplayName(row)}</td>
                      <td>{row.phone || "—"}</td>
                      <td>{row.email || "—"}</td>
                      <td>{(row.tags ?? []).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <LeadBulk />
      </div>
    </div>
  );
}

const LEAD_STAGES = [
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "qualified", label: "Qualifié" },
  { value: "unqualified", label: "Non qualifié" },
  { value: "converted", label: "Converti" },
  { value: "lost", label: "Perdu" },
];

function LeadBulk() {
  const [leads, setLeads] = useState<{ id: string; title: string; status: string }[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [stage, setStage] = useState("contacted");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    void fetchLeads().then((rows) => setLeads((rows ?? []).map((row) => ({ id: row.id, title: row.title, status: row.status }))));
  }, []);
  return (
    <div className="card mt-3">
      <div className="card-header"><h6 className="mb-0">Prospects : changer d'étape</h6></div>
      <div className="card-body">
        <div className="d-flex gap-2 flex-wrap mb-3">
          <select className="form-select" style={{ maxWidth: 220 }} value={stage} onChange={(event) => setStage(event.target.value)}>
            {LEAD_STAGES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          {stage === "lost" ? (
            <input
              className="form-control"
              style={{ maxWidth: 280 }}
              placeholder="Motif (obligatoire)"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          ) : null}
          <button
            type="button"
            className="btn btn-outline-dark"
            disabled={!picked.length}
            onClick={() => {
              void Promise.all(picked.map((id) => updateLead(id, { status: stage, lost_reason: stage === "lost" ? reason : null })))
                .then(() => setMessage("Étape mise à jour."))
                .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Étape refusée"));
            }}
          >
            Appliquer
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={!picked.length}
            onClick={() => {
              void Promise.all(picked.map((id) => archiveCommercial("leads", id)))
                .then(() => setMessage("Prospects archivés."))
                .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Archivage refusé"));
            }}
          >
            Archiver
          </button>
        </div>
        {message ? <p>{message}</p> : null}
        {leads.map((lead) => (
          <label className="d-flex gap-2 border-bottom py-1" key={lead.id}>
            <input
              type="checkbox"
              checked={picked.includes(lead.id)}
              onChange={(event) =>
                setPicked((current) => (event.target.checked ? [...current, lead.id] : current.filter((id) => id !== lead.id)))
              }
            />
            <span>{lead.title}</span>
            <span className="text-muted">{LEAD_STAGES.find((item) => item.value === lead.status)?.label ?? lead.status}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function CommercialTrash() {
  const [bag, setBag] = useState<Awaited<ReturnType<typeof fetchArchived>>>({ leads: [], deals: [], activities: [] });
  const [message, setMessage] = useState<string | null>(null);
  const load = () => {
    void fetchArchived().then(setBag).catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Corbeille indisponible"));
  };
  useEffect(() => {
    load();
  }, []);
  const sections = [
    { table: "leads" as const, title: "Prospects", rows: bag.leads },
    { table: "deals" as const, title: "Affaires", rows: bag.deals },
    { table: "activities" as const, title: "Activités", rows: bag.activities },
  ];
  return (
    <div className="page-wrapper">
      <div className="content">
        <PageHeader title="Corbeille" showModuleTile={false} />
        <p>Les prospects, affaires et activités s'y restaurent pendant 30 jours. Les factures et les paiements n'y entrent pas.</p>
        {message ? <div className="alert alert-warning">{message}</div> : null}
        {sections.map((section) => (
          <div className="card mb-3" key={section.table}>
            <div className="card-header"><h6 className="mb-0">{section.title}</h6></div>
            <div className="card-body">
              {section.rows.length ? section.rows.map((row) => {
                const open = canRestore(String(row.archived_at));
                return (
                  <div className="d-flex justify-content-between border-bottom py-2" key={row.id}>
                    <span>{row.title} · {formatDate(String(row.archived_at))}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={!open}
                      onClick={() =>
                        void restoreCommercial(section.table, row.id)
                          .then(load)
                          .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Restauration refusée"))
                      }
                    >
                      {open ? "Restaurer" : "Délai de 30 jours dépassé"}
                    </button>
                  </div>
                );
              }) : <p className="text-muted mb-0">Rien dans cette corbeille.</p>}
            </div>
          </div>
        ))}
        <p className="text-muted">
          Pour archiver, ouvrez un prospect ou une affaire et utilisez l'action ci-dessous une fois l'identifiant connu, ou{" "}
          <Link href="/leads">la liste des prospects</Link>.
        </p>
        <ArchiveBox onDone={load} />
      </div>
    </div>
  );
}

function ArchiveBox({ onDone }: { onDone: () => void }) {
  const [table, setTable] = useState<"leads" | "deals" | "activities">("leads");
  const [id, setId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="card">
      <div className="card-body">
        <h6>Archiver</h6>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select" style={{ maxWidth: 180 }} value={table} onChange={(event) => setTable(event.target.value as typeof table)}>
            <option value="leads">Prospect</option>
            <option value="deals">Affaire</option>
            <option value="activities">Activité</option>
          </select>
          <input className="form-control" style={{ maxWidth: 360 }} placeholder="Identifiant" value={id} onChange={(event) => setId(event.target.value)} />
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={!id.trim()}
            onClick={() =>
              void archiveCommercial(table, id.trim())
                .then(() => {
                  setMessage("Archivé.");
                  setId("");
                  onDone();
                })
                .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Archivage refusé"))
            }
          >
            Archiver
          </button>
        </div>
        {message ? <p className="mt-2 mb-0">{message}</p> : null}
      </div>
    </div>
  );
}
