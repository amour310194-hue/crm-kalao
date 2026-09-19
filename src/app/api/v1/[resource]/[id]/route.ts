import { NextResponse } from "next/server";
import {
  deleteAccount,
  deleteRecord,
  getById,
  resolveResource,
  updateAccount,
  updateRecord,
} from "@/lib/backend/store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

function isAccounts(raw: string) {
  return raw === "accounts" || raw === "clients";
}

export async function GET(_request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  if (isAccounts(raw)) {
    const record = getById("companies", id) ?? getById("contacts", id);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ resource: "accounts", data: record });
  }
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
  const payload = (await request.json()) as Record<string, unknown>;
  if (isAccounts(raw)) {
    const record = updateAccount(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ resource: "accounts", data: record });
  }
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const record = updateRecord(resource, id, payload);
  if (!record) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ resource, data: record });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  if (isAccounts(raw)) {
    const ok = deleteAccount(id);
    if (!ok) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }
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
