import { NextResponse } from "next/server";
import {
  deleteRecord,
  getById,
  resolveResource,
  updateRecord,
} from "@/lib/backend/store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const record = getById(resource, id);
  if (!record) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ resource, data: record });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const record = updateRecord(resource, id, payload);
  if (!record) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ resource, data: record });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const ok = deleteRecord(resource, id);
  if (!ok) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
