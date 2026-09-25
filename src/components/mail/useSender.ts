"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MailApi, SendResult } from "@/lib/mail/client";
import type { ComposeInput } from "@/lib/mail/types";
import type { Toast } from "@/components/mail/ui";

type Push = (toast: Omit<Toast, "id">) => number;

/**
 * Envoi avec « Annuler » (comme Gmail) : le mail est déjà enregistré en brouillon,
 * puis réellement envoyé après le délai. Annuler rouvre la fenêtre de rédaction.
 * Envoi programmé : envoyé tout de suite à Resend avec une date, annulable depuis le toast ou « Programmés ».
 */
export function useSender(options: {
  api: MailApi;
  push: Push;
  dismiss: (id: number) => void;
  undoSeconds: number;
  reopen: (input: ComposeInput) => void;
  onSent?: (result: SendResult) => void;
  onChanged?: () => void;
}) {
  const { api, push, dismiss, undoSeconds, reopen, onSent, onChanged } = options;
  const pending = useRef(new Map<number, number>());

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (pending.current.size) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const deliver = useCallback(
    async (input: ComposeInput, force = false) => {
      const sending = push({ text: input.scheduledAt ? "Programmation…" : "Envoi en cours…", duration: 0 });
      try {
        const res = await api.send(input, force);
        dismiss(sending);
        if (res.reason === "suppressed" && res.suppressed?.length) {
          const list = res.suppressed.map((s) => s.email).join(", ");
          push({
            tone: "error",
            text: `${list} a rejeté ou signalé vos mails précédents. Le message reste dans les brouillons.`,
            actionLabel: "Envoyer quand même",
            onAction: () => void deliver(input, true),
            duration: 15000,
          });
          onChanged?.();
          return;
        }
        if (!res.ok) {
          push({
            tone: "error",
            text: `Échec de l'envoi${res.detail ? ` : ${res.detail}` : res.reason === "resend_missing" ? " : service d'envoi non configuré" : ""}. Le message est dans les brouillons.`,
            actionLabel: "Ouvrir",
            onAction: () => reopen({ ...input, draftId: res.id ?? input.draftId }),
            duration: 15000,
          });
          onChanged?.();
          return;
        }
        if (res.scheduled && input.scheduledAt) {
          const when = new Date(input.scheduledAt).toLocaleString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
          push({
            text: `Envoi programmé pour ${when}.`,
            actionLabel: "Annuler",
            onAction: () => {
              void api
                .cancelScheduled(res.id as string)
                .then(() => {
                  reopen({ ...input, draftId: res.id, scheduledAt: null });
                  onChanged?.();
                })
                .catch((err: Error) => push({ tone: "error", text: err.message }));
            },
          });
        } else {
          push({
            text: "Message envoyé.",
            actionLabel: onSent ? "Afficher" : undefined,
            onAction: onSent ? () => onSent(res) : undefined,
          });
        }
        onChanged?.();
      } catch (err) {
        dismiss(sending);
        push({
          tone: "error",
          text: err instanceof Error ? err.message : "Échec de l'envoi.",
          actionLabel: "Ouvrir",
          onAction: () => reopen(input),
          duration: 15000,
        });
        onChanged?.();
      }
    },
    [api, push, dismiss, reopen, onSent, onChanged]
  );

  return useCallback(
    (input: ComposeInput) => {
      if (input.scheduledAt || undoSeconds <= 0) {
        void deliver(input);
        return;
      }
      let toastId = 0;
      const timer = window.setTimeout(() => {
        pending.current.delete(toastId);
        dismiss(toastId);
        void deliver(input);
      }, undoSeconds * 1000);
      toastId = push({
        text: "Envoi du message…",
        actionLabel: "Annuler",
        duration: undoSeconds * 1000 + 200,
        onAction: () => {
          window.clearTimeout(timer);
          pending.current.delete(toastId);
          push({ text: "Envoi annulé." });
          reopen(input);
        },
      });
      pending.current.set(toastId, timer);
    },
    [deliver, dismiss, push, reopen, undoSeconds]
  );
}
