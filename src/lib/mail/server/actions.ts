/** Actions sur les mails (lu, suivi, déplacement, libellés, attente, attribution…). */

import { isMailboxKey, type MailAction } from "@/lib/mail/types";
import { MailHttpError, visibleEmails, type MailContext } from "@/lib/mail/server/context";
import { upsertUserState } from "@/lib/mail/server/store";

const SIMPLE = ["read", "unread", "star", "unstar", "important", "unimportant", "restore", "delete_forever"];

export function parseAction(raw: unknown): MailAction {
  const input = (raw ?? {}) as Record<string, unknown>;
  const action = String(input.action ?? "");
  if (SIMPLE.includes(action)) return { action } as MailAction;
  if (action === "move") {
    const folder = String(input.folder ?? "");
    if (!["inbox", "archive", "spam", "deleted"].includes(folder)) throw new MailHttpError(400, "Dossier invalide.");
    return { action, folder: folder as "inbox" | "archive" | "spam" | "deleted" };
  }
  if (action === "snooze") {
    const until = input.until ? new Date(String(input.until)) : null;
    if (until && Number.isNaN(until.getTime())) throw new MailHttpError(400, "Date invalide.");
    return { action, until: until ? until.toISOString() : null };
  }
  if (action === "label_add" || action === "label_remove") {
    const labelId = String(input.labelId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(labelId)) throw new MailHttpError(400, "Libellé invalide.");
    return { action, labelId };
  }
  if (action === "assign") {
    const userId = input.userId ? String(input.userId) : null;
    if (userId && !/^[0-9a-f-]{36}$/i.test(userId)) throw new MailHttpError(400, "Personne invalide.");
    return { action, userId };
  }
  if (action === "move_mailbox") {
    if (!isMailboxKey(input.mailbox)) throw new MailHttpError(400, "Boîte invalide.");
    return { action, mailbox: input.mailbox, ownerId: input.ownerId ? String(input.ownerId) : null };
  }
  throw new MailHttpError(400, "Action inconnue.");
}

type Row = { id: string; direction: string; folder: string; status: string; mailbox: string; resend_id: string | null };

/** Dossier d'origine quand on restaure depuis la corbeille / le spam / l'archive. */
export function restoreFolder(row: { direction: string; status: string; resend_id: string | null }): string {
  if (row.direction === "out") return row.resend_id || row.status === "sent" ? "sent" : "drafts";
  return "inbox";
}

export async function applyAction(ctx: MailContext, ids: string[], action: MailAction): Promise<number> {
  const rows = await visibleEmails<Row>(ctx, ids, "id, direction, folder, status, mailbox, resend_id");
  if (!rows.length) return 0;
  const visible = rows.map((r) => r.id);
  const admin = ctx.admin;

  switch (action.action) {
    case "read":
    case "unread":
      await upsertUserState(admin, ctx.userId, visible, { read: action.action === "read" });
      break;
    case "star":
    case "unstar":
      await upsertUserState(admin, ctx.userId, visible, { starred: action.action === "star" });
      break;
    case "important":
    case "unimportant":
      await upsertUserState(admin, ctx.userId, visible, { important: action.action === "important" });
      break;
    case "snooze":
      await upsertUserState(admin, ctx.userId, visible, { snoozed_until: action.until, read: action.until ? true : undefined });
      break;
    case "move": {
      // Les brouillons et programmés ne se déplacent pas (ils se suppriment / s'annulent).
      const movable = rows.filter((r) => r.folder !== "drafts" && r.folder !== "scheduled");
      const target = action.folder;
      // Comme Gmail : archiver retire de la réception mais laisse les envoyés dans « Envoyés » ;
      // remettre en réception ne concerne que les messages reçus.
      const inIds = movable
        .filter((r) =>
          target === "archive" ? r.folder === "inbox" : target === "inbox" ? r.direction === "in" : true
        )
        .map((r) => r.id);
      if (inIds.length) {
        const { error } = await admin.from("crm_emails").update({ folder: target }).in("id", inIds);
        if (error) throw new MailHttpError(500, error.message);
      }
      const outRestore = movable.filter((r) => r.direction === "out" && target === "inbox");
      for (const r of outRestore) await admin.from("crm_emails").update({ folder: restoreFolder(r) }).eq("id", r.id);
      if (target === "spam") await upsertUserState(admin, ctx.userId, visible, { read: true });
      break;
    }
    case "restore":
      for (const r of rows) {
        if (["deleted", "spam", "archive"].includes(r.folder)) {
          await admin.from("crm_emails").update({ folder: restoreFolder(r) }).eq("id", r.id);
        }
      }
      break;
    case "label_add":
    case "label_remove": {
      const { data: label } = await ctx.userDb.from("crm_email_labels").select("id").eq("id", action.labelId).maybeSingle();
      if (!label) throw new MailHttpError(404, "Libellé introuvable.");
      if (action.action === "label_add") {
        const { error } = await admin
          .from("crm_email_label_links")
          .upsert(visible.map((email_id) => ({ email_id, label_id: action.labelId })), { onConflict: "email_id,label_id", ignoreDuplicates: true });
        if (error) throw new MailHttpError(500, error.message);
      } else {
        await admin.from("crm_email_label_links").delete().eq("label_id", action.labelId).in("email_id", visible);
      }
      break;
    }
    case "assign": {
      if (action.userId) {
        const { data } = await ctx.userDb.rpc("mail_directory");
        const ok = ((data ?? []) as { profile_id: string }[]).some((p) => p.profile_id === action.userId);
        if (!ok) throw new MailHttpError(400, "Cette personne n'a pas de compte CRM.");
      }
      const shared = rows.filter((r) => r.mailbox !== "personal").map((r) => r.id);
      if (shared.length) await admin.from("crm_emails").update({ assigned_to: action.userId }).in("id", shared);
      break;
    }
    case "move_mailbox": {
      if (!ctx.isAdmin) throw new MailHttpError(403, "Réservé aux administrateurs.");
      if (action.mailbox === "personal" && !action.ownerId) throw new MailHttpError(400, "Choisissez le destinataire de la boîte personnelle.");
      await admin
        .from("crm_emails")
        .update({ mailbox: action.mailbox, owner_id: action.mailbox === "personal" ? action.ownerId : null })
        .in("id", visible);
      break;
    }
    case "delete_forever": {
      if (!ctx.isAdmin) throw new MailHttpError(403, "La suppression définitive est réservée aux administrateurs.");
      const trash = rows.filter((r) => r.folder === "deleted" || r.folder === "spam").map((r) => r.id);
      if (trash.length) await admin.from("crm_emails").delete().in("id", trash);
      return trash.length;
    }
  }
  return visible.length;
}
