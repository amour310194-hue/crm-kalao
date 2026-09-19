"use client";

import { useMemo, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { createCrmRecord, deleteCrmRecord, updateCrmRecord } from "@/lib/api/crmClient";
import { parseCrmDate, toIsoDateString } from "@/lib/backend/period";
import { useI18n } from "@/i18n/I18nProvider";

export type ActivityKind = "call" | "email" | "meeting" | "task" | "note";

type ActivityRow = Record<string, unknown> & {
  id?: string;
  key?: string;
  type?: string;
  subject?: string;
  Subject?: string;
  companyId?: string;
  Company?: string;
  dueAt?: string;
  DueAt?: string;
  notes?: string;
};

type ActivityWorkspaceProps = {
  type: ActivityKind;
  title: string;
  addLabel: string;
};

const typeLabel: Record<ActivityKind, string> = {
  call: "Appel",
  email: "E-mail",
  meeting: "Réunion",
  task: "Tâche",
  note: "Note",
};

function toDatetimeLocal(value: unknown) {
  const raw = value == null ? "" : String(value);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw)) return raw.slice(0, 16);
  const parsed = parseCrmDate(raw);
  if (!parsed) {
    const iso = toIsoDateString(raw);
    return iso ? `${iso}T09:00` : "";
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const ActivityWorkspace = ({ type, title, addLabel }: ActivityWorkspaceProps) => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<ActivityRow>("activities", []);
  const { data: companies } = useCrmCollection<Record<string, unknown>>("companies", []);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ActivityRow | null>(null);
  const [subject, setSubject] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = useMemo(
    () => data.filter((row) => String(row.type || "") === type),
    [data, type]
  );

  const openCreate = () => {
    setCurrent(null);
    setSubject("");
    setCompanyId("");
    setDueAt(new Date().toISOString().slice(0, 16));
    setNotes("");
    setError("");
    setOpen(true);
  };

  const openEdit = (record: ActivityRow) => {
    setCurrent(record);
    setSubject(String(record.subject || record.Subject || ""));
    setCompanyId(String(record.companyId || ""));
    setDueAt(toDatetimeLocal(record.dueAt));
    setNotes(String(record.notes || ""));
    setError("");
    setOpen(true);
  };

  const remove = async (record: ActivityRow) => {
    const id = String(record.id || record.key || "");
    if (!id) return;
    if (!window.confirm("Supprimer cette activité ?")) return;
    try {
      await deleteCrmRecord("activities", id);
      setError("");
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim()) {
      setError("Indiquez un objet.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { type, subject: subject.trim(), companyId, dueAt, notes };
    try {
      const id = current?.id || current?.key;
      if (id) {
        await updateCrmRecord("activities", String(id), payload);
      } else {
        await createCrmRecord("activities", payload);
      }
      setOpen(false);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: t("Objet"),
      dataIndex: "Subject",
      render: (_: unknown, record: ActivityRow) => (
        <button type="button" className="btn btn-link p-0 title-name" onClick={() => openEdit(record)}>
          {String(record.Subject || record.subject || "—")}
        </button>
      ),
      sorter: (a: ActivityRow, b: ActivityRow) =>
        String(a.Subject ?? a.subject ?? "").localeCompare(String(b.Subject ?? b.subject ?? ""), "fr"),
    },
    {
      title: t("Client"),
      dataIndex: "Company",
      sorter: (a: ActivityRow, b: ActivityRow) =>
        String(a.Company ?? "").localeCompare(String(b.Company ?? ""), "fr"),
    },
    {
      title: t("Échéance"),
      dataIndex: "DueAt",
      sorter: (a: ActivityRow, b: ActivityRow) =>
        String(a.dueAt ?? "").localeCompare(String(b.dueAt ?? "")),
    },
    {
      title: t("Notes"),
      dataIndex: "notes",
      render: (text: string) => (
        <span className="d-inline-block text-truncate" style={{ maxWidth: 280 }} title={text || ""}>
          {text || "—"}
        </span>
      ),
    },
    {
      title: t("Action"),
      dataIndex: "Action",
      render: (_: unknown, record: ActivityRow) => (
        <div className="d-flex gap-1">
          <button type="button" className="btn btn-sm btn-outline-light" onClick={() => openEdit(record)}>
            {t("Edit")}
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void remove(record)}>
            {t("Delete")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader
            title={title}
            badgeCount={rows.length}
            showModuleTile={true}
            moduleTitle="Application"
            showExport={false}
            onRefresh={reload}
          />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={setSearchText} />
              </div>
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <i className="ti ti-square-rounded-plus-filled me-1" />
                {addLabel}
              </button>
            </div>
            <div className="card-body">
              {error && !open ? <div className="alert alert-danger">{error}</div> : null}
              <div className="custom-table table-nowrap">
                <Datatable columns={columns} dataSource={rows} Selection={false} searchText={searchText} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {open ? (
        <div className="modal fade show d-block" style={{ background: "rgba(15,23,42,.45)" }} role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={submit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {current ? t("Edit") : addLabel} · {typeLabel[type]}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setOpen(false)} aria-label="Fermer" />
                </div>
                <div className="modal-body">
                  {error ? <div className="alert alert-danger">{error}</div> : null}
                  <div className="mb-3">
                    <label className="form-label">{t("Objet")}</label>
                    <input
                      className="form-control"
                      required
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t("Client")}</label>
                      <select className="form-select" value={companyId} onChange={(event) => setCompanyId(event.target.value)}>
                        <option value="">{t("Select")}</option>
                        {companies.map((company) => {
                          const id = String(company.id || company.key || "");
                          return (
                            <option key={id} value={id}>
                              {String(company.Name || company.name || id)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t("Échéance")}</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={dueAt}
                        onChange={(event) => setDueAt(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-0">
                    <label className="form-label">{t("Notes")}</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setOpen(false)}>
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
      ) : null}
    </>
  );
};

export default ActivityWorkspace;
