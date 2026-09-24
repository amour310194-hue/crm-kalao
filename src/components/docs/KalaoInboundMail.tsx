"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { KALAO_INBOUND_RESEND } from "@/lib/org";

type Forward = { from: string; to: string; box: string };

type SetupPayload = {
  ok?: boolean;
  reason?: string;
  endpoint?: string;
  receiving?: string;
  webhook?: { id?: string; status?: string } | null;
  forwards?: Forward[];
};

async function authHeaders() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    const next = refreshed.session?.access_token;
    if (!next) throw new Error("Session expirée");
    return { Authorization: `Bearer ${next}`, "Content-Type": "application/json" };
  }
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function KalaoInboundMail() {
  const [setup, setSetup] = useState<SetupPayload | null>(null);
  const [busy, setBusy] = useState<"hook" | "sync" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const res = await fetch("/api/email/inbound/setup", { headers });
      const json = (await res.json()) as SetupPayload;
      if (res.ok) setSetup(json);
    } catch {
      setSetup(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!setup?.ok && !msg) {
    return (
      <div className="border rounded shadow p-3 mb-3">
        <h6 className="fs-14 fw-medium mb-1">Réception des mails pro</h6>
        <p className="mb-2 text-muted fs-13">
          Endpoint : <code>https://crm.groupe-kalao.com/api/email/inbound</code>. Dans N0C, rediriger
          chaque adresse @groupe-kalao.com vers le même local-part@{KALAO_INBOUND_RESEND}.
        </p>
        <button type="button" className="btn btn-light btn-sm" onClick={() => void load()}>
          Recharger le statut webhook
        </button>
      </div>
    );
  }

  if (!setup?.ok) return null;

  const connected = Boolean(setup.webhook?.id);

  return (
    <div className="border rounded shadow p-3 mb-3">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <h6 className="fs-14 fw-medium mb-1">Réception des mails pro</h6>
          <p className="mb-0 text-muted fs-13">
            Resend Receiving ({setup.receiving || KALAO_INBOUND_RESEND}) pousse chaque mail vers{" "}
            <code>{setup.endpoint}</code>. Dans N0C, garder le MX racine et créer une redirection
            vers l’alias ci-dessous (copie conservée si N0C le permet).
          </p>
        </div>
        <span className={`badge ${connected ? "badge-soft-success" : "badge-soft-warning"}`}>
          {connected ? "Webhook actif" : "Webhook à activer"}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={busy !== null || connected}
          onClick={async () => {
            setBusy("hook");
            setMsg(null);
            try {
              const headers = await authHeaders();
              const res = await fetch("/api/email/inbound/setup", { method: "POST", headers });
              const json = (await res.json()) as { ok?: boolean; reason?: string };
              if (!res.ok || !json.ok) throw new Error(json.reason || "Webhook impossible");
              setMsg(json.reason === "exists" ? "Webhook déjà en place." : "Webhook Resend créé.");
              await load();
            } catch (err) {
              setMsg(err instanceof Error ? err.message : "Échec webhook");
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "hook" ? "Activation…" : connected ? "Webhook en place" : "Activer le webhook Resend"}
        </button>
        <button
          type="button"
          className="btn btn-light btn-sm"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("sync");
            setMsg(null);
            try {
              const headers = await authHeaders();
              const res = await fetch("/api/email/inbound/sync", { method: "POST", headers });
              const json = (await res.json()) as { ok?: boolean; count?: number; reason?: string };
              if (!res.ok || !json.ok) throw new Error(json.reason || "Sync impossible");
              setMsg(`${json.count ?? 0} message(s) Resend relus.`);
            } catch (err) {
              setMsg(err instanceof Error ? err.message : "Échec sync");
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "sync" ? "Import…" : "Importer les mails reçus"}
        </button>
      </div>
      {msg ? <p className="fs-13 mb-2">{msg}</p> : null}
      <div className="table-responsive">
        <table className="table table-sm mb-0">
          <thead>
            <tr>
              <th>Boîte CRM</th>
              <th>Adresse N0C (source)</th>
              <th>Redirection Resend</th>
            </tr>
          </thead>
          <tbody>
            {(setup.forwards ?? []).map((row) => (
              <tr key={row.from}>
                <td>{row.box}</td>
                <td>
                  <code>{row.from}</code>
                </td>
                <td>
                  <code>{row.to}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
