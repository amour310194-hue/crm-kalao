import { NextResponse } from "next/server";
import {
  deleteAccount,
  deleteRecord,
  getById,
  resolveResource,
  updateAccount,
  updateRecord,
} from "@/lib/backend/store";
import { deleteTravel, getTravel, updateTravel } from "@/lib/backend/travel-db";

export const dynamic = "force-dynamic";

function persistError(error: unknown) {
  const message = error instanceof Error ? error.message : "Supabase indisponible";
  return NextResponse.json({ error: message }, { status: 502 });
}

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

  if (resource === "travel") {
    try {
      const persisted = await getTravel(id);
      if (persisted) {
        return NextResponse.json({ resource, source: "supabase", data: persisted });
      }
    } catch (error) {
      return persistError(error);
    }
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

  if (resource === "travel") {
    try {
      const persisted = await updateTravel(id, payload);
      if (persisted) {
        return NextResponse.json({ resource, source: "supabase", data: persisted });
      }
    } catch (error) {
      return persistError(error);
    }
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

  if (resource === "travel") {
    try {
      const persisted = await deleteTravel(id);
      if (persisted) {
        return NextResponse.json({ ok: true, source: "supabase" });
      }
      if (persisted === false) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      }
    } catch (error) {
      return persistError(error);
    }
  }

  const ok = deleteRecord(resource, id);
  if (!ok) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
