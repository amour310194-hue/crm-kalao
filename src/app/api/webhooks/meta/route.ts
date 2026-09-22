import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = process.env.META_VERIFY_TOKEN;
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const challenge = params.get("hub.challenge");
  const verify = params.get("hub.verify_token");
  if (!token || mode !== "subscribe" || verify !== token) {
    return Response.json({ ok: true, active: false }, { status: 200 });
  }
  return new Response(challenge ?? "", { status: 200 });
}

export async function POST() {
  return Response.json({ ok: true, ignored: true, active: false });
}
