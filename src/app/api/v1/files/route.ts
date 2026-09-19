import { NextResponse } from "next/server";
import { auditMutation } from "@/lib/backend/audit";
import { createRecord, listResource } from "@/lib/backend/store";
import type { AttachmentRecord } from "@/lib/backend/types";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

function publicFile(row: AttachmentRecord) {
  const { contentBase64: _omit, ...rest } = row;
  return { ...rest, url: `/api/v1/files/${row.id}` };
}

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
  return NextResponse.json({ data: rows.map(publicFile) });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (5 Mo max)" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const record = createRecord("attachments", {
    parentType: String(form.get("parentType") || "files"),
    parentId: String(form.get("parentId") || "root"),
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    contentBase64: bytes.toString("base64"),
    url: "",
    createdAt: new Date().toISOString(),
  }) as AttachmentRecord;
  record.url = `/api/v1/files/${record.id}`;
  await auditMutation(request, "create", "attachments", { ...record, contentBase64: undefined });

  return NextResponse.json({ data: publicFile(record) }, { status: 201 });
}
