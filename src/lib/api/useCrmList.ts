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

export function useCrmList<T>(resource: string, fallback: T[]) {
  const [data, setData] = useState<T[]>(fallback);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const rows = await fetchCrmResource<T>(resource);
        if (!cancelled && rows.length) {
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
  }, [resource]);

  return data;
}
