import { NextResponse } from "next/server";
import { listUi, toAccountRows } from "@/lib/backend/views";
import {
  createRecord,
  listResource,
  resolveResource,
} from "@/lib/backend/store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { resource: raw } = await context.params;
  if (raw === "accounts" || raw === "clients") {
    return NextResponse.json({
      resource: "accounts",
      data: toAccountRows(),
    });
  }
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  return NextResponse.json({
    resource,
    data: listUi(resource),
    records: listResource(resource),
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { resource: raw } = await context.params;
  const resource = resolveResource(raw);
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const record = createRecord(resource, payload);
  return NextResponse.json({ resource, data: record }, { status: 201 });
}
