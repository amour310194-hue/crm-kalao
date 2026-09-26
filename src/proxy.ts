import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicPath, SESSION_IDLE_SECONDS, SESSION_MAX_SECONDS } from "@/lib/authz";

const LAST_SEEN = "kalao_last_seen";

const HOME_ALIASES = ["/deals-dashboard"];

/** Ancienne page de lecture du template : la messagerie ouvre les mails elle-même. */
const MAIL_ALIASES = ["/application/email-reply"];

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

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (HOME_ALIASES.some((prefix) => matches(path, prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (MAIL_ALIASES.some((prefix) => matches(path, prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/application/email";
    return NextResponse.redirect(url);
  }
  if (BLOCKED.some((prefix) => matches(path, prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/error-404";
    return NextResponse.redirect(url);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  let response = NextResponse.next({ request });
  if (!url || !anon) return response;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(path)) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (user) {
    const now = Date.now();
    const last = Number(request.cookies.get(LAST_SEEN)?.value ?? "0");
    if (last > 0 && now - last > SESSION_IDLE_SECONDS * 1000) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("idle", "1");
      const expired = NextResponse.redirect(login);
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-") || cookie.name === LAST_SEEN) {
          expired.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
        }
      });
      return expired;
    }
    response.cookies.set(LAST_SEEN, String(now), {
      maxAge: SESSION_MAX_SECONDS,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|icon\\.png|apple-icon\\.png|icon$|apple-icon$|assets|uploads|api/).*)"],
};
