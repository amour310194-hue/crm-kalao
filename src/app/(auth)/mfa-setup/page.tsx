"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { all_routes } from "@/router/all_routes";

export default function MfaSetupPage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [aal, setAal] = useState<string | null>(null);

  const refresh = async () => {
    const supabase = getSupabaseBrowserClient();
    const listed = await supabase.auth.mfa.listFactors();
    const verified = (listed.data?.totp ?? []).filter((f) => f.status === "verified");
    setHasVerified(verified.length > 0);
    if (verified[0] && !factorId) setFactorId(verified[0].id);
    const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    setAal(level.data?.currentLevel ?? null);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const enroll = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "CRM Kalao" });
    if (error) {
      setMsg(error.message === "error" ? "Impossible de générer le QR." : "Impossible de générer le QR.");
      console.error(error);
      return;
    }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
    setMsg("Scannez le QR avec une application TOTP, puis saisissez le code.");
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (!factorId) return;
    const supabase = getSupabaseBrowserClient();
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setMsg("Code refusé. Réessayez.");
      console.error(challenge.error);
      return;
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code,
    });
    if (error) {
      setMsg("Code incorrect.");
      return;
    }
    setMsg("2FA activée.");
    await supabase.auth.refreshSession();
    router.replace(all_routes.dashboard);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Authentification à deux facteurs</h1>
      <p className="text-muted">
        Obligatoire pour super-admin, admin, direction, finance et RH. Session actuelle : {aal ?? "—"}.
        Les codes de secours ne sont pas fournis par Auth : enregistrez un second authenticator.
      </p>
      {hasVerified && !qr ? (
        <p className="small">Un TOTP est déjà configuré. Entrez un code pour élever cette session.</p>
      ) : null}
      {!qr && !hasVerified ? (
        <button type="button" className="btn btn-dark" onClick={() => void enroll()}>
          Générer le QR TOTP
        </button>
      ) : (
        <form onSubmit={verify}>
          {qr ? <div className="mb-3" dangerouslySetInnerHTML={{ __html: qr }} /> : null}
          {secret ? <p className="small text-muted">Clé manuelle : {secret}</p> : null}
          <input
            className="form-control mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            required
            placeholder="Code à 6 chiffres"
          />
          <button type="submit" className="btn btn-dark w-100">
            Valider
          </button>
        </form>
      )}
      {hasVerified && !qr ? (
        <form className="mt-3" onSubmit={verify}>
          <input
            className="form-control mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            required
            placeholder="Code à 6 chiffres"
          />
          <button type="submit" className="btn btn-dark w-100">
            Valider le code
          </button>
        </form>
      ) : null}
      {msg ? <p className="mt-3 text-muted">{msg}</p> : null}
    </div>
  );
}
