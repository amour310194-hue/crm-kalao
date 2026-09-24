"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { canCreateStaffAccount } from "@/lib/authz";

type Person = { id: string; name: string; email: string };
type BoxAccess = { open: boolean; profileIds: string[] };

const BOXES: { key: "contact" | "noreply"; label: string }[] = [
  { key: "contact", label: "Contact (partagée)" },
  { key: "noreply", label: "No-reply (partagée)" },
];

export default function KalaoMailboxAccess() {
  const [allowed, setAllowed] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [draft, setDraft] = useState<Record<"contact" | "noreply", BoxAccess> | null>(null);
  const [busy, setBusy] = useState<"contact" | "noreply" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (!canCreateStaffAccount(profile?.role)) {
      setAllowed(false);
      return;
    }
    setAllowed(true);
    const [{ data: staff }, { data: acl }, { data: settings }] = await Promise.all([
      supabase
        .from("employees")
        .select("full_name, email, profile_id")
        .not("profile_id", "is", null)
        .order("full_name"),
      supabase.from("crm_mailbox_acl").select("mailbox, profile_id"),
      supabase.from("crm_mailbox_settings").select("mailbox, restricted"),
    ]);
    setPeople(
      (staff ?? []).map((row) => ({
        id: String(row.profile_id),
        name: String(row.full_name ?? row.email ?? "Employé"),
        email: String(row.email ?? ""),
      }))
    );
    setDraft({
      contact: {
        open: !settings?.find((row) => row.mailbox === "contact")?.restricted,
        profileIds: (acl ?? []).filter((row) => row.mailbox === "contact").map((row) => String(row.profile_id)),
      },
      noreply: {
        open: !settings?.find((row) => row.mailbox === "noreply")?.restricted,
        profileIds: (acl ?? []).filter((row) => row.mailbox === "noreply").map((row) => String(row.profile_id)),
      },
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!allowed || !draft) return null;

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
                    {people.map((person) => {
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
                            {person.name} <span className="text-muted">{person.email}</span>
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
                      const supabase = getSupabaseBrowserClient();
                      const { error: settingErr } = await supabase
                        .from("crm_mailbox_settings")
                        .upsert({ mailbox: box.key, restricted: !access.open });
                      if (settingErr) throw new Error(settingErr.message);
                      await supabase.from("crm_mailbox_acl").delete().eq("mailbox", box.key);
                      if (!access.open && access.profileIds.length) {
                        const { error } = await supabase.from("crm_mailbox_acl").insert(
                          access.profileIds.map((profile_id) => ({ mailbox: box.key, profile_id }))
                        );
                        if (error) throw new Error(error.message);
                      }
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
