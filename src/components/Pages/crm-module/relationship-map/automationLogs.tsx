"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { all_routes } from "@/router/all_routes";
import {
  AutomationLogsListData,
  AutomationLogStatusMeta,
  type AutomationLogData,
} from "../../../../core/json/automationLogsListData";

const route = all_routes;

const TRIGGERS = [
  "Lead Created",
  "Lead Qualified",
  "Deal Stage Changed",
  "Deal Won",
  "Proposal Created",
  "Contract Expiring",
  "Invoice Overdue",
];

const USERS = ["System", "Adrian Herrera"];

const RECORD_LINK_MAP: Record<string, string> = {
  "deals-details.html": route.dealsDetails,
  "leads-details.html": route.leadsDetails,
  "invoice-details.html": route.invoice_details,
  "contracts.html": route.ContractsList,
  "proposals.html": route.ProposalsList,
};

const TIMELINE_TONE: Record<AutomationLogData["Status"], string> = {
  success: "success",
  failed: "danger",
  running: "warning",
  skipped: "primary",
};

const AutomationLogsComponent = () => {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const [status, setStatus] = useState("all");
  const [user, setUser] = useState("all");
  const [selected, setSelected] = useState<AutomationLogData | null>(null);

  const stats = useMemo(() => {
    const count = (s: AutomationLogData["Status"]) => AutomationLogsListData.filter((l) => l.Status === s).length;
    return { success: count("success"), failed: count("failed"), running: count("running"), skipped: count("skipped") };
  }, []);

  const filtered = useMemo(
    () =>
      AutomationLogsListData
        .filter((l) => kind === "all" || l.Kind === kind)
        .filter((l) => trigger === "all" || l.Trigger === trigger)
        .filter((l) => status === "all" || l.Status === status)
        .filter((l) => user === "all" || l.User === user)
        .filter((l) => !search || (l.Source + " " + l.Record + " " + l.Trigger + " " + l.Action).toLowerCase().includes(search.toLowerCase())),
    [search, kind, trigger, status, user]
  );

  const resetFilters = () => {
    setSearch("");
    setKind("all");
    setTrigger("all");
    setStatus("all");
    setUser("all");
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
              <h4 className="mb-1">Automation Logs</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">Automation</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Automation Logs
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
              <div className="dropdown">
                <Link
                  href="#"
                  className="btn btn-outline-light shadow dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-file-export me-1" />
                  Export
                </Link>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li>
                    <Link href="#" className="dropdown-item">
                      <i className="ti ti-file-type-csv me-1" />
                      Export as CSV
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="dropdown-item">
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel
                    </Link>
                  </li>
                </ul>
              </div>
              <Link href={route.workflowBuilder} className="btn btn-primary">
                <i className="ti ti-sitemap me-1" />
                Workflow Builder
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
              <Link
                href={route.automationLogs}
                className="nav-link text-nowrap active"
              >
                <i className="ti ti-history me-1" />
                Automation Logs
              </Link>
            </li>
          </ul>
          {/* End Automation Nav */}
          <div data-automation-logs="">
            {/* Summary */}
            <div className="row g-3 mb-3">
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-success text-success flex-shrink-0">
                      <i className="ti ti-circle-check fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{stats.success}</div>
                      <span className="fs-12 text-muted">Successful</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-danger text-danger flex-shrink-0">
                      <i className="ti ti-alert-circle fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{stats.failed}</div>
                      <span className="fs-12 text-muted">Failed</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-warning text-warning flex-shrink-0">
                      <i className="ti ti-loader fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{stats.running}</div>
                      <span className="fs-12 text-muted">Running</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-secondary text-secondary flex-shrink-0">
                      <i className="ti ti-player-skip-forward fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{stats.skipped}</div>
                      <span className="fs-12 text-muted">Skipped</span>
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
                    <label className="form-label" htmlFor="logs_search">
                      Search
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="logs_search"
                      placeholder="Workflow, rule or record"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label className="form-label" htmlFor="logs_range">
                      Date range
                    </label>
                    <select className="form-select" id="logs_range" defaultValue="Last 7 days">
                      <option>Last 7 days</option>
                      <option>Last 24 hours</option>
                      <option>Last 30 days</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label className="form-label" htmlFor="logs_kind">
                      Source
                    </label>
                    <select
                      className="form-select"
                      id="logs_kind"
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                    >
                      <option value="all">Workflows &amp; rules</option>
                      <option value="Workflow">Workflow</option>
                      <option value="Rule">Rule</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label className="form-label" htmlFor="logs_trigger">
                      Trigger
                    </label>
                    <select
                      className="form-select"
                      id="logs_trigger"
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
                    <label className="form-label" htmlFor="logs_status">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="logs_status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="running">Running</option>
                      <option value="skipped">Skipped</option>
                    </select>
                  </div>
                  <div className="col-lg-1 col-md-6">
                    <label className="form-label" htmlFor="logs_user">
                      User
                    </label>
                    <select
                      className="form-select"
                      id="logs_user"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                    >
                      <option value="all">All</option>
                      {USERS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <span className="badge bg-light text-dark">
                    {filtered.length} of {AutomationLogsListData.length} executions
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Workflow / Rule</th>
                        <th scope="col">Trigger</th>
                        <th scope="col">Record</th>
                        <th scope="col">Action</th>
                        <th scope="col">Status</th>
                        <th scope="col">Executed</th>
                        <th scope="col">Duration</th>
                        <th scope="col">User</th>
                        <th scope="col">Error message</th>
                        <th scope="col" className="no-sort">
                          <span className="visually-hidden">Details</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l) => {
                        const meta = AutomationLogStatusMeta[l.Status];
                        return (
                          <tr key={l.LogId}>
                            <td>
                              <button
                                type="button"
                                className="fw-medium text-dark bg-transparent border-0 p-0 text-start"
                                data-bs-toggle="modal"
                                data-bs-target="#log_modal"
                                onClick={() => setSelected(l)}
                              >
                                {l.Source}
                              </button>
                              <span className="fs-12 text-muted d-block">
                                {l.LogId} &middot; {l.Kind}
                              </span>
                            </td>
                            <td>{l.Trigger}</td>
                            <td>
                              <Link href={RECORD_LINK_MAP[l.RecordLink] ?? "#"} className="link-primary">
                                {l.Record}
                              </Link>
                            </td>
                            <td>{l.Action}</td>
                            <td>
                              <span className={`badge bg-soft-${meta.Tone} text-${meta.Tone}`}>
                                <i className={`ti ${meta.Icon} me-1`} />
                                {meta.Label}
                              </span>
                            </td>
                            <td>{l.ExecutedAt}</td>
                            <td>{l.Duration}</td>
                            <td>{l.User}</td>
                            <td>
                              {l.Error ? (
                                <span
                                  className="fs-12 text-danger text-truncate d-inline-block"
                                  style={{ maxWidth: 220 }}
                                  title={l.Error}
                                >
                                  {l.Error}
                                </span>
                              ) : (
                                <span className="fs-12 text-muted">—</span>
                              )}
                            </td>
                            <td className="no-sort">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light shadow"
                                data-bs-toggle="modal"
                                data-bs-target="#log_modal"
                                onClick={() => setSelected(l)}
                              >
                                <i className="ti ti-eye me-1" />
                                Details
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
                      <i className="ti ti-history-off" />
                    </span>
                    <h6>No executions match your filters</h6>
                    <p>
                      Try widening the date range or clearing the status filter.
                    </p>
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
      {/* Execution Detail Modal */}
      <div
        className="modal fade"
        id="log_modal"
        tabIndex={-1}
        aria-labelledby="log_modal_label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            {selected && (
              <>
                <div className="modal-header">
                  <div className="min-w-0">
                    <h5 className="modal-title" id="log_modal_label">
                      {selected.Source}
                    </h5>
                    <span className="fs-13 text-muted">
                      {selected.LogId} &middot; {selected.Kind} &middot; {selected.ExecutedAt}
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
                  <div className="mb-3">
                    {(() => {
                      const meta = AutomationLogStatusMeta[selected.Status];
                      return (
                        <span className={`badge bg-soft-${meta.Tone} text-${meta.Tone}`}>
                          <i className={`ti ${meta.Icon} me-1`} />
                          {meta.Label}
                        </span>
                      );
                    })()}
                  </div>
                  {/* Workflow / record information */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6 col-lg-3">
                      <span className="fs-12 text-muted d-block">
                        Trigger event
                      </span>
                      <span className="fw-medium text-dark">{selected.Trigger}</span>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                      <span className="fs-12 text-muted d-block">Record</span>
                      <span className="fw-medium text-dark">
                        <Link href={RECORD_LINK_MAP[selected.RecordLink] ?? "#"} className="link-primary">
                          {selected.Record}
                        </Link>
                      </span>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                      <span className="fs-12 text-muted d-block">Duration</span>
                      <span className="fw-medium text-dark">{selected.Duration}</span>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                      <span className="fs-12 text-muted d-block">Executed by</span>
                      <span className="fw-medium text-dark">{selected.User}</span>
                    </div>
                  </div>
                  {/* Execution path */}
                  <h6 className="fs-13 mb-2">Execution path</h6>
                  <div className="log-path mb-4">
                    {selected.Path.map((step, i) => (
                      <span key={step.key} className="d-inline-flex align-items-center">
                        {i > 0 && (
                          <span className="log-path-arrow">
                            <i className="ti ti-chevron-right" />
                          </span>
                        )}
                        <span className={`log-path-step is-${step.Status}`}>{step.Label}</span>
                      </span>
                    ))}
                  </div>
                  {/* Counts */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="border rounded p-3">
                        <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                          <i className="ti ti-circle-check text-success" />
                          Successful actions
                        </div>
                        <div className="fs-20 fw-bold text-dark">
                          {selected.Path.filter((s) => s.Status === "success").length}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-3">
                        <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                          <i className="ti ti-alert-circle text-danger" />
                          Failed actions
                        </div>
                        <div className="fs-20 fw-bold text-dark">
                          {selected.Path.filter((s) => s.Status === "failed").length}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Timeline */}
                  <h6 className="fs-13 mb-3">Execution timeline</h6>
                  <ul className="ai-timeline mb-4">
                    {selected.Timeline.map((t, i) => (
                      <li
                        key={t.key}
                        className={`is-${TIMELINE_TONE[selected.Path[i]?.Status ?? "success"]}`}
                      >
                        <span className="ai-timeline-time">{t.Time}</span>
                        <span className="ai-timeline-title">{t.Title}</span>
                        <p className="ai-timeline-text mb-0">{t.Text}</p>
                      </li>
                    ))}
                  </ul>
                  {/* Error */}
                  {selected.Error && (
                    <div className="alert alert-danger py-2 px-3 fs-13 mb-0">
                      <i className="ti ti-alert-circle me-1" />
                      {selected.Error}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-light shadow"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <Link
                    href={route.workflowBuilder}
                    className="btn btn-outline-light shadow"
                  >
                    <i className="ti ti-sitemap me-1" />
                    Open workflow
                  </Link>
                  <Link href={route.automationRules} className="btn btn-primary">
                    <i className="ti ti-list-check me-1" />
                    Automation rules
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* End Execution Detail Modal */}
    </>
  );
};

export default AutomationLogsComponent;
