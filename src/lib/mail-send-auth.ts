import { fromAddress } from "@/lib/mail-deliverability";
import {
  KALAO_CONTACT_EMAIL,
  KALAO_NOREPLY_EMAIL,
  KALAO_NOREPLY_FROM,
} from "@/lib/org";

export type MailboxKey = "noreply" | "contact" | "personal";
export type SharedMailbox = "contact" | "noreply";

export type SenderAuth =
  | { ok: true; from: string; mailbox: MailboxKey }
  | { ok: false; status: 403; reason: "forbidden_mailbox" };

export function authorizeSender(input: {
  mailbox?: string;
  requestedFrom?: string;
  workEmail: string;
  fullName: string;
  allowedShared: SharedMailbox[];
}): SenderAuth {
  const mailbox = input.mailbox === "contact" || input.mailbox === "personal" || input.mailbox === "noreply"
    ? input.mailbox
    : "noreply";

  if (mailbox === "contact") {
    if (!input.allowedShared.includes("contact")) {
      return { ok: false, status: 403, reason: "forbidden_mailbox" };
    }
    return { ok: true, mailbox, from: `Contact Kalao <${KALAO_CONTACT_EMAIL}>` };
  }

  if (mailbox === "noreply") {
    if (!input.allowedShared.includes("noreply")) {
      return { ok: false, status: 403, reason: "forbidden_mailbox" };
    }
    return { ok: true, mailbox, from: process.env.RESEND_FROM || KALAO_NOREPLY_FROM };
  }

  const work = input.workEmail.trim().toLowerCase();
  if (!work.includes("@")) {
    return { ok: false, status: 403, reason: "forbidden_mailbox" };
  }
  const requested = String(input.requestedFrom ?? "").trim();
  if (requested) {
    const addr = fromAddress(requested).toLowerCase();
    if (addr !== work) return { ok: false, status: 403, reason: "forbidden_mailbox" };
  }
  const name = input.fullName.trim() || work;
  return { ok: true, mailbox: "personal", from: `${name} <${work}>` };
}

export function isSharedMailbox(value: string): value is SharedMailbox {
  return value === "contact" || value === "noreply";
}

export { KALAO_CONTACT_EMAIL, KALAO_NOREPLY_EMAIL };
