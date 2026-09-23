import { NextRequest } from "next/server";
import { consumePasswordReset } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
  let payload: { email?: string; code?: string; token?: string; password?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ ok: false, reason: "bad_payload" }, { status: 400 });
  }
  try {
    await consumePasswordReset({
      email: payload.email,
      code: payload.code,
      token: payload.token,
      password: String(payload.password ?? ""),
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, reason: err instanceof Error ? err.message : "reset_error" },
      { status: 400 }
    );
  }
}
