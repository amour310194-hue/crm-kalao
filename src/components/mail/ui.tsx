"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { avatarColor, initials } from "@/lib/mail/format";
import type { MailboxKey, MailView } from "@/lib/mail/types";

export const VIEW_META: Record<MailView, { label: string; icon: string }> = {
  inbox: { label: "Boîte de réception", icon: "ti ti-inbox" },
  starred: { label: "Suivis", icon: "ti ti-star" },
  snoozed: { label: "En attente", icon: "ti ti-clock" },
  important: { label: "Importants", icon: "ti ti-bookmark" },
  sent: { label: "Messages envoyés", icon: "ti ti-send" },
  scheduled: { label: "Programmés", icon: "ti ti-calendar-time" },
  drafts: { label: "Brouillons", icon: "ti ti-file" },
  assigned: { label: "Attribués à moi", icon: "ti ti-user-check" },
  unread: { label: "Non lus", icon: "ti ti-mail" },
  all: { label: "Tous les messages", icon: "ti ti-mails" },
  archive: { label: "Archives", icon: "ti ti-archive" },
  spam: { label: "Spam", icon: "ti ti-alert-octagon" },
  deleted: { label: "Corbeille", icon: "ti ti-trash" },
  label: { label: "Libellé", icon: "ti ti-tag" },
};

export const MAILBOX_META: Record<MailboxKey, { label: string; hint: string }> = {
  contact: { label: "Contact", hint: "Boîte partagée contact@" },
  noreply: { label: "No-reply", hint: "Envois automatiques no-reply@" },
  personal: { label: "Ma boîte", hint: "Boîte privée" },
  triage: { label: "À trier", hint: "Adresses inconnues (admins)" },
};

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      className="km-avatar"
      style={{ background: avatarColor(name), width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/** Variantes pleines dessinées en SVG : la police « filled » de Tabler remplacerait toutes les icônes du CRM. */
const FILLED: Record<string, string> = {
  "ti ti-star-filled":
    "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z",
  "ti ti-bookmark-filled": "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z",
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const path = FILLED[name];
  if (path) {
    return (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" className={className}>
        <path d={path} />
      </svg>
    );
  }
  return <i className={`${name}${className ? ` ${className}` : ""}`} />;
}

export function IconButton({
  icon,
  title,
  onClick,
  disabled,
  active,
  className,
}: {
  icon: string;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`km-icon-btn${active ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}

/** Menu déroulant : se ferme au clic extérieur, à Échap ou après une action. */
export function MailMenu({
  trigger,
  children,
  align = "left",
  up = false,
  title,
  disabled,
}: {
  trigger: ReactNode | ((open: boolean) => ReactNode);
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: "left" | "right";
  up?: boolean;
  title?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);
  return (
    <div className="km-menu-wrap" ref={ref}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen((v) => !v);
        }}
        title={title}
      >
        {typeof trigger === "function" ? trigger(open) : trigger}
      </span>
      {open ? (
        <div
          className={`km-menu${align === "right" ? " right" : ""}${up ? " up" : ""}`}
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      ) : null}
    </div>
  );
}

export function MailModal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="km-modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`km-modal${wide ? " wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="km-modal-head">
          <span className="km-title">{title}</span>
          <IconButton icon="ti ti-x" title="Fermer" onClick={onClose} />
        </div>
        <div className="km-modal-body">{children}</div>
        {footer ? <div className="km-modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export type Toast = {
  id: number;
  text: string;
  tone?: "info" | "error";
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      seq.current += 1;
      const id = seq.current;
      setToasts((list) => [...list.slice(-2), { ...toast, id }]);
      const duration = toast.duration ?? (toast.actionLabel ? 8000 : 5000);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );
  return { toasts, push, dismiss };
}

export function Toasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="km-toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`km-toast${t.tone === "error" ? " error" : ""}`}>
          <span className="km-toast-text">{t.text}</span>
          {t.actionLabel ? (
            <button
              type="button"
              onClick={() => {
                t.onAction?.();
                dismiss(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          ) : null}
          <button type="button" aria-label="Fermer" onClick={() => dismiss(t.id)} style={{ color: "#fff", opacity: 0.7 }}>
            <i className="ti ti-x" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function fileIcon(contentType: string | null | undefined, filename: string): string {
  const type = (contentType ?? "").toLowerCase();
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (type.startsWith("image/")) return "ti ti-photo";
  if (type === "application/pdf" || ext === "pdf") return "ti ti-file-type-pdf";
  if (["doc", "docx", "odt"].includes(ext)) return "ti ti-file-type-doc";
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "ti ti-file-spreadsheet";
  if (["zip", "rar", "7z"].includes(ext)) return "ti ti-file-zip";
  if (type.startsWith("audio/")) return "ti ti-music";
  if (type.startsWith("video/")) return "ti ti-movie";
  return "ti ti-file";
}

/** Choix rapides de mise en attente / d'envoi programmé (heure de Douala). */
export function quickTimes(now = new Date()): { label: string; date: Date }[] {
  const at = (d: Date, h: number) => {
    const x = new Date(d);
    x.setHours(h, 0, 0, 0);
    return x;
  };
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const monday = new Date(now);
  monday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
  const out: { label: string; date: Date }[] = [];
  const later = at(now, 18);
  if (later.getTime() - now.getTime() > 60 * 60 * 1000) out.push({ label: "Plus tard aujourd'hui", date: later });
  out.push({ label: "Demain matin", date: at(tomorrow, 8) });
  out.push({ label: "Demain après-midi", date: at(tomorrow, 14) });
  out.push({ label: "Lundi matin", date: at(monday, 8) });
  return out;
}

export function formatQuick(date: Date): string {
  return date.toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Valeur pour <input type="datetime-local"> à partir d'une date. */
export function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
