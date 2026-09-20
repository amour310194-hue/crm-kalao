import { useCallback, useEffect, useState } from "react";

export function useLiveRows<T>(fallback: T[], load: () => Promise<T[] | null>) {
  const [rows, setRows] = useState<T[]>(fallback);
  const [live, setLive] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await load();
      if (data) {
        setRows(data);
        setLive(true);
      }
    } catch (err) {
      console.error("[crm] live rows", err);
      setLive(false);
    }
  }, [load]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { rows, live, reload };
}
