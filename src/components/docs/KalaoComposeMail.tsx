"use client";

import "@/components/mail/mail.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseMailApi, type MailSession } from "@/lib/mail/client";
import { newSeed, seedFromInput, type SeedBase } from "@/lib/mail/compose";
import { formatListDate, formatParticipants } from "@/lib/mail/format";
import { loadPrefs } from "@/lib/mail/prefs";
import type { DirectoryEntry, MailAction, MailLabel, MailTemplate, MailThreadRow } from "@/lib/mail/types";
import MailCompose from "@/components/mail/MailCompose";
import MailThread from "@/components/mail/MailThread";
import { useSender } from "@/components/mail/useSender";
import { MAILBOX_META, Toasts, useToasts } from "@/components/mail/ui";

type Props = {
  to?: string | null;
  contactId?: string | null;
  companyId?: string | null;
  partyName: string;
  layout?: "compact" | "panel";
};

function openFicheEmailTab() {
  document.querySelector<HTMLElement>('a[href="#tab_5"]')?.click();
}

function mailHref(query: string) {
  return `/application/email?view=all&q=${encodeURIComponent(query)}`;
}

/**
 * Onglet E-mail d'une fiche client / entreprise : rédaction (mêmes fonctions que la messagerie)
 * et historique des conversations avec ce correspondant.
 */
