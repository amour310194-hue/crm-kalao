"use client";

import { useEffect, useRef } from "react";

export default function KalaoOtpBoxes({
  value,
  onChange,
  onComplete,
  disabled,
  idPrefix,
}: {
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  idPrefix: string;
}) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const done = useRef("");

  useEffect(() => {
    if (disabled) return;
    const firstEmpty = digits.findIndex((d) => !d);
    const target = firstEmpty === -1 ? 5 : firstEmpty;
    refs.current[target]?.focus();
  }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps -- focus once when the row appears

  useEffect(() => {
    if (value.length === 6 && value !== done.current) {
      done.current = value;
      onComplete?.(value);
    }
    if (value.length < 6) done.current = "";
  }, [value, onComplete]);

  const setAt = (index: number, nextDigit: string) => {
    const chars = digits.slice();
    chars[index] = nextDigit;
    onChange(chars.join("").replace(/\D/g, "").slice(0, 6));
  };

  return (
    <div className="kalao-otp-boxes" role="group" aria-label="Code à 6 chiffres">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`${idPrefix}-${index}`}
          ref={(el) => {
            refs.current[index] = el;
          }}
          className="kalao-otp-cell"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Chiffre ${index + 1}`}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            if (raw.length > 1) {
              onChange(raw.slice(0, 6));
              const next = Math.min(raw.length, 5);
              refs.current[next]?.focus();
              return;
            }
            setAt(index, raw.slice(-1));
            if (raw) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[index] && index > 0) {
              setAt(index - 1, "");
              refs.current[index - 1]?.focus();
            }
            if (e.key === "ArrowLeft") refs.current[Math.max(0, index - 1)]?.focus();
            if (e.key === "ArrowRight") refs.current[Math.min(5, index + 1)]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!pasted) return;
            onChange(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
        />
      ))}
    </div>
  );
}
