import { NextResponse } from "next/server";
import { buildSimplePdf } from "@/lib/backend/pdf";
import { getById, listResource, resolveResource } from "@/lib/backend/store";
import { listUi, toAccountRows } from "@/lib/backend/views";

export const dynamic = "force-dynamic";

function flatten(row: Record<string, unknown>) {
  return Object.entries(row)
    .filter(([key]) => !["image", "Image", "Owner_Img", "clientImage", "Project_Image"].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("resource") || "quotes";
  const id = url.searchParams.get("id");

  if (raw === "accounts" || raw === "clients") {
    const rows = toAccountRows();
    const pdf = buildSimplePdf("Clients Groupe Kalao", rows.map((row) => flatten(row as Record<string, unknown>)));
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="clients.pdf"',
      },
    });
  }

  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  if (id) {
    const record = getById(resource, id);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    const pdf = buildSimplePdf(`${resource} ${id}`, flatten(record as Record<string, unknown>).split(" | "));
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resource}-${id}.pdf"`,
      },
    });
  }

  const rows = listUi(resource) as Array<Record<string, unknown>>;
  const fallback = listResource(resource) as Array<Record<string, unknown>>;
  const lines = (rows.length ? rows : fallback).map((row) => flatten(row));
  const pdf = buildSimplePdf(`Export ${resource} — Groupe Kalao`, lines);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resource}.pdf"`,
    },
  });
}
