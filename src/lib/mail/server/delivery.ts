/** Événements de livraison Resend → statut réel du mail et liste des adresses rejetées. */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { DeliveryStatus } from "@/lib/mail/types";

export const DELIVERY_EVENTS: Record<string, DeliveryStatus> = {
  "email.sent": "sent",
  "email.scheduled": "scheduled",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
  "email.suppressed": "suppressed",
  "email.opened": "opened",
};

/** Un statut « plus avancé » ne doit pas être écrasé par un événement arrivé en retard. */
const RANK: Record<string, number> = {
  queued: 0, scheduled: 1, sent: 2, delayed: 3, delivered: 4, opened: 5,
  failed: 6, suppressed: 6, bounced: 7, complained: 8, cancelled: 9,
};

export function shouldReplace(current: string | null | undefined, next: DeliveryStatus): boolean {
  if (!current) return true;
  return (RANK[next] ?? 0) >= (RANK[current] ?? 0);
}

type EventPayload = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    bounce?: { message?: string; type?: string; subType?: string };
    failed?: { reason?: string };
  };
};

export async function applyDeliveryEvent(
  admin: SupabaseClient,
  payload: EventPayload
): Promise<{ handled: boolean; reason: string }> {
  const status = payload.type ? DELIVERY_EVENTS[payload.type] : undefined;
  const resendId = payload.data?.email_id;
  if (!status || !resendId) return { handled: false, reason: "ignored" };
  const { data: row } = await admin
    .from("crm_emails")
    .select("id, delivery_status, folder, scheduled_at")
    .eq("resend_id", resendId)
    .eq("direction", "out")
    .maybeSingle();
  if (!row) return { handled: false, reason: "unknown_email" };

  const detail =
    payload.data?.bounce?.message ||
    payload.data?.failed?.reason ||
    (payload.data?.bounce?.type ? `${payload.data.bounce.type} ${payload.data.bounce.subType ?? ""}`.trim() : null);
  const patch: Record<string, unknown> = {};
  if (shouldReplace(row.delivery_status, status)) {
    patch.delivery_status = status;
    patch.delivery_updated_at = payload.created_at ?? new Date().toISOString();
    if (detail) patch.delivery_detail = String(detail).slice(0, 500);
  }
  // Un envoi programmé qui part passe de « Programmés » à « Envoyés ».
  if (row.folder === "scheduled" && ["sent", "delivered", "opened", "bounced", "complained", "failed"].includes(status)) {
    patch.folder = "sent";
    patch.status = status === "failed" ? "failed" : "sent";
    patch.sent_at = payload.created_at ?? new Date().toISOString();
  }
  if (Object.keys(patch).length) await admin.from("crm_emails").update(patch).eq("id", row.id);

  if (status === "bounced" || status === "complained" || status === "suppressed") {
    const permanent = status !== "bounced" || (payload.data?.bounce?.type ?? "").toLowerCase() !== "transient";
    const recipients = Array.isArray(payload.data?.to) ? payload.data.to : payload.data?.to ? [payload.data.to] : [];
    if (permanent) {
      for (const email of recipients) {
        await admin.from("crm_mail_suppressions").upsert({
          email: String(email).toLowerCase(),
          reason: status,
          detail: detail ? String(detail).slice(0, 500) : null,
          source_email_id: row.id,
        });
      }
    }
  }
  return { handled: true, reason: status };
}
