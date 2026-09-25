"use client";

import { useState } from "react";
import type { MailboxKey, MailCounts, MailLabel, MailView } from "@/lib/mail/types";
import { IconButton, MAILBOX_META, MailMenu, VIEW_META } from "@/components/mail/ui";

const PRIMARY: MailView[] = ["inbox", "starred", "snoozed", "important", "sent", "scheduled", "drafts"];
const MORE: MailView[] = ["assigned", "unread", "all", "archive", "spam", "deleted"];
/** Compteur « non lus » (gras) vs total (gris), comme Gmail. */
const UNREAD_KEYS: Partial<Record<MailView, string>> = { inbox: "inbox", spam: "spam", assigned: "assigned" };
const TOTAL_KEYS: Partial<Record<MailView, string>> = { drafts: "drafts", scheduled: "scheduled", snoozed: "snoozed" };

type Props = {
  mailboxes: MailboxKey[];
  mailbox: MailboxKey;
  view: MailView;
  labelId: string | null;
  counts: Record<string, MailCounts>;
  labels: MailLabel[];
  isAdmin: boolean;
  onCompose: () => void;
  onMailbox: (box: MailboxKey) => void;
  onView: (view: MailView, labelId?: string | null) => void;
  onCreateLabel: () => void;
  onEditLabel: (label: MailLabel) => void;
  onDeleteLabel: (label: MailLabel) => void;
};

export default function MailSidebar(props: Props) {
  const [more, setMore] = useState(MORE.includes(props.view));
  const boxCounts = props.counts[props.mailbox] ?? {};

  const item = (view: MailView) => {
    const meta = VIEW_META[view];
    const unreadKey = UNREAD_KEYS[view];
    const totalKey = TOTAL_KEYS[view];
    const n = unreadKey ? boxCounts[unreadKey] : totalKey ? boxCounts[totalKey] : 0;
    const active = props.view === view && !props.labelId;
    return (
      <button
        key={view}
        type="button"
        className={`km-nav-item${active ? " active" : ""}`}
        onClick={() => props.onView(view)}
        aria-current={active ? "page" : undefined}
      >
        <i className={meta.icon} />
        <span className="km-nav-label">{meta.label}</span>
        {n ? <span className={`km-count${totalKey ? " total" : ""}`}>{n > 999 ? "999+" : n}</span> : null}
      </button>
    );
  };

  return (
    <aside className="km-side" aria-label="Dossiers">
      <button type="button" className="km-compose-btn" onClick={props.onCompose} title="Nouveau message (c)">
        <i className="ti ti-pencil" /> Nouveau message
      </button>
      {props.mailboxes.length > 1 ? (
        <div className="km-boxes">
          <select
            className="form-select form-select-sm"
            value={props.mailbox}
            aria-label="Boîte mail"
            onChange={(e) => props.onMailbox(e.target.value as MailboxKey)}
          >
            {props.mailboxes.map((box) => {
              const unread = props.counts[box]?.inbox ?? 0;
              return (
                <option key={box} value={box}>
                  {MAILBOX_META[box].label}
                  {unread ? ` (${unread})` : ""} — {MAILBOX_META[box].hint}
                </option>
              );
            })}
          </select>
        </div>
      ) : null}
      <nav className="km-nav">
        {PRIMARY.map(item)}
        <button type="button" className="km-nav-item" onClick={() => setMore((v) => !v)} aria-expanded={more}>
          <i className={more ? "ti ti-chevron-up" : "ti ti-chevron-down"} />
          <span className="km-nav-label">{more ? "Moins" : "Plus"}</span>
        </button>
        {more ? MORE.map(item) : null}

        <div className="km-nav-section">
          <span>Libellés</span>
          <IconButton icon="ti ti-plus" title="Créer un libellé" onClick={props.onCreateLabel} />
        </div>
        {props.labels.map((l) => {
          const active = props.view === "label" && props.labelId === l.id;
          const n = boxCounts[`label:${l.id}`] ?? 0;
          const canEdit = Boolean(l.owner_id) || props.isAdmin;
          return (
            <div key={l.id} className="d-flex align-items-center">
              <button
                type="button"
                className={`km-nav-item${active ? " active" : ""}`}
                onClick={() => props.onView("label", l.id)}
                title={l.owner_id ? "Libellé personnel" : "Libellé partagé avec l'équipe"}
              >
                <span className="km-label-dot" style={{ background: l.color }} />
                <span className="km-nav-label">{l.name}</span>
                {n ? <span className="km-count">{n}</span> : null}
              </button>
              {canEdit ? (
                <MailMenu align="right" trigger={<IconButton icon="ti ti-dots-vertical" title="Options du libellé" />}>
                  {(close) => (
                    <>
                      <button type="button" onClick={() => { close(); props.onEditLabel(l); }}>
                        <i className="ti ti-pencil" /> Modifier
                      </button>
                      <button type="button" onClick={() => { close(); props.onDeleteLabel(l); }}>
                        <i className="ti ti-trash" /> Supprimer le libellé
                      </button>
                    </>
                  )}
                </MailMenu>
              ) : null}
            </div>
          );
        })}
        {!props.labels.length ? <div className="px-4 small text-muted">Aucun libellé.</div> : null}
      </nav>
    </aside>
  );
}
