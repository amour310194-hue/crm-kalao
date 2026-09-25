"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { MailApi, MailSession } from "@/lib/mail/client";
import { DELIVERY_LABEL, deliveryTone, formatBytes, formatFullDate, formatListDate } from "@/lib/mail/format";
import { draftSeed, forwardSeed, replySeed, type SeedBase } from "@/lib/mail/compose";
import type { DirectoryEntry, MailAction, MailLabel, MailMessage, MailView } from "@/lib/mail/types";
import { all_routes } from "@/router/all_routes";
import MailBody from "@/components/mail/MailBody";
import { AssignMenu, LabelMenu, MoveMenu, SnoozeMenu } from "@/components/mail/menus";
import { Avatar, fileIcon, Icon, IconButton, MAILBOX_META, MailMenu } from "@/components/mail/ui";

type Props = {
  api: MailApi;
  session: MailSession;
  threadId: string;
  view: MailView;
  labels: MailLabel[];
  directory: DirectoryEntry[];
  signature: string;
  reloadKey: number;
  onBack?: () => void;
  /** Volet de lecture à droite : le bouton Retour n'est utile que sur téléphone. */
  backMobileOnly?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  position?: string;
  onAction: (threadIds: string[], action: MailAction, opts?: { leave?: boolean; undo?: MailAction }) => void;
  onCompose: (seed: SeedBase, inline: boolean) => void;
  onCreateLabel: (name: string) => Promise<MailLabel | null>;
  onCancelScheduled: (id: string) => void;
  onDiscardDraft: (id: string) => void;
  composeSlot?: ReactNode;
  onLoaded?: (messages: MailMessage[]) => void;
  onChanged?: () => void;
};

function displayName(m: MailMessage, session: MailSession) {
  if (m.direction === "out") return m.created_by === session.userId ? "moi" : m.from_name || m.from_email;
  return m.from_name || m.from_email;
}

function recipientsLine(m: MailMessage, session: MailSession) {
  const me = [session.workEmail];
  const list = [...(m.to_emails.length ? m.to_emails : [m.to_email]), ...m.cc_emails];
  const names = list.map((e) => (me.includes(e.toLowerCase()) ? "moi" : e));
  return `à ${names.slice(0, 3).join(", ")}${names.length > 3 ? ` et ${names.length - 3} autre(s)` : ""}`;
}

