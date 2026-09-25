"use client";

import { formatFullDate, formatListDate, formatParticipants } from "@/lib/mail/format";
import type { DirectoryEntry, MailAction, MailLabel, MailThreadRow, MailView } from "@/lib/mail/types";
import { IconButton, MAILBOX_META, VIEW_META } from "@/components/mail/ui";

type Props = {
  rows: MailThreadRow[];
  loading: boolean;
  error: string | null;
  view: MailView;
  showMailbox: boolean;
  labels: MailLabel[];
  directory: DirectoryEntry[];
  selected: Set<string>;
  focusedId: string | null;
  openId: string | null;
  showSnippets: boolean;
  userId: string;
  searching: boolean;
  onToggleSelect: (id: string, shiftKey: boolean) => void;
  onOpen: (row: MailThreadRow) => void;
  onAction: (threadIds: string[], action: MailAction, opts?: { leave?: boolean; undo?: MailAction }) => void;
  onRetry: () => void;
};

const EMPTY_TEXT: Partial<Record<MailView, string>> = {
  inbox: "Aucun message dans la boîte de réception.",
  starred: "Aucun message suivi. Cliquez sur l'étoile d'un message pour le retrouver ici.",
  snoozed: "Aucun message en attente.",
  important: "Aucun message important.",
  sent: "Aucun message envoyé.",
  scheduled: "Aucun envoi programmé.",
  drafts: "Aucun brouillon.",
  assigned: "Aucun message ne vous est attribué.",
  unread: "Tout est lu.",
  archive: "Aucun message archivé.",
  spam: "Aucun spam. Bravo !",
  deleted: "La corbeille est vide.",
  label: "Aucun message avec ce libellé.",
  all: "Aucun message.",
};

export default function MailList(props: Props) {
  const { rows, loading, error, view, labels, selected } = props;

  if (error) {
    return (
      <div className="km-empty">
        <i className="ti ti-cloud-off" />
        <div className="fw-semibold mb-1">Impossible de charger les messages.</div>
        <div className="small mb-3">{error}</div>
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={props.onRetry}>
          Réessayer
        </button>
      </div>
    );
  }
  if (loading && !rows.length) {
    return (
      <div aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="km-skeleton" />
        ))}
      </div>
    );
  }
  if (!rows.length) {
    return (
      <div className="km-empty">
        <i className={props.searching ? "ti ti-search-off" : VIEW_META[view]?.icon ?? "ti ti-inbox"} />
        {props.searching ? "Aucun message ne correspond à votre recherche." : EMPTY_TEXT[view] ?? "Aucun message."}
      </div>
    );
  }

  return (
    <div role="list" aria-label="Conversations">
      {rows.map((row) => {
        const unread = row.unread_count > 0;
        const isSel = selected.has(row.thread_id);
        const rowLabels = row.label_ids
          .map((id) => labels.find((l) => l.id === id))
          .filter((l): l is MailLabel => Boolean(l));
        const assignee = row.assigned_to ? props.directory.find((d) => d.profile_id === row.assigned_to) : null;
        const inTrash = view === "deleted" || view === "spam";
        const failed = row.last_delivery === "bounced" || row.last_delivery === "failed" || row.last_delivery === "complained";
        const participants = view === "sent" || view === "drafts" || view === "scheduled"
          ? `À : ${row.participants.filter((p) => p !== "__me__").join(", ") || "moi"}`
          : formatParticipants(row.participants, row.message_count);
        return (
          <div
            key={row.thread_id}
            role="listitem"
            className={`km-row${unread ? " unread" : ""}${isSel ? " selected" : ""}${props.focusedId === row.thread_id ? " focused" : ""}${props.openId === row.thread_id ? " open" : ""}`}
            onClick={() => props.onOpen(row)}
            aria-label={`${unread ? "Non lu, " : ""}${participants}, ${row.subject}`}
          >
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSel}
              aria-label="Sélectionner"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => props.onToggleSelect(row.thread_id, (e.nativeEvent as MouseEvent).shiftKey)}
            />
            <IconButton
              icon={row.starred ? "ti ti-star-filled" : "ti ti-star"}
              title={row.starred ? "Ne plus suivre" : "Suivre"}
              active={row.starred}
              onClick={(e) => {
                e.stopPropagation();
                props.onAction([row.thread_id], { action: row.starred ? "unstar" : "star" });
              }}
            />
            <IconButton
              icon={row.important ? "ti ti-bookmark-filled" : "ti ti-bookmark"}
              title={row.important ? "Marquer comme non important" : "Marquer comme important"}
              active={row.important}
              className="km-important-btn"
              onClick={(e) => {
                e.stopPropagation();
                props.onAction([row.thread_id], { action: row.important ? "unimportant" : "important" });
              }}
            />
            <span className="km-from" title={participants}>
              {row.has_draft && view !== "drafts" ? <span className="km-chip draft me-1">Brouillon</span> : null}
              {participants}
            </span>
            <span className="km-content">
              {props.showMailbox ? (
                <span className="km-chip bg-secondary-subtle text-secondary-emphasis">{MAILBOX_META[row.mailbox]?.label}</span>
              ) : null}
              {rowLabels.map((l) => (
                <span key={l.id} className="km-chip" style={{ background: `${l.color}22`, color: l.color }}>
                  {l.name}
                </span>
              ))}
              {assignee ? (
                <span className="km-chip bg-info-subtle text-info-emphasis" title="Attribué">
                  <i className="ti ti-user-check" />
                  {assignee.profile_id === props.userId ? "moi" : assignee.full_name.split(" ")[0]}
                </span>
              ) : null}
              {failed ? (
                <span className="km-chip bg-danger-subtle text-danger-emphasis" title="Problème de livraison">
                  <i className="ti ti-alert-triangle" /> Non délivré
                </span>
              ) : null}
              <span className="km-subject">{row.subject || "(sans objet)"}</span>
              {props.showSnippets && row.snippet ? <span className="km-snippet">— {row.snippet}</span> : null}
            </span>
            {row.has_attachments ? <i className="ti ti-paperclip text-muted" title="Pièce jointe" /> : null}
            {row.snoozed_until && new Date(row.snoozed_until).getTime() > Date.now() ? (
              <i className="ti ti-clock text-warning" title={`En attente jusqu'au ${formatFullDate(row.snoozed_until)}`} />
            ) : null}
            <span className="km-date" title={formatFullDate(row.last_at)}>
              {formatListDate(row.last_at)}
            </span>
            <span className="km-hover-actions" onClick={(e) => e.stopPropagation()}>
              {inTrash ? (
                <IconButton icon="ti ti-restore" title="Restaurer" onClick={() => props.onAction([row.thread_id], { action: "restore" }, { leave: true })} />
              ) : (
                <>
                  {view !== "archive" && view !== "sent" && view !== "drafts" && view !== "scheduled" ? (
                    <IconButton
                      icon="ti ti-archive"
                      title="Archiver"
                      onClick={() => props.onAction([row.thread_id], { action: "move", folder: "archive" }, { leave: true, undo: { action: "move", folder: "inbox" } })}
                    />
                  ) : null}
                  <IconButton
                    icon="ti ti-trash"
                    title="Supprimer"
                    onClick={() => props.onAction([row.thread_id], { action: "move", folder: "deleted" }, { leave: true, undo: { action: "restore" } })}
                  />
                </>
              )}
              <IconButton
                icon={unread ? "ti ti-mail-opened" : "ti ti-mail"}
                title={unread ? "Marquer comme lu" : "Marquer comme non lu"}
                onClick={() => props.onAction([row.thread_id], { action: unread ? "read" : "unread" })}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
