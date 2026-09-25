"use client";

import "@/components/mail/mail.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseMailApi, type MailApi, type MailSession } from "@/lib/mail/client";
import { DEFAULT_PREFS, loadPrefs, savePrefs, type MailPrefs } from "@/lib/mail/prefs";
import { draftSeed, forwardSeed, newSeed, replySeed, seedFromInput, type SeedBase } from "@/lib/mail/compose";
import {
  isMailboxKey,
  isMailView,
  type DirectoryEntry,
  type MailAction,
  type MailboxKey,
  type MailCounts,
  type MailLabel,
  type MailMessage,
  type MailTemplate,
  type MailThreadRow,
  type MailView,
} from "@/lib/mail/types";
import MailSidebar from "@/components/mail/MailSidebar";
import MailToolbar from "@/components/mail/MailToolbar";
import MailList from "@/components/mail/MailList";
import MailThread from "@/components/mail/MailThread";
import MailCompose from "@/components/mail/MailCompose";
import MailSearch from "@/components/mail/MailSearch";
import MailSettings from "@/components/mail/MailSettings";
import KalaoMailDnsBanner from "@/components/docs/KalaoMailDnsBanner";
import { useSender } from "@/components/mail/useSender";
import { IconButton, MailModal, Toasts, useToasts, VIEW_META } from "@/components/mail/ui";

const LEAVE_TEXT: Record<string, string> = {
  archive: "Conversation archivée.",
  deleted: "Conversation placée dans la corbeille.",
  spam: "Conversation signalée comme spam.",
  inbox: "Conversation déplacée dans la boîte de réception.",
};

const SHORTCUTS: [string, string][] = [
  ["c", "Nouveau message"],
  ["/", "Rechercher"],
  ["j / k", "Conversation suivante / précédente"],
  ["o ou Entrée", "Ouvrir"],
  ["u", "Revenir à la liste"],
  ["e", "Archiver"],
  ["#", "Supprimer"],
  ["!", "Signaler comme spam"],
  ["r", "Répondre"],
  ["a", "Répondre à tous"],
  ["f", "Transférer"],
  ["s", "Suivre / ne plus suivre"],
  ["x", "Sélectionner"],
  ["Maj + i / Maj + u", "Marquer comme lu / non lu"],
  ["g puis i / s / t / d", "Aller à Réception / Suivis / Envoyés / Brouillons"],
  ["Ctrl + Entrée", "Envoyer (dans la fenêtre de rédaction)"],
  ["?", "Afficher cette aide"],
];

