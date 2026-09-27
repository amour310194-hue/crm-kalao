import { describe, expect, it } from "vitest";
import { DEFAULT_CAPTURE_FIELDS, captureFormFields, submitCapture } from "@/lib/capture-submit";
import { memoryRateLimitStore, CAPTURE_IP_MAX, CAPTURE_IP_WINDOW } from "@/lib/rate-limit";

const FORM = {
  id: "form-1",
  slug: "devis-visa",
  title: "Devis Visa Canada",
  status: "published",
  fields: DEFAULT_CAPTURE_FIELDS,
  success_message: "Merci !",
  default_source: "Devis Visa Canada",
};

function fakeSupabase() {
  let table = "";
  let inserted: { table: string; payload: unknown } | null = null;
  const chain = {
    select: () => chain,
    eq: () => chain,
    limit: () => chain,
    insert: (payload: unknown) => {
      inserted = { table, payload };
      return chain;
    },
    maybeSingle: async () => {
      if (table === "capture_forms") return { data: FORM, error: null };
      return { data: null, error: null };
    },
    single: async () => {
      if (table === "contacts") return { data: { id: "contact-1" }, error: null };
      return { data: null, error: null };
    },
  };
  return {
    client: {
      from(t: string) {
        table = t;
        return chain;
      },
    },
    getInserted: () => inserted,
  };
}

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/capture/devis-visa", {
    method: "POST",
    headers: { "x-forwarded-for": "203.0.113.5" },
    body: JSON.stringify(body),
  });
}

describe("submitCapture", () => {
  it("refuse un champ requis manquant sans rien écrire", async () => {
    const { client, getInserted } = fakeSupabase();
    const result = await submitCapture("devis-visa", {}, request({}), {
      supabase: client as never,
      rateLimit: memoryRateLimitStore(),
    });
    expect(result.status).toBe(400);
    expect(getInserted()).toBeNull();
  });

  it("piège à robot : honeypot rempli renvoie ok sans écrire", async () => {
    const { client, getInserted } = fakeSupabase();
    const result = await submitCapture(
      "devis-visa",
      {
        prenom: "Bot",
        nom: "Spam",
        telephone: "690000000",
        email: "bot@spam.example",
        company_website: "https://spam.example",
      },
      request({}),
      { supabase: client as never, rateLimit: memoryRateLimitStore() }
    );
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(getInserted()).toBeNull();
  });

  it("bloque au-delà de la limite par IP avant tout accès Supabase", async () => {
    const store = memoryRateLimitStore();
    const ip = "203.0.113.5";
    for (let i = 0; i < CAPTURE_IP_MAX; i++) {
      await store.hit(`capture:ip:${ip}`, CAPTURE_IP_WINDOW, CAPTURE_IP_MAX);
    }
    const result = await submitCapture("devis-visa", { name: "Ok" }, request({}), {
      rateLimit: store,
    });
    expect(result.status).toBe(429);
  });
});

describe("captureFormFields", () => {
  it("impose prénom, nom, téléphone, e-mail et message", () => {
    expect(DEFAULT_CAPTURE_FIELDS.map((field) => field.key)).toEqual([
      "prenom",
      "nom",
      "telephone",
      "email",
      "message",
    ]);
    expect(captureFormFields([])).toEqual(DEFAULT_CAPTURE_FIELDS);
  });
});
