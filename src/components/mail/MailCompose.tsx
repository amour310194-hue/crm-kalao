"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import type { MailApi, MailSession } from "@/lib/mail/client";
import { fillTemplate } from "@/lib/mail/html";
import { formatBytes, isValidEmail } from "@/lib/mail/format";
import {
  MAX_ATTACHMENT_BYTES,
  MAX_TOTAL_ATTACHMENT_BYTES,
  type ComposeAttachment,
  type ComposeInput,
  type MailboxKey,
  type MailTemplate,
} from "@/lib/mail/types";
import RecipientField from "@/components/mail/RecipientField";
import { ScheduleMenu } from "@/components/mail/menus";
import { fileIcon, IconButton, MailMenu, type Toast } from "@/components/mail/ui";
import { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL } from "@/lib/org";

export type ComposeSeed = {
  key: string;
  draftId?: string | null;
  mailbox: MailboxKey;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  threadId?: string | null;
  inReplyToId?: string | null;
  contactId?: string | null;
  companyId?: string | null;
  dossierId?: string | null;
  invoiceId?: string | null;
  attachments: ComposeAttachment[];
  title?: string;
};

type Props = {
  seed: ComposeSeed;
  api: MailApi;
  session: MailSession;
  templates: MailTemplate[];
  variant?: "window" | "inline";
  onClose: () => void;
  onSend: (input: ComposeInput) => void;
  onDraftSaved?: () => void;
  push: (toast: Omit<Toast, "id">) => number;
  onTemplatesChanged?: () => void;
};

