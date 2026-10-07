import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { canEditOrgSettings } from "@/lib/authz";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  parsePipelineMap,
  PIPELINE_DEFAULTS,
  sanitizePipelineSteps,
  type PipelineSlug,
} from "@/lib/pipeline-config";
import type { PipelineStep } from "@/lib/visa-pipeline";

const KEY = "procedure_pipelines";

async function loadMap() {
  const admin = getServiceSupabase();
  const { data } = await admin.from("org_settings").select("value").eq("key", KEY).maybeSingle();
  return parsePipelineMap(data?.value);
}

export async function GET(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
  try {
    const pipelines = await loadMap();
    return NextResponse.json({
      ok: true,
      pipelines,
      canEdit: canEditOrgSettings(authed.role),
    });
  } catch (err) {
    console.error("pipelines GET", err);
    return NextResponse.json({
      ok: true,
      pipelines: PIPELINE_DEFAULTS,
      canEdit: canEditOrgSettings(authed.role),
    });
  }
}

export async function PUT(request: NextRequest) {
  const authed = await requireUser(request);
  if (!authed) return NextResponse.json({ ok: false, reason: "auth" }, { status: 401 });
  if (!canEditOrgSettings(authed.role)) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }
  let payload: { slug?: string; steps?: PipelineStep[] } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ ok: false, reason: "payload" }, { status: 400 });
  }
  const slug = payload.slug as PipelineSlug | undefined;
  if (!slug || !(slug in PIPELINE_DEFAULTS)) {
    return NextResponse.json({ ok: false, reason: "slug" }, { status: 400 });
  }
  if (!Array.isArray(payload.steps) || payload.steps.length < 2) {
    return NextResponse.json(
      { ok: false, reason: "steps", message: "Au moins deux étapes, dont Clôturé." },
      { status: 400 }
    );
  }
  const next = await loadMap();
  next[slug] = sanitizePipelineSteps(payload.steps);
  const admin = getServiceSupabase();
  const { error } = await admin.from("org_settings").upsert({
    key: KEY,
    value: next,
    updated_at: new Date().toISOString(),
    updated_by: authed.user.id,
  });
  if (error) {
    console.error("pipelines PUT", error.message);
    return NextResponse.json({ ok: false, reason: "save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pipelines: next });
}
