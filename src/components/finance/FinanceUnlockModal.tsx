"use client";

import { useState } from "react";
import KalaoOtpBoxes from "@/components/auth/KalaoOtpBoxes";
import { authJsonHeaders } from "@/lib/auth-headers";

export default function FinanceUnlockModal({
  onUnlocked,
  onClose,
}: {
  onUnlocked: () => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const send = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/finance/unlock/send", {
        method: "POST",
        credentials: "include",
        headers: await authJsonHeaders(),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "Envoi impossible.");
      setSent(true);
      setMessage("Un code a été envoyé aux administrateurs. Saisissez-le pour confirmer.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (value: string) => {
    if (value.length !== 6) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/finance/unlock/verify", {
        method: "POST",
        credentials: "include",
        headers: await authJsonHeaders(),
        body: JSON.stringify({ code: value }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "Code incorrect.");
      onUnlocked();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Code incorrect.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.55)", zIndex: 1080 }} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Validation administrateur</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="text-muted">
              Toute modification ou annulation d’une écriture financière doit être confirmée par un code envoyé à
              l’administrateur, pour éviter qu’une erreur de saisie fausse la comptabilité.
            </p>
            {message ? <div className="alert alert-info">{message}</div> : null}
            {sent ? (
              <KalaoOtpBoxes idPrefix="finance-otp" value={code} onChange={setCode} onComplete={verify} disabled={busy} />
            ) : null}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void send()} disabled={busy}>
              {busy ? "Envoi…" : sent ? "Renvoyer le code" : "Envoyer le code à l’admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
