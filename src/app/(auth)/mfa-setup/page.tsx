"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { all_routes } from "@/router/all_routes";
import { totpQrSrc } from "@/lib/totp-qr";

export default function MfaSetupPage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [aal, setAal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const listed = await supabase.auth.mfa.listFactors();
      const verified = (listed.data?.totp ?? []).filter((f) => f.status === "verified");
      setHasVerified(verified.length > 0);
      if (verified[0] && !factorId) setFactorId(verified[0].id);
      const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setAal(level.data?.currentLevel ?? null);
    } catch (err) {
      console.error("mfa refresh", err);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- premier chargement uniquement
  }, []);

  const enroll = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "CRM Kalao",
      });
      if (error || !data) {
        setMsg("Impossible de générer le QR. Réessayez.");
        return;
      }
      setFactorId(data.id);
      setQr(totpQrSrc(data.totp.qr_code));
      setSecret(data.totp.secret);
    } catch (err) {
      console.error(err);
      setMsg("Impossible de générer le QR. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!factorId || code.trim().length < 6) return;
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setMsg("Code refusé. Réessayez.");
        return;
      }
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      });
      if (error) {
        setMsg("Code incorrect.");
        return;
      }
      setOk(true);
      setMsg("Double authentification activée.");
      await supabase.auth.refreshSession();
      window.setTimeout(() => router.replace(all_routes.dashboard), 700);
    } catch (err) {
      console.error(err);
      setMsg("Vérification impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  const copySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setMsg("Copie impossible. Saisissez la clé manuellement.");
    }
  };

  const step = qr ? 2 : hasVerified ? 2 : 1;
  const qrSrc = qr ?? null;

  return (
    <div className="kalao-mfa p-3">
      <div className="row g-3 min-vh-100 align-items-stretch">
        <div className="col-lg-6">
            <div className="kalao-mfa-shell h-100 d-flex flex-column justify-content-center p-3 p-md-4">
            <div className="kalao-mfa-card mx-auto w-100" style={{ maxWidth: 440 }}>
              <div className="text-center auth-logo mb-3">
                <ImageWithBasePath src="assets/img/kalao-logo.png" className="img-fluid" alt="Groupe Kalao" />
              </div>
              <div className="kalao-mfa-steps" aria-hidden>
                <span className={`kalao-mfa-step${step >= 1 ? " is-on" : ""}`} />
                <span className={`kalao-mfa-step${step >= 2 ? " is-on" : ""}`} />
                <span className={`kalao-mfa-step${ok ? " is-on" : ""}`} />
              </div>

              <p className="text-uppercase small fw-semibold mb-1" style={{ color: "#e8a317", letterSpacing: "0.08em" }}>
                Sécurité du compte
              </p>
              <h1 className="h3 mb-2">Authentification à deux facteurs</h1>
              <p className="text-muted mb-4">
                Scannez le QR avec Google Authenticator, Authy ou Microsoft Authenticator, puis saisissez le code à 6
                chiffres. Obligatoire pour super-admin, admin, direction, finance et RH.
              </p>

              {!ready ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: "#164b5a" }} role="status">
                    <span className="visually-hidden">Chargement</span>
                  </div>
                </div>
              ) : null}

              {ready && !qrSrc && !hasVerified ? (
                <button type="button" className="btn btn-kalao-gold w-100 py-2" disabled={busy} onClick={() => void enroll()}>
                  {busy ? "Préparation du QR…" : "Afficher le QR"}
                </button>
              ) : null}

              {qrSrc ? (
                <form onSubmit={(e) => void verify(e)}>
                  <div className="kalao-mfa-qr-wrap">
                    <img src={qrSrc} alt="QR code TOTP Kalao" />
                  </div>
                  {secret ? (
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3 p-2 rounded-3" style={{ background: "#f4f8f9" }}>
                      <div className="small text-break mb-0">
                        <span className="text-muted d-block">Clé manuelle</span>
                        <code>{secret}</code>
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => void copySecret()}>
                        {copied ? "Copié" : "Copier"}
                      </button>
                    </div>
                  ) : null}
                  <label className="form-label" htmlFor="mfa-code">
                    Code à 6 chiffres
                  </label>
                  <input
                    id="mfa-code"
                    className="form-control kalao-otp mb-3"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    placeholder="••••••"
                  />
                  <button type="submit" className="btn btn-kalao-gold w-100 py-2" disabled={busy || code.length < 6}>
                    {busy ? "Vérification…" : ok ? "Accès ouvert" : "Valider et entrer"}
                  </button>
                </form>
              ) : null}

              {ready && hasVerified && !qrSrc ? (
                <form onSubmit={(e) => void verify(e)}>
                  <p className="small text-muted">Un authenticator est déjà lié. Entrez un code pour ouvrir cette session.</p>
                  <label className="form-label" htmlFor="mfa-code-existing">
                    Code à 6 chiffres
                  </label>
                  <input
                    id="mfa-code-existing"
                    className="form-control kalao-otp mb-3"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    placeholder="••••••"
                  />
                  <button type="submit" className="btn btn-kalao-gold w-100 py-2" disabled={busy || code.length < 6}>
                    {busy ? "Vérification…" : "Valider le code"}
                  </button>
                </form>
              ) : null}

              {msg ? (
                <p className={`mt-3 mb-0 small ${ok ? "text-success" : "text-danger"}`} role="status">
                  {msg}
                </p>
              ) : null}

              <p className="mt-4 mb-0 small">
                <Link href={all_routes.security} className="text-decoration-none" style={{ color: "#164b5a" }}>
                  Paramètres → Sécurité
                </Link>
                {aal ? <span className="text-muted"> · session {aal}</span> : null}
              </p>
            </div>
            </div>
        </div>

        <div className="col-lg-6 d-none d-lg-block">
          <div className="kalao-mfa-side h-100">
            <span className="kalao-mfa-orb is-gold" />
            <span className="kalao-mfa-orb is-teal" />
            <div className="kalao-mfa-side-copy">
              <div className="kalao-mfa-goldbar" />
              <h2 className="h3 mb-3">Protégez l’accès au CRM</h2>
              <ol className="ps-3 mb-0" style={{ lineHeight: 1.7 }}>
                <li>Ouvrez votre application authenticator.</li>
                <li>Scannez le QR ou saisissez la clé manuelle.</li>
                <li>Entrez le code à 6 chiffres pour continuer.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