export default function KalaoComposeMail({ to, contactId, companyId, partyName, layout = "compact" }: Props) {
  const api = useMemo(() => createSupabaseMailApi(), []);
  const { toasts, push, dismiss } = useToasts();
  const [session, setSession] = useState<MailSession | null>(null);
  const [rows, setRows] = useState<MailThreadRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [labels, setLabels] = useState<MailLabel[]>([]);
  const [directory, setDirectory] = useState<DirectoryEntry[]>([]);
  const [seed, setSeed] = useState<SeedBase | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inlineSeed, setInlineSeed] = useState<SeedBase | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const email = (to ?? "").trim().toLowerCase();

  const load = useCallback(async () => {
    try {
      const res = await api.listThreads(
        {
          mailbox: null,
          view: "all",
          contactId: contactId ?? null,
          companyId: contactId ? null : companyId ?? null,
          partyEmail: !contactId && !companyId ? email || null : null,
          limit: 30,
          offset: 0,
        },
        []
      );
      setRows(res.rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Historique indisponible.");
    }
  }, [api, contactId, companyId, email]);

  useEffect(() => {
    void (async () => {
      const s = await api.session().catch(() => null);
      setSession(s);
      if (!s) return;
      const [sig, tpl, lab, dir] = await Promise.all([
        api.signature().catch(() => ""),
        api.templates().catch(() => []),
        api.labels().catch(() => []),
        api.directory().catch(() => []),
      ]);
      setSignature(sig);
      setTemplates(tpl);
      setLabels(lab);
      setDirectory(dir);
    })();
    void load();
  }, [api, load]);

  const freshSeed = useCallback(
    () =>
      session
        ? newSeed({
            mailbox: session.mailboxes.includes("contact") ? "contact" : "personal",
            available: session.mailboxes,
            signature,
            to: email ? [email] : [],
            contactId,
            companyId,
          })
        : null,
    [session, signature, email, contactId, companyId]
  );

  useEffect(() => {
    if (layout === "panel" && session && !seed) setSeed(freshSeed());
  }, [layout, session, seed, freshSeed]);

  const send = useSender({
    api,
    push,
    dismiss,
    undoSeconds: typeof window === "undefined" ? 10 : loadPrefs().undoSeconds,
    reopen: (input) => setSeed(seedFromInput(input)),
    onChanged: () => {
      void load();
      setReloadKey((n) => n + 1);
    },
  });

  const act = (threadIds: string[], action: MailAction) => {
    void api
      .act({ threadIds }, action)
      .then(() => {
        void load();
        setReloadKey((n) => n + 1);
      })
      .catch((err: Error) => push({ tone: "error", text: err.message }));
  };

  if (layout !== "panel") {
    return (
      <div className="d-flex align-items-center flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={openFicheEmailTab}>
          <i className="ti ti-mail me-1" />
          Envoyer un e-mail
        </button>
        <button type="button" className="btn btn-outline-light shadow" onClick={openFicheEmailTab}>
          Courriers échangés ({rows.length})
        </button>
        {email ? (
          <Link href={mailHref(email)} className="btn btn-outline-light shadow">
            Messagerie
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="kmail d-block" style={{ height: "auto", minHeight: 0, background: "transparent" }}>
      <div className="d-flex flex-column gap-3">
        <div className="card border mb-0">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h6 className="mb-0">Écrire à {partyName}</h6>
            {!email ? <span className="small text-danger">Pas d&apos;e-mail sur cette fiche : saisissez l&apos;adresse.</span> : null}
          </div>
          <div className="card-body p-0">
            {session && seed ? (
              <MailCompose
                key={seed.key}
                api={api}
                session={session}
                templates={templates}
                push={push}
                seed={seed}
                variant="inline"
                onClose={() => setSeed(freshSeed())}
                onSend={(input) => {
                  send(input);
                  setSeed(freshSeed());
                }}
                onTemplatesChanged={() => void api.templates().then(setTemplates)}
              />
            ) : (
              <div className="p-3 text-muted">Chargement…</div>
            )}
          </div>
        </div>

        <div className="card border mb-0">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h6 className="mb-0">Historique des échanges ({rows.length})</h6>
            {email ? (
              <Link href={mailHref(email)} className="btn btn-sm btn-outline-light">
                Ouvrir dans la messagerie
              </Link>
            ) : null}
          </div>
          <div className="list-group list-group-flush">
            {error ? <div className="list-group-item text-danger">{error}</div> : null}
            {!error && !rows.length ? (
              <div className="list-group-item text-muted">Aucun courrier échangé avec ce client pour le moment.</div>
            ) : null}
            {rows.map((row) => (
              <button
                key={row.thread_id}
                type="button"
                className={`list-group-item list-group-item-action text-start${row.thread_id === openId ? " active" : ""}`}
                onClick={() => {
                  setInlineSeed(null);
                  setOpenId(row.thread_id === openId ? null : row.thread_id);
                }}
              >
                <span className="d-flex justify-content-between gap-2">
                  <span className={row.unread_count ? "fw-bold" : "fw-semibold"}>
                    {formatParticipants(row.participants, row.message_count)} · {row.subject || "(sans objet)"}
                  </span>
                  <span className="small text-nowrap opacity-75">{formatListDate(row.last_at)}</span>
                </span>
                <span className="d-block small opacity-75 mt-1 text-truncate">
                  {MAILBOX_META[row.mailbox]?.label} — {row.snippet}
                </span>
              </button>
            ))}
          </div>
        </div>

        {openId && session ? (
          <div className="card border mb-0">
            <MailThread
              key={openId}
              api={api}
              session={session}
              threadId={openId}
              view="all"
              labels={labels}
              directory={directory}
              signature={signature}
              reloadKey={reloadKey}
              onBack={() => setOpenId(null)}
              onAction={(ids, action) => act(ids, action)}
              onCompose={(s) => setInlineSeed(s)}
              onCreateLabel={async () => null}
              onCancelScheduled={(id) => void api.cancelScheduled(id).then(() => setReloadKey((n) => n + 1))}
              onDiscardDraft={(id) => void api.discardDraft(id).then(() => setReloadKey((n) => n + 1))}
              onChanged={() => void load()}
              composeSlot={
                inlineSeed ? (
                  <MailCompose
                    key={inlineSeed.key}
                    api={api}
                    session={session}
                    templates={templates}
                    push={push}
                    seed={inlineSeed}
                    variant="inline"
                    onClose={() => setInlineSeed(null)}
                    onSend={send}
                  />
                ) : null
              }
            />
          </div>
        ) : null}
      </div>
      <Toasts toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
