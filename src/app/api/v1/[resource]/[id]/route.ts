import { NextResponse } from "next/server";
import { auditMutation } from "@/lib/backend/audit";
import { getAccountFiche, getContactFiche } from "@/lib/backend/views";
import {
  deleteAccount,
  deleteQuote,
  deleteRecord,
  getById,
  getQuoteDetail,
  resolveResource,
  updateAccount,
  updateActivity,
  updateCompany,
  updateContact,
  updateDeal,
  updateQuote,
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
    const record = getAccountFiche(id);
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

  if (resource === "quotes") {
    const detail = getQuoteDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ resource, data: detail });
  }

  if (resource === "contacts") {
    const fiche = getContactFiche(id);
    if (!fiche) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ resource, data: fiche });
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
    await auditMutation(request, "update", "accounts", record, id);
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
        await auditMutation(request, "update", resource, persisted, id);
        return NextResponse.json({ resource, source: "supabase", data: persisted });
      }
    } catch (error) {
      return persistError(error);
    }
  }

  if (resource === "deals") {
    const record = updateDeal(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "update", resource, record, id);
    return NextResponse.json({ resource, data: record });
  }

  if (resource === "contacts") {
    const record = updateContact(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "update", resource, record, id);
    return NextResponse.json({ resource, data: record });
  }

  if (resource === "companies") {
    const record = updateCompany(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "update", resource, record, id);
    return NextResponse.json({ resource, data: record });
  }

  if (resource === "quotes") {
    const record = updateQuote(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "update", resource, record, id);
    return NextResponse.json({ resource, data: record });
  }

  if (resource === "activities") {
    const record = updateActivity(id, payload);
    if (!record) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "update", resource, record, id);
    return NextResponse.json({ resource, data: record });
  }

  const record = updateRecord(resource, id, payload);
  if (!record) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  await auditMutation(request, "update", resource, record, id);
  return NextResponse.json({ resource, data: record });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { resource: raw, id } = await context.params;
  if (isAccounts(raw)) {
    const existing = getById("companies", id) ?? getById("contacts", id);
    const ok = deleteAccount(id);
    if (!ok) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "delete", "accounts", existing ?? { id }, id);
    return NextResponse.json({ ok: true });
  }
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  if (resource === "travel") {
    try {
      const existing = await getTravel(id);
      const persisted = await deleteTravel(id);
      if (persisted) {
        await auditMutation(request, "delete", resource, existing ?? { id }, id);
        return NextResponse.json({ ok: true, source: "supabase" });
      }
      if (persisted === false) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      }
    } catch (error) {
      return persistError(error);
    }
  }

  if (resource === "quotes") {
    const existing = getById(resource, id);
    const ok = deleteQuote(id);
    if (!ok) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await auditMutation(request, "delete", resource, existing ?? { id }, id);
    return NextResponse.json({ ok: true });
  }

  const existing = getById(resource, id);
  const ok = deleteRecord(resource, id);
  if (!ok) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  await auditMutation(request, "delete", resource, existing ?? { id }, id);
  return NextResponse.json({ ok: true });
}
