"use client";

/** Préférences d'affichage par navigateur (comme les réglages locaux de Gmail). */

export type MailPrefs = {
  readingPane: "right" | "none";
  undoSeconds: 0 | 5 | 10 | 20 | 30;
  pageSize: 25 | 50 | 100;
  density: "comfortable" | "compact";
  desktopNotifications: boolean;
  showSnippets: boolean;
};

export const DEFAULT_PREFS: MailPrefs = {
  readingPane: "right",
  undoSeconds: 10,
  pageSize: 50,
  density: "comfortable",
  desktopNotifications: false,
  showSnippets: true,
};

const KEY = "kalao.mail.prefs.v1";

export function loadPrefs(): MailPrefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<MailPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: MailPrefs): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* navigation privée : on garde les réglages en mémoire */
  }
}
