"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { all_routes } from "@/router/all_routes";
import { mfaEnforced } from "@/lib/authz";
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

    const redirectIfUnauthenticated = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(all_routes.login);
        return;
      }
      if (mfaEnforced()) {
        const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal.data?.currentLevel === "aal1" && aal.data?.nextLevel === "aal2") {
          router.replace("/mfa-setup");
          return;
        }
      }
      setReady(true);
    };

    void redirectIfUnauthenticated();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setReady(false);
        router.replace(all_routes.login);
      }
    });

    return () => {
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
