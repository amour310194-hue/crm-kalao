"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { all_routes } from "@/router/all_routes";
import {
  AutomationRulesListData,
  AutomationRuleStatusMeta,
  type AutomationRuleData,
} from "../../../../core/json/automationRulesListData";

const route = all_routes;
const OWNERS = ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"];
const APPLIES = ["Leads", "Contacts", "Deals", "Proposals", "Contracts", "Invoices"];
const TRIGGERS = ["Lead Created", "Lead Qualified", "Deal Created", "Deal Won", "Proposal Created", "Contract Expiring", "Invoice Overdue", "Contact Created"];

const AutomationRulesComponent = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [applies, setApplies] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const [owner, setOwner] = useState("all");
  const [selected, setSelected] = useState<AutomationRuleData | null>(null);

  const summary = useMemo(() => {
    const count = (s: AutomationRuleData["Status"]) => AutomationRulesListData.filter((r) => r.Status === s).length;
    return { active: count("active"), draft: count("draft"), paused: count("paused"), error: count("error") };
  }, []);

  const filtered = useMemo(
    () =>
      AutomationRulesListData
        .filter((r) => status === "all" || r.Status === status)
        .filter((r) => applies === "all" || r.Applies === applies)
        .filter((r) => trigger === "all" || r.Trigger === trigger)
        .filter((r) => owner === "all" || r.CreatedBy === owner)
        .filter((r) => !search || (r.Name + r.Trigger + r.CreatedBy).toLowerCase().includes(search.toLowerCase())),
    [search, status, applies, trigger, owner]
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setApplies("all");
    setTrigger("all");
    setOwner("all");
  };

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
          <h4 className="mb-1">Automation Rules</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">Automation</li>
              <li className="breadcrumb-item active" aria-current="page">
                Automation Rules
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            onClick={resetFilters}
          >
            <i className="ti ti-filter-off me-1" />
            Reset filters
          </button>
          <Link
            href={route.automationLogs}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-history me-1" />
            View Logs
          </Link>
          <Link href={route.workflowBuilder} className="btn btn-primary">
            <i className="ti ti-plus me-1" />
            Create Rule
          </Link>
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
          <Link href={route.workflowBuilder} className="nav-link text-nowrap">
            <i className="ti ti-sitemap me-1" />
            Workflow Builder
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.automationRules}
            className="nav-link text-nowrap active"
          >
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
      <div data-automation-rules="">
        {/* Summary */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-success text-success flex-shrink-0">
                  <i className="ti ti-player-play fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.active}</div>
                  <span className="fs-12 text-muted">Active rules</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-secondary text-secondary flex-shrink-0">
                  <i className="ti ti-file-text fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.draft}</div>
                  <span className="fs-12 text-muted">Drafts</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-warning text-warning flex-shrink-0">
                  <i className="ti ti-player-pause fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.paused}</div>
                  <span className="fs-12 text-muted">Paused</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-danger text-danger flex-shrink-0">
                  <i className="ti ti-alert-triangle fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.error}</div>
                  <span className="fs-12 text-muted">In error</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Summary */}
        {/* Table */}
        <div className="card mb-0">
          <div className="card-header">
            <div className="row g-2 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="rules_search">
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="rules_search"
                  placeholder="Rule name, trigger or owner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="rules_status">
                  Status
                </label>
                <select
                  className="form-select"
                  id="rules_status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="rules_applies">
                  Applies to
                </label>
                <select
                  className="form-select"
                  id="rules_applies"
                  value={applies}
                  onChange={(e) => setApplies(e.target.value)}
                >
                  <option value="all">All modules</option>
                  {APPLIES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="rules_trigger">
                  Trigger
                </label>
                <select
                  className="form-select"
                  id="rules_trigger"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                >
                  <option value="all">All triggers</option>
                  {TRIGGERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="rules_owner">
                  Owner
                </label>
                <select
                  className="form-select"
                  id="rules_owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                >
                  <option value="all">All owners</option>
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-1 col-md-6">
                <span className="badge bg-light text-dark w-100 py-2">
                  {filtered.length}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Rule name</th>
                    <th scope="col">Applies to</th>
                    <th scope="col">Trigger</th>
                    <th scope="col">Conditions</th>
                    <th scope="col">Action</th>
                    <th scope="col">Executions</th>
                    <th scope="col">Success rate</th>
                    <th scope="col">Last executed</th>
                    <th scope="col">Created by</th>
                    <th scope="col">Created</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="no-sort">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rule) => {
                    const meta = AutomationRuleStatusMeta[rule.Status];
                    return (
                      <tr key={rule.RuleId}>
                        <td className="fw-medium text-dark">{rule.Name}</td>
                        <td>{rule.Applies}</td>
                        <td>{rule.Trigger}</td>
                        <td>{rule.Conditions}</td>
                        <td>{rule.Action}</td>
                        <td>{rule.Executions.toLocaleString()}</td>
                        <td>{rule.Executions === 0 ? "Not run yet" : `${rule.SuccessRate}%`}</td>
                        <td>{rule.LastExecuted}</td>
                        <td>{rule.CreatedBy}</td>
                        <td>{rule.CreatedDate}</td>
                        <td>
                          <span className={`badge bg-soft-${meta.Tone} text-${meta.Tone}`}>{meta.Label}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light shadow"
                            data-bs-toggle="modal"
                            data-bs-target="#rule_modal"
                            onClick={() => setSelected(rule)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="ai-empty">
                <span className="ai-empty-icon">
                  <i className="ti ti-list-search" />
                </span>
                <h6>No rules match your filters</h6>
                <p>Try a different status or clear the search box.</p>
                <button
                  type="button"
                  className="btn btn-outline-light shadow btn-sm mt-3"
                  onClick={resetFilters}
                >
                  <i className="ti ti-filter-off me-1" />
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
        {/* End Table */}
      </div>
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
  {/* Rule Detail Modal */}
  <div
    className="modal fade"
    id="rule_modal"
    tabIndex={-1}
    aria-labelledby="rule_modal_label"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <div className="min-w-0">
            <h5 className="modal-title" id="rule_modal_label">{selected?.Name}</h5>
            <span className="fs-13 text-muted">{selected?.RuleId}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        {selected && (
        <div className="modal-body">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
            <span className={`badge bg-soft-${AutomationRuleStatusMeta[selected.Status].Tone} text-${AutomationRuleStatusMeta[selected.Status].Tone}`}>
              {AutomationRuleStatusMeta[selected.Status].Label}
            </span>
            <span className="badge bg-soft-secondary text-secondary">{selected.Applies}</span>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <span className="fs-12 text-muted d-block">Trigger</span>
              <span className="fw-medium text-dark">{selected.Trigger}</span>
            </div>
            <div className="col-sm-6 col-lg-3">
              <span className="fs-12 text-muted d-block">Executions</span>
              <span className="fw-medium text-dark">{selected.Executions.toLocaleString()}</span>
            </div>
            <div className="col-sm-6 col-lg-3">
              <span className="fs-12 text-muted d-block">Last executed</span>
              <span className="fw-medium text-dark">{selected.LastExecuted}</span>
            </div>
            <div className="col-sm-6 col-lg-3">
              <span className="fs-12 text-muted d-block">Success rate</span>
              <span>{selected.Executions === 0 ? "Not run yet" : `${selected.SuccessRate}%`}</span>
            </div>
            <div className="col-md-6">
              <span className="fs-12 text-muted d-block">Conditions</span>
              <span className="fw-medium text-dark">{selected.Conditions}</span>
            </div>
            <div className="col-md-6">
              <span className="fs-12 text-muted d-block">Action</span>
              <span className="fw-medium text-dark">{selected.Action}</span>
            </div>
          </div>
          <h6 className="fs-13 mb-2">Rule flow</h6>
          <div className="workflow-flow">
            {selected.Flow.map((step, i) => (
              <div key={step.key}>
                <div className="workflow-node" data-kind={step.Kind}>
                  <div className="workflow-node-head">
                    <span className={`workflow-node-icon ${step.Tint}`}>
                      <i className={`ti ${step.Icon}`} />
                    </span>
                    <div>
                      <span className="workflow-node-kind">{step.Label}</span>
                      <h6 className="workflow-node-title">{step.Title}</h6>
                    </div>
                  </div>
                </div>
                {i < selected.Flow.length - 1 && <div className="workflow-connector" />}
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <Link
            href={route.automationLogs}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-history me-1" />
            View logs
          </Link>
          <Link href={route.workflowBuilder} className="btn btn-primary">
            <i className="ti ti-edit me-1" />
            Edit in builder
          </Link>
        </div>
      </div>
    </div>
  </div>
  {/* End Rule Detail Modal */}
</>

</>

  )
}

export default AutomationRulesComponent;