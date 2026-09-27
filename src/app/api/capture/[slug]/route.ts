import { NextRequest } from "next/server";
import { submitCapture } from "@/lib/capture-submit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await request.json().catch(() => ({}));
  const { status, body } = await submitCapture(slug, payload, request);
  return Response.json(body, { status });
}
