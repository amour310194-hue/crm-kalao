import { NextResponse } from "next/server";
import { auditMutation } from "@/lib/backend/audit";
import { listUi, toAccountRows } from "@/lib/backend/views";
import {
  createAccount,
  createContact,
  createDeal,
  createRecord,
  listResource,
  resolveResource,
} from "@/lib/backend/store";
import { createTravel, listTravel } from "@/lib/backend/travel-db";

export const dynamic = "force-dynamic";

function persistError(error: unknown) {
  const message = error instanceof Error ? error.message : "Supabase indisponible";
  return NextResponse.json({ error: message }, { status: 502 });
}

type RouteContext = {
  params: Promise<{ resource: string }>;
};

function isAccounts(raw: string) {
  return raw === "accounts" || raw === "clients";
}

export async function GET(_request: Request, context: RouteContext) {
  const { resource: raw } = await context.params;
  if (isAccounts(raw)) {
    return NextResponse.json({
      resource: "accounts",
      data: toAccountRows(),
    });
  }
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  if (resource === "travel") {
    try {
      const persisted = await listTravel();
      if (persisted) {
        return NextResponse.json({
          resource,
          source: "supabase",
          data: listUi(resource),
          records: persisted,
        });
      }
    } catch (error) {
      return persistError(error);
    }
  }

  return NextResponse.json({
    resource,
    data: listUi(resource),
    records: listResource(resource),
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { resource: raw } = await context.params;
  const payload = (await request.json()) as Record<string, unknown>;
  if (isAccounts(raw)) {
    const record = createAccount(payload);
    await auditMutation(request, "create", "accounts", record);
    return NextResponse.json({ resource: "accounts", data: record }, { status: 201 });
  }
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  if (resource === "travel") {
    try {
      const persisted = await createTravel(payload);
      if (persisted) {
        await auditMutation(request, "create", resource, persisted);
        return NextResponse.json({ resource, source: "supabase", data: persisted }, { status: 201 });
      }
    } catch (error) {
      return persistError(error);
    }
  }

  if (resource === "deals") {
    const record = createDeal(payload);
    await auditMutation(request, "create", resource, record);
    return NextResponse.json({ resource, data: record }, { status: 201 });
  }

  if (resource === "contacts") {
    const record = createContact(payload);
    await auditMutation(request, "create", resource, record);
    return NextResponse.json({ resource, data: record }, { status: 201 });
  }

  const record = createRecord(resource, payload);
  await auditMutation(request, "create", resource, record);
  return NextResponse.json({ resource, data: record }, { status: 201 });
}
