import { NextResponse } from "next/server";
import { getById } from "@/lib/backend/store";
import type { AttachmentRecord } from "@/lib/backend/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const row = getById("attachments", id) as (AttachmentRecord & { contentBase64?: string }) | null;
  if (!row?.contentBase64) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
  const buffer = Buffer.from(row.contentBase64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": row.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(row.name)}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
