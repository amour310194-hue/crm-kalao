"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function MfaSetupPage() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const enroll = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "CRM Kalao" });
    if (error) {
      setMsg(error.message);
      return;
    }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setMsg("Scannez le QR avec une application TOTP, puis saisissez le code.");
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (!factorId) return;
    const supabase = getSupabaseBrowserClient();
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setMsg(challenge.error.message);
      return;
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code,
    });
    setMsg(error ? error.message : "2FA activée. Rechargez le CRM.");
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Authentification à deux facteurs</h1>
      <p className="text-muted">
        Obligatoire pour la direction, la finance et les admins une fois MFA_ENFORCE activé. Les
        codes de secours seront affichés après validation.
      </p>
      {!qr ? (
        <button type="button" className="btn btn-dark" onClick={() => void enroll()}>
          Générer le QR TOTP
        </button>
      ) : (
        <form onSubmit={verify}>
          <div className="mb-3" dangerouslySetInnerHTML={{ __html: qr }} />
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
      {msg ? <p className="mt-3 text-muted">{msg}</p> : null}
    </div>
  );
}