function readUrl() {
  if (typeof window === "undefined") return {} as Record<string, string | null>;
  const p = new URLSearchParams(window.location.search);
  return { box: p.get("box"), view: p.get("view") ?? p.get("folder"), label: p.get("label"), q: p.get("q"), thread: p.get("thread") };
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export default function MailApp({ api: apiProp }: { api?: MailApi }) {
  const api = useMemo(() => apiProp ?? createSupabaseMailApi(), [apiProp]);
  const initial = useRef(readUrl());
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { toasts, push, dismiss } = useToasts();

  const [session, setSession] = useState<MailSession | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [prefs, setPrefsState] = useState<MailPrefs>(DEFAULT_PREFS);
  const [mailbox, setMailbox] = useState<MailboxKey>("personal");
  const [view, setView] = useState<MailView>(isMailView(initial.current.view) ? (initial.current.view as MailView) : "inbox");
  const [labelId, setLabelId] = useState<string | null>(initial.current.label ?? null);
  const [search, setSearch] = useState(initial.current.q ?? "");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<MailThreadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState<Record<string, MailCounts>>({});
  const [labels, setLabels] = useState<MailLabel[]>([]);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [signature, setSignature] = useState("");
  const [directory, setDirectory] = useState<DirectoryEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(initial.current.thread ?? null);
  const [threadReload, setThreadReload] = useState(0);
  const [composes, setComposes] = useState<SeedBase[]>([]);
  const [inlineSeed, setInlineSeed] = useState<SeedBase | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const openMessages = useRef<MailMessage[]>([]);
  const lastSelected = useRef<string | null>(null);
  const listSeq = useRef(0);
  const gPressed = useRef(0);

  const split = prefs.readingPane === "right";

  // --- Démarrage -----------------------------------------------------------
  useEffect(() => {
    setPrefsState(loadPrefs());
    void (async () => {
      try {
        const s = await api.session();
        if (!s) {
          setBootError("Connectez-vous pour accéder à la messagerie.");
          return;
        }
        setSession(s);
        const wanted = initial.current.box;
        setMailbox(isMailboxKey(wanted) && s.mailboxes.includes(wanted) ? wanted : s.mailboxes.includes("contact") ? "contact" : "personal");
        const [l, t, sig, dir] = await Promise.all([
          api.labels().catch(() => []),
          api.templates().catch(() => []),
          api.signature().catch(() => ""),
          api.directory().catch(() => []),
        ]);
        setLabels(l);
        setTemplates(t);
        setSignature(sig);
        setDirectory(dir);
      } catch (err) {
        setBootError(err instanceof Error ? err.message : "Messagerie indisponible.");
      }
    })();
  }, [api]);

  // Hauteur disponible sous l'en-tête du CRM.
  useEffect(() => {
    const fit = () => {
      const top = rootRef.current?.getBoundingClientRect().top ?? 64;
      rootRef.current?.style.setProperty("--kmail-top", `${Math.max(0, Math.round(top + window.scrollY))}px`);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [session]);

  const setPrefs = useCallback((next: MailPrefs) => {
    setPrefsState(next);
    savePrefs(next);
  }, []);

  // --- Chargements ---------------------------------------------------------
  const loadList = useCallback(
    async (silent = false) => {
      if (!session) return;
      const seq = ++listSeq.current;
      if (!silent) setLoading(true);
      try {
        const res = await api.listThreads(
          { mailbox, view, labelId: view === "label" ? labelId : null, search, limit: prefs.pageSize, offset },
          labels
        );
        if (seq !== listSeq.current) return;
        setRows(res.rows);
        setTotal(res.total);
        setListError(null);
      } catch (err) {
        if (seq !== listSeq.current) return;
        setListError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        if (seq === listSeq.current) setLoading(false);
      }
    },
    [api, session, mailbox, view, labelId, search, prefs.pageSize, offset, labels]
  );

  const loadCounts = useCallback(async () => {
    if (!session) return;
    try {
      setCounts(await api.counts());
    } catch {
      /* compteurs : on garde les précédents */
    }
  }, [api, session]);

  const reloadMeta = useCallback(async () => {
    const [l, t] = await Promise.all([api.labels().catch(() => labels), api.templates().catch(() => templates)]);
    setLabels(l);
    setTemplates(t);
  }, [api, labels, templates]);

  const refreshAll = useCallback(() => {
    void loadList(true);
    void loadCounts();
    setThreadReload((n) => n + 1);
  }, [loadList, loadCounts]);

  useEffect(() => {
    void loadList();
    setSelected(new Set());
  }, [loadList]);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts]);

  // URL partageable / bouton Retour du navigateur.
  useEffect(() => {
    if (!session) return;
    const p = new URLSearchParams();
    p.set("box", mailbox);
    p.set("view", view);
    if (view === "label" && labelId) p.set("label", labelId);
    if (search) p.set("q", search);
    if (openId) p.set("thread", openId);
    const url = `${window.location.pathname}?${p.toString()}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [session, mailbox, view, labelId, search, openId]);

  useEffect(() => {
    const onPop = () => setOpenId(readUrl().thread ?? null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Temps réel + filet de sécurité toutes les 60 s. Les valeurs changeantes passent par une ref
  // pour ne pas recréer l'abonnement à chaque clic.
  const live = useRef({ refreshAll, loadCounts, loadList, offset, openId, desktop: prefs.desktopNotifications, push });
  live.current = { refreshAll, loadCounts, loadList, offset, openId, desktop: prefs.desktopNotifications, push };
  useEffect(() => {
    if (!session) return;
    let timer = 0;
    const openFrom = (row: Partial<MailMessage>) => {
      if (row.mailbox && isMailboxKey(row.mailbox)) setMailbox(row.mailbox);
      setOpenId((row.thread_id as string | undefined) ?? (row.id as string));
    };
    let unsubscribe = () => {};
    try {
      unsubscribe = api.subscribe((event) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => live.current.refreshAll(), 700);
        const row = event.row;
        if (event.type === "insert" && row.direction === "in" && row.folder === "inbox") {
          const who = row.from_name || row.from_email || "Nouveau message";
          live.current.push({
            text: `Nouveau message de ${who} : ${row.subject ?? ""}`,
            actionLabel: "Ouvrir",
            onAction: () => openFrom(row),
          });
          if (live.current.desktop && document.hidden && typeof Notification !== "undefined" && Notification.permission === "granted") {
            const n = new Notification(`Message de ${who}`, { body: String(row.subject ?? ""), tag: String(row.id ?? "") });
            n.onclick = () => {
              window.focus();
              openFrom(row);
            };
          }
        }
      });
    } catch {
      /* temps réel indisponible : le rafraîchissement périodique prend le relais */
    }
    const poll = window.setInterval(() => {
      if (document.hidden) return;
      void live.current.loadCounts();
      if (live.current.offset === 0 && !live.current.openId) void live.current.loadList(true);
    }, 60000);
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
      window.clearInterval(poll);
    };
  }, [api, session]);

  const inboxUnread = counts[mailbox]?.inbox ?? 0;
  useEffect(() => {
    const base = view === "label" ? labels.find((l) => l.id === labelId)?.name ?? "Libellé" : VIEW_META[view].label;
    const title = `${inboxUnread ? `(${inboxUnread}) ` : ""}${search ? "Résultats de recherche" : base} — Messagerie Kalao`;
    document.title = title;
    // Next réécrit le titre des métadonnées après la navigation : on le repose ensuite.
    const t = window.setTimeout(() => {
      document.title = title;
    }, 400);
    return () => window.clearTimeout(t);
  }, [inboxUnread, view, labelId, labels, search, openId]);

  // --- Actions -------------------------------------------------------------
  const nextAfter = useCallback(
    (ids: string[]) => {
      const idx = rows.findIndex((r) => r.thread_id === openId);
      const remaining = rows.filter((r) => !ids.includes(r.thread_id));
      return remaining[Math.min(Math.max(idx, 0), remaining.length - 1)]?.thread_id ?? null;
    },
    [rows, openId]
  );

  const act = useCallback(
    (threadIds: string[], action: MailAction, opts?: { leave?: boolean; undo?: MailAction }) => {
      if (!threadIds.length) return;
      const leaving = Boolean(opts?.leave) && action.action !== "read" && action.action !== "unread";
      // Mise à jour immédiate de la liste (optimiste).
      setRows((list) => {
        if (leaving) return list.filter((r) => !threadIds.includes(r.thread_id));
        return list.map((r) => {
          if (!threadIds.includes(r.thread_id)) return r;
          switch (action.action) {
            case "read":
              return { ...r, unread_count: 0 };
            case "unread":
              return { ...r, unread_count: Math.max(1, r.unread_count) };
            case "star":
              return { ...r, starred: true };
            case "unstar":
              return { ...r, starred: false };
            case "important":
              return { ...r, important: true };
            case "unimportant":
              return { ...r, important: false };
            case "label_add":
              return { ...r, label_ids: [...new Set([...r.label_ids, action.labelId])] };
            case "label_remove":
              return { ...r, label_ids: r.label_ids.filter((id) => id !== action.labelId) };
            case "assign":
              return { ...r, assigned_to: action.userId };
            default:
              return r;
          }
        });
      });
      if (leaving || (action.action === "unread" && opts?.leave)) {
        setSelected((s) => new Set([...s].filter((id) => !threadIds.includes(id))));
        if (openId && threadIds.includes(openId)) {
          setInlineSeed(null);
          setOpenId(split && leaving ? nextAfter(threadIds) : null);
        }
      }
      void api
        .act({ threadIds }, action)
        .then(() => {
          const n = threadIds.length;
          if (action.action === "move") {
            const text = LEAVE_TEXT[action.folder];
            push({
              text: n > 1 ? text.replace("Conversation", `${n} conversations`).replace("placée", "placées").replace("archivée", "archivées").replace("signalée", "signalées").replace("déplacée", "déplacées") : text,
              actionLabel: opts?.undo ? "Annuler" : undefined,
              onAction: opts?.undo ? () => void api.act({ threadIds }, opts.undo as MailAction).then(refreshAll) : undefined,
            });
          } else if (action.action === "snooze" && action.until) {
            push({
              text: `En attente jusqu'au ${new Date(action.until).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.`,
              actionLabel: "Annuler",
              onAction: () => void api.act({ threadIds }, { action: "snooze", until: null }).then(refreshAll),
            });
          } else if (action.action === "restore") {
            push({ text: n > 1 ? `${n} conversations restaurées.` : "Conversation restaurée." });
          } else if (action.action === "delete_forever") {
            push({ text: "Supprimé définitivement." });
          } else if (action.action === "assign") {
            const who = directory.find((d) => d.profile_id === action.userId)?.full_name;
            push({ text: who ? `Attribué à ${who}.` : "Attribution retirée." });
          } else if (action.action === "move_mailbox") {
            push({ text: "Conversation rangée." });
          }
          void loadCounts();
          if (leaving) void loadList(true);
          if (openId && threadIds.includes(openId) && !leaving) setThreadReload((x) => x + 1);
        })
        .catch((err: Error) => {
          push({ tone: "error", text: err.message || "L'action a échoué." });
          void loadList(true);
        });
    },
    [api, push, refreshAll, loadCounts, loadList, openId, split, nextAfter, directory]
  );

  const createLabel = useCallback(
    async (name: string): Promise<MailLabel | null> => {
      const palette = ["#164B5A", "#E8A317", "#1a73e8", "#188038", "#9334e6", "#d93025", "#e37400"];
      try {
        await api.saveLabel({ name, color: palette[labels.length % palette.length] });
        const next = await api.labels();
        setLabels(next);
        push({ text: `Libellé « ${name} » créé.` });
        return next.find((l) => l.name.toLowerCase() === name.toLowerCase()) ?? null;
      } catch (err) {
        push({ tone: "error", text: err instanceof Error ? err.message : "Création impossible." });
        return null;
      }
    },
    [api, labels.length, push]
  );

  // --- Rédaction -----------------------------------------------------------
  const openCompose = useCallback(
    (seed: SeedBase, inline = false) => {
      if (inline && openId && (!seed.threadId || seed.threadId === openId)) {
        setInlineSeed(seed);
        return;
      }
      setComposes((list) => {
        const without = list.filter((c) => !(seed.draftId && c.draftId === seed.draftId));
        return [...without, seed].slice(-3);
      });
    },
    [openId]
  );

  const send = useSender({
    api,
    push,
    dismiss,
    undoSeconds: prefs.undoSeconds,
    reopen: (input) => openCompose(seedFromInput(input), false),
    onSent: (res) => {
      if (res.threadId) setOpenId(res.threadId);
    },
    onChanged: refreshAll,
  });

  const newMessage = useCallback(() => {
    if (!session) return;
    openCompose(newSeed({ mailbox, available: session.mailboxes, signature }));
  }, [session, mailbox, signature, openCompose]);

  const openRow = useCallback(
    async (row: MailThreadRow) => {
      setFocused(row.thread_id);
      if (view === "drafts") {
        try {
          const msgs = await api.thread(row.thread_id);
          const draft = msgs.filter((m) => m.folder === "drafts").pop();
          if (draft) {
            openCompose(draftSeed(draft));
            return;
          }
        } catch {
          /* on ouvre la conversation à la place */
        }
      }
      setInlineSeed(null);
      if (openId !== row.thread_id) window.history.pushState(null, "", window.location.href);
      setOpenId(row.thread_id);
      if (row.unread_count > 0) act([row.thread_id], { action: "read" });
    },
    [api, view, openCompose, openId, act]
  );

  const changeView = useCallback((next: MailView, nextLabel: string | null = null) => {
    setView(next);
    setLabelId(next === "label" ? nextLabel : null);
    setOffset(0);
    setOpenId(null);
    setInlineSeed(null);
    setSideOpen(false);
  }, []);

  const doSearch = useCallback((q: string) => {
    setSearch(q);
    setOffset(0);
    setOpenId(null);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const n = await api.refresh();
      if (n > 0) push({ text: `${n} nouveau(x) message(s) récupéré(s).` });
    } catch {
      /* la liste est quand même rechargée */
    } finally {
      await loadList(true);
      await loadCounts();
      setRefreshing(false);
    }
  }, [api, push, loadList, loadCounts]);

  const select = (mode: "all" | "none" | "read" | "unread" | "starred" | "unstarred") => {
    const pick = (r: MailThreadRow) =>
      mode === "all" ||
      (mode === "read" && r.unread_count === 0) ||
      (mode === "unread" && r.unread_count > 0) ||
      (mode === "starred" && r.starred) ||
      (mode === "unstarred" && !r.starred);
    setSelected(mode === "none" ? new Set() : new Set(rows.filter(pick).map((r) => r.thread_id)));
  };

  const toggleSelect = (id: string, shift: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shift && lastSelected.current) {
        const a = rows.findIndex((r) => r.thread_id === lastSelected.current);
        const b = rows.findIndex((r) => r.thread_id === id);
        if (a >= 0 && b >= 0) {
          const [lo, hi] = a < b ? [a, b] : [b, a];
          rows.slice(lo, hi + 1).forEach((r) => next.add(r.thread_id));
          return next;
        }
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    lastSelected.current = id;
  };

  // --- Raccourcis clavier (comme Gmail) ------------------------------------
  const openIndex = rows.findIndex((r) => r.thread_id === openId);
  const move = useCallback(
    (delta: number) => {
      if (!rows.length) return;
      const current = openId ?? focused;
      const idx = rows.findIndex((r) => r.thread_id === current);
      const next = rows[Math.min(Math.max(idx + delta, 0), rows.length - 1)];
      if (!next) return;
      if (openId) void openRow(next);
      else setFocused(next.thread_id);
    },
    [rows, openId, focused, openRow]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (showSettings || showHelp) return;
      const key = e.key;
      const target = selected.size ? [...selected] : openId ? [openId] : focused ? [focused] : [];
      const last = openMessages.current.filter((m) => m.folder !== "drafts").slice(-1)[0];
      const ctx = session ? { available: session.mailboxes, signature, workEmail: session.workEmail } : null;
      if (Date.now() - gPressed.current < 1200) {
        gPressed.current = 0;
        const map: Record<string, MailView> = { i: "inbox", s: "starred", t: "sent", d: "drafts", a: "all" };
        if (map[key]) {
          e.preventDefault();
          changeView(map[key]);
        }
        return;
      }
      switch (key) {
        case "g":
          gPressed.current = Date.now();
          return;
        case "c":
          e.preventDefault();
          newMessage();
          return;
        case "/":
          e.preventDefault();
          searchRef.current?.focus();
          return;
        case "?":
          setShowHelp(true);
          return;
        case "j":
          move(1);
          return;
        case "k":
          move(-1);
          return;
        case "o":
        case "Enter": {
          const row = rows.find((r) => r.thread_id === focused);
          if (row && !openId) void openRow(row);
          return;
        }
        case "u":
          if (openId) {
            setOpenId(null);
            setInlineSeed(null);
          }
          return;
        case "e":
          if (target.length) act(target, { action: "move", folder: "archive" }, { leave: true, undo: { action: "move", folder: "inbox" } });
          return;
        case "#":
          if (target.length) act(target, { action: "move", folder: "deleted" }, { leave: true, undo: { action: "restore" } });
          return;
        case "!":
          if (target.length) act(target, { action: "move", folder: "spam" }, { leave: true, undo: { action: "restore" } });
          return;
        case "s": {
          const row = rows.find((r) => r.thread_id === (openId ?? focused));
          if (row) act([row.thread_id], { action: row.starred ? "unstar" : "star" });
          return;
        }
        case "x":
          if (focused) toggleSelect(focused, false);
          return;
        case "I":
          if (target.length) act(target, { action: "read" });
          return;
        case "U":
          if (target.length) act(target, { action: "unread" }, { leave: true });
          return;
        case "r":
        case "a":
        case "f":
          if (openId && last && ctx) {
            e.preventDefault();
            openCompose(key === "f" ? forwardSeed(last, ctx) : replySeed(last, key === "a" ? "replyAll" : "reply", ctx), true);
          }
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, selected, openId, focused, session, signature, showSettings, showHelp, move, act, openRow, newMessage, changeView, openCompose]);

  // --- Rendu ---------------------------------------------------------------
  if (bootError) {
    return (
      <div className="kmail" ref={rootRef} style={{ display: "block" }}>
        <div className="km-empty">
          <i className="ti ti-mail-off" />
          {bootError}
        </div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="kmail" ref={rootRef}>
        <div className="km-side" />
        <div className="km-main">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="km-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const composeProps = {
    api,
    session,
    templates,
    push,
    onTemplatesChanged: () => void reloadMeta(),
    onDraftSaved: () => void loadCounts(),
  };

  return (
    <div ref={rootRef} className={`kmail${prefs.density === "compact" ? " compact" : ""}${sideOpen ? " side-open" : ""}`}>
      <MailSidebar
        mailboxes={session.mailboxes}
        mailbox={mailbox}
        view={view}
        labelId={labelId}
        counts={counts}
        labels={labels}
        isAdmin={session.isAdmin}
        onCompose={newMessage}
        onMailbox={(box) => {
          setMailbox(box);
          setOffset(0);
          setOpenId(null);
          setSideOpen(false);
        }}
        onView={changeView}
        onCreateLabel={() => {
          const name = window.prompt("Nom du nouveau libellé :");
          if (name?.trim()) void createLabel(name.trim());
        }}
        onEditLabel={(l) => {
          const name = window.prompt("Nouveau nom du libellé :", l.name);
          if (name?.trim() && name.trim() !== l.name) {
            void api.saveLabel({ id: l.id, name: name.trim(), color: l.color }).then(reloadMeta).catch((err: Error) => push({ tone: "error", text: err.message }));
          }
        }}
        onDeleteLabel={(l) => {
          if (window.confirm(`Supprimer le libellé « ${l.name} » ? Les messages ne sont pas supprimés.`)) {
            void api
              .deleteLabel(l.id)
              .then(() => {
                if (labelId === l.id) changeView("inbox");
                return reloadMeta();
              })
              .catch((err: Error) => push({ tone: "error", text: err.message }));
          }
        }}
      />

      <main className="km-main">
        <div className="km-top">
          <IconButton icon="ti ti-menu-2" title="Dossiers" className="km-side-toggle" onClick={() => setSideOpen((v) => !v)} />
          <MailSearch ref={searchRef} value={search} onSearch={doSearch} />
          <span className="km-spacer km-desktop-only" style={{ flex: 1 }} />
          <IconButton icon="ti ti-keyboard" title="Raccourcis clavier (?)" className="km-desktop-only" onClick={() => setShowHelp(true)} />
          <IconButton icon="ti ti-settings" title="Paramètres" onClick={() => setShowSettings(true)} />
        </div>
        {session.isAdmin ? <KalaoMailDnsBanner /> : null}
        {search ? (
          <div className="km-banner info">
            <i className="ti ti-search" /> Résultats pour « {search} »
            <button type="button" className="btn btn-link btn-sm ms-auto p-0" onClick={() => doSearch("")}>
              Effacer la recherche
            </button>
          </div>
        ) : null}
        <div className={`km-body${split ? " split" : ""}${openId ? " has-open" : ""}`}>
          {!openId || split ? (
            <div className="km-list-pane">
              <MailToolbar
                rows={rows}
                selected={selected}
                view={view}
                total={total}
                offset={offset}
                pageSize={prefs.pageSize}
                labels={labels}
                directory={directory}
                isAdmin={session.isAdmin}
                refreshing={refreshing}
                onSelect={select}
                onRefresh={() => void refresh()}
                onAction={act}
                onPage={(o) => {
                  setOffset(o);
                  setOpenId(null);
                }}
                onCreateLabel={(name) => {
                  void createLabel(name).then((l) => {
                    if (l && selected.size) act([...selected], { action: "label_add", labelId: l.id });
                  });
                }}
                onEmptyTrash={() => {
                  if (window.confirm("Supprimer définitivement toutes les conversations de cette page ? Action irréversible.")) {
                    act(rows.map((r) => r.thread_id), { action: "delete_forever" }, { leave: true });
                  }
                }}
              />
              <div className="km-list">
                <MailList
                  rows={rows}
                  loading={loading}
                  error={listError}
                  view={view}
                  showMailbox={false}
                  labels={labels}
                  directory={directory}
                  selected={selected}
                  focusedId={focused}
                  openId={openId}
                  showSnippets={prefs.showSnippets && !split}
                  userId={session.userId}
                  searching={Boolean(search)}
                  onToggleSelect={toggleSelect}
                  onOpen={(row) => void openRow(row)}
                  onAction={act}
                  onRetry={() => void loadList()}
                />
              </div>
            </div>
          ) : null}
          {openId ? (
            <div className="km-reading-pane">
              <MailThread
                key={openId}
                api={api}
                session={session}
                threadId={openId}
                view={view}
                labels={labels}
                directory={directory}
                signature={signature}
                reloadKey={threadReload}
                onBack={() => {
                  setOpenId(null);
                  setInlineSeed(null);
                }}
                backMobileOnly={split}
                onPrev={openIndex > 0 ? () => move(-1) : undefined}
                onNext={openIndex >= 0 && openIndex < rows.length - 1 ? () => move(1) : undefined}
                position={openIndex >= 0 ? `${offset + openIndex + 1} sur ${total}` : undefined}
                onAction={act}
                onCompose={openCompose}
                onCreateLabel={createLabel}
                onCancelScheduled={(id) =>
                  void api
                    .cancelScheduled(id)
                    .then(async () => {
                      push({ text: "Envoi programmé annulé : le message est dans les brouillons." });
                      const msgs = await api.thread(openId);
                      const draft = msgs.find((m) => m.id === id);
                      if (draft) openCompose(draftSeed(draft));
                      refreshAll();
                    })
                    .catch((err: Error) => push({ tone: "error", text: err.message }))
                }
                onDiscardDraft={(id) =>
                  void api
                    .discardDraft(id)
                    .then(() => {
                      push({ text: "Brouillon supprimé." });
                      refreshAll();
                    })
                    .catch((err: Error) => push({ tone: "error", text: err.message }))
                }
                onLoaded={(msgs) => {
                  openMessages.current = msgs;
                }}
                onChanged={refreshAll}
                composeSlot={
                  inlineSeed ? (
                    <MailCompose
                      key={inlineSeed.key}
                      {...composeProps}
                      seed={inlineSeed}
                      variant="inline"
                      onClose={() => setInlineSeed(null)}
                      onSend={send}
                    />
                  ) : null
                }
              />
            </div>
          ) : split ? (
            <div className="km-reading-pane d-none d-lg-block">
              <div className="km-empty">
                <i className="ti ti-mail-opened" />
                Sélectionnez une conversation pour la lire.
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {!composes.length && !openId ? (
        <button type="button" className="km-fab" onClick={newMessage} aria-label="Nouveau message">
          <i className="ti ti-pencil" /> Nouveau
        </button>
      ) : null}

      <div className="km-compose-dock">
        {composes.map((seed) => (
          <MailCompose
            key={seed.key}
            {...composeProps}
            seed={seed}
            onClose={() => setComposes((list) => list.filter((c) => c.key !== seed.key))}
            onSend={send}
          />
        ))}
      </div>

      <Toasts toasts={toasts} dismiss={dismiss} />

      {showSettings ? (
        <MailSettings
          api={api}
          session={session}
          prefs={prefs}
          onPrefs={setPrefs}
          signature={signature}
          onSignature={setSignature}
          templates={templates}
          labels={labels}
          onReload={() => void reloadMeta()}
          onClose={() => setShowSettings(false)}
          push={push}
        />
      ) : null}

      {showHelp ? (
        <MailModal title="Raccourcis clavier" onClose={() => setShowHelp(false)}>
          <table className="table table-sm mb-0">
            <tbody>
              {SHORTCUTS.map(([k, label]) => (
                <tr key={k}>
                  <td style={{ width: 200 }}>
                    <span className="km-kbd">{k}</span>
                  </td>
                  <td>{label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MailModal>
      ) : null}
    </div>
  );
}
