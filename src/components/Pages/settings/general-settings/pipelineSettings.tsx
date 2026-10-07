"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import GeneralSettingsNav from "./generalSettingsNav";
import PipelineEditor from "@/components/crm/PipelineEditor";
import { PIPELINE_DEFAULTS, PIPELINE_SLUG_LABEL, type PipelineSlug } from "@/lib/pipeline-config";
import type { PipelineStep } from "@/lib/visa-pipeline";

export default function PipelineSettingsComponent() {
  const [pipelines, setPipelines] = useState(PIPELINE_DEFAULTS);
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState<PipelineSlug | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    void (async () => {
      try {
        const res = await fetch("/api/pipelines", { credentials: "include" });
        const json = (await res.json()) as {
          pipelines?: Record<PipelineSlug, PipelineStep[]>;
          canEdit?: boolean;
        };
        if (json.pipelines) setPipelines({ ...PIPELINE_DEFAULTS, ...json.pipelines });
        setCanEdit(Boolean(json.canEdit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chargement impossible.");
      }
    })();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader title="Paramètres" badgeCount={false} showModuleTile={false} showExport={false} />
          <SettingsTopbar />
          <div className="row">
            <div className="col-xl-3 col-lg-12 theiaStickySidebar">
              <GeneralSettingsNav />
            </div>
            <div className="col-xl-9 col-lg-12">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-2">Pipelines de procédure</h5>
                  <p className="text-muted">
                    Définissez l’ordre des étapes. « Clôturé » reste toujours la dernière étape.
                  </p>
                  {(Object.keys(PIPELINE_SLUG_LABEL) as PipelineSlug[]).map((slug) => (
                    <div className="border rounded p-3 mb-3" key={slug}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{PIPELINE_SLUG_LABEL[slug]}</h6>
                        {canEdit ? (
                          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditing(slug)}>
                            Modifier
                          </button>
                        ) : null}
                      </div>
                      <ol className="mb-0 ps-3">
                        {(pipelines[slug] ?? []).map((step) => (
                          <li key={step.key}>{step.label}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {editing ? (
        <PipelineEditor
          slug={editing}
          steps={pipelines[editing]}
          onClose={() => setEditing(null)}
          onSaved={(next) => {
            setPipelines((prev) => ({ ...prev, [editing]: next }));
            load();
          }}
        />
      ) : null}
    </>
  );
}
