"use client";

import { useState } from "react";
import type { DirectoryEntry, MailLabel } from "@/lib/mail/types";
import { formatQuick, IconButton, MailMenu, quickTimes, toLocalInput } from "@/components/mail/ui";

/** Liste des heures rapides + date personnalisée. Utilisé pour « En attente » et « Programmer l'envoi ». */
function TimeChoices({
  onPick,
  close,
  title,
  extra,
}: {
  onPick: (date: Date) => void;
  close: () => void;
  title: string;
  extra?: React.ReactNode;
}) {
  const [custom, setCustom] = useState(false);
  const [value, setValue] = useState(() => toLocalInput(new Date(Date.now() + 2 * 3600 * 1000)));
  return (
    <>
      <div className="km-menu-title">{title}</div>
      {quickTimes().map((q) => (
        <button
          key={q.label}
          type="button"
          onClick={() => {
            onPick(q.date);
            close();
          }}
        >
          <span style={{ flex: 1 }}>{q.label}</span>
          <span className="text-muted small">{formatQuick(q.date)}</span>
        </button>
      ))}
      <hr />
      {custom ? (
        <div className="px-3 pb-2">
          <input
            type="datetime-local"
            className="form-control form-control-sm mb-2"
            value={value}
            min={toLocalInput(new Date())}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-sm btn-primary w-100 justify-content-center"
            onClick={() => {
              const date = new Date(value);
              if (!Number.isNaN(date.getTime()) && date.getTime() > Date.now()) {
                onPick(date);
                close();
              }
            }}
          >
            Valider
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setCustom(true)}>
          <i className="ti ti-calendar" /> Choisir une date et une heure
        </button>
      )}
      {extra}
    </>
  );
}

export function SnoozeMenu({ onSnooze, disabled, allowClear }: { onSnooze: (date: Date | null) => void; disabled?: boolean; allowClear?: boolean }) {
  return (
    <MailMenu disabled={disabled} trigger={<IconButton icon="ti ti-clock" title="Mettre en attente" disabled={disabled} />}>
      {(close) => (
        <TimeChoices
          title="Mettre en attente jusqu'à…"
          onPick={(d) => onSnooze(d)}
          close={close}
          extra={
            allowClear ? (
              <button
                type="button"
                onClick={() => {
                  onSnooze(null);
                  close();
                }}
              >
                <i className="ti ti-clock-off" /> Annuler la mise en attente
              </button>
            ) : null
          }
        />
      )}
    </MailMenu>
  );
}

export function ScheduleMenu({ onSchedule, disabled }: { onSchedule: (date: Date) => void; disabled?: boolean }) {
  return (
    <MailMenu
      up
      disabled={disabled}
      trigger={
        <button type="button" className="btn btn-primary btn-send-more" title="Options d'envoi" disabled={disabled}>
          <i className="ti ti-chevron-down" />
        </button>
      }
    >
      {(close) => <TimeChoices title="Programmer l'envoi" onPick={onSchedule} close={close} />}
    </MailMenu>
  );
}

export function LabelMenu({
  labels,
  applied,
  onToggle,
  onCreate,
  disabled,
}: {
  labels: MailLabel[];
  applied: string[];
  onToggle: (labelId: string, add: boolean) => void;
  onCreate: (name: string) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = labels.filter((l) => l.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <MailMenu disabled={disabled} trigger={<IconButton icon="ti ti-tag" title="Libellés" disabled={disabled} />}>
      {(close) => (
        <>
          <div className="km-menu-title">Ajouter un libellé</div>
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Rechercher ou créer"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
          {filtered.map((l) => {
            const on = applied.includes(l.id);
            return (
              <button key={l.id} type="button" onClick={() => onToggle(l.id, !on)}>
                <i className={on ? "ti ti-square-check" : "ti ti-square"} />
                <span className="km-label-dot" style={{ background: l.color }} />
                <span>{l.name}</span>
                {l.owner_id ? null : <span className="text-muted small ms-auto">partagé</span>}
              </button>
            );
          })}
          {query.trim() && !labels.some((l) => l.name.toLowerCase() === query.trim().toLowerCase()) ? (
            <button
              type="button"
              onClick={() => {
                onCreate(query.trim());
                setQuery("");
                close();
              }}
            >
              <i className="ti ti-plus" /> Créer « {query.trim()} »
            </button>
          ) : null}
          {!labels.length && !query ? <div className="km-menu-item text-muted">Aucun libellé pour l&apos;instant.</div> : null}
        </>
      )}
    </MailMenu>
  );
}

export function MoveMenu({
  onMove,
  disabled,
  current,
}: {
  onMove: (folder: "inbox" | "archive" | "spam" | "deleted") => void;
  disabled?: boolean;
  current?: string;
}) {
  const items: { key: "inbox" | "archive" | "spam" | "deleted"; label: string; icon: string }[] = [
    { key: "inbox", label: "Boîte de réception", icon: "ti ti-inbox" },
    { key: "archive", label: "Archives", icon: "ti ti-archive" },
    { key: "spam", label: "Spam", icon: "ti ti-alert-octagon" },
    { key: "deleted", label: "Corbeille", icon: "ti ti-trash" },
  ];
  return (
    <MailMenu disabled={disabled} trigger={<IconButton icon="ti ti-folder-symlink" title="Déplacer vers" disabled={disabled} />}>
      {(close) => (
        <>
          <div className="km-menu-title">Déplacer vers</div>
          {items
            .filter((i) => i.key !== current)
            .map((i) => (
              <button
                key={i.key}
                type="button"
                onClick={() => {
                  onMove(i.key);
                  close();
                }}
              >
                <i className={i.icon} /> {i.label}
              </button>
            ))}
        </>
      )}
    </MailMenu>
  );
}

export function AssignMenu({
  directory,
  current,
  onAssign,
  disabled,
}: {
  directory: DirectoryEntry[];
  current: string | null;
  onAssign: (userId: string | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const list = directory.filter((d) => d.full_name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <MailMenu disabled={disabled} trigger={<IconButton icon="ti ti-user-plus" title="Attribuer à" disabled={disabled} />}>
      {(close) => (
        <>
          <div className="km-menu-title">Attribuer à un collègue</div>
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Rechercher"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
          {current ? (
            <button
              type="button"
              onClick={() => {
                onAssign(null);
                close();
              }}
            >
              <i className="ti ti-user-off" /> Retirer l&apos;attribution
            </button>
          ) : null}
          {list.map((d) => (
            <button
              key={d.profile_id}
              type="button"
              onClick={() => {
                onAssign(d.profile_id);
                close();
              }}
            >
              <i className={d.profile_id === current ? "ti ti-circle-check" : "ti ti-user"} />
              <span>{d.full_name}</span>
            </button>
          ))}
        </>
      )}
    </MailMenu>
  );
}
