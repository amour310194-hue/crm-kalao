import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { createRecord, listResource } from "@/lib/backend/store";
import type { AttachmentRecord } from "@/lib/backend/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parentType = url.searchParams.get("parentType");
  const parentId = url.searchParams.get("parentId");
  let rows = listResource("attachments") as AttachmentRecord[];
  if (parentType) {
    rows = rows.filter((row) => row.parentType === parentType);
  }
  if (parentId) {
    rows = rows.filter((row) => row.parentId === parentId);
  }
  return NextResponse.json({ data: rows });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;
  const dir = join(process.cwd(), "public", "uploads");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, safeName), bytes);

  const record = createRecord("attachments", {
    parentType: String(form.get("parentType") || "files"),
    parentId: String(form.get("parentId") || "root"),
    name: file.name,
    url: `/uploads/${safeName}`,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ data: record }, { status: 201 });
}
