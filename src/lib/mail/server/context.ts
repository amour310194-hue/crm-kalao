/** Contexte d'une requête mail côté serveur : utilisateur, droits sur les boîtes, clients Supabase. */

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/require-user";
import { getServiceSupabase, getUserSupabase } from "@/lib/supabase/admin";
import { isCrmAdmin } from "@/lib/authz";
import { isSharedMailbox } from "@/lib/mail-send-auth";
import type { SharedMailbox } from "@/lib/mail/types";

export type MailContext = {
  userId: string;
  role: string | null;
  isAdmin: boolean;
  /** Client avec le jeton de l'utilisateur : la RLS s'applique (lecture, contrôle de visibilité). */
  userDb: SupabaseClient;
  /** Client service : écritures après contrôle. */
  admin: SupabaseClient;
  allowedShared: SharedMailbox[];
  workEmail: string;
  fullName: string;
};

export class MailHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "MailHttpError";
  }
}

export async function getMailContext(request: Request): Promise<MailContext> {
  const authed = await requireUser(request);
  if (!authed || !authed.token) throw new MailHttpError(401, "unauthorized");
  const userDb = getUserSupabase(authed.token);
  if (!userDb) throw new MailHttpError(503, "supabase_missing");
  const admin = getServiceSupabase();
  const [{ data: profile }, { data: employee }, { data: shared }] = await Promise.all([
    admin.from("profiles").select("full_name, role").eq("id", authed.user.id).maybeSingle(),
    admin.from("employees").select("email, full_name").eq("profile_id", authed.user.id).maybeSingle(),
    userDb.rpc("shared_mailboxes_for_me"),
  ]);
  const role = (profile?.role as string | null) ?? authed.role;
  if (!role) throw new MailHttpError(403, "no_role");
  const workEmail = String(employee?.email || authed.user.email || "").trim().toLowerCase();
  return {
    userId: authed.user.id,
    role,
    isAdmin: isCrmAdmin(role),
    userDb,
    admin,
    allowedShared: (Array.isArray(shared) ? shared : []).filter(isSharedMailbox),
    workEmail,
    fullName: String(employee?.full_name || profile?.full_name || workEmail.split("@")[0] || "Kalao"),
  };
}

export function jsonError(err: unknown): Response {
  if (err instanceof MailHttpError) {
    return Response.json({ ok: false, reason: err.message }, { status: err.status });
  }
  console.error("[mail]", err);
  const message = err instanceof Error ? err.message : "mail_error";
  return Response.json({ ok: false, reason: message }, { status: 500 });
}

/** Ids de mails réellement visibles par l'utilisateur (RLS), avec les colonnes demandées. */
export async function visibleEmails<T = { id: string }>(
  ctx: MailContext,
  ids: string[],
  columns = "id"
): Promise<T[]> {
  const clean = [...new Set(ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id)))].slice(0, 500);
  if (!clean.length) return [];
  const { data, error } = await ctx.userDb.from("crm_emails").select(columns).in("id", clean);
  if (error) throw new MailHttpError(500, error.message);
  return (data ?? []) as T[];
}

/** Tous les messages visibles d'un ou plusieurs fils. */
export async function visibleThreadMessages<T = { id: string }>(
  ctx: MailContext,
  threadIds: string[],
  columns = "id"
): Promise<T[]> {
  const clean = [...new Set(threadIds.filter((id) => /^[0-9a-f-]{36}$/i.test(id)))].slice(0, 200);
  if (!clean.length) return [];
  const list = clean.join(",");
  const { data, error } = await ctx.userDb
    .from("crm_emails")
    .select(columns)
    .or(`thread_id.in.(${list}),id.in.(${list})`);
  if (error) throw new MailHttpError(500, error.message);
  return (data ?? []) as T[];
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new MailHttpError(400, "bad_payload");
  }
}
