"use client";

import { useEffect, useState } from "react";

export async function fetchCrmResource<T>(resource: string): Promise<T[]> {
  const response = await fetch(`/api/v1/${resource}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API ${resource}`);
  }
  const json = (await response.json()) as { data: T[] };
  return json.data ?? [];
}

export function useCrmCollection<T>(resource: string, fallback: T[]) {
  const [data, setData] = useState<T[]>(fallback);
  const [reloadTick, setReloadTick] = useState(0);

  const reload = () => setReloadTick((tick) => tick + 1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const rows = await fetchCrmResource<T>(resource);
        if (!cancelled) {
          setData(rows);
        }
      } catch {
        if (!cancelled) {
          setData(fallback);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [resource, reloadTick]);

  return { data, reload };
}

export function useCrmList<T>(resource: string, fallback: T[]) {
  const { data } = useCrmCollection<T>(resource, fallback);
  return data;
}
