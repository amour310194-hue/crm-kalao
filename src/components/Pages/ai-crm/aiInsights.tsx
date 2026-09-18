"use client";
import Link from "next/link";
import { useMemo, useState } from 'react'
import { all_routes } from "@/router/all_routes";
import { aiLink } from "./aiLinks";
import {
  insights,
  severityRank,
  daysAgo,
} from "../../../core/json/aiCrmData";

const route = all_routes;

const CATEGORIES = [
  { key: "all", label: "All categories", icon: "" },
  { key: "revenue", label: "Revenue", icon: "ti-coin" },
  { key: "lead", label: "Leads", icon: "ti-target-arrow" },
  { key: "deal", label: "Deals", icon: "ti-briefcase" },
  { key: "customer", label: "Customers", icon: "ti-users" },
  { key: "performance", label: "Performance", icon: "ti-chart-bar" },
  { key: "risk", label: "Risk", icon: "ti-alert-hexagon" },
];

const AiInsightsComponent = () => {
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, opportunity: 0 };
    insights.forEach((i) => {
      if (i.severity in c) (c as any)[i.severity]++;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    return insights
      .filter((i) => category === "all" || i.category === category)
      .filter((i) => severity === "all" || i.severity === severity)
      .filter((i) => period === "all" || daysAgo(i.date) <= Number(period))
      .filter((i) => !search || (i.title + i.body).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
  }, [category, severity, period, search]);

  const resetFilters = () => {
    setCategory("all");
    setSeverity("all");
    setPeriod("all");
    setSearch("");
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
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="mb-0">AI Insights</h4>
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
                AI Insights
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
                  <i className="ti ti-file-type-pdf me-1" />
                  Export as PDF
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
          <Link href={route.aiInsights} className="nav-link text-nowrap active">
            <i className="ti ti-bulb me-1" />
            Insights
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.aiLeadScoring} className="nav-link text-nowrap">
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
      <div data-ai-insights="">
        {/* Severity summary */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-critical">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-danger text-danger">
                  <i className="ti ti-alert-hexagon" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.critical}</div>
                  <span className="fs-12 text-muted">Critical</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-high">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-warning text-warning">
                  <i className="ti ti-alert-triangle" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.high}</div>
                  <span className="fs-12 text-muted">High priority</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-medium">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-info text-info">
                  <i className="ti ti-info-circle" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.medium}</div>
                  <span className="fs-12 text-muted">Medium</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-opportunity">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-success text-success">
                  <i className="ti ti-trending-up" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{counts.opportunity}</div>
                  <span className="fs-12 text-muted">Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Severity summary */}
        {/* Filters */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={`ai-suggestion${category === c.key ? " active" : ""}`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.icon && <i className={`ti ${c.icon}`} />}
                  {c.label}
                </button>
              ))}
            </div>
            <div className="row g-2 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label" htmlFor="insight_search">
                  Search insights
                </label>
                <div className="input-icon position-relative">
                  <input
                    type="text"
                    className="form-control"
                    id="insight_search"
                    placeholder="Search by keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="insight_category">
                  Category
                </label>
                <select
                  className="form-select"
                  id="insight_category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="revenue">Revenue</option>
                  <option value="lead">Leads</option>
                  <option value="deal">Deals</option>
                  <option value="customer">Customers</option>
                  <option value="performance">Performance</option>
                  <option value="risk">Risk</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="insight_severity">
                  Severity
                </label>
                <select
                  className="form-select"
                  id="insight_severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="opportunity">Opportunity</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="insight_period">
                  Date range
                </label>
                <select
                  className="form-select"
                  id="insight_period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="all">All time</option>
                  <option value={1}>Last 24 hours</option>
                  <option value={3}>Last 3 days</option>
                  <option value={7}>Last 7 days</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <span className="badge bg-light text-dark w-100 py-2">
                  {filtered.length} insight{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* End Filters */}
        {/* Insight grid */}
        {filtered.length > 0 ? (
          <div className="row g-3">
            {filtered.map((ins) => (
              <div className="col-xl-4 col-md-6" key={ins.id}>
                <div className="card mb-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className={`ai-insight-icon bg-soft-${ins.tone} text-${ins.tone}`}>
                        <i className={`ti ${ins.icon}`} />
                      </span>
                      <div className="d-flex gap-1">
                        <span className={`badge bg-soft-${ins.tone} text-${ins.tone} text-capitalize`}>
                          {ins.severity}
                        </span>
                        <span className="badge bg-light text-dark text-capitalize">{ins.category}</span>
                      </div>
                    </div>
                    <h6 className="mb-1">{ins.title}</h6>
                    <p className="fs-13 text-muted mb-2">{ins.body}</p>
                    <div className="ai-insight is-medium mb-2">
                      <p className="mb-0 fs-12">
                        <strong>Why this surfaced: </strong>
                        {ins.why}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fs-12 text-muted">
                        {ins.metricLabel}: <strong className="text-dark">{ins.metric}</strong>
                      </span>
                      <Link href={aiLink(ins.link)} className="btn btn-sm btn-outline-light shadow">
                        {ins.action}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="ai-empty">
                <span className="ai-empty-icon">
                  <i className="ti ti-mood-search" />
                </span>
                <h6>No insights match these filters</h6>
                <p>
                  Try widening the date range or clearing the category filter.
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
            </div>
          </div>
        )}
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
</>

  )
}

export default AiInsightsComponent;