"use client";

import { useState } from "react";
import DefaultEditor from "react-simple-wysiwyg";
import type { MailApi, MailSession } from "@/lib/mail/client";
import type { MailPrefs } from "@/lib/mail/prefs";
import { TEMPLATE_VARIABLES } from "@/lib/mail/html";
import type { MailLabel, MailTemplate } from "@/lib/mail/types";
import { MailModal } from "@/components/mail/ui";
import KalaoMailboxAccess from "@/components/docs/KalaoMailboxAccess";
import KalaoInboundMail from "@/components/docs/KalaoInboundMail";
import KalaoMailDnsBanner from "@/components/docs/KalaoMailDnsBanner";

type Tab = "general" | "signature" | "templates" | "labels" | "access" | "diagnostic";

type Props = {
  api: MailApi;
  session: MailSession;
  prefs: MailPrefs;
  onPrefs: (prefs: MailPrefs) => void;
  signature: string;
  onSignature: (html: string) => void;
  templates: MailTemplate[];
  labels: MailLabel[];
  onReload: () => void;
  onClose: () => void;
  push: (t: { text: string; tone?: "info" | "error" }) => void;
};

const COLORS = ["#164B5A", "#E8A317", "#d93025", "#1a73e8", "#188038", "#9334e6", "#e37400", "#5f6368"];

