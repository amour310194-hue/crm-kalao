import { NextRequest } from "next/server";
import { KALAO_NOREPLY_FROM } from "@/lib/org";

export async function POST(request: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ ok: true, dispatched: false });
  }

  let payload: { to?: string; subject?: string; body?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, dispatched: false }, { status: 400 });
  }

  const to = String(payload.to ?? "").trim();
  const subject = String(payload.subject ?? "CRM Kalao").trim();
  const text = String(payload.body ?? "").trim();
  if (!to || !text) {
    return Response.json({ ok: true, dispatched: false });
  }

  const from = process.env.RESEND_FROM || KALAO_NOREPLY_FROM;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  return Response.json({ ok: res.ok, dispatched: res.ok });
}
