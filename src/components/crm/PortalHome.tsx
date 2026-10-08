"use client";

import { FormEvent, useState } from "react";

export default function PortalHome() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    void fetch("/api/portail/lien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((json: { dispatched?: boolean; detail?: string }) => {
        if (json.dispatched) setMessage("Le lien a été envoyé.");
        else setMessage(json.detail || "Le lien n'a pas été envoyé.");
      })
      .catch(() => setMessage("Envoi indisponible."));
  };
  return (
    <main className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="h4">Espace client Kalao</h1>
      <p>Indiquez l&apos;adresse de votre dossier. Un lien d&apos;accès part par e-mail. Vous ne voyez que vos propres pièces, factures et messages.</p>
      <form onSubmit={submit}>
        <input className="form-control mb-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        <button className="btn btn-primary" type="submit">Recevoir le lien</button>
      </form>
      {message ? <p className="mt-3">{message}</p> : null}
    </main>
  );
}
