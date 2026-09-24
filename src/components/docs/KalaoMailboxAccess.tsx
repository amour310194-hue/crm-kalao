"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Person = { id: string; name: string; email: string; role: string };
type BoxAccess = { open: boolean; profileIds: string[] };

type Payload = {
  ok?: boolean;
  people?: Person[];
  access?: { contact: BoxAccess; noreply: BoxAccess };
};

const BOXES: { key: "contact" | "noreply"; label: string }[] = [
  { key: "contact", label: "Contact (partagée)" },
  { key: "noreply", label: "No-reply (partagée)" },
];

async function authHeaders() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  let token = data.session?.access_token;
  if (!token) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    token = refreshed.session?.access_token;
  }
  if (!token) throw new Error("Session expirée");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function KalaoMailboxAccess() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [draft, setDraft] = useState<Record<"contact" | "noreply", BoxAccess> | null>(null);
  const [busy, setBusy] = useState<"contact" | "noreply" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const res = await fetch("/api/email/mailbox-access", { headers });
      const json = (await res.json()) as Payload;
      if (!res.ok || !json.ok) {
        setPayload(null);
        return;
      }
      setPayload(json);
      setDraft(json.access ?? null);
    } catch {
      setPayload(null);
    }
  }, []);

  useEffect(() => {
    void load();
    const retry = window.setTimeout(() => {
      void load();
    }, 800);
    return () => window.clearTimeout(retry);
  }, [load]);

  if (!payload?.ok || !draft) {
    return (
      <div className="border rounded shadow p-3 mb-3">
        <h6 className="fs-14 fw-medium mb-1">Accès aux boîtes partagées</h6>
        <p className="text-muted fs-13 mb-2">
          Choisissez qui peut ouvrir Contact et No-reply. Un admin, un manager ou un RH peut toujours y
          accéder.
        </p>
        <button type="button" className="btn btn-light btn-sm" onClick={() => void load()}>
          Charger les accès
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded shadow p-3 mb-3">
      <h6 className="fs-14 fw-medium mb-1">Accès aux boîtes partagées</h6>
      <p className="text-muted fs-13 mb-3">
        Choisissez qui peut ouvrir Contact et No-reply. « Tout le personnel » laisse la boîte ouverte.
        Un admin, un manager ou un RH peut toujours y accéder.
      </p>
      <div className="row g-3">
        {BOXES.map((box) => {
          const access = draft[box.key];
          return (
            <div key={box.key} className="col-md-6">
              <div className="border rounded p-2 h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <strong className="fs-13">{box.label}</strong>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={access.open}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev
                            ? {
                                ...prev,
                                [box.key]: { ...prev[box.key], open: e.target.checked },
                              }
                            : prev
                        )
                      }
                    />
                    <label className="form-check-label fs-12">Tout le personnel</label>
                  </div>
                </div>
                {!access.open ? (
                  <div className="d-flex flex-column gap-1 mb-2" style={{ maxHeight: 220, overflow: "auto" }}>
                    {(payload.people ?? []).map((person) => {
                      const checked = access.profileIds.includes(person.id);
                      return (
                        <label key={person.id} className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const ids = new Set(prev[box.key].profileIds);
                                if (e.target.checked) ids.add(person.id);
                                else ids.delete(person.id);
                                return {
                                  ...prev,
                                  [box.key]: { open: false, profileIds: [...ids] },
                                };
                              })
                            }
                          />
                          <span className="form-check-label fs-13">
                            {person.name}{" "}
                            <span className="text-muted">{person.email}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="fs-12 text-muted mb-2">Tous les comptes CRM voient cette boîte.</p>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-dark"
                  disabled={busy !== null}
                  onClick={async () => {
                    setBusy(box.key);
                    setMsg(null);
                    try {
                      const headers = await authHeaders();
                      const res = await fetch("/api/email/mailbox-access", {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                          mailbox: box.key,
                          open: access.open,
                          profileIds: access.profileIds,
                        }),
                      });
                      const json = (await res.json()) as { ok?: boolean; reason?: string };
                      if (!res.ok || !json.ok) throw new Error(json.reason || "Enregistrement impossible");
                      setMsg(`${box.label} : accès enregistré.`);
                      await load();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Échec");
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
                  {busy === box.key ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {msg ? <p className="fs-13 mb-0 mt-2">{msg}</p> : null}
    </div>
  );
}
