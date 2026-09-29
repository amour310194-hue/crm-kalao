"use client";

import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { authJsonHeaders } from "@/lib/auth-headers";
import {
  INTEGRATION_PROVIDERS,
  providerStatusLabel,
  type ProviderStatus,
} from "@/lib/integrations";

type EmailStatus = { id: string; label: string; status: "serveur" | "absent" };

export default function ConnectedAppsComponent() {
  const [origin, setOrigin] = useState("");
  const [email, setEmail] = useState<EmailStatus | null>(null);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/settings/integrations", { headers: await authJsonHeaders() });
      const json = (await res.json()) as {
        ok?: boolean;
        reason?: string;
        origin?: string;
        email?: EmailStatus;
        providers?: ProviderStatus[];
      };
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (!res.ok || !json.ok) throw new Error(json.reason || "Chargement impossible");
      setOrigin(json.origin ?? window.location.origin);
      setEmail(json.email ?? null);
      setProviders(json.providers ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setDraft = (providerId: string, key: string, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [providerId]: { ...(prev[providerId] ?? {}), [key]: value },
    }));
  };

  const save = async (providerId: string, event: FormEvent) => {
    event.preventDefault();
    setBusy(providerId);
    setError(null);
    setOk(null);
    try {
      const catalog = INTEGRATION_PROVIDERS.find((item) => item.id === providerId);
      const status = providers.find((item) => item.id === providerId);
      const values: Record<string, string> = {};
      for (const field of catalog?.fields ?? []) {
        const typed = drafts[providerId]?.[field.key];
        if (field.secret) {
          if (typed && typed.trim()) values[field.key] = typed.trim();
        } else {
          values[field.key] = typed !== undefined ? typed : status?.fields.find((f) => f.key === field.key)?.publicValue ?? "";
        }
      }
      const res = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: await authJsonHeaders(),
        body: JSON.stringify({ provider: providerId, values }),
      });
      const json = (await res.json()) as { ok?: boolean; reason?: string };
      if (!res.ok || !json.ok) throw new Error(json.reason || "Enregistrement impossible");
      setDrafts((prev) => ({ ...prev, [providerId]: {} }));
      setOk("Enregistré. Les clés ne sont pas encore testées auprès des réseaux.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader title="Canaux et clés API" badgeCount={false} showModuleTile={false} showExport={false} />
          <SettingsTopbar />
          <div className="row">
            <div className="col-xl-3 col-lg-12 theiaStickySidebar">
              <div className="card mb-3 mb-xl-0">
                <div className="card-body">
                  <div className="settings-sidebar">
                    <h5 className="mb-3 fs-17">Paramètres généraux</h5>
                    <div className="list-group list-group-flush settings-sidebar">
                      <Link href={all_routes.profile} className="d-block p-2 fw-medium">
                        Profil
                      </Link>
                      <Link href={all_routes.security} className="d-block p-2 fw-medium">
                        Sécurité
                      </Link>
                      <Link href={all_routes.notification} className="d-block p-2 fw-medium">
                        Notifications
                      </Link>
                      <Link href={all_routes.connectedApps} className="d-block p-2 fw-medium active">
                        Canaux et clés API
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-12">
              {forbidden ? (
                <div className="alert alert-warning">Réservé à un administrateur ou à la direction.</div>
              ) : (
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="border-bottom mb-3 pb-3">
                      <h5 className="mb-1 fs-17">Canaux et clés API</h5>
                      <p className="text-muted mb-0">
                        Saisissez ici les identifiants. Rien n&apos;est marqué « connecté » tant qu&apos;une
                        vérification réelle n&apos;a pas été faite. Les secrets sont chiffrés côté serveur, jamais
                        renvoyés au navigateur.
                      </p>
                    </div>
                    {ok ? <div className="alert alert-success py-2">{ok}</div> : null}
                    {error ? <div className="alert alert-danger py-2">{error}</div> : null}

                    <div className="card border mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <h6 className="mb-1">E-mail (Resend)</h6>
                            <p className="text-muted small mb-0">
                              Déjà géré dans Paramètres système. La clé reste dans les variables d&apos;environnement
                              Vercel, pas dans ce formulaire.
                            </p>
                          </div>
                          <span
                            className={`badge ${email?.status === "serveur" ? "badge-soft-info" : "badge-soft-secondary"}`}
                          >
                            {email?.status === "serveur" ? "Clé présente sur le serveur" : "Clé Resend absente"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {INTEGRATION_PROVIDERS.map((catalog) => {
                      const status = providers.find((item) => item.id === catalog.id);
                      return (
                        <form key={catalog.id} className="card border mb-3" onSubmit={(e) => void save(catalog.id, e)}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                              <div>
                                <h6 className="mb-1">{catalog.label}</h6>
                                <p className="text-muted small mb-1">{catalog.summary}</p>
                                {catalog.webhookPath ? (
                                  <p className="small mb-0">
                                    Webhook à déclarer :{" "}
                                    <code>
                                      {origin}
                                      {catalog.webhookPath}
                                    </code>
                                  </p>
                                ) : null}
                              </div>
                              <span
                                className={`badge ${status?.status === "cles_enregistrees" ? "badge-soft-info" : "badge-soft-secondary"}`}
                              >
                                {status ? providerStatusLabel(status.status) : "Non configuré"}
                              </span>
                            </div>
                            <div className="row g-3">
                              {catalog.fields.map((field) => {
                                const live = status?.fields.find((item) => item.key === field.key);
                                const draft = drafts[catalog.id]?.[field.key];
                                return (
                                  <div className="col-md-6" key={field.key}>
                                    <label className="form-label">{field.label}</label>
                                    <input
                                      className="form-control"
                                      type={field.secret ? "password" : "text"}
                                      autoComplete="off"
                                      placeholder={
                                        field.secret && live?.last4
                                          ? `Enregistré (••••${live.last4}) — laisser vide pour conserver`
                                          : field.placeholder || ""
                                      }
                                      value={draft ?? (field.secret ? "" : live?.publicValue ?? "")}
                                      onChange={(e) => setDraft(catalog.id, field.key, e.target.value)}
                                    />
                                    {field.hint ? <div className="form-text">{field.hint}</div> : null}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 text-end">
                              <button type="submit" className="btn btn-primary" disabled={busy === catalog.id}>
                                {busy === catalog.id ? "Enregistrement…" : "Enregistrer"}
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
