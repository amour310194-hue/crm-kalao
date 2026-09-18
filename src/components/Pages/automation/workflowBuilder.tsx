"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { all_routes } from "@/router/all_routes";
import {
  WorkflowBlocksData,
  WorkflowPaletteSections,
  type WorkflowBlockData,
} from "../../../core/json/workflowBlocksData";
import { WorkflowTemplatesData } from "../../../core/json/workflowTemplatesData";

const route = all_routes;

interface CanvasStep {
  id: string;
  type: string;
}

const DEFAULT_STEPS: CanvasStep[] = [
  { id: "s1", type: "deal-stage-changed" },
  { id: "s2", type: "score-check" },
  { id: "s3", type: "notify-slack" },
  { id: "s4", type: "create-task" },
  { id: "s5", type: "wait-delay" },
];

const blockFor = (type: string): WorkflowBlockData | undefined =>
  WorkflowBlocksData.find((b) => b.Type === type);

let nextStepId = 100;

const WorkflowBuilderComponent = () => {
  const [steps, setSteps] = useState<CanvasStep[]>(DEFAULT_STEPS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);
  const [testRun, setTestRun] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const addStep = (type: string) => {
    const id = `s${nextStepId++}`;
    setSteps((prev) => [...prev, { id, type }]);
    setSelectedId(id);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((sel) => (sel === id ? null : sel));
  };

  const moveStep = (id: string, dir: -1 | 1) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const duplicateStep = (id: string) => {
    const idx = steps.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const clone = { id: `s${nextStepId++}`, type: steps[idx].type };
    setSteps((prev) => [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)]);
  };

  const applyTemplate = (templateId: string) => {
    const tpl = WorkflowTemplatesData.find((t) => t.Id === templateId);
    if (!tpl) return;
    setSteps(tpl.Steps.map((s) => ({ id: `s${nextStepId++}`, type: s.Type })));
    setSelectedId(null);
  };

  const clearCanvas = () => {
    setSteps([]);
    setSelectedId(null);
  };

  const runTest = () => {
    setTestRun(
      `Test run against a sample record completed - ${steps.length} of ${steps.length} steps ran successfully in 0.8s.`
    );
  };

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return WorkflowPaletteSections.map((section) => ({
      ...section,
      blocks: WorkflowBlocksData.filter(
        (b) =>
          b.Group === section.Group &&
          (!q || b.Title.toLowerCase().includes(q) || b.Description.toLowerCase().includes(q))
      ),
    })).filter((s) => s.blocks.length > 0);
  }, [search]);

  const selectedStep = steps.find((s) => s.id === selectedId) ?? null;
  const selectedBlock = selectedStep ? blockFor(selectedStep.type) : null;

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div>
              <h4 className="mb-1">Workflow Builder</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">Automation</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Workflow Builder
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light shadow"
                data-bs-toggle="modal"
                data-bs-target="#workflow_templates_modal"
              >
                <i className="ti ti-layout-grid me-1" />
                Templates
              </button>
              <Link
                href={route.automationLogs}
                className="btn btn-outline-light shadow"
              >
                <i className="ti ti-history me-1" />
                Run History
              </Link>
              <button
                type="button"
                className="btn btn-outline-light shadow"
                onClick={runTest}
              >
                <i className="ti ti-player-play me-1" />
                Test Run
              </button>
              <button
                type="button"
                className="btn btn-outline-light shadow"
                onClick={() => showToast("Workflow saved as draft.")}
              >
                <i className="ti ti-file-text me-1" />
                Save as Draft
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => showToast("Workflow saved.")}
              >
                <i className="ti ti-device-floppy me-1" />
                Save Workflow
              </button>
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-icon btn-outline-light shadow"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="More actions"
                >
                  <i className="ti ti-dots-vertical" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => showToast("Workflow duplicated.")}
                    >
                      <i className="ti ti-copy me-1" />
                      Duplicate workflow
                    </button>
                  </li>
                  <li>
                    <Link className="dropdown-item" href={route.automationRules}>
                      <i className="ti ti-list-check me-1" />
                      Automation rules
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href={route.webhooks}>
                      <i className="ti ti-webhook me-1" />
                      Webhooks
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={() => showToast("Workflow deleted.")}
                    >
                      <i className="ti ti-trash me-1" />
                      Delete workflow
                    </button>
                  </li>
                </ul>
              </div>
              <Link
                href="#"
                className="btn btn-icon btn-outline-light shadow"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Collapse"
                data-bs-original-title="Collapse"
                id="collapse-header"
              >
                <i className="ti ti-transition-top" />
              </Link>
            </div>
          </div>
          {/* End Page Header */}
          {/* Automation Nav */}
          <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto overflow-y-hidden">
            <li className="nav-item">
              <Link
                href={route.workflowBuilder}
                className="nav-link text-nowrap active"
              >
                <i className="ti ti-sitemap me-1" />
                Workflow Builder
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.automationRules} className="nav-link text-nowrap">
                <i className="ti ti-list-check me-1" />
                Automation Rules
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.webhooks} className="nav-link text-nowrap">
                <i className="ti ti-webhook me-1" />
                Webhooks
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.automationLogs} className="nav-link text-nowrap">
                <i className="ti ti-history me-1" />
                Automation Logs
              </Link>
            </li>
          </ul>
          {/* End Automation Nav */}
          {toast && (
            <div className="alert alert-info" role="status">
              {toast}
            </div>
          )}
          {/* Workflow Meta */}
          <div className="card mb-3">
            <div className="card-body py-3">
              <div className="row g-3 align-items-end">
                <div className="col-lg-4">
                  <label className="form-label" htmlFor="workflow_name">
                    Workflow name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="workflow_name"
                    defaultValue="High-intent deal follow-up"
                  />
                </div>
                <div className="col-lg-3">
                  <label className="form-label" htmlFor="workflow_module">
                    Applies to
                  </label>
                  <select className="form-select" id="workflow_module" defaultValue="Deals">
                    <option>Deals</option>
                    <option>Leads</option>
                    <option>Contacts</option>
                    <option>Companies</option>
                  </select>
                </div>
                <div className="col-lg-3">
                  <label className="form-label" htmlFor="workflow_folder">
                    Folder
                  </label>
                  <select className="form-select" id="workflow_folder" defaultValue="Sales automation">
                    <option>Sales automation</option>
                    <option>Onboarding</option>
                    <option>Retention</option>
                  </select>
                </div>
                <div className="col-lg-12">
                  <label className="form-label" htmlFor="workflow_desc">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="workflow_desc"
                    defaultValue="Notify the owner and open a follow-up task when a high-intent deal moves stage."
                  />
                </div>
                <div className="col-lg-2">
                  <div className="d-flex align-items-center justify-content-lg-end gap-2">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="workflow_status"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                      />
                      <label
                        className="form-check-label visually-hidden"
                        htmlFor="workflow_status"
                      >
                        Workflow active
                      </label>
                    </div>
                    <span className={`badge bg-soft-${active ? "success" : "secondary"} text-${active ? "success" : "secondary"}`}>
                      {active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 flex-wrap mt-3 pt-3 border-top fs-12 text-muted">
                <span>
                  <i className="ti ti-user me-1" />
                  Created by
                  <span className="fw-medium text-dark">Tomas Lindqvist</span>
                </span>
                <span>
                  <i className="ti ti-calendar me-1" />
                  Created
                  <span className="fw-medium text-dark">12 Aug 2026</span>
                </span>
                <span>
                  <i className="ti ti-device-floppy me-1" />
                  Last saved
                  <span className="fw-medium text-dark" data-workflow-saved="">
                    2 hours ago
                  </span>
                </span>
                <span className="ms-auto">
                  <i className="ti ti-player-play me-1" />
                  Executed
                  <span className="fw-medium text-dark">1,248 times</span>
                </span>
              </div>
            </div>
          </div>
          {/* End Workflow Meta */}
          {/* Builder */}
          <div className="workflow-builder mb-3">
            {/* Palette */}
            <div className="workflow-palette">
              <div className="card h-100 mb-0">
                <div className="card-header">
                  <h6 className="mb-0">Blocks</h6>
                </div>
                <div className="card-body">
                  <p className="text-muted fs-12 mb-2">
                    Click or drag a block onto the canvas.
                  </p>
                  <div className="mb-3">
                    <label
                      className="visually-hidden"
                      htmlFor="workflow_block_search"
                    >
                      Search blocks
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="workflow_block_search"
                      placeholder="Search triggers, conditions, actions"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="workflow-palette-scroll">
                    {filteredSections.map((section) => (
                      <div className="workflow-palette-group" key={section.Group}>
                        <div className="workflow-palette-title">{section.Label}</div>
                        {section.blocks.map((b) => (
                          <button
                            type="button"
                            key={b.Type}
                            className="workflow-block"
                            onClick={() => addStep(b.Type)}
                          >
                            <i className={`ti ${b.Icon} ${b.Tint}`} />
                            <span>{b.Title}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                    {filteredSections.length === 0 && (
                      <p className="fs-12 text-muted">No blocks match your search.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* End Palette */}
            {/* Canvas */}
            <div className="workflow-canvas-wrap">
              <div className="card h-100 mb-0">
                <div className="card-header d-flex align-items-center justify-content-between gap-2">
                  <h6 className="mb-0">Canvas</h6>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark">
                      {steps.length} step{steps.length === 1 ? "" : "s"}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light shadow"
                      onClick={clearCanvas}
                    >
                      <i className="ti ti-trash me-1" />
                      Clear
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {testRun && (
                    <div className="border rounded p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="fw-medium text-dark">
                          <i className="ti ti-circle-check text-success me-1" />
                          Test run result
                        </span>
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-outline-light"
                          onClick={() => setTestRun(null)}
                          aria-label="Dismiss"
                        >
                          <i className="ti ti-x" />
                        </button>
                      </div>
                      <p className="fs-13 text-muted mb-0 mt-1">{testRun}</p>
                    </div>
                  )}
                  <div className="workflow-canvas">
                    <div className="workflow-flow">
                      {steps.length === 0 && (
                        <div className="workflow-canvas-hint">
                          <p className="text-muted fs-13 mb-0">
                            Click a block on the left to start building your workflow.
                          </p>
                        </div>
                      )}
                      {steps.map((step, i) => {
                        const block = blockFor(step.type);
                        if (!block) return null;
                        const isSelected = selectedId === step.id;
                        return (
                          <div key={step.id}>
                            <div
                              className={`workflow-node${isSelected ? " is-selected" : ""}`}
                              data-node-id={step.id}
                              data-kind={block.Kind}
                              onClick={() => setSelectedId(step.id)}
                            >
                              <div className="workflow-node-tools">
                                <button
                                  type="button"
                                  className="workflow-node-tool"
                                  disabled={i === 0}
                                  onClick={(e) => { e.stopPropagation(); moveStep(step.id, -1); }}
                                  aria-label="Move up"
                                >
                                  <i className="ti ti-arrow-up" />
                                </button>
                                <button
                                  type="button"
                                  className="workflow-node-tool"
                                  disabled={i === steps.length - 1}
                                  onClick={(e) => { e.stopPropagation(); moveStep(step.id, 1); }}
                                  aria-label="Move down"
                                >
                                  <i className="ti ti-arrow-down" />
                                </button>
                                <button
                                  type="button"
                                  className="workflow-node-tool"
                                  onClick={(e) => { e.stopPropagation(); duplicateStep(step.id); }}
                                  aria-label="Duplicate step"
                                >
                                  <i className="ti ti-copy" />
                                </button>
                                <button
                                  type="button"
                                  className="workflow-node-tool workflow-node-remove"
                                  onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}
                                  aria-label="Remove step"
                                >
                                  <i className="ti ti-trash" />
                                </button>
                              </div>
                              <div className="workflow-node-head">
                                <span className={`workflow-node-icon ${block.Tint}`}>
                                  <i className={`ti ${block.Icon}`} />
                                </span>
                                <div>
                                  <span className="workflow-node-kind">
                                    {i === 0 ? "Trigger" : block.Kind}
                                  </span>
                                  <h6 className="workflow-node-title">{block.Title}</h6>
                                </div>
                              </div>
                              <p className="workflow-node-desc">{block.Description}</p>
                            </div>
                            {i < steps.length - 1 && <div className="workflow-connector" />}
                          </div>
                        );
                      })}
                      {steps.length > 0 && (
                        <>
                          <div className="workflow-connector" />
                          <div className="workflow-end">End of workflow</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Canvas */}
            {/* Properties */}
            <div className="workflow-props">
              <div className="card h-100 mb-0">
                <div className="card-header">
                  <h6 className="mb-0">Step settings</h6>
                </div>
                <div className="card-body">
                  {!selectedStep || !selectedBlock ? (
                    <div className="workflow-props-empty">
                      <p className="fs-13 text-muted mb-0">
                        Select a step on the canvas to edit its settings.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className={`workflow-node-icon ${selectedBlock.Tint}`}>
                          <i className={`ti ${selectedBlock.Icon}`} />
                        </span>
                        <div>
                          <span className="workflow-node-kind d-block">{selectedBlock.Kind}</span>
                          <h6 className="mb-0">{selectedBlock.Title}</h6>
                        </div>
                      </div>
                      <p className="fs-13 text-muted mb-3">{selectedBlock.Description}</p>
                      <label className="form-label" htmlFor="step_note">
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        id="step_note"
                        rows={3}
                        placeholder="Add configuration notes for this step..."
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* End Properties */}
          </div>
          {/* End Builder */}
          {/* Run History */}
          <div className="card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h6 className="mb-0">Recent runs</h6>
              <Link href="#" className="link-primary fs-13">
                View all
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Record</th>
                      <th scope="col">Triggered</th>
                      <th scope="col">Steps run</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="no-sort">
                        <span className="visually-hidden">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link
                          href={route.dealsDetails}
                          className="fw-medium text-dark"
                        >
                          Northwind Logistics - Renewal
                        </Link>
                      </td>
                      <td>21 Aug 2026, 09:14</td>
                      <td>5 of 5</td>
                      <td>1.2s</td>
                      <td>
                        <span className="workflow-run-status is-success">
                          Completed
                        </span>
                      </td>
                      <td>
                        <Link
                          href="#"
                          className="btn btn-icon btn-sm btn-outline-light"
                          aria-label="View run detail"
                        >
                          <i className="ti ti-eye" />
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          href={route.dealsDetails}
                          className="fw-medium text-dark"
                        >
                          Meridian Health - Expansion
                        </Link>
                      </td>
                      <td>21 Aug 2026, 08:47</td>
                      <td>3 of 5</td>
                      <td>0.9s</td>
                      <td>
                        <span className="workflow-run-status is-failed">
                          Failed at webhook
                        </span>
                      </td>
                      <td>
                        <Link
                          href="#"
                          className="btn btn-icon btn-sm btn-outline-light"
                          aria-label="View run detail"
                        >
                          <i className="ti ti-eye" />
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          href={route.dealsDetails}
                          className="fw-medium text-dark"
                        >
                          Cobalt Studio - New Business
                        </Link>
                      </td>
                      <td>20 Aug 2026, 17:02</td>
                      <td>4 of 5</td>
                      <td>—</td>
                      <td>
                        <span className="workflow-run-status is-running">
                          Waiting 2 days
                        </span>
                      </td>
                      <td>
                        <Link
                          href="#"
                          className="btn btn-icon btn-sm btn-outline-light"
                          aria-label="View run detail"
                        >
                          <i className="ti ti-eye" />
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          href={route.dealsDetails}
                          className="fw-medium text-dark"
                        >
                          Arclight Media - Upsell
                        </Link>
                      </td>
                      <td>20 Aug 2026, 11:38</td>
                      <td>5 of 5</td>
                      <td>1.4s</td>
                      <td>
                        <span className="workflow-run-status is-success">
                          Completed
                        </span>
                      </td>
                      <td>
                        <Link
                          href="#"
                          className="btn btn-icon btn-sm btn-outline-light"
                          aria-label="View run detail"
                        >
                          <i className="ti ti-eye" />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End Run History */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
          <p className="mb-md-0 mb-1">
            Copyright ©
            <Link
              href="#"
              className="link-primary text-decoration-underline"
            >
              CRMS
            </Link>
          </p>
          <div className="d-flex align-items-center gap-2 footer-links justify-content-center justify-content-md-end">
            <Link href="#">About</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact Us</Link>
          </div>
        </footer>
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <>
        {/* Workflow Templates Modal */}
        <div
          className="modal fade"
          id="workflow_templates_modal"
          tabIndex={-1}
          aria-labelledby="workflow_templates_modal_label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5
                    className="modal-title"
                    id="workflow_templates_modal_label"
                  >
                    Workflow templates
                  </h5>
                  <span className="fs-13 text-muted">
                    Start from a ready-made CRM automation
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-warning py-2 px-3 fs-12">
                  <i className="ti ti-alert-triangle me-1" />
                  Loading a template replaces the steps currently on the canvas.
                </div>
                <div className="row g-3">
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("assign-leads")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-user-check" />
                      </span>
                      <h6 className="ai-quick-title">
                        Assign New Leads Automatically
                      </h6>
                      <p className="ai-quick-desc">
                        Route every new lead to an owner by territory as soon as
                        it lands.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Leads
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("high-value-deal")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-coin" />
                      </span>
                      <h6 className="ai-quick-title">
                        High-Value Deal Notification
                      </h6>
                      <p className="ai-quick-desc">
                        Alert sales leadership the moment a deal above $100K is
                        created.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Deals
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("lead-followup")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-mail-fast" />
                      </span>
                      <h6 className="ai-quick-title">New Lead Follow-up</h6>
                      <p className="ai-quick-desc">
                        Welcome email, wait two days, then a follow-up task.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Leads
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("proposal-followup")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-file-text" />
                      </span>
                      <h6 className="ai-quick-title">Proposal Follow-up</h6>
                      <p className="ai-quick-desc">
                        Chase a proposal that has not been answered after three
                        days.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Proposals
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("contract-renewal")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-file-certificate" />
                      </span>
                      <h6 className="ai-quick-title">
                        Contract Renewal Reminder
                      </h6>
                      <p className="ai-quick-desc">
                        Warn the account owner 30 days before a contract
                        expires.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Contracts
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("invoice-overdue")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-receipt-off" />
                      </span>
                      <h6 className="ai-quick-title">
                        Invoice Overdue Notification
                      </h6>
                      <p className="ai-quick-desc">
                        Notify finance and email the customer when an invoice
                        goes past due.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Invoices
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("customer-onboarding")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-rocket" />
                      </span>
                      <h6 className="ai-quick-title">
                        New Customer Onboarding
                      </h6>
                      <p className="ai-quick-desc">
                        Kick off onboarding tasks as soon as a deal is won.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Deals
                        </span>
                        <span className="fs-12 text-muted">5 steps</span>
                      </span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex">
                    <button
                      type="button"
                      className="ai-quick text-start w-100"
                      data-bs-dismiss="modal" onClick={() => applyTemplate("deal-won")}
                    >
                      <span className="ai-quick-icon bg-soft-primary text-primary">
                        <i className="ti ti-trophy" />
                      </span>
                      <h6 className="ai-quick-title">Deal Won Notification</h6>
                      <p className="ai-quick-desc">
                        Celebrate the win and hand the account to finance.
                      </p>
                      <span className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-soft-secondary text-secondary">
                          Deals
                        </span>
                        <span className="fs-12 text-muted">4 steps</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-light shadow"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Workflow Templates Modal */}
        {/* Add Step Modal */}
        <div
          className="modal fade"
          id="add_step_modal"
          tabIndex={-1}
          aria-labelledby="add_step_modal_label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add_step_modal_label">
                  Add a step
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="workflow-palette-title">Conditions</div>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("if-else")}
                    >
                      <i className="ti ti-arrows-split-2 bg-soft-warning text-warning" />
                      <span>If / else branch</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("field-check")}
                    >
                      <i className="ti ti-filter bg-soft-warning text-warning" />
                      <span>Field condition</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("score-check")}
                    >
                      <i className="ti ti-target-arrow bg-soft-warning text-warning" />
                      <span>Lead score threshold</span>
                    </button>
                  </div>
                </div>
                <div className="workflow-palette-title">Actions</div>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("send-email")}
                    >
                      <i className="ti ti-mail bg-soft-success text-success" />
                      <span>Send email</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("create-task")}
                    >
                      <i className="ti ti-checklist bg-soft-success text-success" />
                      <span>Create task</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("assign-user")}
                    >
                      <i className="ti ti-user-check bg-soft-success text-success" />
                      <span>Assign owner</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("update-field")}
                    >
                      <i className="ti ti-edit bg-soft-success text-success" />
                      <span>Update field</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("send-webhook")}
                    >
                      <i className="ti ti-webhook bg-soft-success text-success" />
                      <span>Send webhook</span>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("notify-slack")}
                    >
                      <i className="ti ti-bell bg-soft-success text-success" />
                      <span>Send notification</span>
                    </button>
                  </div>
                </div>
                <div className="workflow-palette-title">Timing</div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="workflow-block"
                      data-bs-dismiss="modal" onClick={() => addStep("wait-delay")}
                    >
                      <i className="ti ti-clock-hour-4 bg-purple-subtle text-purple" />
                      <span>Wait</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Add Step Modal */}
      </>
    </>
  );
};

export default WorkflowBuilderComponent;
