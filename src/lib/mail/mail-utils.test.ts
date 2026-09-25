import { describe, expect, it } from "vitest";
import { buildSearchQuery, folderForIn, parseSearch, parseSearchDate } from "@/lib/mail/search";
import {
  formatListDate,
  formatParticipants,
  initials,
  isValidEmail,
  parseAddress,
  splitRecipients,
  uniqueEmails,
} from "@/lib/mail/format";
import {
  fillTemplate,
  forwardSubject,
  htmlToText,
  normalizeSubject,
  replaceCidImages,
  replySubject,
  safeFilename,
  textToHtml,
  wrapOutgoingHtml,
} from "@/lib/mail/html";
import { forwardSeed, replySeed, sendingMailbox } from "@/lib/mail/compose";
import type { MailMessage } from "@/lib/mail/types";

describe("recherche façon Gmail", () => {
  it("sépare opérateurs et texte libre", () => {
    const p = parseSearch('de:client@ex.com objet:"visa canada" has:attachment is:unread passeport');
    expect(p.from).toBe("client@ex.com");
    expect(p.subject).toBe("visa canada");
    expect(p.hasAttachment).toBe(true);
    expect(p.unread).toBe(true);
    expect(p.text).toBe("passeport");
  });

  it("comprend les alias français et les dates", () => {
    const p = parseSearch("à:edith après:2026-09-01 avant:15/09/2026 est:suivi label:urgent");
    expect(p.to).toBe("edith");
    expect(p.after).toBe("2026-09-01T00:00:00.000Z");
    expect(p.before).toBe("2026-09-15T00:00:00.000Z");
    expect(p.starred).toBe(true);
    expect(p.label).toBe("urgent");
  });

  it("gère newer_than relatif", () => {
    const now = Date.UTC(2026, 8, 25);
    expect(parseSearch("newer_than:7d", now).after).toBe("2026-09-18T00:00:00.000Z");
  });

  it("rejette les dates impossibles", () => {
    expect(parseSearchDate("2026-02-31")).toBeUndefined();
    expect(parseSearchDate("n'importe quoi")).toBeUndefined();
  });

  it("mappe in:", () => {
    expect(folderForIn("corbeille")).toBe("deleted");
    expect(folderForIn("anywhere")).toBe("all");
  });

  it("reconstruit la requête du panneau avancé", () => {
    expect(buildSearchQuery({ from: "Edith Nlend", hasAttachment: true, words: "facture" })).toBe(
      'de:"Edith Nlend" has:attachment facture'
    );
  });
});

describe("formats", () => {
  it("date de liste : heure aujourd'hui, jour cette année, date complète sinon", () => {
    const now = new Date("2026-09-25T15:00:00Z");
    expect(formatListDate("2026-09-25T09:30:00Z", now)).toMatch(/10:30/);
    expect(formatListDate("2026-03-12T09:30:00Z", now)).toMatch(/12 mars/);
    expect(formatListDate("2025-03-12T09:30:00Z", now)).toBe("12/03/2025");
  });

  it("participants comme Gmail", () => {
    expect(formatParticipants(["Edith Nlend", "__me__", "Edith Nlend"], 3)).toBe("Edith, moi (3)");
    expect(formatParticipants(["client@ex.com"], 1)).toBe("client@ex.com");
    expect(formatParticipants(["A B", "C D", "E F", "G H"], 4)).toBe("A … E, G (4)");
  });

  it("adresses", () => {
    expect(parseAddress('"Amour Okala" <Amour@Ex.com>')).toEqual({ name: "Amour Okala", email: "amour@ex.com" });
    expect(splitRecipients("a@b.cm; Nom <c@d.cm>\ne@f.cm")).toEqual(["a@b.cm", "c@d.cm", "e@f.cm"]);
    expect(uniqueEmails(["A@b.cm", "a@b.cm"])).toEqual(["a@b.cm"]);
    expect(isValidEmail("client@groupe-kalao.com")).toBe(true);
    expect(isValidEmail("client@")).toBe(false);
    expect(initials("edith.nlend@groupe-kalao.com")).toBe("EN");
  });
});