export default function MailSettings(props: Props) {
  const { api, session, prefs } = props;
  const [tab, setTab] = useState<Tab>("general");
  const [signature, setSignature] = useState(props.signature);
  const [editing, setEditing] = useState<Partial<MailTemplate> & { shared?: boolean } | null>(null);
  const [labelDraft, setLabelDraft] = useState<{ id?: string; name: string; color: string; shared: boolean } | null>(null);
  const [reminders, setReminders] = useState<string | null>(null);

  const fail = (err: unknown) => props.push({ tone: "error", text: err instanceof Error ? err.message : "Échec" });

  const tabs: { key: Tab; label: string; admin?: boolean }[] = [
    { key: "general", label: "Général" },
    { key: "signature", label: "Signature" },
    { key: "templates", label: "Modèles" },
    { key: "labels", label: "Libellés" },
    { key: "access", label: "Boîtes partagées", admin: true },
    { key: "diagnostic", label: "Diagnostic", admin: true },
  ];

  return (
    <MailModal title="Paramètres de la messagerie" onClose={props.onClose} wide>
      <div className="km-tabs" role="tablist">
        {tabs
          .filter((t) => !t.admin || session.isAdmin)
          .map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
      </div>

      {tab === "general" ? (
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label fw-semibold">Volet de lecture</label>
            <select className="form-select" value={prefs.readingPane} onChange={(e) => props.onPrefs({ ...prefs, readingPane: e.target.value as MailPrefs["readingPane"] })}>
              <option value="right">À droite de la liste (style Outlook)</option>
              <option value="none">Aucun : la conversation remplace la liste (style Gmail)</option>
            </select>
          </div>
          <div>
            <label className="form-label fw-semibold">Annuler l&apos;envoi</label>
            <select className="form-select" value={prefs.undoSeconds} onChange={(e) => props.onPrefs({ ...prefs, undoSeconds: Number(e.target.value) as MailPrefs["undoSeconds"] })}>
              {[0, 5, 10, 20, 30].map((s) => (
                <option key={s} value={s}>
                  {s ? `Délai d'annulation : ${s} secondes` : "Envoi immédiat, sans délai"}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Conversations par page</label>
              <select className="form-select" value={prefs.pageSize} onChange={(e) => props.onPrefs({ ...prefs, pageSize: Number(e.target.value) as MailPrefs["pageSize"] })}>
                {[25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Densité</label>
              <select className="form-select" value={prefs.density} onChange={(e) => props.onPrefs({ ...prefs, density: e.target.value as MailPrefs["density"] })}>
                <option value="comfortable">Confortable</option>
                <option value="compact">Compacte</option>
              </select>
            </div>
          </div>
          <div className="form-check form-switch">
            <input id="km-snip" className="form-check-input" type="checkbox" checked={prefs.showSnippets} onChange={(e) => props.onPrefs({ ...prefs, showSnippets: e.target.checked })} />
            <label className="form-check-label" htmlFor="km-snip">Afficher un extrait du message dans la liste</label>
          </div>
          <div className="form-check form-switch">
            <input
              id="km-notif"
              className="form-check-input"
              type="checkbox"
              checked={prefs.desktopNotifications}
              onChange={async (e) => {
                const on = e.target.checked;
                if (on && typeof Notification !== "undefined" && Notification.permission !== "granted") {
                  const perm = await Notification.requestPermission();
                  if (perm !== "granted") {
                    props.push({ tone: "error", text: "Le navigateur a refusé les notifications." });
                    return;
                  }
                }
                props.onPrefs({ ...prefs, desktopNotifications: on });
              }}
            />
            <label className="form-check-label" htmlFor="km-notif">Notifications du bureau à l&apos;arrivée d&apos;un message</label>
          </div>
          <p className="small text-muted mb-0">Ces réglages sont propres à ce navigateur.</p>
        </div>
      ) : null}

      {tab === "signature" ? (
        <div>
          <p className="small text-muted">Ajoutée automatiquement aux nouveaux messages et aux réponses.</p>
          <div className="border rounded">
            <DefaultEditor value={signature} onChange={(e) => setSignature(e.target.value)} containerProps={{ style: { minHeight: 160 } }} />
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                setSignature(
                  `<p><strong>${session.fullName}</strong><br>Groupe Kalao · Bastos, Yaoundé<br>${session.workEmail} · +237 694 635 250</p>`
                )
              }
            >
              Proposer une signature
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                void api
                  .saveSignature(signature)
                  .then(() => {
                    props.onSignature(signature);
                    props.push({ text: "Signature enregistrée." });
                  })
                  .catch(fail)
              }
            >
              Enregistrer
            </button>
          </div>
        </div>
      ) : null}

      {tab === "templates" ? (
        editing ? (
          <div className="d-flex flex-column gap-2">
            <input className="form-control" placeholder="Nom du modèle" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <input className="form-control" placeholder="Objet (facultatif)" value={editing.subject ?? ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
            <div className="border rounded">
              <DefaultEditor value={editing.body_html ?? ""} onChange={(e) => setEditing({ ...editing, body_html: e.target.value })} containerProps={{ style: { minHeight: 200 } }} />
            </div>
            <div className="small text-muted">
              Variables :{" "}
              {TEMPLATE_VARIABLES.map((v) => (
                <code key={v.key} className="me-2" title={v.label}>{`{{${v.key}}}`}</code>
              ))}
            </div>
            {session.isAdmin && !editing.id ? (
              <div className="form-check">
                <input id="km-tpl-shared" type="checkbox" className="form-check-input" checked={Boolean(editing.shared)} onChange={(e) => setEditing({ ...editing, shared: e.target.checked })} />
                <label className="form-check-label" htmlFor="km-tpl-shared">Partager avec toute l&apos;équipe</label>
              </div>
            ) : null}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(null)}>Annuler</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  void api
                    .saveTemplate({ id: editing.id, name: editing.name ?? "", subject: editing.subject ?? "", body_html: editing.body_html ?? "", shared: editing.shared })
                    .then(() => {
                      setEditing(null);
                      props.onReload();
                      props.push({ text: "Modèle enregistré." });
                    })
                    .catch(fail)
                }
              >
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-end mb-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing({ name: "", subject: "", body_html: "" })}>
                <i className="ti ti-plus" /> Nouveau modèle
              </button>
            </div>
            <div className="list-group">
              {props.templates.map((t) => {
                const canEdit = Boolean(t.owner_id) || session.isAdmin;
                return (
                  <div key={t.id} className="list-group-item d-flex align-items-center gap-2">
                    <i className={t.owner_id ? "ti ti-user" : "ti ti-users"} title={t.owner_id ? "Personnel" : "Partagé"} />
                    <span className="flex-fill">
                      <span className="fw-semibold">{t.name}</span>
                      {t.subject ? <span className="text-muted small"> — {t.subject}</span> : null}
                    </span>
                    {canEdit ? (
                      <>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(t)}>Modifier</button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Supprimer le modèle « ${t.name} » ?`)) {
                              void api.deleteTemplate(t.id).then(props.onReload).catch(fail);
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </>
                    ) : null}
                  </div>
                );
              })}
              {!props.templates.length ? <div className="list-group-item text-muted">Aucun modèle.</div> : null}
            </div>
          </div>
        )
      ) : null}

      {tab === "labels" ? (
        <div>
          {labelDraft ? (
            <div className="border rounded p-3 mb-3">
              <input className="form-control mb-2" placeholder="Nom du libellé" value={labelDraft.name} autoFocus onChange={(e) => setLabelDraft({ ...labelDraft, name: e.target.value })} />
              <div className="d-flex gap-2 mb-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Couleur ${c}`}
                    onClick={() => setLabelDraft({ ...labelDraft, color: c })}
                    style={{ width: 24, height: 24, borderRadius: 6, background: c, border: labelDraft.color === c ? "3px solid var(--bs-body-color)" : "0" }}
                  />
                ))}
              </div>
              {session.isAdmin && !labelDraft.id ? (
                <div className="form-check mb-2">
                  <input id="km-lab-shared" type="checkbox" className="form-check-input" checked={labelDraft.shared} onChange={(e) => setLabelDraft({ ...labelDraft, shared: e.target.checked })} />
                  <label className="form-check-label" htmlFor="km-lab-shared">Libellé partagé (visible par toute l&apos;équipe)</label>
                </div>
              ) : null}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setLabelDraft(null)}>Annuler</button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    void api
                      .saveLabel(labelDraft)
                      .then(() => {
                        setLabelDraft(null);
                        props.onReload();
                      })
                      .catch(fail)
                  }
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-end mb-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setLabelDraft({ name: "", color: COLORS[0], shared: false })}>
                <i className="ti ti-plus" /> Nouveau libellé
              </button>
            </div>
          )}
          <div className="list-group">
            {props.labels.map((l) => (
              <div key={l.id} className="list-group-item d-flex align-items-center gap-2">
                <span className="km-label-dot" style={{ background: l.color }} />
                <span className="flex-fill">{l.name}</span>
                <span className="small text-muted">{l.owner_id ? "personnel" : "partagé"}</span>
                {l.owner_id || session.isAdmin ? (
                  <>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setLabelDraft({ id: l.id, name: l.name, color: l.color, shared: !l.owner_id })}>Modifier</button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        if (window.confirm(`Supprimer le libellé « ${l.name} » ? Les messages ne sont pas supprimés.`)) {
                          void api.deleteLabel(l.id).then(props.onReload).catch(fail);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </>
                ) : null}
              </div>
            ))}
            {!props.labels.length ? <div className="list-group-item text-muted">Aucun libellé.</div> : null}
          </div>
        </div>
      ) : null}

      {tab === "access" && session.isAdmin ? <KalaoMailboxAccess /> : null}

      {tab === "diagnostic" && session.isAdmin ? (
        <div className="d-flex flex-column gap-4">
          <section>
            <h6>DNS du domaine</h6>
            <KalaoMailDnsBanner detailed />
          </section>
          <section>
            <h6>Réception (Resend) et redirections</h6>
            <KalaoInboundMail />
          </section>
          <section>
            <h6>Relances automatiques de factures</h6>
            <p className="small text-muted">
              J-3 avant l&apos;échéance et J+7 après, une seule fois par facture, depuis no-reply. Actives uniquement si
              la variable <code>MAIL_REMINDERS_ENABLED=1</code> est définie sur Vercel ; sinon le cron fait une simulation.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={async () => {
                setReminders("Simulation en cours…");
                try {
                  const { authJsonHeaders } = await import("@/lib/auth-headers");
                  const res = await fetch("/api/mail/reminders?dry=1", { headers: await authJsonHeaders() });
                  const json = (await res.json()) as { results?: { invoice: string; to: string; kind: string; detail?: string }[] };
                  const list = json.results ?? [];
                  setReminders(
                    list.length
                      ? list.map((r) => `${r.invoice} → ${r.to || "?"} (${r.kind === "invoice_due_3d" ? "J-3" : "J+7"}${r.detail ? `, ${r.detail}` : ""})`).join("\n")
                      : "Aucune relance à envoyer aujourd'hui."
                  );
                } catch {
                  setReminders("Simulation impossible.");
                }
              }}
            >
              Voir ce qui partirait aujourd&apos;hui
            </button>
            {reminders ? <pre className="small mt-2 mb-0 p-2 border rounded" style={{ whiteSpace: "pre-wrap" }}>{reminders}</pre> : null}
          </section>
        </div>
      ) : null}
    </MailModal>
  );
}
