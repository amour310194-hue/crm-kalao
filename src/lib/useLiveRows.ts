import { useCallback, useEffect, useState } from "react";

/**
 * Charge des lignes Supabase. En cas d’échec ou de liste vide, on affiche
 * vide — jamais le JSON de démo du template.
 */
export function useLiveRows<T>(_fallback: T[], load: () => Promise<T[] | null>) {
  const [rows, setRows] = useState<T[]>([]);
  const [live, setLive] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await load();
      setRows(data ?? []);
      setLive(true);
    } catch (err) {
      console.error("[crm] live rows", err);
      setRows([]);
      setLive(true);
    }
  }, [load]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { rows, live, reload };
}
