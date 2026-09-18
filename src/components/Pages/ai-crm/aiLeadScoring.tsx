"use client";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import {
  leads,
  band,
  meterTone,
  type AiLead,
} from "../../../core/json/aiCrmData";

const route = all_routes;
const OWNERS = ["Adrian Herrera", "Ellis Vandermeer", "Priya Raghunathan", "Tomas Lindqvist", "Nadia Okonkwo"];

const AiLeadScoringComponent = () => {
  const [search, setSearch] = useState("");
  const [bandFilter, setBandFilter] = useState("all");
  const [owner, setOwner] = useState("all");
  const [sortKey, setSortKey] = useState<"score" | "probability" | "engagement">("score");
  const [selectedLead, setSelectedLead] = useState<AiLead | null>(null);

  const counts = useMemo(() => {
    const c = { hot: 0, warm: 0, cold: 0 };
    leads.forEach((l) => { c[band(l.score).key]++; });
    const avgProb = Math.round(leads.reduce((s, l) => s + l.probability, 0) / leads.length);
    return { ...c, avgProb };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => bandFilter === "all" || band(l.score).key === bandFilter)
      .filter((l) => owner === "all" || l.owner === owner)
      .filter((l) => !search || (l.name + l.company + l.email).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [search, bandFilter, owner, sortKey]);

  const openExplain = (lead: AiLead) => setSelectedLead(lead);

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
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="mb-0">AI Lead Scoring</h4>
            <span className="ai-chip">
              <i className="ti ti-sparkles" />
              AI
            </span>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={route.aiCommandCenter}>AI CRM</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                AI Lead Scoring
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link href={route.leads} className="btn btn-outline-light shadow">
            <i className="ti ti-users me-1" />
            All leads
          </Link>
          <Link href={route.aiSettings} className="btn btn-outline-light shadow">
            <i className="ti ti-adjustments-bolt me-1" />
            Scoring model
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
      {/* AI Section Nav */}
      <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto">
        <li className="nav-item">
          <Link href={route.aiCommandCenter} className="nav-link text-nowrap">
            <i className="ti ti-sparkles me-1" />
            Command Center
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.aiInsights} className="nav-link text-nowrap">
            <i className="ti ti-bulb me-1" />
            Insights
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.aiLeadScoring}
            className="nav-link text-nowrap active"
          >
            <i className="ti ti-target-arrow me-1" />
            Lead Scoring
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.dealRiskAnalysis} className="nav-link text-nowrap">
            <i className="ti ti-shield-half me-1" />
            Deal Risk
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.aiEmailComposer} className="nav-link text-nowrap">
            <i className="ti ti-mail-star me-1" />
            Email Composer
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.callSummary} className="nav-link text-nowrap">
            <i className="ti ti-phone-calling me-1" />
            Call Summary
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.askYourData} className="nav-link text-nowrap">
            <i className="ti ti-message-chatbot me-1" />
            Ask Your Data
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.aiSettings} className="nav-link text-nowrap">
            <i className="ti ti-adjustments-bolt me-1" />
            AI Settings
          </Link>
        </li>
      </ul>
      {/* End AI Section Nav */}
      <div data-ai-scoring="">
        {/* Summary */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-danger text-danger flex-shrink-0">
                  <i className="ti ti-flame fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.hot}</div>
                  <span className="fs-12 text-muted">Hot leads (75+)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-warning text-warning flex-shrink-0">
                  <i className="ti ti-temperature fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.warm}</div>
                  <span className="fs-12 text-muted">Warm leads (45-74)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-info text-info flex-shrink-0">
                  <i className="ti ti-snowflake fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.cold}</div>
                  <span className="fs-12 text-muted">Cold leads (&lt;45)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card mb-0 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className="avatar avatar-lg rounded bg-soft-primary text-primary flex-shrink-0">
                  <i className="ti ti-percentage fs-20" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.avgProb}%</div>
                  <span className="fs-12 text-muted">
                    Avg. conversion probability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Summary */}
        {/* Model note */}
        <div className="ai-insight is-medium mb-3">
          <div className="d-flex align-items-start gap-2 flex-wrap">
            <span className="ai-chip flex-shrink-0">
              <i className="ti ti-sparkles" />
              Model
            </span>
            <p className="mb-0 fs-13">
              Scores are generated from engagement behaviour, firmographic fit
              and historical conversion patterns across your last 340 leads.
              Every score below can be opened to see exactly which factors
              contributed and by how much.
            </p>
          </div>
        </div>
        {/* Table */}
        <div className="card mb-0">
          <div className="card-header">
            <div className="row g-2 align-items-end">
              <div className="col-xxl-3 col-xl-4 col-md-4">
                <label className="form-label" htmlFor="score_search">
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="score_search"
                  placeholder="Name, company or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-xxl-2 col-xl-4 col-md-4">
                <label className="form-label" htmlFor="score_band">
                  Classification
                </label>
                <select
                  className="form-select"
                  id="score_band"
                  value={bandFilter}
                  onChange={(e) => setBandFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              <div className="col-xxl-2 col-xl-4 col-md-4">
                <label className="form-label" htmlFor="score_owner">
                  Owner
                </label>
                <select
                  className="form-select"
                  id="score_owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                >
                  <option value="all">All owners</option>
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="col-xxl-5 col-xl-12 col-md-12">
                <label className="form-label d-block">Sort by</label>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-outline-light shadow${sortKey === "score" ? " active" : ""}`}
                    onClick={() => setSortKey("score")}
                  >
                    Score <i className="ti ti-sort-descending ms-1" />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-light shadow${sortKey === "probability" ? " active" : ""}`}
                    onClick={() => setSortKey("probability")}
                  >
                    Probability <i className="ti ti-arrows-sort ms-1" />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-light shadow${sortKey === "engagement" ? " active" : ""}`}
                    onClick={() => setSortKey("engagement")}
                  >
                    Engagement <i className="ti ti-arrows-sort ms-1" />
                  </button>
                  <span className="badge bg-light text-dark ms-auto">
                    {filteredLeads.length} of {leads.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Lead</th>
                    <th scope="col">Company</th>
                    <th scope="col">AI score</th>
                    <th scope="col">Class</th>
                    <th scope="col" style={{ minWidth: 150 }}>
                      Conversion probability
                    </th>
                    <th scope="col" style={{ minWidth: 140 }}>
                      Engagement
                    </th>
                    <th scope="col">Est. value</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Last activity</th>
                    <th scope="col" className="no-sort">
                      <span className="visually-hidden">Explain</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const b = band(lead.score);
                    return (
                      <tr key={lead.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="avatar avatar-sm rounded">
                              <ImageWithBasePath src={`assets/img/profiles/${lead.avatar}`} alt={lead.name} className="img-fluid rounded" />
                            </span>
                            <div>
                              <span className="fw-medium text-dark d-block">{lead.name}</span>
                              <span className="fs-12 text-muted">{lead.title}</span>
                            </div>
                          </div>
                        </td>
                        <td>{lead.company}</td>
                        <td>
                          <span
                            className={`ai-score ai-score-sm is-${b.key}`}
                            style={{ "--ai-score": lead.score } as CSSProperties}
                          >
                            <span className="ai-score-value">{lead.score}</span>
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-soft-${b.tone} text-${b.tone}`}>{b.label}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className={`ai-meter ${meterTone(lead.probability)} flex-grow-1`}>
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: `${lead.probability}%` }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">{lead.probability}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className={`ai-meter ${meterTone(lead.engagement)} flex-grow-1`}>
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: `${lead.engagement}%` }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">{lead.engagement}%</span>
                          </div>
                        </td>
                        <td>${lead.value.toLocaleString()}</td>
                        <td>{lead.owner}</td>
                        <td>{lead.lastActivity}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light shadow"
                            data-bs-toggle="modal"
                            data-bs-target="#lead_score_modal"
                            onClick={() => openExplain(lead)}
                          >
                            Why?
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredLeads.length === 0 && (
              <div className="ai-empty">
                <span className="ai-empty-icon">
                  <i className="ti ti-mood-search" />
                </span>
                <h6>No leads match your filters</h6>
                <p>Try a different classification or clear the search box.</p>
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
  {/* Lead Score Detail Modal */}
  <div
    className="modal fade"
    id="lead_score_modal"
    tabIndex={-1}
    aria-labelledby="lead_score_modal_label"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="lead_score_modal_label">
            Why this lead scored what it did
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          {selectedLead && (() => {
            const lead = selectedLead;
            const b = band(lead.score);
            const sortedFactors = [...lead.factors].sort((a, c) => Math.abs(c.weight) - Math.abs(a.weight));
            return (
              <>
                {/* Identity + score */}
                <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
                  <span
                    className={`ai-score ai-score-lg is-${b.key}`}
                    style={{ "--ai-score": lead.score } as CSSProperties}
                  >
                    <span className="ai-score-value">{lead.score}</span>
                    <span className="ai-score-max">/100</span>
                  </span>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="avatar avatar-md rounded">
                        <ImageWithBasePath
                          src={`assets/img/profiles/${lead.avatar}`}
                          alt={lead.name}
                          className="img-fluid rounded"
                        />
                      </span>
                      <div>
                        <h5 className="mb-0">{lead.name}</h5>
                        <span className="fs-13 text-muted">{lead.title} · {lead.company}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                      <span className={`badge bg-soft-${b.tone} text-${b.tone}`}>{b.label}</span>
                      <span className="ai-chip">
                        <i className="ti ti-sparkles" />
                        AI scored
                      </span>
                    </div>
                  </div>
                </div>
                {/* Key metrics */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-13 text-muted">
                          Conversion probability
                        </span>
                        <span className="fw-bold text-dark">{lead.probability}%</span>
                      </div>
                      <span className="ai-meter">
                        <span className="ai-meter-track">
                          <span className="ai-meter-fill" style={{ width: `${lead.probability}%` }} />
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-13 text-muted">Engagement score</span>
                        <span className="fw-bold text-dark">{lead.engagement}%</span>
                      </div>
                      <span className="ai-meter is-info">
                        <span className="ai-meter-track">
                          <span className="ai-meter-fill" style={{ width: `${lead.engagement}%` }} />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* Lead detail */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-lg-3">
                    <span className="fs-12 text-muted d-block">Lead quality</span>
                    <span className="fw-medium text-dark">{lead.quality}</span>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <span className="fs-12 text-muted d-block">Source</span>
                    <span className="fw-medium text-dark">{lead.source}</span>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <span className="fs-12 text-muted d-block">Owner</span>
                    <span className="fw-medium text-dark">{lead.owner}</span>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <span className="fs-12 text-muted d-block">Est. value</span>
                    <span className="fw-medium text-dark">${lead.value.toLocaleString()}</span>
                  </div>
                  <div className="col-sm-6 col-lg-6">
                    <span className="fs-12 text-muted d-block">Email</span>
                    <span className="fw-medium text-dark">{lead.email}</span>
                  </div>
                  <div className="col-sm-6 col-lg-6">
                    <span className="fs-12 text-muted d-block">Phone</span>
                    <span className="fw-medium text-dark">{lead.phone}</span>
                  </div>
                </div>
                {/* AI explanation */}
                <div className="ai-insight-why mb-4">
                  <span className="ai-chip mb-2">
                    <i className="ti ti-sparkles" />
                    AI explanation
                  </span>
                  <p className="mb-0">{lead.explanation}</p>
                </div>
                <div className="row g-4">
                  {/* Scoring factors */}
                  <div className="col-lg-7">
                    <h6 className="fs-14 mb-2">Scoring factors</h6>
                    <p className="fs-12 text-muted mb-2">
                      Contribution to the final score, largest first.
                    </p>
                    <ul className="ai-signals">
                      {sortedFactors.map((f) => (
                        <li key={f.label}>
                          <span className={`ai-signal-icon bg-soft-${f.type === "positive" ? "success" : "danger"} text-${f.type === "positive" ? "success" : "danger"}`}>
                            <i className={`ti ${f.type === "positive" ? "ti-plus" : "ti-minus"}`} />
                          </span>
                          <span className="flex-grow-1 fs-13">{f.label}</span>
                          <span className={`fs-13 fw-medium text-${f.type === "positive" ? "success" : "danger"}`}>
                            {f.weight > 0 ? "+" : ""}{f.weight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Recent activity */}
                  <div className="col-lg-5">
                    <h6 className="fs-14 mb-3">Recent activity</h6>
                    <ul className="ai-timeline">
                      {lead.activities.map((a) => (
                        <li className={`is-${a.tone}`} key={a.time + a.text}>
                          <span className="ai-timeline-time">{a.time}</span>
                          <p className="ai-timeline-text mb-0">
                            <i className={`ti ${a.icon} me-1`} />
                            {a.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Next action */}
                <div className="ai-action mt-4">
                  <span className="ai-action-icon bg-soft-primary text-primary">
                    <i className="ti ti-player-track-next" />
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="ai-action-title">{lead.nextAction}</h6>
                    <p className="ai-action-meta fst-italic mb-0">{lead.nextActionDetail}</p>
                  </div>
                </div>
              </>
            );
          })()}
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
            href={route.aiEmailComposer}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-mail me-1" />
            Draft email
          </Link>
          <Link href={route.leadsDetails} className="btn btn-primary">
            <i className="ti ti-external-link me-1" />
            Open lead
          </Link>
        </div>
      </div>
    </div>
  </div>
  {/* End Lead Score Detail Modal */}
</>

</>

  )
}

export default AiLeadScoringComponent;