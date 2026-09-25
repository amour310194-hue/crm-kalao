"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function KalaoResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") ?? "");
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, token, password }),
      });
      const json = (await res.json()) as { ok?: boolean; reason?: string };
      if (!res.ok || !json.ok) throw new Error(json.reason || "Réinitialisation impossible");
      setMsg("Mot de passe enregistré. Redirection…");
      setTimeout(() => router.push(all_routes.login), 800);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="mb-3" onSubmit={onSubmit}>
      {!token ? (
        <>
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label">Code reçu par e-mail</label>
          <input
            className="form-control mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            inputMode="numeric"
          />
        </>
      ) : (
        <p className="text-muted">Lien de réinitialisation détecté.</p>
      )}
      <label className="form-label">Nouveau mot de passe</label>
      <input
        type="password"
        className="form-control mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={12}
        autoComplete="new-password"
      />
      <label className="form-label">Confirmer</label>
      <input
        type="password"
        className="form-control mb-2"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        minLength={12}
        autoComplete="new-password"
      />
      <button type="submit" className="btn btn-dark w-100" disabled={busy}>
        {busy ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
      {msg ? <p className="mb-0 mt-2 text-muted">{msg}</p> : null}
    </form>
  );
}
