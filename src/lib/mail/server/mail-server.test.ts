import { describe, expect, it } from "vitest";
import { buildResendBody, checkScheduledAt, cleanRecipients, recipientErrors } from "@/lib/mail/server/send";
import { applyDeliveryEvent, shouldReplace } from "@/lib/mail/server/delivery";
import { parseAction, restoreFolder } from "@/lib/mail/server/actions";
import { doualaDay, reminderContent, reminderKindFor, type InvoiceForReminder } from "@/lib/mail/server/reminders";
import { looksLikeSpoof, parseReferences, resolveMailbox } from "@/lib/store-inbound";

describe("destinataires", () => {
  it("dédoublonne entre À, Cc et Cci", () => {
    const r = cleanRecipients({ to: ["A@x.cm", "b@x.cm"], cc: ["a@x.cm", "c@x.cm"], bcc: ["c@x.cm", "d@x.cm"] });
    expect(r).toEqual({ to: ["a@x.cm", "b@x.cm"], cc: ["c@x.cm"], bcc: ["d@x.cm"] });
  });

  it("refuse les adresses invalides et l'absence de destinataire", () => {
    expect(recipientErrors({ to: [], cc: [], bcc: [] })[0]).toMatch(/destinataire/);
    expect(recipientErrors({ to: ["pas-une-adresse"], cc: [], bcc: [] })[0]).toMatch(/invalide/);
    expect(recipientErrors({ to: Array.from({ length: 51 }, (_, i) => `u${i}@x.cm`), cc: [], bcc: [] })[0]).toMatch(/50/);
  });
});

describe("envoi programmé", () => {
  const now = Date.UTC(2026, 8, 25, 10);
  it("ignore une date passée ou trop proche (envoi immédiat)", () => {
    expect(checkScheduledAt(new Date(now + 10_000).toISOString(), now)).toBeNull();
  });
  it("accepte demain, refuse au-delà de 30 jours", () => {
    expect(checkScheduledAt(new Date(now + 86400_000).toISOString(), now)).toBe(new Date(now + 86400_000).toISOString());
    expect(() => checkScheduledAt(new Date(now + 31 * 86400_000).toISOString(), now)).toThrow(/30 jours/);
  });
});

describe("message Resend", () => {
  const base = {
    from: "Amour <amour@groupe-kalao.com>",
    replyTo: "amour@groupe-kalao.com",
    recipients: { to: ["c@x.cm"], cc: ["d@x.cm"], bcc: [] },
    subject: "Re: Visa",
    bodyHtml: "<p>Bonjour</p>",
    messageId: "<e1@groupe-kalao.com>",
    inReplyTo: "<abc@mail.gmail.com>",
    references: ["<root@mail.gmail.com>"],
    emailId: "e1",
  };

  it("pose les en-têtes de conversation pour que le client voie une réponse, pas un nouveau fil", () => {
    const body = buildResendBody({ ...base, kind: "personal" });
    expect(body.headers?.["In-Reply-To"]).toBe("<abc@mail.gmail.com>");
    expect(body.headers?.References).toBe("<root@mail.gmail.com> <abc@mail.gmail.com>");
    expect(body.headers?.["Message-ID"]).toBe("<e1@groupe-kalao.com>");
    expect(body.cc).toEqual(["d@x.cm"]);
    expect(body.bcc).toBeUndefined();
    expect(body.text).toBe("Bonjour");
  });

  it("n'ajoute plus de List-Unsubscribe invalide ; marque les envois automatiques", () => {
    const personal = buildResendBody({ ...base, kind: "personal" });
    expect(Object.keys(personal.headers ?? {})).not.toContain("List-Unsubscribe-Post");
    expect(personal.headers?.["Auto-Submitted"]).toBeUndefined();
    const auto = buildResendBody({ ...base, kind: "noreply" });
    expect(auto.headers?.["Auto-Submitted"]).toBe("auto-generated");
  });

  it("transmet les pièces jointes par URL et la date programmée", () => {
    const body = buildResendBody({
      ...base,
      kind: "contact",
      attachments: [{ filename: "a.pdf", path: "https://signed/url" }],
      scheduledAt: "2026-09-26T07:00:00.000Z",
    });
    expect(body.attachments?.[0]).toEqual({ filename: "a.pdf", path: "https://signed/url", content_type: undefined });
    expect(body.scheduled_at).toBe("2026-09-26T07:00:00.000Z");
  });
});

