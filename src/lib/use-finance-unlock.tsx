"use client";

import { useCallback, useState, type ReactNode } from "react";
import FinanceUnlockModal from "@/components/finance/FinanceUnlockModal";
import { isFinanceUnlockError } from "@/lib/finance-unlock";

export function useFinanceUnlock() {
  const [open, setOpen] = useState(false);
  const [retry, setRetry] = useState<(() => Promise<void>) | null>(null);

  const run = useCallback(async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      if (isFinanceUnlockError(err)) {
        setRetry(() => fn);
        setOpen(true);
        return;
      }
      throw err;
    }
  }, []);

  const modal: ReactNode = open ? (
    <FinanceUnlockModal
      onClose={() => {
        setOpen(false);
        setRetry(null);
      }}
      onUnlocked={() => {
        const next = retry;
        setOpen(false);
        setRetry(null);
        if (next) void next();
      }}
    />
  ) : null;

  return { run, modal };
}
