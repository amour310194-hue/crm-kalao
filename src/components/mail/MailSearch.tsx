"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { buildSearchQuery } from "@/lib/mail/search";
import { IconButton } from "@/components/mail/ui";

type Props = {
  value: string;
  onSearch: (query: string) => void;
};

/** Barre de recherche avec opérateurs (de:, à:, objet:, has:attachment…) et panneau de recherche avancée. */
const MailSearch = forwardRef<HTMLInputElement, Props>(function MailSearch({ value, onSearch }, ref) {
  const [text, setText] = useState(value);
  const [advanced, setAdvanced] = useState(false);
  const [fields, setFields] = useState({ from: "", to: "", subject: "", words: "", hasAttachment: false, after: "", before: "" });
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (!advanced) return;
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setAdvanced(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [advanced]);

  const set = (key: keyof typeof fields, v: string | boolean) => setFields((f) => ({ ...f, [key]: v }));

  return (
    <div className="km-search" ref={wrap}>
      <form
        className="km-search-box"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(text.trim());
        }}
      >
        <IconButton icon="ti ti-search" title="Rechercher" onClick={() => onSearch(text.trim())} />
        <input
          ref={ref}
          type="search"
          placeholder="Rechercher dans les messages (ex. de:client@ex.com has:attachment)"
          aria-label="Rechercher dans les messages"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
              if (text) {
                setText("");
                onSearch("");
              }
            }
          }}
        />
        {text ? (
          <IconButton
            icon="ti ti-x"
            title="Effacer la recherche"
            onClick={() => {
              setText("");
              onSearch("");
            }}
          />
        ) : null}
        <IconButton icon="ti ti-adjustments-horizontal" title="Recherche avancée" onClick={() => setAdvanced((v) => !v)} />
      </form>
      {advanced ? (
        <div className="km-search-adv">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = buildSearchQuery(fields);
              setText(q);
              onSearch(q);
              setAdvanced(false);
            }}
          >
            {([
              ["from", "De"],
              ["to", "À"],
              ["subject", "Objet"],
              ["words", "Contient les mots"],
            ] as const).map(([key, label]) => (
              <div className="row align-items-center" key={key}>
                <label className="col-4 col-form-label col-form-label-sm">{label}</label>
                <div className="col-8">
                  <input className="form-control form-control-sm" value={fields[key]} onChange={(e) => set(key, e.target.value)} />
                </div>
              </div>
            ))}
            <div className="row align-items-center">
              <label className="col-4 col-form-label col-form-label-sm">Après le</label>
              <div className="col-8">
                <input type="date" className="form-control form-control-sm" value={fields.after} onChange={(e) => set("after", e.target.value)} />
              </div>
            </div>
            <div className="row align-items-center">
              <label className="col-4 col-form-label col-form-label-sm">Avant le</label>
              <div className="col-8">
                <input type="date" className="form-control form-control-sm" value={fields.before} onChange={(e) => set("before", e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-8 offset-4">
                <div className="form-check">
                  <input
                    id="km-has-att"
                    type="checkbox"
                    className="form-check-input"
                    checked={fields.hasAttachment}
                    onChange={(e) => set("hasAttachment", e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="km-has-att">
                    Contenant une pièce jointe
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="small text-muted">
                Astuce : <code>de:</code> <code>à:</code> <code>objet:</code> <code>has:attachment</code> <code>is:unread</code>{" "}
                <code>après:2026-09-01</code> <code>label:visa</code>
              </span>
              <button type="submit" className="btn btn-primary btn-sm">
                Rechercher
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
});

export default MailSearch;
