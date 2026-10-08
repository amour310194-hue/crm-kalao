"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Hit = { href: string; label: string };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || query.trim().length < 2 || !isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    const term = `%${query.trim()}%`;
    void Promise.all([
      supabase.from("contacts").select("id, first_name, last_name").or(`first_name.ilike.${term},last_name.ilike.${term}`).limit(5),
      supabase.from("dossiers").select("id, title").ilike("title", term).limit(5),
      supabase.from("invoices").select("id, number").ilike("number", term).limit(5),
    ]).then(([contacts, dossiers, invoices]) => {
      const next: Hit[] = [];
      for (const row of contacts.data ?? []) next.push({ href: `/crm/contact-details?id=${row.id}`, label: `${row.first_name} ${row.last_name}` });
      for (const row of dossiers.data ?? []) next.push({ href: `/crm/project-details?id=${row.id}`, label: row.title });
      for (const row of invoices.data ?? []) next.push({ href: `/docs/invoice/${row.id}`, label: row.number ?? "Facture" });
      setHits(next);
    });
  }, [open, query]);

  if (!open) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,.35)", zIndex: 2000 }} onClick={() => setOpen(false)}>
      <div className="bg-white rounded shadow p-3 mx-auto mt-5" style={{ maxWidth: 520 }} onClick={(event) => event.stopPropagation()}>
        <input className="form-control" autoFocus placeholder="Clients, dossiers, factures" value={query} onChange={(e) => setQuery(e.target.value)} />
        <ul className="list-unstyled mt-2 mb-0">
          {hits.map((hit) => (
            <li key={hit.href}><a href={hit.href}>{hit.label}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
