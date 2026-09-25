import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Ancien accueil mis en favori : même écran que /dashboard. */
const HOME_ALIASES = ["/deals-dashboard"];

/** Routes template encore présentes sur disque : on les coupe plutôt que de les peaufiner. */
const BLOCKED = [
  "/ai-crm",
  "/automation",
  "/reports",
  "/super-admin",
  "/membership",
  "/content/",
  "/hrm/",
  "/crm-setting",
  "/ui-",
  "/icon-",
  "/layout-",
  "/sales-dashboard",
  "/leads-dashboard",
  "/project-dashboard",
  "/revenue-summary-dashboard",
  "/executive-dashboard",
  "/growth-dashboard",
  "/application/social-feed",
  "/application/kanban",
  "/application/video-call",
  "/application/audio-call",
  "/application/call-history",
  "/sales-crm/opportunities",
  "/sales-crm/sales-target",
  "/sales-crm/sales-order",
  "/crm/pipeline",
  "/crm/contracts",
  "/crm/campaign",
];

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(prefix);
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (HOME_ALIASES.some((prefix) => matches(path, prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (BLOCKED.some((prefix) => matches(path, prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/error-404";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|assets|uploads|api/).*)",
  ],
};