function hasText(html: string) {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

export default function MailCompose({
  seed,
  api,
  session,
  templates,
  variant = "window",
  onClose,
  onSend,
  onDraftSaved,
  push,
  onTemplatesChanged,
}: Props) {
  const sendable: MailboxKey[] = session.mailboxes.filter((b) => b !== "triage");
  const [mailbox, setMailbox] = useState<MailboxKey>(sendable.includes(seed.mailbox) ? seed.mailbox : sendable[0] ?? "personal");
  const [to, setTo] = useState(seed.to);
  const [cc, setCc] = useState(seed.cc);
  const [bcc, setBcc] = useState(seed.bcc);
  const [showCc, setShowCc] = useState(seed.cc.length > 0);
  const [showBcc, setShowBcc] = useState(seed.bcc.length > 0);
  const [subject, setSubject] = useState(seed.subject);
  const [html, setHtml] = useState(seed.html);
  const [attachments, setAttachments] = useState<ComposeAttachment[]>(seed.attachments);
  const [draftId, setDraftId] = useState<string | null>(seed.draftId ?? null);
  const [threadId, setThreadId] = useState<string | null>(seed.threadId ?? null);
  const [status, setStatus] = useState<string>(seed.draftId ? "Brouillon" : "");
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = useRef(false);
  const saving = useRef<Promise<string | null> | null>(null);
  const closed = useRef(false);

  const input = useMemo<ComposeInput>(
    () => ({
      draftId,
      mailbox,
      to,
      cc: showCc ? cc : [],
      bcc: showBcc ? bcc : [],
      subject,
      html,
      threadId,
      inReplyToId: seed.inReplyToId ?? null,
      contactId: seed.contactId ?? null,
      companyId: seed.companyId ?? null,
      dossierId: seed.dossierId ?? null,
      invoiceId: seed.invoiceId ?? null,
      attachments: attachments
        .filter((a) => !a.uploading && !a.error && (a.path || a.sourceAttachmentId))
        .map((a) => ({
          path: a.path,
          sourceAttachmentId: a.sourceAttachmentId,
          filename: a.filename,
          size: a.size,
          contentType: a.contentType,
        })),
    }),
    [draftId, mailbox, to, cc, bcc, showCc, showBcc, subject, html, threadId, seed, attachments]
  );

  // La signature seule ne compte pas comme du contenu : fermer une fenêtre vierge ne crée pas de brouillon.
  const untouchedBody = html === seed.html || !hasText(html);
  const isEmpty =
    !to.length && !cc.length && !bcc.length && !subject.trim() && untouchedBody && !attachments.length && !seed.draftId;

  /** Enregistre le brouillon ; renvoie son id. */
  const save = useCallback(async (): Promise<string | null> => {
    if (saving.current) await saving.current;
    if (isEmpty && !draftId) return null;
    const run = (async () => {
      setStatus("Enregistrement…");
      try {
        const res = await api.saveDraft(input);
        setDraftId(res.id);
        setThreadId(res.threadId);
        dirty.current = false;
        setStatus("Brouillon enregistré");
        onDraftSaved?.();
        return res.id;
      } catch (err) {
        setStatus(err instanceof Error ? `Non enregistré : ${err.message}` : "Non enregistré");
        return draftId;
      }
    })();
    saving.current = run;
    const id = await run;
    saving.current = null;
    return id;
  }, [api, input, isEmpty, draftId, onDraftSaved]);

  // Enregistrement automatique 2,5 s après la dernière frappe.
  useEffect(() => {
    if (!dirty.current) return;
    const t = window.setTimeout(() => {
      if (!closed.current) void save();
    }, 2500);
    return () => window.clearTimeout(t);
  }, [input, save]);

  const touch = () => {
    dirty.current = true;
    setStatus("");
  };

  const uploadFiles = async (files: File[]) => {
    const currentTotal = attachments.reduce((s, a) => s + a.size, 0);
    let total = currentTotal;
    for (const file of files) {
      const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`;
      if (file.size > MAX_ATTACHMENT_BYTES || total + file.size > MAX_TOTAL_ATTACHMENT_BYTES) {
        push({
          tone: "error",
          text: `« ${file.name} » (${formatBytes(file.size)}) dépasse la limite de 25 Mo. Partagez plutôt un lien (Drive, WeTransfer…).`,
          duration: 9000,
        });
        continue;
      }
      total += file.size;
      touch();
      setAttachments((list) => [...list, { key, filename: file.name, size: file.size, contentType: file.type, uploading: true }]);
      try {
        const { path } = await api.upload(file);
        setAttachments((list) => list.map((a) => (a.key === key ? { ...a, path, uploading: false } : a)));
      } catch (err) {
        setAttachments((list) =>
          list.map((a) => (a.key === key ? { ...a, uploading: false, error: err instanceof Error ? err.message : "échec" } : a))
        );
      }
    }
  };

  const close = async () => {
    closed.current = true;
    if (!isEmpty && (dirty.current || !draftId)) {
      const id = await save();
      if (id) push({ text: "Brouillon enregistré." });
    }
    onClose();
  };

  const discard = async () => {
    closed.current = true;
    if (draftId) {
      try {
        await api.discardDraft(draftId);
      } catch {
        /* déjà supprimé */
      }
    }
    push({ text: "Brouillon supprimé." });
    onClose();
  };

  const submit = async (scheduledAt?: Date) => {
    const all = [...to, ...(showCc ? cc : []), ...(showBcc ? bcc : [])];
    if (!all.length) {
      push({ tone: "error", text: "Ajoutez au moins un destinataire." });
      return;
    }
    const bad = all.filter((e) => !isValidEmail(e));
    if (bad.length) {
      push({ tone: "error", text: `Adresse invalide : ${bad.join(", ")}` });
      return;
    }
    if (attachments.some((a) => a.uploading)) {
      push({ tone: "error", text: "Patientez : une pièce jointe est encore en cours d'envoi." });
      return;
    }
    if (!subject.trim() && !window.confirm("Envoyer ce message sans objet ?")) return;
    if (/pi[eè]ce[s]? jointe|ci-joint|en pj/i.test(html.replace(/<[^>]+>/g, " ")) && !attachments.length) {
      if (!window.confirm("Le message parle d'une pièce jointe, mais aucun fichier n'est joint. Envoyer quand même ?")) return;
    }
    closed.current = true;
    const id = await save();
    onSend({ ...input, draftId: id ?? draftId, scheduledAt: scheduledAt ? scheduledAt.toISOString() : null });
    onClose();
  };

  const applyTemplate = async (tpl: MailTemplate) => {
    const vars = await api
      .templateVars({ email: to[0] ?? null, contactId: seed.contactId, companyId: seed.companyId })
      .catch(() => ({}) as Record<string, string>);
    const body = fillTemplate(tpl.body_html, { expediteur: session.fullName, ...vars });
    if (!subject.trim() && tpl.subject) setSubject(fillTemplate(tpl.subject, vars, false));
    // Le modèle s'insère en tête ; la signature et la citation restent en dessous.
    setHtml((current) => `${body}${current}`);
    touch();
  };

  const saveAsTemplate = async () => {
    const name = window.prompt("Nom du modèle :", subject || "Nouveau modèle");
    if (!name) return;
    try {
      const bodyOnly = html.replace(/<div class="kalao_signature">[\s\S]*?<\/div>/, "").replace(/<br><div class="kalao_quote">[\s\S]*$/, "");
      await api.saveTemplate({ name, subject, body_html: bodyOnly });
      push({ text: `Modèle « ${name} » enregistré.` });
      onTemplatesChanged?.();
    } catch (err) {
      push({ tone: "error", text: err instanceof Error ? err.message : "Échec" });
    }
  };

  const fromOptions = sendable.map((box) => ({
    box,
    label:
      box === "contact"
        ? `Contact Kalao <${KALAO_CONTACT_EMAIL}>`
        : box === "noreply"
          ? `CRM Kalao <${KALAO_NOREPLY_EMAIL}> (automatique)`
          : `${session.fullName} <${session.workEmail}>`,
  }));

  const title = seed.title || subject || "Nouveau message";
  const cls = `km-compose${variant === "inline" ? " inline" : ""}${minimized ? " minimized" : ""}${maximized ? " maximized" : ""}`;

  return (
    <div
      className={cls}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          void submit();
        }
        if (e.key === "Escape" && variant === "window") {
          e.stopPropagation();
          void close();
        }
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        setDragging(false);
        void uploadFiles(Array.from(e.dataTransfer.files));
      }}
      style={{ position: variant === "inline" ? "relative" : undefined }}
    >
      {variant === "window" ? (
        <div className="km-compose-head" onClick={() => setMinimized((v) => !v)}>
          <span className="km-title">{title}</span>
          <IconButton icon={minimized ? "ti ti-chevron-up" : "ti ti-minus"} title={minimized ? "Agrandir" : "Réduire"} onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); setMaximized(false); }} />
          <IconButton icon={maximized ? "ti ti-arrows-diagonal-minimize-2" : "ti ti-arrows-diagonal"} title={maximized ? "Quitter le plein écran" : "Plein écran"} onClick={(e) => { e.stopPropagation(); setMaximized((v) => !v); setMinimized(false); }} />
          <IconButton icon="ti ti-x" title="Enregistrer et fermer (Échap)" onClick={(e) => { e.stopPropagation(); void close(); }} />
        </div>
      ) : null}
      {minimized ? null : (
        <>
          {dragging ? <div className="km-drop">Déposez les fichiers ici</div> : null}
          <div className="km-field">
            <label>De</label>
            <select
              value={mailbox}
              onChange={(e) => {
                setMailbox(e.target.value as MailboxKey);
                touch();
              }}
              aria-label="Expéditeur"
            >
              {fromOptions.map((o) => (
                <option key={o.box} value={o.box}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <RecipientField
            label="À"
            value={to}
            onChange={(v) => {
              setTo(v);
              touch();
            }}
            api={api}
            autoFocus={!seed.to.length}
            trailing={
              <span className="km-field-links">
                {!showCc ? <button type="button" onClick={() => setShowCc(true)}>Cc</button> : null}
                {!showBcc ? <button type="button" onClick={() => setShowBcc(true)}>Cci</button> : null}
              </span>
            }
          />
          {showCc ? (
            <RecipientField label="Cc" value={cc} onChange={(v) => { setCc(v); touch(); }} api={api} />
          ) : null}
          {showBcc ? (
            <RecipientField label="Cci" value={bcc} onChange={(v) => { setBcc(v); touch(); }} api={api} />
          ) : null}
          <div className="km-field">
            <input
              placeholder="Objet"
              aria-label="Objet"
              value={subject}
              autoFocus={Boolean(seed.to.length) && !seed.subject}
              onChange={(e) => {
                setSubject(e.target.value);
                touch();
              }}
            />
          </div>
          <div className="km-editor">
            <EditorProvider>
              <Editor
                value={html}
                onChange={(e) => {
                  setHtml(e.target.value);
                  touch();
                }}
                aria-label="Message"
                autoFocus={Boolean(seed.to.length && seed.subject)}
              >
                <Toolbar>
                  <BtnUndo />
                  <BtnRedo />
                  <Separator />
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnStrikeThrough />
                  <Separator />
                  <BtnNumberedList />
                  <BtnBulletList />
                  <Separator />
                  <BtnLink />
                  <BtnClearFormatting />
                </Toolbar>
              </Editor>
            </EditorProvider>
          </div>
          {attachments.length ? (
            <div className="km-compose-atts">
              {attachments.map((a) => (
                <span key={a.key} className={`km-compose-att${a.error ? " error" : ""}`} title={a.error ?? a.filename}>
                  <i className={a.uploading ? "ti ti-loader-2" : fileIcon(a.contentType, a.filename)} />
                  <span className="km-name">{a.filename}</span>
                  <span className="text-muted">({a.uploading ? "envoi…" : a.error ? "échec" : formatBytes(a.size)})</span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    aria-label={`Retirer ${a.filename}`}
                    onClick={() => {
                      setAttachments((list) => list.filter((x) => x.key !== a.key));
                      touch();
                    }}
                  >
                    <i className="ti ti-x" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <div className="km-compose-foot">
            <div className="km-send-group">
              <button type="button" className="btn btn-primary btn-send" onClick={() => void submit()} title="Envoyer (Ctrl+Entrée)">
                Envoyer
              </button>
              <ScheduleMenu onSchedule={(d) => void submit(d)} />
            </div>
            <IconButton icon="ti ti-paperclip" title="Joindre des fichiers (25 Mo max.)" onClick={() => fileRef.current?.click()} />
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                void uploadFiles(files);
              }}
            />
            <MailMenu up trigger={<IconButton icon="ti ti-template" title="Modèles" />}>
              {(closeMenu) => (
                <>
                  <div className="km-menu-title">Insérer un modèle</div>
                  {templates.length ? (
                    templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          closeMenu();
                          void applyTemplate(t);
                        }}
                      >
                        <i className={t.owner_id ? "ti ti-user" : "ti ti-users"} /> {t.name}
                      </button>
                    ))
                  ) : (
                    <div className="km-menu-item text-muted">Aucun modèle.</div>
                  )}
                  <hr />
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      void saveAsTemplate();
                    }}
                  >
                    <i className="ti ti-device-floppy" /> Enregistrer comme modèle
                  </button>
                </>
              )}
            </MailMenu>
            <span className="km-compose-status">{status}</span>
            <span style={{ flex: 1 }} />
            <IconButton icon="ti ti-trash" title="Supprimer le brouillon" onClick={() => void discard()} />
            {variant === "inline" ? (
              <IconButton icon="ti ti-x" title="Fermer" onClick={() => void close()} />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
