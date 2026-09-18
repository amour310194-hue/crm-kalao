"use client";
import Link from "next/link";
import { useMemo, useState } from 'react'
import { all_routes } from "@/router/all_routes";
import {
  ScheduledReportsListData,
  ScheduleStatusMeta,
  ScheduleFormatIcon,
  type ScheduledReportRow,
} from "../../../../core/json/scheduledReportsListData";
import Modal from './modal'

const route = all_routes;

const ScheduledReportsComponent = () => {
  const [schedules, setSchedules] = useState<ScheduledReportRow[]>(ScheduledReportsListData);
  const [search, setSearch] = useState("");
  const [freqFilter, setFreqFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<ScheduledReportRow | null>(null);
  const [historyTarget, setHistoryTarget] = useState<ScheduledReportRow | null>(null);

  const summary = useMemo(() => {
    const active = schedules.filter((s) => s.Status === "active").length;
    const paused = schedules.filter((s) => s.Status === "paused").length;
    const failed = schedules.filter((s) => s.Status === "failed").length;
    return { active, paused, failed };
  }, [schedules]);

  const filtered = useMemo(
    () =>
      schedules
        .filter((s) => freqFilter === "all" || s.Frequency === freqFilter)
        .filter((s) => formatFilter === "all" || s.Format === formatFilter)
        .filter((s) => statusFilter === "all" || s.Status === statusFilter)
        .filter(
          (s) =>
            !search ||
            (s.Name + s.Type + s.Owner).toLowerCase().includes(search.toLowerCase())
        ),
    [schedules, search, freqFilter, formatFilter, statusFilter]
  );

  const togglePause = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.Id === id ? { ...s, Status: s.Status === "paused" ? "active" : "paused" } : s
      )
    );
  };

  const removeSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.Id !== id));
  };

  const openCreate = () => setEditing(null);
  const openEdit = (s: ScheduledReportRow) => setEditing(s);
  const openHistory = (s: ScheduledReportRow) => setHistoryTarget(s);

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
          <h4 className="mb-1">Scheduled Reports</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">Reports</li>
              <li className="breadcrumb-item active" aria-current="page">
                Scheduled Reports
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link
            href={route.reportBuilder}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-plus me-1" />
            Create Report
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#schedule_modal"
            onClick={openCreate}
          >
            <i className="ti ti-clock-plus me-1" />
            Create Schedule
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
      {/* Reports Nav */}
      <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto">
        <li className="nav-item">
          <Link href={route.reportBuilder} className="nav-link text-nowrap">
            <i className="ti ti-tool me-1" />
            Report Builder
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.scheduledReports}
            className="nav-link text-nowrap active"
          >
            <i className="ti ti-clock-hour-4 me-1" />
            Scheduled
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.salesForecasting} className="nav-link text-nowrap">
            <i className="ti ti-chart-arrows-vertical me-1" />
            Forecasting
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.winLossAnalysis} className="nav-link text-nowrap">
            <i className="ti ti-trophy me-1" />
            Win/Loss
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.salesVelocity} className="nav-link text-nowrap">
            <i className="ti ti-rocket me-1" />
            Velocity
          </Link>
        </li>
      </ul>
      {/* End Reports Nav */}
      <div data-scheduled-reports="">
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
                  <span className="fs-12 text-muted">Active schedules</span>
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
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.failed}</div>
                  <span className="fs-12 text-muted">Failed last run</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-primary text-primary flex-shrink-0">
                  <i className="ti ti-mail-fast fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">412</div>
                  <span className="fs-12 text-muted">
                    Reports sent this month
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
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="sched_search">
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sched_search"
                  placeholder="Report name, type or owner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="sched_freq">
                  Frequency
                </label>
                <select
                  className="form-select"
                  id="sched_freq"
                  value={freqFilter}
                  onChange={(e) => setFreqFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="sched_format">
                  Format
                </label>
                <select
                  className="form-select"
                  id="sched_format"
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="sched_status">
                  Status
                </label>
                <select
                  className="form-select"
                  id="sched_status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <span className="badge bg-light text-dark w-100 py-2">
                  {filtered.length} of {schedules.length}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Report name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Frequency</th>
                    <th scope="col">Recipients</th>
                    <th scope="col">Format</th>
                    <th scope="col">Last sent</th>
                    <th scope="col">Next run</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="no-sort">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const status = ScheduleStatusMeta[s.Status];
                    return (
                      <tr key={s.Id}>
                        <td className="fw-medium text-dark">{s.Name}</td>
                        <td>{s.Type}</td>
                        <td>
                          {s.Frequency}
                          <span className="fs-12 text-muted d-block">{s.Detail}</span>
                        </td>
                        <td>
                          {s.Recipients[0]}{" "}
                          <span className="badge bg-light text-dark">{s.Recipients[1]}</span>
                        </td>
                        <td>
                          <i className={`ti ${ScheduleFormatIcon[s.Format]} me-1`} />
                          {s.Format}
                        </td>
                        <td>{s.LastRun}</td>
                        <td>{s.NextRun}</td>
                        <td>{s.Owner}</td>
                        <td>
                          <span className={`badge bg-soft-${status.tone} text-${status.tone}`}>{status.label}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-icon btn-sm btn-outline-light shadow"
                              data-bs-toggle="modal"
                              data-bs-target="#schedule_modal"
                              onClick={() => openEdit(s)}
                              aria-label="Edit"
                            >
                              <i className="ti ti-edit" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm btn-outline-light shadow"
                              onClick={() => togglePause(s.Id)}
                              aria-label={s.Status === "paused" ? "Resume" : "Pause"}
                            >
                              <i className={`ti ${s.Status === "paused" ? "ti-player-play" : "ti-player-pause"}`} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm btn-outline-light shadow"
                              data-bs-toggle="modal"
                              data-bs-target="#schedule_history_modal"
                              onClick={() => openHistory(s)}
                              aria-label="History"
                            >
                              <i className="ti ti-history" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm btn-outline-light shadow text-danger"
                              onClick={() => removeSchedule(s.Id)}
                              aria-label="Delete"
                            >
                              <i className="ti ti-trash" />
                            </button>
                          </div>
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
                  <i className="ti ti-calendar-off" />
                </span>
                <h6>No schedules match your filters</h6>
                <p>Try a different frequency or clear the search box.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#schedule_modal"
                  onClick={openCreate}
                >
                  <i className="ti ti-clock-plus me-1" />
                  Create Schedule
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
        <Modal editing={editing} historyTarget={historyTarget} />
</>

  )
}

export default ScheduledReportsComponent;