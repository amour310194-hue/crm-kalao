"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import GeneralSettingsNav from "./generalSettingsNav";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { authJsonHeaders } from "@/lib/auth-headers";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  collectMfaFactors,
  explainMfaError,
  factorKind,
  MFA_METHOD_LABEL,
  type MfaFactor,
  type MfaKind,
} from "@/lib/mfa-methods";

type Factor = MfaFactor;
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

function formatWhen(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return value;
  }
}

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
  const [nextPassword, setNextPassword] = useState("");
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
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        const listed = await supabase.auth.mfa.listFactors();
        const packed = listed.data as {
          totp?: Factor[];
          phone?: Factor[];
          webauthn?: Factor[];
          all?: Factor[];
        };
        setFactors(collectMfaFactors(packed ?? {}));
        const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        setAal(level.data?.currentLevel ?? null);
      }

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
        body: JSON.stringify({ current, next: nextPassword }),
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
      setNextPassword("");
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

  const unenroll = async (factorId: string) => {
    setBusy(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
      if (unenrollError) throw new Error(explainMfaError(unenrollError.message));
      setOk("Méthode retirée.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const methodStatus = (kind: MfaKind) => {
    const on = factors.some((f) => factorKind(f) === kind && f.status === "verified");
    return on ? "configurée" : "non configurée";
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader title="Paramètres" badgeCount={false} showModuleTile={false} showExport={false} />
          <SettingsTopbar />
          <div className="row">
            <div className="col-xl-3 col-lg-12 theiaStickySidebar">
              <GeneralSettingsNav />
            </div>
            <div className="col-xl-9 col-lg-12">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {ok ? <div className="alert alert-success">{ok}</div> : null}

              <div className="card mb-3">
                <div className="card-body">
                  <div className="border-bottom mb-3 pb-3">
                    <h5 className="mb-0 fs-17">Sécurité</h5>
                  </div>
                  <h6 className="mb-3">Mot de passe</h6>
                  <p className="text-muted">
                    Compte : {email ?? "—"}. Dernier changement : {formatWhen(passwordChangedAt)}
                  </p>
                  <form onSubmit={(e) => void changePassword(e)} className="row g-3">
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
                        value={nextPassword}
                        onChange={(e) => setNextPassword(e.target.value)}
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
                  <h5 className="mb-2">Méthodes d’authentification</h5>
                  <p className="text-muted small">
                    Plusieurs méthodes peuvent être liées. Le statut vient d’Auth, jamais d’un badge « Connected ».
                    {aal ? ` Session actuelle : ${aal}.` : null}
                  </p>
                  <div className="table-responsive">
                    <table className="table mb-3">
                      <thead>
                        <tr>
                          <th>Méthode</th>
                          <th>Statut</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {(["totp", "email"] as const).map((kind) => {
                          const factor =
                            kind === "totp"
                              ? factors.find((f) => factorKind(f) === "totp" && f.status === "verified")
                              : null;
                          return (
                            <tr key={kind}>
                              <td>{MFA_METHOD_LABEL[kind]}</td>
                              <td>
                                {kind === "email"
                                  ? "Code envoyé à l’e-mail du compte"
                                  : methodStatus(kind)}
                              </td>
                              <td className="text-end">
                                <Link href={`/mfa-setup?method=${kind}`} className="btn btn-sm btn-outline-primary me-1">
                                  {factor ? "Vérifier" : "Configurer"}
                                </Link>
                                {factor ? (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={busy}
                                    onClick={() => void unenroll(factor.id)}
                                  >
                                    Retirer
                                  </button>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
                    <p className="text-muted mb-0">
                      Aucune autre session listée (appareil actuel uniquement côté navigateur).
                    </p>
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
                              <td>{formatWhen(row.updated_at || row.created_at)}</td>
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
                    <p className="text-muted mb-0">
                      Aucun accès enregistré pour l’instant. Les prochaines tentatives (réussies ou non) apparaîtront
                      ici.
                    </p>
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
                              <td>{formatWhen(row.created_at)}</td>
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
    </>
  );
}
