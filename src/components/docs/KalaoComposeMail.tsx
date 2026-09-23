"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { liveHref } from "@/lib/docs";
import {
  explainSend,
  fetchPartyEmails,
  fetchSessionMail,
  mailHref,
  mailboxLabel,
  sendCrmEmail,
  type CrmEmailRow,
  type MailboxKey,
  type SessionMail,
} from "@/lib/mail";

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
  const [rows, setRows] = useState<CrmEmailRow[]>([]);

  const load = () => {
    void fetchPartyEmails({ companyId, contactId }).then(setRows);
    void fetchSessionMail().then(setSession);
  };

  useEffect(() => {
    load();
  }, [companyId, contactId]);

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
            <label className="form-label mb-1">Depuis</label>
            <select
              className="form-select"
              value={mailbox}
              onChange={(e) => setMailbox(e.target.value as MailboxKey)}
            >
              <option value="contact">Contact (tous les employés)</option>
              <option value="noreply">No-reply (tous les employés)</option>
              <option value="personal">
                Ma boîte{session ? ` — ${session.workEmail}` : ""} (privé)
              </option>
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
              rows={5}
              placeholder="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-dark"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const result = await sendCrmEmail({
                    mailbox,
                    to: recipient,
                    subject,
                    body,
                    companyId,
                    contactId,
                  });
                  setMsg(explainSend(result));
                  if (result.dispatched) {
                    setSubject("");
                    setBody("");
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
          <p className="mb-2 fw-semibold">Courrier lié</p>
          {rows.slice(0, 6).map((row) => (
            <div key={row.id} className="d-flex justify-content-between gap-2 mb-1">
              <Link href={liveHref(all_routes.emailReply, row.id)}>
                {row.direction === "out" ? "Envoyé" : "Reçu"} · {mailboxLabel(row.mailbox)} ·{" "}
                {row.subject}
              </Link>
              <span className="text-muted">{row.status}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
