"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { all_routes } from "@/router/all_routes";
import {
  WebhooksListData,
  AutomationWebhookStatusMeta,
  type AutomationWebhookData,
} from "../../../../core/json/webhooksListData";

const route = all_routes;
const EVENTS = ["Lead Created", "Lead Updated", "Deal Created", "Deal Updated", "Deal Won", "Deal Lost", "Contact Created", "Company Created", "Invoice Created", "Payment Received", "Contract Created", "Task Created"];

const WebhooksComponent = () => {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<AutomationWebhookData | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [testResponse, setTestResponse] = useState<AutomationWebhookData | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const summary = useMemo(() => {
    const count = (s: AutomationWebhookData["Status"]) => WebhooksListData.filter((w) => w.Status === s).length;
    return { active: count("active"), paused: count("paused"), failing: count("failing") };
  }, []);

  const filtered = useMemo(
    () =>
      WebhooksListData
        .filter((w) => eventFilter === "all" || w.Event === eventFilter)
        .filter((w) => status === "all" || w.Status === status)
        .filter((w) => !search || (w.Name + w.Endpoint + w.Event).toLowerCase().includes(search.toLowerCase())),
    [search, eventFilter, status]
  );

  const openAdd = () => {
    setEditing(null);
    setShowSecret(false);
    setTestResponse(null);
  };
  const openEdit = (w: AutomationWebhookData) => {
    setEditing(w);
    setShowSecret(false);
    setTestResponse(null);
  };
  const sendTest = () => {
    if (editing) setTestResponse(editing);
  };
  const save = () => {
    showToast(editing ? "Webhook updated." : "Webhook created.");
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
              <h4 className="mb-1">Webhooks</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">Automation</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Webhooks
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <Link
                href={route.automationLogs}
                className="btn btn-outline-light shadow"
              >
                <i className="ti ti-history me-1" />
                View Logs
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#webhook_modal"
                onClick={openAdd}
              >
                <i className="ti ti-plus me-1" />
                Add Webhook
              </button>
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
              <Link href={route.webhooks} className="nav-link text-nowrap active">
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
          <div data-webhooks="">
            <div className="alert alert-light border d-flex align-items-start gap-2 fs-13">
              <i className="ti ti-info-circle mt-1" />
              <div>
                Webhooks push CRM events to your own endpoints. Secrets are
                masked here and only shown when you explicitly reveal them.
                <span className="text-muted">
                  This template is static - no request leaves the browser.
                </span>
              </div>
            </div>
            {/* Summary */}
            <div className="row g-3 mb-3">
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-success text-success flex-shrink-0">
                      <i className="ti ti-plug-connected fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{summary.active}</div>
                      <span className="fs-12 text-muted">Active endpoints</span>
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
                      <i className="ti ti-plug-connected-x fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">{summary.failing}</div>
                      <span className="fs-12 text-muted">Failing</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card mb-0 h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="avatar avatar-lg rounded bg-soft-primary text-primary flex-shrink-0">
                      <i className="ti ti-send fs-20" />
                    </span>
                    <div>
                      <div className="fs-22 fw-bold text-dark lh-1">18,402</div>
                      <span className="fs-12 text-muted">
                        Deliveries this month
                      </span>
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
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label" htmlFor="hooks_search">
                      Search
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="hooks_search"
                      placeholder="Name, endpoint or event"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label" htmlFor="hooks_event">
                      Event
                    </label>
                    <select
                      className="form-select"
                      id="hooks_event"
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                    >
                      <option value="all">All events</option>
                      {EVENTS.map((ev) => (
                        <option key={ev} value={ev}>{ev}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label" htmlFor="hooks_status">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="hooks_status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="failing">Failing</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-6">
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
                        <th scope="col">Webhook name</th>
                        <th scope="col">Endpoint</th>
                        <th scope="col">Method</th>
                        <th scope="col">Event</th>
                        <th scope="col">Last triggered</th>
                        <th scope="col">Response</th>
                        <th scope="col">Success rate</th>
                        <th scope="col">Created</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="no-sort">
                          <span className="visually-hidden">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((w) => {
                        const meta = AutomationWebhookStatusMeta[w.Status];
                        return (
                          <tr key={w.WebhookId}>
                            <td>
                              <Link
                                href="#"
                                className="fw-medium text-dark"
                                data-bs-toggle="modal"
                                data-bs-target="#webhook_modal"
                                onClick={() => openEdit(w)}
                              >
                                {w.Name}
                              </Link>
                            </td>
                            <td className="text-truncate" style={{ maxWidth: 220 }}>
                              {w.Endpoint}
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{w.Method}</span>
                            </td>
                            <td>{w.Event}</td>
                            <td>{w.LastTriggered}</td>
                            <td>{w.ResponseCode}</td>
                            <td>{w.SuccessRate}%</td>
                            <td>{w.Created}</td>
                            <td>
                              <span className={`badge bg-soft-${meta.Tone} text-${meta.Tone}`}>
                                {meta.Label}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-icon btn-outline-light shadow btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#webhook_modal"
                                onClick={() => openEdit(w)}
                                aria-label="Edit webhook"
                              >
                                <i className="ti ti-pencil" />
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
                      <i className="ti ti-plug-off" />
                    </span>
                    <h6>No webhooks match your filters</h6>
                    <p>Try a different event or clear the search box.</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-3"
                      data-bs-toggle="modal"
                      data-bs-target="#webhook_modal"
                      onClick={openAdd}
                    >
                      <i className="ti ti-plus me-1" />
                      Add Webhook
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
      {/* Webhook Configuration Modal */}
      <div
        className="modal fade"
        id="webhook_modal"
        tabIndex={-1}
        aria-labelledby="webhook_modal_label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content" key={editing?.WebhookId ?? "new"}>
            <div className="modal-header">
              <h5 className="modal-title" id="webhook_modal_label">
                {editing ? `Edit webhook - ${editing.Name}` : "Add webhook"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="wh_name">
                    Webhook name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="wh_name"
                    defaultValue={editing?.Name ?? ""}
                    placeholder="e.g. Deal won - billing sync"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="wh_event">
                    Event
                  </label>
                  <select
                    className="form-select"
                    id="wh_event"
                    defaultValue={editing?.Event ?? "Deal Won"}
                  >
                    {EVENTS.map((ev) => (
                      <option key={ev}>{ev}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-9">
                  <label className="form-label" htmlFor="wh_url">
                    Endpoint URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="wh_url"
                    defaultValue={editing?.Endpoint ?? ""}
                    placeholder="https://api.example.com/hooks/crm"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="wh_method">
                    HTTP method
                  </label>
                  <select
                    className="form-select"
                    id="wh_method"
                    defaultValue={editing?.Method ?? "POST"}
                  >
                    <option>POST</option>
                    <option>PUT</option>
                    <option>PATCH</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="wh_auth">
                    Authentication
                  </label>
                  <select
                    className="form-select"
                    id="wh_auth"
                    defaultValue={editing?.Auth ?? "Bearer token"}
                  >
                    <option>None</option>
                    <option>Bearer token</option>
                    <option>Basic auth</option>
                    <option>API key</option>
                    <option>HMAC signature</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="wh_secret">
                    Signing secret
                  </label>
                  <div className="input-group">
                    <input
                      type={showSecret ? "text" : "password"}
                      className="form-control"
                      id="wh_secret"
                      defaultValue={editing?.Secret ?? "whsec_000000000000"}
                    />
                    <button
                      className="btn btn-outline-light shadow"
                      type="button"
                      onClick={() => setShowSecret((v) => !v)}
                      aria-label={showSecret ? "Hide secret" : "Show secret"}
                    >
                      <i className={`ti ti-${showSecret ? "eye-off" : "eye"}`} />
                    </button>
                  </div>
                  <span className="fs-12 text-muted">
                    Masked by default. Never shared outside your workspace.
                  </span>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="wh_headers">
                    Custom headers
                  </label>
                  <textarea
                    className="form-control"
                    id="wh_headers"
                    rows={2}
                    placeholder='{"X-Source": "crms"}'
                    defaultValue={
                      '{"X-Source": "crms", "Content-Type": "application/json"}'
                    }
                  />
                </div>
                <div className="col-lg-7">
                  <label className="form-label">Payload preview</label>
                  <div className="webhook-code">
                    <pre>{editing?.SamplePayload ?? WebhooksListData[0].SamplePayload}</pre>
                  </div>
                </div>
                <div className="col-lg-5">
                  <label className="form-label">Test response</label>
                  <div className="webhook-code">
                    {testResponse ? (
                      <>
                        <div className="d-flex justify-content-between fs-12 text-muted mb-1">
                          <span>{testResponse.SampleResponseLabel}</span>
                          <span>{testResponse.SampleResponseTime}</span>
                        </div>
                        <pre className="mb-0">{testResponse.SampleResponseBody}</pre>
                      </>
                    ) : (
                      <span className="text-muted fs-12">
                        Send a test request to see a sample response here.
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-light shadow w-100 mt-2"
                    onClick={sendTest}
                    disabled={!editing}
                  >
                    <i className="ti ti-plug-connected me-1" />
                    Send test request
                  </button>
                  <span className="fs-12 text-muted d-block mt-2">
                    <i className="ti ti-info-circle me-1" />
                    Static template - the response below is a canned example.
                  </span>
                </div>
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="wh_retry"
                      defaultChecked
                    />
                    <label
                      className="form-check-label fs-13"
                      htmlFor="wh_retry"
                    >
                      Retry up to 3 times on failure
                    </label>
                  </div>
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
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={save}
              >
                <i className="ti ti-device-floppy me-1" />
                Save webhook
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Webhook Configuration Modal */}
    </>
  );
};

export default WebhooksComponent;
