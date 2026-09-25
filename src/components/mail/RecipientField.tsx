"use client";

import { useEffect, useRef, useState } from "react";
import { isValidEmail, splitRecipients } from "@/lib/mail/format";
import type { MailApi, Suggestion } from "@/lib/mail/client";

/** Champ À / Cc / Cci : adresses en pastilles, autocomplétion contacts / entreprises / collègues, collage multiple. */
export default function RecipientField({
  label,
  value,
  onChange,
  api,
  autoFocus,
  trailing,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  api: MailApi;
  autoFocus?: boolean;
  trailing?: React.ReactNode;
}) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = text.trim();
    if (!q || !focused) {
      setSuggestions([]);
      return;
    }
    let alive = true;
    const t = window.setTimeout(() => {
      void api
        .suggest(q)
        .then((list) => {
          if (alive) {
            setSuggestions(list.filter((s) => !value.includes(s.email)));
            setActive(0);
          }
        })
        .catch(() => undefined);
    }, 150);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [text, focused, api, value]);

  const add = (raw: string) => {
    const emails = splitRecipients(raw);
    if (!emails.length) return;
    const next = [...value];
    for (const e of emails) if (!next.includes(e)) next.push(e);
    onChange(next);
    setText("");
    setSuggestions([]);
  };

  return (
    <div className="km-field" onClick={() => inputRef.current?.focus()}>
      <label>{label}</label>
      <div className="km-recipients">
        {value.map((email) => (
          <span key={email} className={`km-recipient${isValidEmail(email) ? "" : " invalid"}`} title={email}>
            <span className="text-truncate">{email}</span>
            <button
              type="button"
              aria-label={`Retirer ${email}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((v) => v !== email));
              }}
            >
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={text}
          autoFocus={autoFocus}
          aria-label={label}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setFocused(false);
              if (text.trim()) add(text);
            }, 150);
          }}
          onChange={(e) => {
            const v = e.target.value;
            if (/[,;\s]$/.test(v) && v.trim().includes("@")) add(v);
            else setText(v);
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            if (/[,;\n]/.test(pasted)) {
              e.preventDefault();
              add(pasted);
            }
          }}
          onKeyDown={(e) => {
            if (suggestions.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              e.preventDefault();
              setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length);
              return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
              if (suggestions[active] && text.trim()) {
                e.preventDefault();
                add(suggestions[active].email);
              } else if (text.trim()) {
                e.preventDefault();
                add(text);
              }
            } else if (e.key === "Backspace" && !text && value.length) {
              onChange(value.slice(0, -1));
            } else if (e.key === "Escape" && suggestions.length) {
              e.stopPropagation();
              setSuggestions([]);
            }
          }}
          style={{ minWidth: 120 }}
        />
        {suggestions.length ? (
          <div className="km-suggest" role="listbox">
            {suggestions.map((s, i) => (
              <button
                key={s.email}
                type="button"
                className={i === active ? "active" : ""}
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(s.email);
                }}
              >
                <i className={s.kind === "staff" ? "ti ti-user-star" : s.kind === "company" ? "ti ti-building" : "ti ti-user"} />
                <span className="d-flex flex-column">
                  <span>{s.name || s.email}</span>
                  {s.name ? <span className="text-muted small">{s.email}</span> : null}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}
