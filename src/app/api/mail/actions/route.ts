import { NextRequest } from "next/server";
import { getMailContext, jsonError, readJson, visibleThreadMessages } from "@/lib/mail/server/context";
import { applyAction, parseAction } from "@/lib/mail/server/actions";

/**
 * Actions groupées. Corps : { ids?: string[], threadIds?: string[], action, ... }.
 * threadIds applique l'action à tous les messages visibles des fils (comportement Gmail).
 */
export async function POST(request: NextRequest) {
  try {
    const ctx = await getMailContext(request);
    const body = await readJson<Record<string, unknown>>(request);
    const action = parseAction(body);
    const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
    const threadIds = Array.isArray(body.threadIds) ? body.threadIds.map(String) : [];
    let target = ids;
    if (threadIds.length) {
      const rows = await visibleThreadMessages<{ id: string }>(ctx, threadIds, "id");
      target = [...ids, ...rows.map((r) => r.id)];
    }
    const count = await applyAction(ctx, target, action);
    return Response.json({ ok: true, count });
  } catch (err) {
    return jsonError(err);
  }
}
