import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadPrefs } from "@/lib/mail/prefs";
import type { ActivityRow } from "@/lib/crm";

export const NOTIFICATION_KINDS = [
  "mail",
  "activity",
  "reminder",
  "appointment",
  "lead",
  "deal",
  "system",
] as const;

export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export type NotificationRow = {
  id: string;
  recipient_id: string;
  kind: NotificationKind | string;
  title: string;
  body: string | null;
  href: string | null;
  ref_table: string | null;
  ref_id: string | null;
  read_at: string | null;
  created_at: string;
  synthetic?: boolean;
};

const TZ = "Africa/Douala";
const seenDesktop = new Set<string>();

export function notificationIcon(kind: string): string {
  switch (kind) {
    case "mail":
      return "ti ti-mail";
    case "lead":
      return "ti ti-user-plus";
    case "deal":
      return "ti ti-briefcase";
    case "appointment":
      return "ti ti-calendar-event";
    case "reminder":
      return "ti ti-alarm";
    case "activity":
      return "ti ti-checkbox";
    default:
      return "ti ti-bell";
  }
}

export function relativeTimeFr(iso: string, now = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const diffSec = Math.round((then.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
  if (abs < 60) return rtf.format(Math.round(diffSec), "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  return rtf.format(Math.round(diffSec / 86400), "day");
}

export function formatDueFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Activités à venir (24 h) absentes du flux déjà stocké. */
export function dueActivityItems(
  activities: ActivityRow[],
  stored: NotificationRow[],
  now = new Date()
): NotificationRow[] {
  const horizon = now.getTime() + 24 * 60 * 60 * 1000;
  const known = new Set(
    stored
      .filter((row) => row.ref_table === "activities" && row.ref_id)
      .map((row) => `${row.kind}:${row.ref_id}`)
  );
  return activities
    .filter((row) => {
      if (!row.due_at || row.done) return false;
      const due = new Date(row.due_at).getTime();
      if (Number.isNaN(due) || due < now.getTime() || due > horizon) return false;
      if (known.has(`reminder:${row.id}`) || known.has(`appointment:${row.id}`)) return false;
      return true;
    })
    .map((row) => ({
      id: `due:${row.id}`,
      recipient_id: "",
      kind: "reminder" as const,
      title: row.type === "meeting" ? "Rendez-vous à venir" : "Rappel",
      body: `${row.subject} — ${formatDueFr(row.due_at as string)}`,
      href: "/calendar",
      ref_table: "activities",
      ref_id: row.id,
      read_at: null,
      created_at: row.due_at as string,
      synthetic: true,
    }));
}

export function mergeNotificationFeed(
  stored: NotificationRow[],
  activities: ActivityRow[],
  now = new Date()
): NotificationRow[] {
  const extra = dueActivityItems(activities, stored, now);
  return [...extra, ...stored].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function db() {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseBrowserClient();
}

export async function fetchNotifications(limit = 50): Promise<NotificationRow[]> {
  const supabase = db();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("crm_notifications")
    .select("id, recipient_id, kind, title, body, href, ref_table, ref_id, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as NotificationRow[];
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
  const real = ids.filter((id) => !id.startsWith("due:"));
  if (!real.length) return;
  const supabase = db();
  if (!supabase) return;
  const { error } = await supabase
    .from("crm_notifications")
    .update({ read_at: new Date().toISOString() })
    .in("id", real)
    .is("read_at", null);
  if (error) throw error;
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = db();
  if (!supabase) return;
  const { error } = await supabase
    .from("crm_notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
  if (error) throw error;
}

export async function refreshDueReminders(): Promise<void> {
  const supabase = db();
  if (!supabase) return;
  await supabase.rpc("refresh_due_reminders");
}

export function unreadCount(rows: NotificationRow[]): number {
  return rows.filter((row) => !row.read_at).length;
}

export function useNotifications() {
  const [stored, setStored] = useState<NotificationRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);

  const reload = useCallback(async () => {
    const supabase = db();
    if (!supabase) {
      setStored([]);
      setActivities([]);
      return;
    }
    try {
      await refreshDueReminders();
    } catch {
      /* le flux stocké suffit */
    }
    const [notes, acts] = await Promise.all([
      fetchNotifications(),
      supabase
        .from("activities")
        .select("id, type, subject, due_at, done, created_at, notes, company_id, contact_id, deal_id")
        .order("due_at", { ascending: true })
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? []) as ActivityRow[];
        }),
    ]);
    setStored(notes);
    setActivities(acts);
  }, []);

  useEffect(() => {
    void reload();
    const supabase = db();
    if (!supabase) return;
    const channel = supabase
      .channel("crm-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "crm_notifications" },
        (payload) => {
          const row = payload.new as NotificationRow;
          const supabase = db();
          void supabase?.auth.getUser().then(({ data }) => {
            if (row.recipient_id && data.user?.id && row.recipient_id !== data.user.id) return;
            setStored((prev) => {
              if (prev.some((item) => item.id === row.id)) return prev;
              return [row, ...prev];
            });
            const prefs = loadPrefs();
            if (
              prefs.desktopNotifications &&
              typeof Notification !== "undefined" &&
              Notification.permission === "granted" &&
              document.hidden &&
              !seenDesktop.has(row.id)
            ) {
              seenDesktop.add(row.id);
              const n = new Notification(row.title, { body: row.body ?? "", tag: row.id });
              n.onclick = () => {
                window.focus();
                if (row.href) window.location.href = row.href;
              };
            }
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "crm_notifications" },
        (payload) => {
          const row = payload.new as NotificationRow;
          setStored((prev) => prev.map((item) => (item.id === row.id ? row : item)));
        }
      )
      .subscribe();
    const poll = window.setInterval(() => {
      if (!document.hidden) void reload();
    }, 60000);
    return () => {
      void supabase.removeChannel(channel);
      window.clearInterval(poll);
    };
  }, [reload]);

  const items = useMemo(() => mergeNotificationFeed(stored, activities), [stored, activities]);
  const unread = useMemo(() => unreadCount(items), [items]);

  const markRead = useCallback(
    async (ids: string[]) => {
      setStored((prev) =>
        prev.map((row) =>
          ids.includes(row.id) && !row.read_at ? { ...row, read_at: new Date().toISOString() } : row
        )
      );
      try {
        await markNotificationsRead(ids);
      } catch (err) {
        console.error("[crm] notifications read", err);
        await reload();
      }
    },
    [reload]
  );

  const markAll = useCallback(async () => {
    setStored((prev) =>
      prev.map((row) => (row.read_at ? row : { ...row, read_at: new Date().toISOString() }))
    );
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("[crm] notifications read-all", err);
      await reload();
    }
  }, [reload]);

  return { items, unread, reload, markRead, markAll };
}
