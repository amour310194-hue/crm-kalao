"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function InboxScreen() {
  const [rows, setRows] = useState<{ id: string; channel: string; status: string; window_expires_at: string | null }[]>([]);
  const [templates, setTemplates] = useState<{ key: string; label: string; submitted: boolean }[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    void supabase.from("channel_conversations").select("id, channel, status, window_expires_at").then(({ data }) => {
      setRows(data ?? []);
    });
    void supabase.from("whatsapp_templates").select("key, label, submitted").then(({ data }) => {
      setTemplates(data ?? []);
    });
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Messagerie</h5></div>
      <div className="card-body">
        <p className="text-muted">
          WhatsApp, Messenger et Instagram : réponse libre pendant 24 h après le dernier message du client, 72 h si la conversation vient d&apos;une publicité. Au-delà, seul un modèle approuvé par Meta. TikTok : pas de messages privés tant que le compte n&apos;est pas éligible. LinkedIn : pas de messages privés.
        </p>
        <p>Aucun canal n&apos;est marqué connecté. Les cinq modèles WhatsApp sont prêts, pas encore soumis à Meta.</p>
        <ul>
          {templates.map((item) => (
            <li key={item.key}>{item.label} — {item.submitted ? "soumis" : "non soumis"}</li>
          ))}
        </ul>
        {!rows.length ? <p>Aucune conversation reçue.</p> : null}
        {rows.map((row) => (
          <div key={row.id} className="border-bottom py-2">
            {row.channel} — {row.status}
            {row.window_expires_at ? ` — fenêtre jusqu'au ${row.window_expires_at}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsScreen() {
  const [aged, setAged] = useState<{ bucket: string; n: number; remaining: number }[]>([]);
  const [forecast, setForecast] = useState<{ conditional: boolean; remaining: number }[]>([]);
  const [conversion, setConversion] = useState<{ source: string; leads: number; converted: number }[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    void supabase.from("v_aged_receivables").select("bucket, n, remaining").then(({ data }) => setAged(data ?? []));
    void supabase.from("v_cash_forecast").select("conditional, remaining").then(({ data }) => setForecast(data ?? []));
    void supabase.from("v_lead_conversion").select("source, leads, converted").then(({ data }) => setConversion(data ?? []));
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Rapports</h5></div>
      <div className="card-body">
        <p className="text-muted">Les totaux viennent des vues en base. Les dépenses publicitaires ne sont pas synchronisées : Meta, TikTok et Google Ads restent non configurés.</p>
        <h6>Balance âgée</h6>
        <ul>{aged.map((row) => <li key={row.bucket}>{row.bucket} : {row.n} facture(s), reste {row.remaining}</li>)}</ul>
        <h6>Prévision à 6 mois</h6>
        <ul>{forecast.map((row) => <li key={String(row.conditional)}>{row.conditional ? "Conditionnel" : "Exigible"} : {row.remaining}</li>)}</ul>
        <h6>Conversion par source</h6>
        <ul>{conversion.map((row) => <li key={row.source}>{row.source} : {row.converted}/{row.leads}</li>)}</ul>
      </div>
    </div>
  );
}

export function TargetsScreen() {
  const [month, setMonth] = useState("2026-10-01");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getUser().then(async ({ data }) => {
      const { error } = await supabase.from("sales_targets").insert({
        profile_id: data.user?.id,
        month,
        amount: Number(amount),
      });
      setMessage(error ? error.message : "Objectif enregistré.");
    });
  };
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Objectifs mensuels</h5></div>
      <form className="card-body" onSubmit={save}>
        <p className="text-muted">Aucun objectif n&apos;est imposé. La direction saisit le montant du mois.</p>
        <div className="d-flex gap-2 flex-wrap">
          <input className="form-control" type="date" value={month} onChange={(e) => setMonth(e.target.value)} />
          <input className="form-control" inputMode="numeric" placeholder="Montant FCFA" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="btn btn-primary" type="submit">Enregistrer</button>
        </div>
        {message ? <p className="mt-2">{message}</p> : null}
      </form>
    </div>
  );
}

export function ReconciliationScreen() {
  const [rows, setRows] = useState<{ id: string; provider: string; amount: number; external_id: string }[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void getSupabaseBrowserClient()
      .from("provider_payments")
      .select("id, provider, amount, external_id")
      .eq("matched", false)
      .then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Rapprochement Mobile Money</h5></div>
      <div className="card-body">
        <p className="text-muted">Orange Money et MTN MoMo sont en mode test. Un paiement sans facture correspondante apparaît ici. Rien n&apos;est débité chez l&apos;opérateur.</p>
        {!rows.length ? <p>Aucun paiement non rapproché.</p> : null}
        <ul>{rows.map((row) => <li key={row.id}>{row.provider} {row.external_id} — {row.amount}</li>)}</ul>
      </div>
    </div>
  );
}

export function PrivacyScreen() {
  const [pieces, setPieces] = useState<{ id: string; retain_until: string | null }[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const today = new Date();
    today.setUTCDate(today.getUTCDate() + 30);
    void getSupabaseBrowserClient()
      .from("attachments")
      .select("id, retain_until")
      .not("retain_until", "is", null)
      .lte("retain_until", today.toISOString().slice(0, 10))
      .is("notice_sent_at", null)
      .then(({ data }) => setPieces(data ?? []));
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Pièces et données personnelles</h5></div>
      <div className="card-body">
        <p>Les pièces sont conservées 5 ans. Cette liste signale celles qui arrivent à échéance dans 30 jours. Aucune suppression n&apos;est lancée d&apos;ici.</p>
        <p>Sauvegarde hors Supabase : non configurée. Les sauvegardes automatiques de Supabase ne sont pas affichées comme les nôtres.</p>
        {!pieces.length ? <p>Aucune pièce à signaler.</p> : <p>{pieces.length} pièce(s) à signaler avant suppression.</p>}
      </div>
    </div>
  );
}

export function AssistantScreen() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: pref } = await supabase.from("ai_preferences").select("enabled").eq("profile_id", data.user.id).maybeSingle();
      if (pref) setEnabled(Boolean(pref.enabled));
    });
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">Assistant</h5></div>
      <div className="card-body">
        <p className="text-muted">L&apos;assistant ne décide rien et n&apos;envoie rien seul. Aucune pièce d&apos;identité ne lui est transmise. Aucune clé de modèle n&apos;est configurée sur ce déploiement : il ne produit pas de texte inventé.</p>
        <label className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={enabled}
            onChange={(event) => {
              const next = event.target.checked;
              setEnabled(next);
              const supabase = getSupabaseBrowserClient();
              void supabase.auth.getUser().then(async ({ data }) => {
                if (!data.user) return;
                const { error } = await supabase.from("ai_preferences").upsert({ profile_id: data.user.id, enabled: next });
                setMessage(error ? error.message : next ? "Assistant activé." : "Assistant coupé.");
              });
            }}
          />
          <span className="form-check-label">Laisser l&apos;assistant disponible</span>
        </label>
        {message ? <p className="mt-2">{message}</p> : null}
      </div>
    </div>
  );
}
