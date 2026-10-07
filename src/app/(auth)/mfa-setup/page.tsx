"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { all_routes } from "@/router/all_routes";
import { totpQrSrc } from "@/lib/totp-qr";
import {
  collectMfaFactors,
  explainMfaError,
  factorKind,
  MFA_METHOD_LABEL,
  toE164,
  unverifiedFactors,
  verifiedFactors,
  type MfaFactor,
  type MfaKind,
} from "@/lib/mfa-methods";

export default function MfaSetupPage() {
  const router = useRouter();
  const [method, setMethod] = useState<MfaKind | "choose">("choose");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [aal, setAal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const verified = verifiedFactors(factors);

  const refresh = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace(all_routes.login);
        return;
      }
      const listed = await supabase.auth.mfa.listFactors();
      const packed = listed.data as {
        totp?: MfaFactor[];
        phone?: MfaFactor[];
        webauthn?: MfaFactor[];
        all?: MfaFactor[];
      };
      const nextFactors = collectMfaFactors(packed ?? {});
      setFactors(nextFactors);
      const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setAal(level.data?.currentLevel ?? null);
      const verifiedNext = verifiedFactors(nextFactors);
      if (!factorId && verifiedNext[0]) setFactorId(verifiedNext[0].id);
    } catch (err) {
      console.error("mfa refresh", err);
    } finally {
      setReady(true);
    }
  }, [factorId, router]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("method");
    if (q === "totp" || q === "phone" || q === "webauthn") setMethod(q);
    void refresh();
  }, [refresh]);

  const afterVerified = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.refreshSession();
    let level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (level.data?.currentLevel !== "aal2") {
      await supabase.auth.refreshSession();
      level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    }
    setAal(level.data?.currentLevel ?? null);
    if (level.data?.currentLevel !== "aal2") {
      setOk(false);
      setMsg("Le code est accepté mais la session n’est pas encore au niveau 2. Validez à nouveau le code.");
      return false;
    }
    setOk(true);
    setMsg("Méthode activée.");
    let codes: string[] | null = null;
    try {
      const rec = await supabase.auth.mfa.recoveryCodes.generate();
      if (!rec.error && rec.data?.codes?.length) {
        codes = rec.data.codes;
        setRecoveryCodes(codes);
      }
    } catch {
      /* codes de secours optionnels selon le projet Auth */
    }
    if (!codes) {
      window.setTimeout(() => router.replace(all_routes.dashboard), 900);
    }
    return true;
  };

  const enrollTotp = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const listed = await supabase.auth.mfa.listFactors();
      const packed = listed.data as {
        totp?: MfaFactor[];
        phone?: MfaFactor[];
        webauthn?: MfaFactor[];
        all?: MfaFactor[];
      };
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
        return;
      }
      setFactorId(data.id);
      setQr(totpQrSrc(data.totp.qr_code));
      setSecret(data.totp.secret);
      setMethod("totp");
    } catch (err) {
      console.error(err);
      setMsg("Impossible de générer le QR.");
    } finally {
      setBusy(false);
    }
  };

  const enrollPhone = async () => {
    const e164 = toE164(phone);
    if (!e164) {
      setMsg("Indiquez un numéro international, ex. +2376XXXXXXXX.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "phone",
        friendlyName: "SMS Kalao",
        phone: e164,
      });
      if (error || !data) {
        setMsg(explainMfaError(error?.message));
        return;
      }
      setFactorId(data.id);
      const challenge = await supabase.auth.mfa.challenge({ factorId: data.id });
      if (challenge.error) {
        setMsg(explainMfaError(challenge.error.message));
        return;
      }
      setChallengeId(challenge.data.id);
      setSmsSent(true);
      setMsg("Code envoyé par SMS si le canal est configuré sur Auth.");
    } catch (err) {
      console.error(err);
      setMsg(explainMfaError(undefined));
    } finally {
      setBusy(false);
    }
  };

  const challengeExisting = async (id: string, kind: MfaKind) => {
    setBusy(true);
    setMsg(null);
    setFactorId(id);
    setMethod(kind);
    try {
      const supabase = getSupabaseBrowserClient();
      if (kind === "webauthn") {
        const result = await supabase.auth.mfa.webauthn.authenticate({
          factorId: id,
          webauthn: { rpId: window.location.hostname, rpOrigins: [window.location.origin] },
        });
        if (result.error) {
          setMsg(explainMfaError(result.error.message));
          return;
        }
        await afterVerified();
        return;
      }
      const challenge = await supabase.auth.mfa.challenge({ factorId: id });
      if (challenge.error) {
        setMsg(explainMfaError(challenge.error.message));
        return;
      }
      setChallengeId(challenge.data.id);
      if (kind === "phone") {
        setSmsSent(true);
        setMsg("Code envoyé par SMS.");
      }
    } catch (err) {
      console.error(err);
      setMsg(explainMfaError(undefined));
    } finally {
      setBusy(false);
    }
  };

  const enrollWebauthn = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const result = await supabase.auth.mfa.webauthn.register({
        friendlyName: "Clé Kalao",
        webauthn: { rpId: window.location.hostname, rpOrigins: [window.location.origin] },
      });
      if (result.error) {
        setMsg(explainMfaError(result.error.message));
        return;
      }
      await refresh();
      await afterVerified();
    } catch (err) {
      console.error(err);
      setMsg(explainMfaError(undefined));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event?: FormEvent) => {
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
      await afterVerified();
    } catch (err) {
      console.error(err);
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

  const showChooser = ready && method === "choose" && !qr && !smsSent && !ok;
  const step = ok || recoveryCodes ? 3 : qr || smsSent || method === "phone" ? 2 : 1;

  const methodIcon = (kind: MfaKind) =>
    kind === "phone" ? "ti-message" : kind === "webauthn" ? "ti-key" : "ti-device-mobile";

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
                Choisissez au moins une méthode. Vous pouvez en ajouter d’autres ensuite. Obligatoire pour super-admin,
                admin, direction, finance et RH.
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
                  {aal !== "aal2" && verified.length > 0 ? (
                    <p className="small text-muted">Confirmez une méthode déjà liée pour ouvrir cette session.</p>
                  ) : null}
                  {verified.map((factor) => {
                    const kind = factorKind(factor);
                    if (!kind) return null;
                    return (
                      <button
                        key={factor.id}
                        type="button"
                        className="kalao-mfa-method"
                        disabled={busy}
                        onClick={() => void challengeExisting(factor.id, kind)}
                      >
                        <span className="kalao-mfa-ico">
                          <i className={`ti ${methodIcon(kind)}`} />
                        </span>
                        <span>
                          <strong>{MFA_METHOD_LABEL[kind]}</strong>
                          <span className="small text-muted">Déjà configurée — valider maintenant</span>
                        </span>
                      </button>
                    );
                  })}
                  <button type="button" className="kalao-mfa-method" disabled={busy} onClick={() => void enrollTotp()}>
                    <span className="kalao-mfa-ico">
                      <i className="ti ti-qrcode" />
                    </span>
                    <span>
                      <strong>Application authenticator</strong>
                      <span className="small text-muted">Google Authenticator, Authy, Microsoft Authenticator</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="kalao-mfa-method"
                    disabled={busy}
                    onClick={() => {
                      setMethod("phone");
                      setMsg(null);
                    }}
                  >
                    <span className="kalao-mfa-ico">
                      <i className="ti ti-message" />
                    </span>
                    <span>
                      <strong>Code par SMS</strong>
                      <span className="small text-muted">Numéro Cameroun ou international. Nécessite SMS Auth.</span>
                    </span>
                  </button>
                  <button type="button" className="kalao-mfa-method" disabled={busy} onClick={() => void enrollWebauthn()}>
                    <span className="kalao-mfa-ico">
                      <i className="ti ti-key" />
                    </span>
                    <span>
                      <strong>Clé de sécurité / passkey</strong>
                      <span className="small text-muted">Clé USB, Windows Hello, empreinte — si le navigateur le permet</span>
                    </span>
                  </button>
                </div>
              ) : null}

              {method === "phone" && !smsSent ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void enrollPhone();
                  }}
                >
                  <label className="form-label" htmlFor="mfa-phone">
                    Numéro (indicatif +237…)
                  </label>
                  <input
                    id="mfa-phone"
                    className="form-control mb-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2376XXXXXXXX"
                    autoComplete="tel"
                    required
                  />
                  <button type="submit" className="btn btn-kalao-gold w-100 py-2" disabled={busy}>
                    {busy ? "Envoi…" : "Envoyer le code SMS"}
                  </button>
                  <button type="button" className="btn btn-link w-100 mt-2" onClick={() => setMethod("choose")}>
                    Autre méthode
                  </button>
                </form>
              ) : null}

              {qr ? (
                <form onSubmit={(e) => void verifyCode(e)}>
                  <div className="kalao-mfa-qr-wrap">
                    <img src={qr} alt="QR code TOTP Kalao" />
                  </div>
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
                    {busy ? "Vérification…" : "Valider"}
                  </button>
                </form>
              ) : null}

              {smsSent ? (
                <form onSubmit={(e) => void verifyCode(e)}>
                  <label className="form-label" htmlFor="mfa-sms">
                    Code SMS à 6 chiffres
                  </label>
                  <input
                    id="mfa-sms"
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
                    {busy ? "Vérification…" : "Valider le SMS"}
                  </button>
                </form>
              ) : null}

              {ok && !recoveryCodes ? (
                <div className="kalao-mfa-ok">
                  <div className="kalao-mfa-ok-mark">
                    <i className="ti ti-check" />
                  </div>
                  <p className="mb-0">Accès sécurisé. Ouverture du CRM…</p>
                </div>
              ) : null}

              {recoveryCodes ? (
                <div className="alert alert-warning mt-3">
                  <p className="fw-semibold mb-2">Codes de secours — copiez-les maintenant, ils ne seront plus réaffichés.</p>
                  <ul className="mb-2">
                    {recoveryCodes.map((item) => (
                      <li key={item}>
                        <code>{item}</code>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-sm btn-dark" onClick={() => router.replace(all_routes.dashboard)}>
                    Continuer vers le CRM
                  </button>
                </div>
              ) : null}

              {msg ? (
                <p className={`mt-3 mb-0 small ${ok ? "text-success" : "text-danger"}`} role="status">
                  {msg}
                </p>
              ) : null}

              <p className="mt-4 mb-0 small text-muted">
                {aal ? `Session ${aal}` : "Validez un code pour ouvrir le CRM."}
              </p>
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
              <h2 className="h3 mb-3">Une méthode, ou plusieurs</h2>
              <ol className="ps-3 mb-0" style={{ lineHeight: 1.7 }}>
                <li>Authenticator : QR, fonctionne hors réseau.</li>
                <li>SMS : code reçu sur votre téléphone.</li>
                <li>Clé / passkey : validation biométrique ou clé USB.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
