"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { canInviteStaff } from "@/lib/roles";

type Props = {
  employeeId: string;
  hasAccount?: boolean;
  onDone?: () => void;
};

export default function KalaoStaffAccounts({ employeeId, hasAccount, onDone }: Props) {
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    void canInviteStaff().then(setAllowed);
  }, []);

  if (!allowed || hasAccount) return null;

  return (
    <div className="d-flex flex-column gap-1">
      <button
        type="button"
        className="btn btn-sm btn-outline-dark"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMsg(null);
          try {
            const supabase = getSupabaseBrowserClient();
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (!token) throw new Error("Session expirée");
            const res = await fetch("/api/staff/create-account", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ employeeId, role: "staff" }),
            });
            const json = (await res.json()) as { ok?: boolean; reason?: string; email?: string };
            if (!res.ok || !json.ok) throw new Error(json.reason || "Création impossible");
            setMsg(`Compte créé. Un e-mail no-reply a été envoyé${json.email ? ` à ${json.email}` : ""}.`);
            onDone?.();
          } catch (err) {
            setMsg(err instanceof Error ? err.message : "Erreur");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Création…" : "Créer le compte CRM"}
      </button>
      {msg ? <span className="text-muted">{msg}</span> : null}
    </div>
  );
}