export default function MailThread(props: Props) {
  const { api, session, threadId, labels, directory, signature, reloadKey, view } = props;
  const [messages, setMessages] = useState<MailMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [details, setDetails] = useState<Set<string>>(new Set());
  const [showOlder, setShowOlder] = useState(false);
  const [inlineUrls, setInlineUrls] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const list = await api.thread(threadId);
      setMessages(list);
      setError(null);
      props.onLoaded?.(list);
      const inline = list.flatMap((m) => m.attachments.filter((a) => a.inline).map((a) => a.id));
      if (inline.length) setInlineUrls(await api.inlineUrls(inline));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger la conversation.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, threadId]);

  useEffect(() => {
    setMessages(null);
    setExpanded(new Set());
    setShowOlder(false);
    void load();
  }, [load]);

  useEffect(() => {
    if (reloadKey) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  // Comme Gmail : dernier message et messages non lus dépliés.
  useEffect(() => {
    if (!messages?.length) return;
    setExpanded((prev) => {
      if (prev.size) return prev;
      const next = new Set<string>();
      const visible = messages.filter((m) => m.folder !== "drafts");
      visible.forEach((m) => {
        if (!m.read) next.add(m.id);
      });
      const last = visible[visible.length - 1];
      if (last) next.add(last.id);
      return next;
    });
  }, [messages]);

  const inTrash = view === "deleted" || view === "spam";
  const visible = useMemo(
    () => (messages ?? []).filter((m) => (inTrash ? true : m.folder !== "deleted" && m.folder !== "spam")),
    [messages, inTrash]
  );
  const sentOrReceived = visible.filter((m) => m.folder !== "drafts");
  const drafts = visible.filter((m) => m.folder === "drafts" && m.created_by === session.userId);
  const first = sentOrReceived[0] ?? visible[0];
  const last = sentOrReceived[sentOrReceived.length - 1];

  if (error) {
    return (
      <div className="km-empty">
        <i className="ti ti-alert-triangle" />
        {error}
        <div className="mt-3">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => void load()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  if (!messages) {
    return (
      <div className="p-4">
        <div className="km-skeleton" style={{ height: 28, width: "60%", marginBottom: 16 }} />
        <div className="km-skeleton" />
        <div className="km-skeleton" />
      </div>
    );
  }
  if (!visible.length) {
    return (
      <div className="km-empty">
        <i className="ti ti-mail-off" />
        Cette conversation n&apos;est plus disponible.
      </div>
    );
  }

  const ids = [threadId];
  const threadLabels = [...new Set(visible.flatMap((m) => m.label_ids))];
  const shared = visible.some((m) => m.mailbox !== "personal");
  const assigned = visible.map((m) => m.assigned_to).find(Boolean) ?? null;
  const assignee = directory.find((d) => d.profile_id === assigned);
  const mailbox = (last ?? first).mailbox;
  const contactId = visible.map((m) => m.contact_id).find(Boolean);
  const companyId = visible.map((m) => m.company_id).find(Boolean);
  const dossierId = visible.map((m) => m.dossier_id).find(Boolean);
  const snoozed = visible.map((m) => m.snoozed_until).find((s) => s && new Date(s).getTime() > Date.now());
  const available = session.mailboxes;
  const composeCtx = { available, signature, workEmail: session.workEmail };

  const collapsedMiddle = !showOlder && sentOrReceived.length > 4
    ? sentOrReceived.slice(1, -2).filter((m) => !expanded.has(m.id))
    : [];
  const hiddenIds = new Set(collapsedMiddle.length >= 2 ? collapsedMiddle.map((m) => m.id) : []);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderMessage = (m: MailMessage) => {
    const open = expanded.has(m.id);
    const name = displayName(m, session);
    const tone = deliveryTone(m.delivery_status);
    const files = m.attachments.filter((a) => !a.inline);
    if (!open) {
      return (
        <div key={m.id} className="km-msg collapsed" onClick={() => toggle(m.id)}>
          <div className="km-msg-head">
            <Avatar name={m.from_name || m.from_email} />
            <div className="km-msg-meta">
              <div className="d-flex gap-2 align-items-baseline">
                <span className="km-name">{name}</span>
                {files.length ? <i className="ti ti-paperclip text-muted" /> : null}
              </div>
              <div className="km-msg-snippet">{m.snippet || m.body.slice(0, 160)}</div>
            </div>
            <span className="km-msg-date">{formatListDate(m.created_at)}</span>
          </div>
        </div>
      );
    }
    return (
      <div key={m.id} className="km-msg">
        <div className="km-msg-head">
          <Avatar name={m.from_name || m.from_email} />
          <div className="km-msg-meta" onClick={() => toggle(m.id)} style={{ cursor: "pointer" }}>
            <div>
              <span className="km-name">{m.from_name || (m.direction === "out" ? name : m.from_email)}</span>{" "}
              <span className="km-addr">&lt;{m.from_email}&gt;</span>
            </div>
            <div className="km-to">
              {recipientsLine(m, session)}{" "}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 align-baseline text-muted"
                aria-label="Détails"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetails((prev) => {
                    const next = new Set(prev);
                    if (next.has(m.id)) next.delete(m.id);
                    else next.add(m.id);
                    return next;
                  });
                }}
              >
                <i className="ti ti-caret-down" />
              </button>
            </div>
          </div>
          <span className="km-msg-date" title={formatFullDate(m.sent_at || m.created_at)}>
            <span className="km-date-long">{formatFullDate(m.sent_at || m.created_at)}</span>
            <span className="km-date-short">{formatListDate(m.sent_at || m.created_at)}</span>
          </span>
          <IconButton
            icon={m.starred ? "ti ti-star-filled" : "ti ti-star"}
            title={m.starred ? "Ne plus suivre" : "Suivre"}
            active={m.starred}
            onClick={() => {
              void api.act({ ids: [m.id] }, { action: m.starred ? "unstar" : "star" }).then(() => {
                void load();
                props.onChanged?.();
              });
            }}
          />
          <IconButton
            icon="ti ti-arrow-back-up"
            title="Répondre"
            onClick={() => props.onCompose(replySeed(m, "reply", composeCtx), true)}
          />
          <MailMenu align="right" trigger={<IconButton icon="ti ti-dots-vertical" title="Plus" />}>
            {(close) => (
              <>
                <button type="button" onClick={() => { close(); props.onCompose(replySeed(m, "reply", composeCtx), true); }}>
                  <i className="ti ti-arrow-back-up" /> Répondre
                </button>
                <button type="button" onClick={() => { close(); props.onCompose(replySeed(m, "replyAll", composeCtx), true); }}>
                  <i className="ti ti-arrow-back-up-double" /> Répondre à tous
                </button>
                <button type="button" onClick={() => { close(); props.onCompose(forwardSeed(m, composeCtx), true); }}>
                  <i className="ti ti-arrow-forward-up" /> Transférer
                </button>
                <hr />
                <button type="button" onClick={() => { close(); props.onAction(ids, { action: "unread" }, { leave: true }); }}>
                  <i className="ti ti-mail" /> Marquer comme non lu
                </button>
                <button type="button" onClick={() => { close(); window.print(); }}>
                  <i className="ti ti-printer" /> Imprimer
                </button>
              </>
            )}
          </MailMenu>
        </div>
        {details.has(m.id) ? (
          <dl className="km-details ms-5">
            <dt>De</dt>
            <dd>{m.from_name ? `${m.from_name} <${m.from_email}>` : m.from_email}</dd>
            <dt>À</dt>
            <dd>{(m.to_emails.length ? m.to_emails : [m.to_email]).join(", ")}</dd>
            {m.cc_emails.length ? (<><dt>Cc</dt><dd>{m.cc_emails.join(", ")}</dd></>) : null}
            {m.direction === "out" && m.bcc_emails.length ? (<><dt>Cci</dt><dd>{m.bcc_emails.join(", ")}</dd></>) : null}
            <dt>Date</dt>
            <dd>{formatFullDate(m.sent_at || m.created_at)}</dd>
            <dt>Objet</dt>
            <dd>{m.subject}</dd>
            <dt>Boîte</dt>
            <dd>{MAILBOX_META[m.mailbox]?.label ?? m.mailbox}</dd>
            {m.direction === "in" && (m.auth_spf || m.auth_dkim || m.auth_dmarc) ? (
              <>
                <dt>Sécurité</dt>
                <dd>SPF {m.auth_spf ?? "?"} · DKIM {m.auth_dkim ?? "?"} · DMARC {m.auth_dmarc ?? "?"}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
        {m.direction === "out" && m.delivery_status && m.folder !== "drafts" ? (
          <div className="ms-5 ps-2 mt-1">
            <span className={`badge bg-${tone}-subtle text-${tone}-emphasis`}>
              {DELIVERY_LABEL[m.delivery_status] ?? m.delivery_status}
            </span>
            {m.delivery_detail && tone !== "success" ? <span className="small text-muted ms-2">{m.delivery_detail}</span> : null}
          </div>
        ) : null}
        {m.folder === "scheduled" ? (
          <div className="km-banner info ms-5 mt-2 rounded">
            <i className="ti ti-calendar-time" />
            Envoi programmé pour {formatFullDate(m.scheduled_at)}.
            <button type="button" className="btn btn-sm btn-outline-primary ms-auto" onClick={() => props.onCancelScheduled(m.id)}>
              Annuler l&apos;envoi
            </button>
          </div>
        ) : null}
        {m.direction === "in" && m.folder === "spam" ? (
          <div className="km-banner error ms-5 mt-2 rounded">
            <i className="ti ti-alert-octagon" /> Ce message a été classé comme spam
            {m.auth_dmarc === "fail" ? " (échec de l'authentification de l'expéditeur)" : ""}.
          </div>
        ) : null}
        <div className="km-msg-body">
          <MailBody
            html={m.html}
            text={m.body}
            inlineUrls={inlineUrls}
            trustedSender={m.direction === "out"}
          />
        </div>
        {files.length ? (
          <>
            <div className="km-atts">
              {files.map((a) => (
                <a
                  key={a.id}
                  className="km-att"
                  href={api.attachmentUrl({ id: a.id })}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Ouvrir ${a.filename}`}
                >
                  <span className="km-att-thumb">
                    <i className={fileIcon(a.content_type, a.filename)} />
                  </span>
                  <span className="km-att-name">{a.filename}</span>
                  <span className="km-att-size d-flex justify-content-between">
                    {formatBytes(a.size_bytes)}
                    <span
                      role="button"
                      title="Télécharger"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(api.attachmentUrl({ id: a.id }, true), "_blank", "noopener");
                      }}
                    >
                      <i className="ti ti-download" />
                    </span>
                  </span>
                </a>
              ))}
            </div>
            {files.length > 1 ? (
              <div className="small text-muted ms-5 ps-2 mt-1">
                {files.length} pièces jointes · {formatBytes(files.reduce((s, a) => s + a.size_bytes, 0))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    );
  };

  const hasFolder = (f: string) => visible.some((m) => m.folder === f);

  return (
    <div className="km-thread">
      <div className="km-toolbar">
        {props.onBack ? (
          <IconButton
            icon="ti ti-arrow-left"
            title="Retour à la liste (u)"
            className={props.backMobileOnly ? "km-back-mobile" : undefined}
            onClick={props.onBack}
          />
        ) : null}
        {inTrash || hasFolder("archive") ? (
          <IconButton icon="ti ti-restore" title="Restaurer" onClick={() => props.onAction(ids, { action: "restore" }, { leave: true })} />
        ) : null}
        {!inTrash && hasFolder("inbox") ? (
          <IconButton icon="ti ti-archive" title="Archiver (e)" onClick={() => props.onAction(ids, { action: "move", folder: "archive" }, { leave: true, undo: { action: "move", folder: "inbox" } })} />
        ) : null}
        {view !== "spam" ? (
          <IconButton icon="ti ti-alert-octagon" title="Signaler comme spam" onClick={() => props.onAction(ids, { action: "move", folder: "spam" }, { leave: true, undo: { action: "restore" } })} />
        ) : null}
        {view !== "deleted" ? (
          <IconButton icon="ti ti-trash" title="Supprimer (#)" onClick={() => props.onAction(ids, { action: "move", folder: "deleted" }, { leave: true, undo: { action: "restore" } })} />
        ) : session.isAdmin ? (
          <IconButton
            icon="ti ti-trash-x"
            title="Supprimer définitivement"
            onClick={() => {
              if (window.confirm("Supprimer définitivement cette conversation ? Cette action est irréversible.")) {
                props.onAction(ids, { action: "delete_forever" }, { leave: true });
              }
            }}
          />
        ) : null}
        <span className="mx-1 border-start" style={{ height: 20 }} />
        <IconButton icon="ti ti-mail" title="Marquer comme non lu (Maj+U)" onClick={() => props.onAction(ids, { action: "unread" }, { leave: true })} />
        <SnoozeMenu allowClear={Boolean(snoozed)} onSnooze={(d) => props.onAction(ids, { action: "snooze", until: d ? d.toISOString() : null }, { leave: Boolean(d) })} />
        <MoveMenu onMove={(folder) => props.onAction(ids, { action: "move", folder }, { leave: true })} />
        <LabelMenu
          labels={labels}
          applied={threadLabels}
          onToggle={(labelId, add) => props.onAction(ids, { action: add ? "label_add" : "label_remove", labelId })}
          onCreate={(name) => {
            void props.onCreateLabel(name).then((l) => {
              if (l) props.onAction(ids, { action: "label_add", labelId: l.id });
            });
          }}
        />
        {shared ? (
          <AssignMenu directory={directory} current={assigned} onAssign={(userId) => props.onAction(ids, { action: "assign", userId })} />
        ) : null}
        {session.isAdmin && mailbox === "triage" ? (
          <MailMenu trigger={<IconButton icon="ti ti-inbox" title="Ranger dans une boîte" />}>
            {(close) => (
              <>
                <div className="km-menu-title">Ranger dans</div>
                {(["contact", "noreply"] as const).map((b) => (
                  <button key={b} type="button" onClick={() => { close(); props.onAction(ids, { action: "move_mailbox", mailbox: b }, { leave: true }); }}>
                    {MAILBOX_META[b].label}
                  </button>
                ))}
                <div className="km-menu-title">Boîte personnelle de…</div>
                {directory.map((d) => (
                  <button key={d.profile_id} type="button" onClick={() => { close(); props.onAction(ids, { action: "move_mailbox", mailbox: "personal", ownerId: d.profile_id }, { leave: true }); }}>
                    {d.full_name}
                  </button>
                ))}
              </>
            )}
          </MailMenu>
        ) : null}
        <IconButton icon="ti ti-printer" title="Imprimer" onClick={() => window.print()} />
        <span className="km-spacer" />
        {props.position ? <span className="km-range">{props.position}</span> : null}
        {props.onPrev ? <IconButton icon="ti ti-chevron-left" title="Plus récent (k)" onClick={props.onPrev} /> : null}
        {props.onNext ? <IconButton icon="ti ti-chevron-right" title="Plus ancien (j)" onClick={props.onNext} /> : null}
      </div>

      <div className="km-thread-head">
        <h2>{first?.subject || "(sans objet)"}</h2>
        {first?.important ? <span className="text-warning" title="Important"><Icon name="ti ti-bookmark-filled" /></span> : null}
      </div>
      <div className="km-thread-links">
        <span className="km-chip bg-secondary-subtle text-secondary-emphasis">{MAILBOX_META[mailbox]?.label}</span>
        {threadLabels.map((id) => {
          const l = labels.find((x) => x.id === id);
          if (!l) return null;
          return (
            <span key={id} className="km-chip" style={{ background: `${l.color}22`, color: l.color }}>
              {l.name}
              <button
                type="button"
                className="btn btn-link p-0 lh-1"
                style={{ color: l.color, fontSize: 11 }}
                aria-label={`Retirer ${l.name}`}
                onClick={() => props.onAction(ids, { action: "label_remove", labelId: id })}
              >
                <i className="ti ti-x" />
              </button>
            </span>
          );
        })}
        {assignee ? (
          <span className="km-chip bg-info-subtle text-info-emphasis">
            <i className="ti ti-user-check" /> {assignee.profile_id === session.userId ? "Attribué à moi" : assignee.full_name}
          </span>
        ) : null}
        {snoozed ? (
          <span className="km-chip bg-warning-subtle text-warning-emphasis">
            <i className="ti ti-clock" /> En attente jusqu&apos;au {formatFullDate(snoozed).replace(/\s*\(.*\)$/, "")}
          </span>
        ) : null}
        {contactId ? (
          <Link className="km-chip bg-primary-subtle text-primary-emphasis text-decoration-none" href={`${all_routes.contactDetails}?id=${contactId}`}>
            <i className="ti ti-user" /> Fiche contact
          </Link>
        ) : companyId ? (
          <Link className="km-chip bg-primary-subtle text-primary-emphasis text-decoration-none" href={`${all_routes.companyDetails}?id=${companyId}`}>
            <i className="ti ti-building" /> Fiche entreprise
          </Link>
        ) : null}
        {dossierId ? (
          <Link className="km-chip bg-success-subtle text-success-emphasis text-decoration-none" href={`${all_routes.projectDetails}?id=${dossierId}`}>
            <i className="ti ti-folder" /> Dossier
          </Link>
        ) : null}
      </div>

      {sentOrReceived.map((m, i) => {
        if (hiddenIds.has(m.id)) {
          if (m.id !== collapsedMiddle[0].id) return null;
          return (
            <div key="older" className="km-msg collapsed text-center" onClick={() => setShowOlder(true)}>
              <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">
                {collapsedMiddle.length} messages plus anciens
              </span>
            </div>
          );
        }
        return <div key={m.id} data-index={i}>{renderMessage(m)}</div>;
      })}

      {drafts.map((d) => (
        <div key={d.id} className="km-msg">
          <div className="km-msg-head">
            <Avatar name={session.fullName} />
            <div className="km-msg-meta">
              <span className="km-chip draft">Brouillon</span>
              <div className="km-msg-snippet">{d.snippet || "(vide)"}</div>
              {d.delivery_status === "failed" ? (
                <div className="small text-danger">Échec de l&apos;envoi : {d.delivery_detail}</div>
              ) : null}
            </div>
            <span className="km-msg-date">{formatListDate(d.created_at)}</span>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => props.onCompose(draftSeed(d), true)}>
              Modifier
            </button>
            <IconButton icon="ti ti-trash" title="Supprimer le brouillon" onClick={() => props.onDiscardDraft(d.id)} />
          </div>
        </div>
      ))}

      {props.composeSlot ? (
        <div className="km-inline-compose">{props.composeSlot}</div>
      ) : last ? (
        <div className="km-reply-bar">
          <button type="button" className="btn btn-outline-secondary" onClick={() => props.onCompose(replySeed(last, "reply", composeCtx), true)}>
            <i className="ti ti-arrow-back-up me-1" /> Répondre
          </button>
          {[...last.to_emails, ...last.cc_emails].length > 1 ? (
            <button type="button" className="btn btn-outline-secondary" onClick={() => props.onCompose(replySeed(last, "replyAll", composeCtx), true)}>
              <i className="ti ti-arrow-back-up-double me-1" /> Répondre à tous
            </button>
          ) : null}
          <button type="button" className="btn btn-outline-secondary" onClick={() => props.onCompose(forwardSeed(last, composeCtx), true)}>
            <i className="ti ti-arrow-forward-up me-1" /> Transférer
          </button>
        </div>
      ) : null}
    </div>
  );
}