describe("suivi de livraison", () => {
  it("n'écrase pas un statut plus avancé", () => {
    expect(shouldReplace("delivered", "sent")).toBe(false);
    expect(shouldReplace("sent", "delivered")).toBe(true);
    expect(shouldReplace("delivered", "bounced")).toBe(true);
  });

  it("marque le mail rejeté et bloque l'adresse", async () => {
    const updates: Record<string, unknown>[] = [];
    const upserts: Record<string, unknown>[] = [];
    const chain = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => ({ data: { id: "row1", delivery_status: "sent", folder: "sent", scheduled_at: null } }),
      update: (patch: Record<string, unknown>) => {
        updates.push(patch);
        return { eq: async () => ({}) };
      },
      upsert: async (row: Record<string, unknown>) => {
        upserts.push(row);
        return {};
      },
    };
    const admin = { from: () => chain } as unknown as Parameters<typeof applyDeliveryEvent>[0];
    const res = await applyDeliveryEvent(admin, {
      type: "email.bounced",
      data: { email_id: "re_1", to: ["Client@ex.cm"], bounce: { message: "Mailbox does not exist", type: "Permanent" } },
    });
    expect(res).toEqual({ handled: true, reason: "bounced" });
    expect(updates[0].delivery_status).toBe("bounced");
    expect(upserts[0]).toMatchObject({ email: "client@ex.cm", reason: "bounced" });
  });

  it("ignore les événements inconnus", async () => {
    const admin = {} as Parameters<typeof applyDeliveryEvent>[0];
    expect(await applyDeliveryEvent(admin, { type: "domain.updated" })).toEqual({ handled: false, reason: "ignored" });
  });
});

describe("actions", () => {
  it("valide les actions", () => {
    expect(parseAction({ action: "move", folder: "archive" })).toEqual({ action: "move", folder: "archive" });
    expect(() => parseAction({ action: "move", folder: "sent" })).toThrow();
    expect(() => parseAction({ action: "drop_table" })).toThrow();
    expect(() => parseAction({ action: "label_add", labelId: "x" })).toThrow();
  });

  it("restaure au bon endroit", () => {
    expect(restoreFolder({ direction: "in", status: "stored", resend_id: null })).toBe("inbox");
    expect(restoreFolder({ direction: "out", status: "sent", resend_id: "re_1" })).toBe("sent");
    expect(restoreFolder({ direction: "out", status: "stored", resend_id: null })).toBe("drafts");
  });
});

describe("relances de factures", () => {
  const now = new Date("2026-09-25T08:00:00Z");
  const invoice = (due: string, extra: Partial<InvoiceForReminder> = {}): InvoiceForReminder => ({
    id: "i1", number: "FAC-1", amount: 100000, paid_amount: 40000, due_date: due, status: "unpaid",
    contact_id: null, company_id: null, dossier_id: null, ...extra,
  });

  it("J-3 et J+7 seulement, jamais une facture soldée ou conditionnelle", () => {
    expect(doualaDay(0, now)).toBe("2026-09-25");
    expect(reminderKindFor(invoice("2026-09-28"), now)).toBe("invoice_due_3d");
    expect(reminderKindFor(invoice("2026-09-18"), now)).toBe("invoice_overdue_7d");
    expect(reminderKindFor(invoice("2026-09-27"), now)).toBeNull();
    expect(reminderKindFor(invoice("2026-09-28", { paid_amount: 100000 }), now)).toBeNull();
    expect(reminderKindFor(invoice("2026-09-28", { is_conditional: true }), now)).toBeNull();
    expect(reminderKindFor(invoice("2026-09-28", { status: "cancelled" }), now)).toBeNull();
  });

  it("indique le reste à payer en FCFA", () => {
    const c = reminderContent("invoice_due_3d", invoice("2026-09-28"));
    expect(c.subject).toContain("FAC-1");
    expect(c.html).toContain("60 000 FCFA");
  });
});

describe("réception", () => {
  it("adresse inconnue → « À trier », pas la boîte partagée", async () => {
    const res = await resolveMailbox(["direction@groupe-kalao.com"], null);
    expect(res?.mailbox).toBe("triage");
    const contact = await resolveMailbox(["contact@ildiielkie.resend.app"], null);
    expect(contact?.mailbox).toBe("contact");
  });

  it("classe en spam un expéditeur usurpé", () => {
    expect(looksLikeSpoof({ spf: "pass", dkim: "pass", dmarc: "pass" })).toBe(false);
    expect(looksLikeSpoof({ dmarc: "fail" })).toBe(true);
    expect(looksLikeSpoof({ spf: "fail", dkim: "fail" })).toBe(true);
  });

  it("lit l'en-tête References", () => {
    expect(parseReferences("<a@x> <b@y>\r\n <c@z>")).toEqual(["<a@x>", "<b@y>", "<c@z>"]);
  });
});
