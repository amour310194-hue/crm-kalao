"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { authJsonHeaders } from "@/lib/auth-headers";
import { formatDate } from "@/lib/crm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Factor = { id: string; status: string; factor_type: string; friendly_name?: string };
type SessionRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  aal?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  tag?: string | null;
};
type LoginRow = {
  id: string;
  success: boolean;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  token?: string | null;
};

export default function SecuritySettingsComponent() {
  const [email, setEmail] = useState<string | null>(null);
  const [passwordChangedAt, setPasswordChangedAt] = useState<string | null>(null);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [aal, setAal] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [events, setEvents] = useState<LoginRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      try {
        setMine(sessionStorage.getItem("kalao_cxn_token"));
      } catch {
        setMine(null);
      }
      const supabase = getSupabaseBrowserClient();
      const listed = await supabase.auth.mfa.listFactors();
      setFactors([...(listed.data?.totp ?? []), ...(listed.data?.phone ?? [])] as Factor[]);
      const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setAal(level.data?.currentLevel ?? null);

      const res = await fetch("/api/settings/security", { headers: await authJsonHeaders() });
      const text = await res.text();
      let json: {
        ok?: boolean;
        email?: string;
        passwordChangedAt?: string;
        sessions?: SessionRow[];
        loginEvents?: LoginRow[];
      } = {};
      try {
        json = text ? (JSON.parse(text) as typeof json) : {};
      } catch {
        setError("Chargement impossible. Réessayez.");
        return;
      }
      if (!res.ok || !json.ok) {
        setError("Chargement impossible. Réessayez.");
        return;
      }
      setEmail(json.email ?? null);
      setPasswordChangedAt(json.passwordChangedAt ?? null);
      setSessions(json.sessions ?? []);
      setEvents(json.loginEvents ?? []);
    } catch (err) {
      console.error("security load", err);
      setError("Chargement partiel. La page reste utilisable.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: await authJsonHeaders(),
        body: JSON.stringify({ current, next }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (!res.ok || !json.ok) {
        const map: Record<string, string> = {
          actuel: "Mot de passe actuel incorrect.",
          faible: "Le nouveau mot de passe doit faire au moins 10 caractères.",
        };
        throw new Error(map[json.reason ?? ""] ?? "Impossible de changer le mot de passe.");
      }
      setCurrent("");
      setNext("");
      setOk("Mot de passe mis à jour.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const sessionAction = async (action: string, sessionId?: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/security", {
        method: "POST",
        headers: await authJsonHeaders(),
        body: JSON.stringify({ action, sessionId }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("Action refusée.");
      if (action === "signout_all") {
        window.location.href = all_routes.login;
        return;
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const totpVerified = factors.some((f) => f.factor_type === "totp" && f.status === "verified");

  return (
    <div className="page-wrapper">
      <div className="content">
        <PageHeader title="Sécurité" badgeCount={false} showModuleTile={false} showExport={false} />
        <SettingsTopbar />
        <div className="row">
          <div className="col-xl-3 col-lg-12 theiaStickySidebar">
            <div className="card mb-3 mb-xl-0">
              <div className="card-body">
                <h5 className="mb-3 fs-17">Paramètres généraux</h5>
                <div className="list-group list-group-flush">
                  <Link href={all_routes.profile} className="d-block p-2 fw-medium">
                    Profil
                  </Link>
                  <Link href={all_routes.security} className="d-block p-2 fw-medium active">
                    Sécurité
                  </Link>
                  <Link href={all_routes.notification} className="d-block p-2 fw-medium">
                    Notifications
                  </Link>
                  <Link href={all_routes.connectedApps} className="d-block p-2 fw-medium">
                    Canaux et clés API
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-12">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {ok ? <div className="alert alert-success">{ok}</div> : null}

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="mb-3">Mot de passe</h5>
                <p className="text-muted">
                  Compte : {email ?? "—"}. Dernier changement : {formatDate(passwordChangedAt)}
                </p>
                <form onSubmit={changePassword} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="form-control"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      autoComplete="new-password"
                      minLength={10}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                      Enregistrer le mot de passe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="mb-3">Double authentification (TOTP)</h5>
                <p className="mb-2">
                  Statut :{" "}
                  <strong>{totpVerified ? "configurée" : "non configurée"}</strong>
                  {aal ? ` — session ${aal}` : null}
                </p>
                <p className="small text-muted">
                  Le statut vient de votre compte Auth (facteurs TOTP). Supabase ne fournit pas de codes de
                  secours : enregistrez un second appareil authenticator si besoin.
                </p>
                <Link href="/mfa-setup" className="btn btn-outline-primary">
                  {totpVerified ? "Gérer / vérifier le TOTP" : "Configurer le TOTP"}
                </Link>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Sessions actives</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    disabled={busy}
                    onClick={() => void sessionAction("signout_all")}
                  >
                    Déconnecter partout
                  </button>
                </div>
                {sessions.length === 0 ? (
                  <p className="text-muted mb-0">Aucune autre session listée (appareil actuel uniquement côté navigateur).</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Appareil</th>
                          <th>Jeton</th>
                          <th>IP</th>
                          <th>Niveau</th>
                          <th>Vu</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((row) => (
                          <tr key={row.id}>
                            <td className="small">{row.user_agent || "—"}</td>
                            <td>
                              <code>{row.tag || "—"}</code>
                              {mine && row.tag === mine ? (
                                <span className="badge badge-soft-info ms-1">cet appareil</span>
                              ) : null}
                            </td>
                            <td>{row.ip || "—"}</td>
                            <td>{row.aal || "—"}</td>
                            <td>{formatDate(row.updated_at || row.created_at)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => void sessionAction("signout_session", row.id)}
                              >
                                Déconnecter cet appareil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-0">
              <div className="card-body">
                <h5 className="mb-3">Historique de connexion (30 derniers)</h5>
                {mine ? (
                  <p className="small text-muted">
                    Jeton de cette connexion : <code>{mine}</code>
                  </p>
                ) : null}
                {events.length === 0 ? (
                  <p className="text-muted mb-0">Aucun accès enregistré pour l’instant. Les prochaines tentatives (réussies ou non) apparaîtront ici.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Jeton</th>
                          <th>Résultat</th>
                          <th>IP</th>
                          <th>Appareil</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((row) => (
                          <tr key={row.id}>
                            <td>{formatDate(row.created_at)}</td>
                            <td>
                              <code>{row.token || "—"}</code>
                              {mine && row.token === mine ? (
                                <span className="badge badge-soft-info ms-1">cet appareil</span>
                              ) : null}
                            </td>
                            <td>{row.success ? "Réussi" : "Échec"}</td>
                            <td>{row.ip || "—"}</td>
                            <td className="small">{row.user_agent || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
