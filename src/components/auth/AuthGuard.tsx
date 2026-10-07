"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { all_routes } from "@/router/all_routes";
import { isMfaExemptPath, mustEnrollMfa } from "@/lib/authz";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    const redirectIfUnauthenticated = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          router.replace(all_routes.login);
          return;
        }
        const { data: userCheck } = await supabase.auth.getUser();
        if (!userCheck.user) {
          router.replace(all_routes.login);
          return;
        }
        setReady(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .maybeSingle();
        const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        const level = aal.data?.currentLevel ?? "aal1";
        let emailOk = false;
        try {
          const status = await fetch("/api/mfa/email/status", { credentials: "include" });
          const json = (await status.json()) as { ok?: boolean };
          emailOk = Boolean(json.ok);
        } catch {
          emailOk = false;
        }
        if (
          mustEnrollMfa(profile?.role ?? null, level, emailOk) &&
          !isMfaExemptPath(pathname)
        ) {
          router.replace("/mfa-setup");
        }
      } catch (err) {
        console.error("AuthGuard", err);
        setReady(true);
      }
    };

    const watchdog = window.setTimeout(() => setReady(true), 2500);
    void redirectIfUnauthenticated().finally(() => window.clearTimeout(watchdog));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setReady(false);
        router.replace(all_routes.login);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center px-3">
          <h4 className="mb-2">Connexion requise</h4>
          <p className="text-muted mb-0">
            Configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
            pour ouvrir le CRM Kalao.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement</span>
          </div>
          <p className="text-muted mb-0">Vérification de la session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
