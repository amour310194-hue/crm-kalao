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

export const DEFAULT_CAPTURE_FIELDS: CaptureField[] = [
  { key: "prenom", label: "Prénom", type: "text", required: true },
  { key: "nom", label: "Nom", type: "text", required: true },
  { key: "telephone", label: "Téléphone", type: "phone", required: true },
  { key: "email", label: "E-mail", type: "email", required: true },
  { key: "message", label: "Message", type: "textarea", required: false },
];

export function captureFormFields(fields: unknown): CaptureField[] {
  const stored = Array.isArray(fields) ? (fields as CaptureField[]) : [];
  const hasAll = DEFAULT_CAPTURE_FIELDS.every((field) => stored.some((item) => item.key === field.key));
  return hasAll ? stored : DEFAULT_CAPTURE_FIELDS;
}

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

  const fields = captureFormFields(captureForm.fields);
  for (const field of fields) {
    if (field.required && !str(payload[field.key])) {
      return { status: 400, body: { ok: false, reason: "validation" } };
    }
  }

  const firstName = str(payload.prenom);
  const lastName = str(payload.nom);
  const email = str(payload.email) || null;
  const phone = str(payload.telephone) || null;
  const message = str(payload.message);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  let contactId: string | null = null;
  if (email || phone) {
    const query = supabase.from("contacts").select("id").limit(1);
    const { data: existing } = email
      ? await query.eq("email", email).maybeSingle()
      : await query.eq("phone", phone as string).maybeSingle();
    contactId = existing?.id ?? null;
  }

  if (!contactId) {
    const { data: created, error: contactErr } = await supabase
      .from("contacts")
      .insert({
        first_name: firstName || "Prospect",
        last_name: lastName || "Kalao",
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
  const notes = message || null;

  const { error: leadErr } = await supabase.from("leads").insert({
    title: fullName || captureForm.title,
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
