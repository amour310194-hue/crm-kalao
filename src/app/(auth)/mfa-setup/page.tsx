"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { all_routes } from "@/router/all_routes";
import { totpQrSrc } from "@/lib/totp-qr";
import { authJsonHeaders } from "@/lib/auth-headers";
import KalaoOtpBoxes from "@/components/auth/KalaoOtpBoxes";
import {
  collectMfaFactors,
  explainMfaError,
  unverifiedFactors,
  verifiedFactors,
  type MfaFactor,
  type MfaKind,
} from "@/lib/mfa-methods";

type Screen = "choose" | "totp" | "email";

export default function MfaSetupPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("choose");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const verified = verifiedFactors(factors);

  const refresh = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace(all_routes.login);
        return;
      }
      setEmailHint(userData.user.email ?? null);
      const listed = await supabase.auth.mfa.listFactors();
      const packed = listed.data as { totp?: MfaFactor[]; all?: MfaFactor[] };
      const nextFactors = collectMfaFactors(packed ?? {});
      setFactors(nextFactors);
      const verifiedNext = verifiedFactors(nextFactors);
      if (!factorId && verifiedNext[0]) setFactorId(verifiedNext[0].id);
    } catch (err) {
      console.error("mfa refresh", err);
    } finally {
      setReady(true);
    }
  }, [factorId, router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const afterTotpVerified = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.refreshSession();
    let level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (level.data?.currentLevel !== "aal2") {
      await supabase.auth.refreshSession();
      level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    }
    if (level.data?.currentLevel !== "aal2") {
      setOk(false);
      setMsg("Le code est accepté mais la session n’est pas encore au niveau 2. Saisissez un nouveau code.");
      return false;
    }
    setOk(true);
    setMsg(null);
    window.setTimeout(() => router.replace(all_routes.dashboard), 700);
    return true;
  };

  const enrollTotp = async () => {
    setScreen("totp");
    setPreparing(true);
    setBusy(true);
    setMsg(null);
    setQr(null);
    setSecret(null);
    setCode("");
    try {
      const supabase = getSupabaseBrowserClient();
      const listed = await supabase.auth.mfa.listFactors();
      const packed = listed.data as { totp?: MfaFactor[]; all?: MfaFactor[] };
      const pending = unverifiedFactors(collectMfaFactors(packed ?? {})).filter(
        (factor) => factor.factor_type === "totp"
      );
      for (const factor of pending) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator Kalao ${Date.now().toString(36)}`,
      });
      if (error || !data || !("totp" in data) || !data.totp) {
        setMsg(explainMfaError(error?.message));
        setScreen("choose");
        return;
      }
      setFactorId(data.id);
      setQr(totpQrSrc(data.totp.qr_code));
      setSecret(data.totp.secret);
    } catch (err) {
      console.error(err);
      setMsg("Impossible de générer le QR.");
      setScreen("choose");
    } finally {
      setBusy(false);
      setPreparing(false);
    }
  };

  const challengeTotp = async (id: string) => {
    setScreen("totp");
    setPreparing(true);
    setBusy(true);
    setMsg(null);
    setQr(null);
    setFactorId(id);
    setCode("");
    try {
      const supabase = getSupabaseBrowserClient();
      const challenge = await supabase.auth.mfa.challenge({ factorId: id });
      if (challenge.error) {
        setMsg(explainMfaError(challenge.error.message));
        setScreen("choose");
        return;
      }
      setChallengeId(challenge.data.id);
    } catch (err) {
      console.error(err);
      setMsg(explainMfaError(undefined));
      setScreen("choose");
    } finally {
      setBusy(false);
      setPreparing(false);
    }
  };

  const sendEmailCode = async () => {
    setScreen("email");
    setPreparing(true);
    setBusy(true);
    setMsg(null);
    setCode("");
    try {
      const res = await fetch("/api/mfa/email/send", {
        method: "POST",
        headers: await authJsonHeaders(),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; to?: string };
      if (!res.ok || !json.ok) {
        setMsg(json.message || "Impossible d’envoyer le code e-mail.");
        setScreen("choose");
        return;
      }
      if (json.to) setEmailHint(json.to);
    } catch {
      setMsg("Impossible d’envoyer le code e-mail.");
      setScreen("choose");
    } finally {
      setBusy(false);
      setPreparing(false);
    }
  };

  const verifyTotp = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!factorId || code.trim().length < 6) return;
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      let cid = challengeId;
      if (!cid) {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
          setMsg(explainMfaError(challenge.error.message));
          return;
        }
        cid = challenge.data.id;
        setChallengeId(cid);
      }
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: cid,
        code: code.trim(),
      });
      if (error) {
        setMsg("Code incorrect.");
        return;
      }
      await refresh();
      await afterTotpVerified();
    } catch (err) {
      console.error(err);
      setMsg("Vérification impossible.");
    } finally {
      setBusy(false);
    }
  };

  const verifyEmail = async (event?: FormEvent) => {
    event?.preventDefault();
    if (code.trim().length < 6) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/mfa/email/verify", {
        method: "POST",
        headers: await authJsonHeaders(),
        body: JSON.stringify({ code: code.trim() }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setMsg(json.message || "Code incorrect ou expiré.");
        return;
      }
      setOk(true);
      window.setTimeout(() => router.replace(all_routes.dashboard), 700);
    } catch {
      setMsg("Vérification impossible.");
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
      setMsg("Copie impossible.");
    }
  };

  const backToChoose = () => {
    setScreen("choose");
    setQr(null);
    setSecret(null);
    setCode("");
    setChallengeId(null);
    setMsg(null);
    setPreparing(false);
  };

  const showChooser = ready && screen === "choose" && !ok;
  const step = ok ? 3 : screen === "choose" ? 1 : 2;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("method") as MfaKind | null;
    if (!ready || screen !== "choose") return;
    if (q === "totp") void enrollTotp();
    if (q === "email") void sendEmailCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className="kalao-mfa p-3">
      <div className="row g-3 min-vh-100 align-items-stretch">
        <div className="col-lg-6">
          <div className="kalao-mfa-shell h-100 d-flex flex-column justify-content-center p-3 p-md-4">
            <div className="kalao-mfa-card mx-auto w-100" style={{ maxWidth: 460 }}>
              <div className="text-center auth-logo mb-3">
                <ImageWithBasePath src="assets/img/kalao-logo.png" className="img-fluid" alt="Groupe Kalao" />
              </div>
              <div className="kalao-mfa-steps" aria-hidden>
                <span className={`kalao-mfa-step${step >= 1 ? " is-on" : ""}`} />
                <span className={`kalao-mfa-step${step >= 2 ? " is-on" : ""}`} />
                <span className={`kalao-mfa-step${step >= 3 ? " is-on" : ""}`} />
              </div>
              <p className="text-uppercase small fw-semibold mb-1" style={{ color: "#e8a317", letterSpacing: "0.08em" }}>
                Sécurité du compte
              </p>
              <h1 className="h3 mb-2">Protégez votre accès</h1>
              <p className="text-muted mb-4">
                Choisissez une méthode. Obligatoire pour super-admin, admin, direction, finance et RH.
              </p>

              {!ready ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: "#164b5a" }} role="status">
                    <span className="visually-hidden">Chargement</span>
                  </div>
                </div>
              ) : null}

              {showChooser ? (
                <div className="kalao-mfa-methods">
                  {verified.map((factor) => (
                    <button
                      key={factor.id}
                      type="button"
                      className="kalao-mfa-method"
                      disabled={busy}
                      onClick={() => void challengeTotp(factor.id)}
                    >
                      <span className="kalao-mfa-ico">
                        <i className="ti ti-device-mobile" />
                      </span>
                      <span>
                        <strong>Appli d’authentification</strong>
                        <span className="small text-muted">Déjà liée — saisir le code</span>
                      </span>
                    </button>
                  ))}
                  {verified.length === 0 ? (
                    <button type="button" className="kalao-mfa-method" disabled={busy} onClick={() => void enrollTotp()}>
                      <span className="kalao-mfa-ico">
                        <i className="ti ti-qrcode" />
                      </span>
                      <span>
                        <strong>Appli d’authentification</strong>
                        <span className="small text-muted">Google Authenticator, Authy, Microsoft Authenticator</span>
                      </span>
                    </button>
                  ) : null}
                  <button type="button" className="kalao-mfa-method" disabled={busy} onClick={() => void sendEmailCode()}>
                    <span className="kalao-mfa-ico">
                      <i className="ti ti-mail" />
                    </span>
                    <span>
                      <strong>Authentification par e-mail</strong>
                      <span className="small text-muted">
                        Code à 6 chiffres envoyé {emailHint ? `à ${emailHint}` : "sur votre adresse"}
                      </span>
                    </span>
                  </button>
                </div>
              ) : null}

              {screen === "totp" && !ok ? (
                <form onSubmit={(e) => void verifyTotp(e)}>
                  {preparing && !qr ? (
                    <div className="text-center py-3">
                      <div className="spinner-border mb-2" style={{ color: "#164b5a" }} role="status">
                        <span className="visually-hidden">Préparation</span>
                      </div>
                      <p className="text-muted mb-3">Préparation du QR… les cases sont prêtes pour le code.</p>
                    </div>
                  ) : null}
                  {qr ? (
                    <div className="kalao-mfa-qr-wrap">
                      <img src={qr} alt="QR code TOTP Kalao" />
                    </div>
                  ) : !preparing ? (
                    <p className="text-muted">Saisissez le code à 6 chiffres de l’application.</p>
                  ) : null}
                  {secret ? (
                    <div
                      className="d-flex align-items-center justify-content-between gap-2 mb-3 p-2 rounded-3"
                      style={{ background: "#f4f8f9" }}
                    >
                      <div className="small text-break mb-0">
                        <span className="text-muted d-block">Clé manuelle</span>
                        <code>{secret}</code>
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => void copySecret()}>
                        {copied ? "Copié" : "Copier"}
                      </button>
                    </div>
                  ) : null}
                  <p className="form-label mb-2">Code de l’application</p>
                  <KalaoOtpBoxes
                    idPrefix="mfa-totp"
                    value={code}
                    disabled={busy && !preparing}
                    onChange={setCode}
                    onComplete={(full) => {
                      if (!busy && full.length === 6) void verifyTotp();
                    }}
                  />
                  <button type="submit" className="btn btn-kalao-gold w-100 py-2" disabled={busy || code.length < 6}>
                    {busy ? "Vérification…" : "Valider"}
                  </button>
                  <button type="button" className="btn btn-link w-100 mt-2" onClick={backToChoose}>
                    Autre méthode
                  </button>
                </form>
              ) : null}

              {screen === "email" && !ok ? (
                <form onSubmit={(e) => void verifyEmail(e)}>
                  <p className="text-muted">
                    {preparing
                      ? "Envoi du code…"
                      : `Un code a été envoyé ${emailHint ? `à ${emailHint}` : "sur votre adresse e-mail"}.`}
                  </p>
                  <p className="form-label mb-2">Code reçu par e-mail</p>
                  <KalaoOtpBoxes
                    idPrefix="mfa-email"
                    value={code}
                    disabled={busy && preparing}
                    onChange={setCode}
                    onComplete={(full) => {
                      if (!busy && !preparing && full.length === 6) void verifyEmail();
                    }}
                  />
                  <button type="submit" className="btn btn-kalao-gold w-100 py-2" disabled={busy || preparing || code.length < 6}>
                    {busy ? "Vérification…" : "Valider"}
                  </button>
                  <button type="button" className="btn btn-link w-100 mt-2" disabled={busy} onClick={() => void sendEmailCode()}>
                    Renvoyer le code
                  </button>
                  <button type="button" className="btn btn-link w-100" onClick={backToChoose}>
                    Autre méthode
                  </button>
                </form>
              ) : null}

              {ok ? (
                <div className="kalao-mfa-ok">
                  <div className="kalao-mfa-ok-mark">
                    <i className="ti ti-check" />
                  </div>
                  <p className="mb-0">Accès sécurisé. Ouverture du CRM…</p>
                </div>
              ) : null}

              {msg ? (
                <p className={`mt-3 mb-0 small ${ok ? "text-success" : "text-danger"}`} role="status">
                  {msg}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block">
          <div className="kalao-mfa-side h-100">
            <span className="kalao-mfa-orb is-gold" />
            <span className="kalao-mfa-orb is-teal" />
            <span className="kalao-mfa-pulse" />
            <span className="kalao-mfa-pulse is-2" />
            <span className="kalao-mfa-pulse is-3" />
            <span className="kalao-mfa-shield">
              <i className="ti ti-shield-lock" />
            </span>
            <div className="kalao-mfa-side-copy">
              <div className="kalao-mfa-goldbar" />
              <h2 className="h3 mb-3">Deux méthodes</h2>
              <ol className="ps-3 mb-0" style={{ lineHeight: 1.7 }}>
                <li>Appli d’authentification : scannez le QR, puis saisissez le code.</li>
                <li>E-mail : un code à 6 chiffres est envoyé sur votre adresse.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
