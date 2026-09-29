import { describe, expect, it } from "vitest";
import {
  dueActivityItems,
  mergeNotificationFeed,
  notificationIcon,
  relativeTimeFr,
  unreadCount,
  type NotificationRow,
} from "@/lib/notifications";
import type { ActivityRow } from "@/lib/crm";

const now = new Date("2026-09-29T16:00:00+01:00");

function note(partial: Partial<NotificationRow>): NotificationRow {
  return {
    id: "n1",
    recipient_id: "u1",
    kind: "mail",
    title: "Mail reçu",
    body: "Client — Devis",
    href: "/application/email",
    ref_table: "crm_emails",
    ref_id: "e1",
    read_at: null,
    created_at: "2026-09-29T15:00:00.000Z",
    ...partial,
  };
}

describe("notifications", () => {
  it("compte uniquement les non lues", () => {
    expect(
      unreadCount([
        note({ id: "a", read_at: null }),
        note({ id: "b", read_at: "2026-09-29T15:01:00.000Z" }),
      ])
    ).toBe(1);
  });

  it("relatif en français", () => {
    expect(relativeTimeFr("2026-09-29T15:59:00+01:00", now)).toMatch(/seconde|minute/);
    expect(relativeTimeFr("2026-09-29T14:00:00+01:00", now)).toMatch(/heure/);
  });

  it("icônes par type", () => {
    expect(notificationIcon("mail")).toContain("mail");
    expect(notificationIcon("lead")).toContain("user");
    expect(notificationIcon("reminder")).toContain("alarm");
  });

  it("ajoute un rappel pour un rendez-vous dans les 24 h", () => {
    const dueAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const activities: ActivityRow[] = [
      {
        id: "act-1",
        type: "meeting",
        subject: "Visite client",
        company_id: null,
        contact_id: null,
        deal_id: null,
        due_at: dueAt,
        created_at: dueAt,
        notes: null,
        done: false,
      },
    ];
    const extra = dueActivityItems(activities, [], now);
    expect(extra).toHaveLength(1);
    expect(extra[0].kind).toBe("reminder");
    expect(extra[0].body).toContain("Visite client");
  });

  it("ne duplique pas un rappel déjà stocké", () => {
    const dueAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const activities: ActivityRow[] = [
      {
        id: "act-1",
        type: "meeting",
        subject: "Visite client",
        company_id: null,
        contact_id: null,
        deal_id: null,
        due_at: dueAt,
        created_at: dueAt,
        notes: null,
        done: false,
      },
    ];
    const stored = [note({ kind: "reminder", ref_table: "activities", ref_id: "act-1" })];
    expect(dueActivityItems(activities, stored, now)).toHaveLength(0);
  });

  it("place les rappels à venir avant les anciens mails", () => {
    const dueAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    const feed = mergeNotificationFeed(
      [note({ created_at: "2026-09-28T10:00:00.000Z" })],
      [
        {
          id: "act-2",
          type: "task",
          subject: "Relance",
          company_id: null,
          contact_id: null,
          deal_id: null,
          due_at: dueAt,
          created_at: dueAt,
          notes: null,
        },
      ],
      now
    );
    expect(feed[0].id).toBe("due:act-2");
  });
});
