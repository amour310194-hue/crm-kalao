"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { all_routes } from "@/router/all_routes";
import { getLocalSession } from "@/lib/auth/session";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const allow = () => setReady(true);
    const deny = () => router.replace(all_routes.login);

    if (getLocalSession()) {
      allow();
      return;
    }

    if (!isSupabaseConfigured()) {
      deny();
      return;
    }

    const supabase = getSupabaseBrowserClient();

    const redirectIfUnauthenticated = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        deny();
        return;
      }
      allow();
    };

    void redirectIfUnauthenticated();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !getLocalSession()) {
        deny();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

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
