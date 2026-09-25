"use client";

import type { DirectoryEntry, MailAction, MailLabel, MailThreadRow, MailView } from "@/lib/mail/types";
import { AssignMenu, LabelMenu, MoveMenu, SnoozeMenu } from "@/components/mail/menus";
import { IconButton, MailMenu } from "@/components/mail/ui";

type Props = {
  rows: MailThreadRow[];
  selected: Set<string>;
  view: MailView;
  total: number;
  offset: number;
  pageSize: number;
  labels: MailLabel[];
  directory: DirectoryEntry[];
  isAdmin: boolean;
  refreshing: boolean;
  onSelect: (mode: "all" | "none" | "read" | "unread" | "starred" | "unstarred") => void;
  onRefresh: () => void;
  onAction: (threadIds: string[], action: MailAction, opts?: { leave?: boolean; undo?: MailAction }) => void;
  onPage: (offset: number) => void;
  onCreateLabel: (name: string) => void;
  onEmptyTrash?: () => void;
};

export default function MailToolbar(props: Props) {
  const { rows, selected, view, total, offset, pageSize } = props;
  const ids = [...selected];
  const count = ids.length;
  const all = rows.length > 0 && rows.every((r) => selected.has(r.thread_id));
  const some = count > 0 && !all;
  const inTrash = view === "deleted" || view === "spam";
  const selRows = rows.filter((r) => selected.has(r.thread_id));
  const anyUnread = selRows.some((r) => r.unread_count > 0);
  const appliedLabels = props.labels.filter((l) => selRows.length && selRows.every((r) => r.label_ids.includes(l.id))).map((l) => l.id);
  const from = total ? offset + 1 : 0;
  const to = Math.min(offset + rows.length, total);

  return (
    <div className="km-toolbar">
      <span className="km-select-all">
        <input
          type="checkbox"
          className="form-check-input"
          aria-label="Tout sélectionner"
          checked={all}
          ref={(el) => {
            if (el) el.indeterminate = some;
          }}
          onChange={() => props.onSelect(all || some ? "none" : "all")}
        />
        <MailMenu trigger={<IconButton icon="ti ti-caret-down" title="Sélectionner" />}>
          {(close) => (
            <>
              {([
                ["all", "Tous"],
                ["none", "Aucun"],
                ["read", "Lus"],
                ["unread", "Non lus"],
                ["starred", "Suivis"],
                ["unstarred", "Non suivis"],
              ] as const).map(([mode, label]) => (
                <button key={mode} type="button" onClick={() => { props.onSelect(mode); close(); }}>
                  {label}
                </button>
              ))}
            </>
          )}
        </MailMenu>
      </span>

      {count === 0 ? (
        <>
          <IconButton
            icon={props.refreshing ? "ti ti-loader-2" : "ti ti-refresh"}
            title="Actualiser (récupère aussi les mails en attente chez Resend)"
            onClick={props.onRefresh}
            disabled={props.refreshing}
          />
          {view === "deleted" && props.isAdmin && props.onEmptyTrash && rows.length ? (
            <button type="button" className="btn btn-link btn-sm text-danger" onClick={props.onEmptyTrash}>
              Vider la corbeille de cette page
            </button>
          ) : null}
        </>
      ) : (
        <>
          {inTrash || view === "archive" ? (
            <IconButton icon="ti ti-restore" title="Restaurer" onClick={() => props.onAction(ids, { action: "restore" }, { leave: true })} />
          ) : null}
          {!inTrash && view !== "archive" && view !== "sent" && view !== "drafts" && view !== "scheduled" ? (
            <IconButton
              icon="ti ti-archive"
              title="Archiver"
              onClick={() => props.onAction(ids, { action: "move", folder: "archive" }, { leave: true, undo: { action: "move", folder: "inbox" } })}
            />
          ) : null}
          {view !== "spam" ? (
            <IconButton
              icon="ti ti-alert-octagon"
              title="Signaler comme spam"
              onClick={() => props.onAction(ids, { action: "move", folder: "spam" }, { leave: true, undo: { action: "restore" } })}
            />
          ) : (
            <IconButton icon="ti ti-mail-check" title="Non-spam" onClick={() => props.onAction(ids, { action: "restore" }, { leave: true })} />
          )}
          {view !== "deleted" ? (
            <IconButton
              icon="ti ti-trash"
              title="Supprimer"
              onClick={() => props.onAction(ids, { action: "move", folder: "deleted" }, { leave: true, undo: { action: "restore" } })}
            />
          ) : props.isAdmin ? (
            <IconButton
              icon="ti ti-trash-x"
              title="Supprimer définitivement"
              onClick={() => {
                if (window.confirm(`Supprimer définitivement ${count} conversation(s) ? Cette action est irréversible.`)) {
                  props.onAction(ids, { action: "delete_forever" }, { leave: true });
                }
              }}
            />
          ) : null}
          <span className="mx-1 border-start" style={{ height: 20 }} />
          <IconButton
            icon={anyUnread ? "ti ti-mail-opened" : "ti ti-mail"}
            title={anyUnread ? "Marquer comme lu" : "Marquer comme non lu"}
            onClick={() => props.onAction(ids, { action: anyUnread ? "read" : "unread" })}
          />
          <SnoozeMenu onSnooze={(d) => props.onAction(ids, { action: "snooze", until: d ? d.toISOString() : null }, { leave: Boolean(d) })} />
          <MoveMenu onMove={(folder) => props.onAction(ids, { action: "move", folder }, { leave: true })} />
          <LabelMenu
            labels={props.labels}
            applied={appliedLabels}
            onToggle={(labelId, add) => props.onAction(ids, { action: add ? "label_add" : "label_remove", labelId })}
            onCreate={props.onCreateLabel}
          />
          {selRows.some((r) => r.mailbox !== "personal") ? (
            <AssignMenu directory={props.directory} current={null} onAssign={(userId) => props.onAction(ids, { action: "assign", userId })} />
          ) : null}
          <MailMenu trigger={<IconButton icon="ti ti-dots-vertical" title="Plus" />}>
            {(close) => (
              <>
                <button type="button" onClick={() => { props.onAction(ids, { action: "star" }); close(); }}>
                  <i className="ti ti-star" /> Suivre
                </button>
                <button type="button" onClick={() => { props.onAction(ids, { action: "unstar" }); close(); }}>
                  <i className="ti ti-star-off" /> Ne plus suivre
                </button>
                <button type="button" onClick={() => { props.onAction(ids, { action: "important" }); close(); }}>
                  <i className="ti ti-bookmark" /> Marquer comme important
                </button>
                <button type="button" onClick={() => { props.onAction(ids, { action: "unimportant" }); close(); }}>
                  <i className="ti ti-bookmark-off" /> Marquer comme non important
                </button>
              </>
            )}
          </MailMenu>
          <span className="small text-muted ms-2">{count} sélectionnée(s)</span>
        </>
      )}

      <span className="km-spacer" />
      <span className="km-range">{total ? `${from}–${to} sur ${total.toLocaleString("fr-FR")}` : ""}</span>
      <IconButton icon="ti ti-chevron-left" title="Plus récents" disabled={offset <= 0} onClick={() => props.onPage(Math.max(0, offset - pageSize))} />
      <IconButton icon="ti ti-chevron-right" title="Plus anciens" disabled={offset + rows.length >= total} onClick={() => props.onPage(offset + pageSize)} />
    </div>
  );
}
