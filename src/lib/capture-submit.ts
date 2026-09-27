import type { SupabaseClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  CAPTURE_FORM_MAX,
  CAPTURE_FORM_WINDOW,
  CAPTURE_IP_MAX,
  CAPTURE_IP_WINDOW,
  clientIp,
  enforceRateLimits,
  supabaseRateLimitStore,
  type RateLimitStore,
} from "@/lib/rate-limit";

export type CaptureField = {
  key: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select";
  required?: boolean;
};

type CaptureFormRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  fields: CaptureField[];
  success_message: string | null;
  default_source: string | null;
};

const HONEYPOT_KEY = "company_website";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitCapture(
  slug: string,
  payload: Record<string, unknown>,
  request: Request,
  opts?: { rateLimit?: RateLimitStore; supabase?: SupabaseClient }
): Promise<{ status: number; body: { ok: boolean; reason?: string } }> {
  const store = opts?.rateLimit ?? supabaseRateLimitStore();
  const ip = clientIp(request);
  const limited = await enforceRateLimits(store, [
    { key: `capture:ip:${ip}`, windowSeconds: CAPTURE_IP_WINDOW, max: CAPTURE_IP_MAX },
    { key: `capture:form:${slug}`, windowSeconds: CAPTURE_FORM_WINDOW, max: CAPTURE_FORM_MAX },
  ]);
  if (limited.limited) {
    return { status: 429, body: { ok: false, reason: "too_many_requests" } };
  }

  const supabase = opts?.supabase ?? getServiceSupabase();
  const { data: form, error: formErr } = await supabase
    .from("capture_forms")
    .select("id, slug, title, status, fields, success_message, default_source")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (formErr || !form) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  const captureForm = form as CaptureFormRow;

  // Piège à robots : un champ caché que seul un bot remplit. On répond succès sans
  // rien écrire pour ne pas révéler au bot que sa soumission a été détectée.
  if (str(payload[HONEYPOT_KEY])) {
    return { status: 200, body: { ok: true } };
  }

  const fields = Array.isArray(captureForm.fields) ? captureForm.fields : [];
  for (const field of fields) {
    if (field.required && !str(payload[field.key])) {
      return { status: 400, body: { ok: false, reason: "validation" } };
    }
  }

  // Les libellés sont saisis librement (en français) par le staff dans l'écran
  // d'administration : on ne peut pas deviner le rôle d'un champ à partir de sa
  // clé (slug du libellé). On se base donc sur le `type` du champ, qui lui est
  // un ensemble fermé et fiable.
  const emailField = fields.find((f) => f.type === "email");
  const phoneField = fields.find((f) => f.type === "phone");
  const nameField = fields.find((f) => f.type === "text");
  const messageField = fields.find((f) => f.type === "textarea");

  const name = str(payload[nameField?.key ?? ""]) || captureForm.title;
  const email = emailField ? str(payload[emailField.key]) || null : null;
  const phone = phoneField ? str(payload[phoneField.key]) || null : null;
  const message = messageField ? str(payload[messageField.key]) : "";
  const handled = new Set([emailField?.key, phoneField?.key, nameField?.key, messageField?.key]);
  const extras = fields
    .filter((f) => !handled.has(f.key))
    .map((f) => `${f.label}: ${str(payload[f.key])}`)
    .filter((line) => !line.endsWith(": "));

  let contactId: string | null = null;
  if (email || phone) {
    const query = supabase.from("contacts").select("id").limit(1);
    const { data: existing } = email
      ? await query.eq("email", email).maybeSingle()
      : await query.eq("phone", phone as string).maybeSingle();
    contactId = existing?.id ?? null;
  }

  if (!contactId) {
    const parts = name.split(/\s+/).filter(Boolean);
    const { data: created, error: contactErr } = await supabase
      .from("contacts")
      .insert({
        first_name: parts[0] || "Prospect",
        last_name: parts.slice(1).join(" ") || "Kalao",
        email,
        phone,
        notes: message || null,
        status: "prospect",
      })
      .select("id")
      .single();
    if (contactErr || !created) {
      return { status: 500, body: { ok: false, reason: "contact" } };
    }
    contactId = created.id;
  }

  const utmSource = str(payload.utm_source) || null;
  const utmMedium = str(payload.utm_medium) || null;
  const utmCampaign = str(payload.utm_campaign) || null;
  const utmContent = str(payload.utm_content) || null;
  const notes = [message, ...extras].filter(Boolean).join("\n") || null;

  const { error: leadErr } = await supabase.from("leads").insert({
    title: name || captureForm.title,
    contact_id: contactId,
    source: captureForm.default_source || captureForm.title,
    capture_form_id: captureForm.id,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    notes,
  });
  if (leadErr) {
    return { status: 500, body: { ok: false, reason: "lead" } };
  }

  return { status: 200, body: { ok: true } };
}