describe("HTML et sujets", () => {
  it("texte ↔ HTML", () => {
    const html = textToHtml("Bonjour <client>,\n\nVoir https://ex.com/a?b=1");
    expect(html).toContain("&lt;client&gt;");
    expect(html).toContain('<a href="https://ex.com/a?b=1">');
    expect(htmlToText('<p>Bonjour</p><ul><li>Un</li></ul><a href="https://x.cm">lien</a>')).toBe(
      "Bonjour\n\n• Un\nlien (https://x.cm)"
    );
  });

  it("normalise les objets de réponse", () => {
    expect(normalizeSubject("RE: TR : Fwd: Visa Canada")).toBe("visa canada");
    expect(replySubject("Re: Visa")).toBe("Re: Visa");
    expect(forwardSubject("Visa")).toBe("Tr: Visa");
  });

  it("échappe les variables de modèle", () => {
    expect(fillTemplate("Bonjour {{nom}} {{inconnu}}", { nom: "<b>X</b>" })).toBe("Bonjour &lt;b&gt;X&lt;/b&gt; ");
  });

  it("pas de bandeau ni d'invitation à répondre sur un mail personnel ; mention « ne répondez pas » sur no-reply", () => {
    expect(wrapOutgoingHtml("<p>x</p>", "personal")).not.toContain("ne pas y répondre");
    expect(wrapOutgoingHtml("<p>x</p>", "noreply")).toContain("merci de ne pas y répondre");
  });

  it("remplace les images cid", () => {
    expect(replaceCidImages('<img src="cid:logo@x">', { "logo@x": "/api/mail/attachments?id=1" })).toBe(
      '<img src="/api/mail/attachments?id=1">'
    );
  });

  it("nom de fichier sûr", () => {
    expect(safeFilename("Passeport scanné (1).pdf")).toBe("Passeport_scanne_1_.pdf");
    expect(safeFilename("../../etc/passwd")).toBe("etc_passwd");
  });
});

function msg(partial: Partial<MailMessage>): MailMessage {
  return {
    id: "m1", thread_id: "t1", mailbox: "contact", owner_id: null, direction: "in", folder: "inbox",
    status: "stored", from_email: "client@ex.cm", from_name: "Client", to_email: "contact@groupe-kalao.com",
    to_emails: ["contact@groupe-kalao.com", "edith@groupe-kalao.com"], cc_emails: ["avocat@ex.cm"], bcc_emails: [],
    subject: "Visa", body: "Bonjour", html: null, snippet: null, created_at: "2026-09-25T10:00:00Z", sent_at: null,
    scheduled_at: null, delivery_status: null, delivery_detail: null, assigned_to: null, created_by: null,
    contact_id: "c1", company_id: null, dossier_id: "d1", invoice_id: null, in_reply_to: null, has_attachments: true,
    auth_spf: null, auth_dkim: null, auth_dmarc: null, read: true, starred: false, important: false, snoozed_until: null,
    attachments: [{ id: "a1", email_id: "m1", filename: "passeport.pdf", content_type: "application/pdf", size_bytes: 10, content_id: null, inline: false }],
    label_ids: [],
    ...partial,
  };
}

describe("rédaction", () => {
  const ctx = { available: ["contact", "personal"] as const, signature: "<b>Amour</b>", workEmail: "amour@groupe-kalao.com" };

  it("répondre à tous exclut ses propres adresses et garde le fil", () => {
    const seed = replySeed(msg({}), "replyAll", { ...ctx, available: [...ctx.available] });
    expect(seed.to).toEqual(["client@ex.cm"]);
    expect(seed.cc).toEqual(["edith@groupe-kalao.com", "avocat@ex.cm"]);
    expect(seed.inReplyToId).toBe("m1");
    expect(seed.threadId).toBe("t1");
    expect(seed.subject).toBe("Re: Visa");
    expect(seed.html).toContain("kalao_signature");
    expect(seed.dossierId).toBe("d1");
  });

  it("répondre à son propre envoi réécrit aux destinataires", () => {
    const seed = replySeed(msg({ direction: "out", from_email: "contact@groupe-kalao.com", to_emails: ["client@ex.cm"] }), "reply", { ...ctx, available: [...ctx.available] });
    expect(seed.to).toEqual(["client@ex.cm"]);
  });

  it("transférer reprend les pièces jointes", () => {
    const seed = forwardSeed(msg({}), { available: ["contact"], signature: "" });
    expect(seed.attachments[0].sourceAttachmentId).toBe("a1");
    expect(seed.subject).toBe("Tr: Visa");
  });

  it("n'envoie jamais depuis « À trier »", () => {
    expect(sendingMailbox("triage", ["contact", "personal", "triage"])).toBe("personal");
    expect(sendingMailbox("noreply", ["contact", "personal"])).toBe("personal");
  });
});
