"use client";

import { useEffect, useState } from "react";
import { createSupabaseMailApi } from "@/lib/mail/client";

/** Pastille « non lus » de l'icône mail de l'en-tête (toutes les boîtes visibles, réception uniquement). */
export default function MailUnreadBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let alive = true;
    const api = createSupabaseMailApi();
    const load = () =>
      api
        .counts()
        .then((all) => {
          if (alive) setCount(Object.values(all).reduce((sum, c) => sum + (c.inbox ?? 0), 0));
        })
        .catch(() => undefined);
    void load();
    let unsubscribe = () => {};
    try {
      unsubscribe = api.subscribe(() => void load());
    } catch {
      /* pas de temps réel : rafraîchissement périodique */
    }
    const poll = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 90000);
    return () => {
      alive = false;
      unsubscribe();
      window.clearInterval(poll);
    };
  }, []);
  if (!count) return null;
  return (
    <span
      className="position-absolute badge rounded-pill bg-danger"
      style={{ top: 2, right: -2, fontSize: 10, padding: "3px 5px" }}
      aria-label={`${count} message(s) non lu(s)`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
