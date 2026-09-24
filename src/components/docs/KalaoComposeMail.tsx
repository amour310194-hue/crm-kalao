"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatChatTime } from "@/lib/inbox";
import { filesToMailPayload, repairMailText } from "@/lib/mail-text";
import { CRM_MAIL_TEMPLATES, fillMailTemplate } from "@/lib/mail-templates";
import {
  explainSend,
  fetchAllowedMailboxes,
  fetchPartyEmails,
  fetchSessionMail,
  mailHref,
  mailboxLabel,
  saveCrmDraft,
  sendCrmEmail,
  type CrmEmailRow,
  type MailboxKey,
  type SessionMail,
} from "@/lib/mail";
import KalaoMailReader from "@/components/docs/KalaoMailReader";

type Props = {
  to?: string | null;
  contactId?: string | null;
  companyId?: string | null;
  partyName: string;
};

export default function KalaoComposeMail({ to, contactId, companyId, partyName }: Props) {
  const [open, setOpen] = useState(false);
  const [mailbox, setMailbox] = useState<MailboxKey>("contact");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<SessionMail | null>(null);
  const [allowed, setAllowed] = useState<MailboxKey[]>(["contact", "noreply", "personal"]);
  const [rows, setRows] = useState<CrmEmailRow[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [openedId, setOpenedId] = useState<string | null>(null);

  const load = () => {
    void fetchPartyEmails({ companyId, contactId, email: to }).then(setRows);
    void fetchSessionMail().then(setSession);
    void fetchAllowedMailboxes().then((boxes) => {
      setAllowed(boxes);
      setMailbox((current) => (boxes.includes(current) ? current : boxes[0] ?? "personal"));
    });
  };

  useEffect(() => {
    load();
  }, [companyId, contactId, to]);

  const recipient = (to ?? "").trim();

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setOpen((v) => !v);
            setMsg(null);
          }}
        >
          <i className="ti ti-mail me-1" />
          Envoyer un e-mail
        </button>
        <Link href={mailHref(mailbox, "all")} className="btn btn-outline-light shadow">
          Boîtes CRM
        </Link>
      </div>
      {open ? (
        <div className="border rounded p-3 bg-white">
          <p className="mb-2 fw-semibold">Écrire à {partyName}</p>
          <div className="mb-2">
            <label className="form-label mb-1">Modèle</label>
            <select
              className="form-select"
              defaultValue=""
              onChange={(e) => {
                const tpl = CRM_MAIL_TEMPLATES.find((item) => item.id === e.target.value);
                if (!tpl) return;
                const filled = fillMailTemplate(tpl, { name: partyName, email: recipient });
                setSubject(filled.subject);
                setBody(filled.body);
              }}
            >
              <option value="">Sans modèle — écrire librement</option>
              {CRM_MAIL_TEMPLATES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label mb-1">Depuis</label>
            <select
              className="form-select"
              value={mailbox}
              onChange={(e) => setMailbox(e.target.value as MailboxKey)}
            >
              {allowed.includes("contact") ? (
                <option value="contact">Contact (partagée)</option>
              ) : null}
              {allowed.includes("noreply") ? (
                <option value="noreply">No-reply (partagée)</option>
              ) : null}
              {allowed.includes("personal") ? (
                <option value="personal">
                  Ma boîte{session ? ` — ${session.workEmail}` : ""} (privé)
                </option>
              ) : null}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label mb-1">À</label>
            <input className="form-control" value={recipient} readOnly />
          </div>
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Objet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={6}
              placeholder="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveCrmDraft({
                    mailbox,
                    to: recipient,
                    subject,
                    body,
                    companyId,
                    contactId,
                  });
                  setMsg("Brouillon enregistré dans la boîte CRM.");
                  load();
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Erreur");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Brouillon
            </button>
            <button
              type="button"
              className="btn btn-dark"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const attachments = files.length ? await filesToMailPayload(files) : [];
                  const result = await sendCrmEmail({
                    mailbox,
                    to: recipient,
                    subject,
                    body,
                    companyId,
                    contactId,
                    attachments,
                  });
                  setMsg(explainSend(result));
                  if (result.dispatched) {
                    setSubject("");
                    setBody("");
                    setFiles([]);
                    load();
                  }
                } catch (err) {
                  setMsg(err instanceof Error ? err.message : "Erreur");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Envoyer
            </button>
            <button type="button" className="btn btn-outline-light" onClick={() => setOpen(false)}>
              Fermer
            </button>
          </div>
          {msg ? <p className="mb-0 mt-2 text-muted">{msg}</p> : null}
        </div>
      ) : null}
      {rows.length ? (
        <div className="border rounded p-3 bg-light">
          <p className="mb-2 fw-semibold">Courriers échangés ({rows.length})</p>
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              className="btn btn-link text-start w-100 p-0 mb-2 text-decoration-none"
              onClick={() => setOpenedId(row.id === openedId ? null : row.id)}
            >
              <span className="d-block fw-semibold">
                {row.direction === "out" ? "Envoyé" : "Reçu"} · {mailboxLabel(row.mailbox)} ·{" "}
                {repairMailText(row.subject)}
              </span>
              <span className="d-block text-muted">
                {formatChatTime(row.created_at)} · {repairMailText(row.body).slice(0, 90)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mb-0 text-muted">Aucun courrier échangé avec ce client pour le moment.</p>
      )}
      {openedId ? (
        <KalaoMailReader
          id={openedId}
          onClose={() => setOpenedId(null)}
          onChanged={load}
        />
      ) : null}
    </div>
  );
}
