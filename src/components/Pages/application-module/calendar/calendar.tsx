"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { createCrmRecord, updateCrmRecord } from "@/lib/api/crmClient";
import { parseCrmDate } from "@/lib/backend/period";
import { useI18n } from "@/i18n/I18nProvider";

type ActivityKind = "call" | "email" | "meeting" | "task" | "note";

type ActivityRow = Record<string, unknown> & {
  id?: string;
  key?: string;
  type?: string;
  subject?: string;
  Subject?: string;
  companyId?: string;
  Company?: string;
  dueAt?: string;
  notes?: string;
};

const typeLabel: Record<ActivityKind, string> = {
  call: "Appel",
  email: "E-mail",
  meeting: "Réunion",
  task: "Tâche",
  note: "Note",
};

const typeClass: Record<string, string> = {
  call: "bg-info",
  email: "bg-primary",
  meeting: "bg-success",
  task: "bg-warning",
  note: "bg-secondary",
};

function activityStart(dueAt: unknown) {
  const raw = dueAt == null ? "" : String(dueAt);
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw;
  const parsed = parseCrmDate(raw);
  if (!parsed) return undefined;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

const CalenderComponent = () => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<ActivityRow>("activities", []);
  const { data: companies } = useCrmCollection<Record<string, unknown>>("companies", []);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ActivityRow | null>(null);
  const [kind, setKind] = useState<ActivityKind>("meeting");
  const [subject, setSubject] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const upcoming = useMemo(() => {
    return [...data]
      .filter((row) => activityStart(row.dueAt))
      .sort((a, b) => String(activityStart(a.dueAt)).localeCompare(String(activityStart(b.dueAt))))
      .slice(0, 6);
  }, [data]);

  const events = useMemo(
    () =>
      data.flatMap((row) => {
        const start = activityStart(row.dueAt);
        const id = String(row.id || row.key || "");
        if (!start || !id) return [];
        const type = String(row.type || "task");
        return [
          {
            id,
            title: String(row.Subject || row.subject || typeLabel[type as ActivityKind] || "Activité"),
            start,
            className: typeClass[type] || "bg-secondary",
          },
        ];
      }),
    [data]
  );

  const openCreate = (iso?: string) => {
    setCurrent(null);
    setKind("meeting");
    setSubject("");
    setCompanyId("");
    setDueAt(iso ? iso.slice(0, 16) : new Date().toISOString().slice(0, 16));
    setNotes("");
    setError("");
    setOpen(true);
  };

  const openEdit = (record: ActivityRow) => {
    setCurrent(record);
    setKind((record.type as ActivityKind) || "task");
    setSubject(String(record.subject || record.Subject || ""));
    setCompanyId(String(record.companyId || ""));
    const start = activityStart(record.dueAt);
    setDueAt(start ? start.slice(0, 16) : "");
    setNotes(String(record.notes || ""));
    setError("");
    setOpen(true);
  };

  const onDateClick = (info: { dateStr: string }) => {
    openCreate(`${info.dateStr}${info.dateStr.includes("T") ? "" : "T09:00"}`.slice(0, 16));
  };

  const onEventClick = (info: EventClickArg) => {
    const record = data.find((row) => String(row.id || row.key) === info.event.id);
    if (record) openEdit(record);
  };

  const onEventDrop = async (info: EventDropArg) => {
    try {
      await updateCrmRecord("activities", info.event.id, {
        dueAt: info.event.startStr.slice(0, 16),
      });
      reload();
    } catch {
      info.revert();
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
    const payload = { type: kind, subject: subject.trim(), companyId, dueAt, notes };
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <PageHeader
            title="Calendar"
            badgeCount={data.length}
            showModuleTile={true}
            moduleTitle="Application"
            showExport={false}
            onRefresh={reload}
          />
          <div className="row">
            <div className="col-xxl-3 col-xl-4">
              <div className="card">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">{t("Activités")}</h5>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => openCreate()}>
                      {t("Add New")}
                    </button>
                  </div>
                  <p className="fs-12 text-muted mb-3">
                    Cliquez une date pour créer, glissez un événement pour déplacer.
                  </p>
                  {upcoming.length === 0 ? (
                    <p className="text-muted mb-0">Aucune activité planifiée.</p>
                  ) : (
                    upcoming.map((row) => (
                      <button
                        type="button"
                        key={String(row.id || row.key)}
                        className="border-start border-3 border-primary mb-3 ps-3 text-start w-100 bg-transparent"
                        onClick={() => openEdit(row)}
                      >
                        <h6 className="fw-medium mb-1">{String(row.Subject || row.subject)}</h6>
                        <p className="fs-12 mb-0">
                          {typeLabel[(row.type as ActivityKind) || "task"]} · {String(row.Company || "—")}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-xxl-9 col-xl-8">
              <div className="card mb-0">
                <div className="card-body">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      start: "today,prev,next",
                      center: "title",
                      end: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={events}
                    editable
                    dateClick={onDateClick}
                    eventClick={onEventClick}
                    eventDrop={onEventDrop}
                  />
                </div>
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
                  <h5 className="modal-title">{current ? t("Edit") : t("Add New")}</h5>
                  <button type="button" className="btn-close" onClick={() => setOpen(false)} aria-label="Fermer" />
                </div>
                <div className="modal-body">
                  {error ? <div className="alert alert-danger">{error}</div> : null}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t("Type")}</label>
                      <select
                        className="form-select"
                        value={kind}
                        onChange={(event) => setKind(event.target.value as ActivityKind)}
                      >
                        {(Object.keys(typeLabel) as ActivityKind[]).map((item) => (
                          <option key={item} value={item}>
                            {typeLabel[item]}
                          </option>
                        ))}
                      </select>
                    </div>
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
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("Objet")}</label>
                    <input
                      className="form-control"
                      required
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("Échéance")}</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={dueAt}
                      onChange={(event) => setDueAt(event.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">{t("Notes")}</label>
                    <textarea
                      className="form-control"
                      rows={3}
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

export default CalenderComponent;
