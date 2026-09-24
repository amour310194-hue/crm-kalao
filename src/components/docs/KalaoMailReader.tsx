"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isLiveId } from "@/lib/docs";
import { filesToMailPayload } from "@/lib/mail-text";
import { CRM_MAIL_TEMPLATES, fillMailTemplate } from "@/lib/mail-templates";
import {
  explainSend,
  fetchCrmEmail,
  mailboxLabel,
  mailHref,
  patchCrmEmail,
  restoreTray,
  sendCrmEmail,
  trayOf,
  type CrmEmailRow,
  type MailboxKey,
} from "@/lib/mail";

type Mode = "read" | "reply" | "forward";

type Props = {
  id?: string | null;
  onClose?: () => void;
  onChanged?: () => void;
};

export default function KalaoMailReader({ id: idProp, onClose, onChanged }: Props) {
  const [row, setRow] = useState<CrmEmailRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("read");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const urlId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;
  const id = idProp ?? urlId;

  const load = () => {
    if (!id || !isLiveId(id)) return;
    void fetchCrmEmail(id).then((next) => {
      setRow(next);
      if (next?.unread) {
        void patchCrmEmail(next.id, { unread: false }).then(() => onChanged?.());
      }
    });
  };

  useEffect(() => {
    setMode("read");
    setMsg(null);
    setFiles([]);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const quote = useMemo(() => {
    if (!row) return "";
    return `\n\n--- Message d'origine ---\nDe : ${row.from_email}\nÀ : ${row.to_email}\nObjet : ${row.subject}\n\n${row.body}`;
  }, [row]);

  if (!row) return null;

  const startReply = (kind: "reply" | "forward") => {
    setMode(kind);
    setTo(kind === "forward" ? "" : row.from_email);
    setSubject(
      kind === "forward"
        ? row.subject.startsWith("Tr:")
          ? row.subject
          : `Tr: ${row.subject}`
        : row.subject.startsWith("Re:")
          ? row.subject
          : `Re: ${row.subject}`
    );
    setBody(quote);
    setMsg(null);
  };

  const move = async (folder: CrmEmailRow["folder"]) => {
    await patchCrmEmail(row.id, { folder, unread: false });
    setMsg(`Déplacé vers ${folder}.`);
    onChanged?.();
    load();
  };

  const mailbox: MailboxKey = row.mailbox;

  return (
    <div className="alert alert-light border mb-0 rounded-0">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <p className="mb-1 fw-semibold fs-16">{row.subject}</p>
          <p className="mb-0">
            {trayOf(row) === "drafts"
              ? "Brouillon"
              : row.direction === "out"
                ? "Envoyé"
                : "Reçu"}{" "}
            · {mailboxLabel(row.mailbox)} · de {row.from_email} · à {row.to_email}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {trayOf(row) !== "drafts" ? (
            <>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => startReply("reply")}>
                Répondre
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={() => startReply("forward")}
              >
                Transférer
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-sm btn-outline-warning"
            onClick={() => void move(trayOf(row) === "spam" ? restoreTray(row) : "spam")}
          >
            {trayOf(row) === "spam" ? "Retirer du spam" : "Spam"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => void move(trayOf(row) === "deleted" ? restoreTray(row) : "deleted")}
          >
            {trayOf(row) === "deleted" ? "Restaurer" : "Supprimer"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => void patchCrmEmail(row.id, { unread: true }).then(() => onChanged?.())}
          >
            Non lu
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => window.print()}
          >
            Imprimer
          </button>
          <Link href={mailHref(row.mailbox, trayOf(row) === "drafts" ? "drafts" : "inbox")} className="btn btn-sm btn-outline-dark">
            Boîtes
          </Link>
          {onClose ? (
            <button type="button" className="btn btn-sm btn-outline-dark" onClick={onClose}>
              Fermer
            </button>
          ) : null}
        </div>
      </div>
      <pre className="mb-3 text-wrap bg-white border rounded p-3" style={{ whiteSpace: "pre-wrap" }}>
        {row.body}
      </pre>
      {mode !== "read" ? (
        <div className="border rounded p-3 bg-white">
          <p className="fw-semibold mb-2">{mode === "forward" ? "Transférer" : "Répondre"}</p>
          <div className="mb-2">
            <label className="form-label mb-1">Modèle</label>
            <select
              className="form-select"
              defaultValue=""
              onChange={(e) => {
                const tpl = CRM_MAIL_TEMPLATES.find((item) => item.id === e.target.value);
                if (!tpl) return;
                const filled = fillMailTemplate(tpl, { name: row.contacts ? `${row.contacts.first_name} ${row.contacts.last_name}` : "", email: to });
                setSubject(mode === "forward" ? `Tr: ${filled.subject}` : `Re: ${filled.subject}`);
                setBody(`${filled.body}${quote}`);
              }}
            >
              <option value="">Écrire librement ou choisir un modèle</option>
              {CRM_MAIL_TEMPLATES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label mb-1">À</label>
            <input className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="mb-2">
            <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="mb-2">
            <textarea className="form-control" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div className="mb-2">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            {files.length ? (
              <p className="mb-0 mt-1 text-muted">{files.length} fichier(s) joint(s)</p>
            ) : null}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const attachments = files.length ? await filesToMailPayload(files) : [];
                  const result = await sendCrmEmail({
                    mailbox,
                    to,
                    subject,
                    body,
                    companyId: row.company_id,
                    contactId: row.contact_id,
                    inReplyTo: row.id,
                    attachments,
                  });
                  setMsg(explainSend(result));
                  if (result.dispatched) {
                    setMode("read");
                    setFiles([]);
                    onChanged?.();
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
            <button type="button" className="btn btn-outline-light" onClick={() => setMode("read")}>
              Annuler
            </button>
          </div>
        </div>
      ) : null}
      {msg ? <p className="mb-0 mt-2">{msg}</p> : null}
    </div>
  );
}
