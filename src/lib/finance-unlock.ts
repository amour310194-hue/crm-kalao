export const FINANCE_UNLOCK_ERROR = "FINANCE_UNLOCK_REQUIRED";

export function isFinanceUnlockError(err: unknown): boolean {
  return err instanceof Error && err.message === FINANCE_UNLOCK_ERROR;
}

export async function financeUnlockStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/finance/unlock/status", { credentials: "include" });
    const json = (await res.json()) as { ok?: boolean };
    return Boolean(json.ok);
  } catch {
    return false;
  }
}

export async function assertFinanceUnlocked() {
  if (!(await financeUnlockStatus())) {
    throw new Error(FINANCE_UNLOCK_ERROR);
  }
}
