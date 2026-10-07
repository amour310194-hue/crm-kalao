"use client";

import { useState } from "react";
import { authJsonHeaders } from "@/lib/auth-headers";
import { PIPELINE_SLUG_LABEL, type PipelineSlug } from "@/lib/pipeline-config";
import type { PipelineStep } from "@/lib/visa-pipeline";

export default function PipelineEditor({
  slug,
  steps,
  onClose,
  onSaved,
}: {
  slug: PipelineSlug;
  steps: PipelineStep[];
  onClose: () => void;
  onSaved: (next: PipelineStep[]) => void;
}) {
  const [rows, setRows] = useState<PipelineStep[]>(
    steps.length ? steps : [{ key: "consult", label: "Consultation" }, { key: "done", label: "Clôturé" }]
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const move = (index: number, dir: -1 | 1) => {
    const next = rows.slice();
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setRows(next);
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configurer le pipeline — {PIPELINE_SLUG_LABEL[slug]}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="text-muted small">
              L’étape « Clôturé » est toujours placée en dernier, quelle que soit sa position dans la liste.
            </p>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {rows.map((step, i) => (
              <div className="d-flex gap-2 align-items-center mb-2" key={`${step.key}-${i}`}>
                <span className="badge bg-dark">{i + 1}</span>
                <input
                  className="form-control"
                  value={step.label}
                  onChange={(e) => {
                    const next = rows.slice();
                    next[i] = { ...step, label: e.target.value };
                    setRows(next);
                  }}
                />
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setRows(rows.filter((_, j) => j !== i))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setRows([...rows, { key: `etape_${rows.length + 1}`, label: `Étape ${rows.length + 1}` }])
              }
            >
              Ajouter une étape
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  const res = await fetch("/api/pipelines", {
                    method: "PUT",
                    credentials: "include",
                    headers: await authJsonHeaders(),
                    body: JSON.stringify({ slug, steps: rows }),
                  });
                  const json = (await res.json()) as { ok?: boolean; pipelines?: Record<string, PipelineStep[]>; message?: string };
                  if (!res.ok || !json.ok) throw new Error(json.message || "Enregistrement impossible.");
                  onSaved(json.pipelines?.[slug] ?? rows);
                  onClose();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Enregistrement impossible.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Enregistrement…" : "Enregistrer le pipeline"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
