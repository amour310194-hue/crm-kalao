"use client";

import { FormEvent, useState } from "react";

export default function KalaoForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let json: { ok?: boolean; reason?: string } = {};
      try {
        json = (await res.json()) as { ok?: boolean; reason?: string };
      } catch {
        throw new Error("Envoi impossible. Réessayez.");
      }
      if (res.status === 429) throw new Error("Trop de demandes. Réessayez plus tard.");
      if (!res.ok || !json.ok) throw new Error(json.reason || "Envoi impossible");
      setMsg("Si ce compte existe, un e-mail no-reply a été envoyé avec un code et un lien.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="mb-3" onSubmit={onSubmit}>
      <label className="form-label">E-mail professionnel</label>
      <input
        type="email"
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <button type="submit" className="btn btn-dark w-100" disabled={busy}>
        {busy ? "Envoi…" : "Envoyer le code"}
      </button>
      {msg ? <p className="mb-0 mt-2 text-muted">{msg}</p> : null}
    </form>
  );
}
