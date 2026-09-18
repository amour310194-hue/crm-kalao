"use client";
import Link from "next/link";
import React, { useMemo, useState } from 'react'
import { all_routes } from "@/router/all_routes";
import {
  deals,
  riskBand,
  meterTone,
  moneyShort,
} from "../../../core/json/aiCrmData";

const route = all_routes;

const DealRiskAnalysisComponent = () => {
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const worstDeal = useMemo(() => [...deals].sort((a, b) => a.health - b.health)[0], []);
  const [selectedId, setSelectedId] = useState<string>(worstDeal?.id ?? "");

  const summary = useMemo(() => {
    const groups = { high: [] as typeof deals, medium: [] as typeof deals, low: [] as typeof deals };
    deals.forEach((d) => groups[riskBand(d.health).key].push(d));
    const avgHealth = Math.round(deals.reduce((s, d) => s + d.health, 0) / deals.length);
    const sum = (list: typeof deals) => list.reduce((s, d) => s + d.value, 0);
    return {
      high: { count: groups.high.length, value: sum(groups.high) },
      medium: { count: groups.medium.length, value: sum(groups.medium) },
      low: { count: groups.low.length, value: sum(groups.low) },
      avgHealth,
    };
  }, []);

  const visibleDeals = useMemo(
    () => [...deals]
      .filter((d) => riskFilter === "all" || riskBand(d.health).key === riskFilter)
      .sort((a, b) => a.health - b.health),
    [riskFilter]
  );

  const selectedDeal = deals.find((d) => d.id === selectedId) ?? null;

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
            <h4 className="mb-0">Deal Risk Analysis</h4>
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
                Deal Risk Analysis
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <select className="form-select w-auto" aria-label="Period" defaultValue="This Quarter (Q3 2026)">
            <option>This Quarter (Q3 2026)</option>
            <option>Next Quarter (Q4 2026)</option>
            <option>All open deals</option>
          </select>
          <Link href={route.dealsGrid} className="btn btn-outline-light shadow">
            <i className="ti ti-briefcase me-1" />
            All deals
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
          <Link href={route.aiLeadScoring} className="nav-link text-nowrap">
            <i className="ti ti-target-arrow me-1" />
            Lead Scoring
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.dealRiskAnalysis}
            className="nav-link text-nowrap active"
          >
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
      <div data-ai-risk="">
        {/* Risk summary */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-critical">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-danger text-danger">
                  <i className="ti ti-alert-hexagon" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.high.count}</div>
                  <span className="fs-12 text-muted">High risk · {moneyShort(summary.high.value)}</span>
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
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.medium.count}</div>
                  <span className="fs-12 text-muted">Medium risk · {moneyShort(summary.medium.value)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-opportunity">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-success text-success">
                  <i className="ti ti-shield-check" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.low.count}</div>
                  <span className="fs-12 text-muted">Low risk · {moneyShort(summary.low.value)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="ai-insight is-medium">
              <div className="ai-insight-head mb-0">
                <span className="ai-insight-icon bg-soft-info text-info">
                  <i className="ti ti-heartbeat" />
                </span>
                <div>
                  <div className="fs-22 fw-bold text-dark lh-1">{summary.avgHealth}</div>
                  <span className="fs-12 text-muted">Avg. deal health</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Risk summary */}
        <div className="row g-3">
          {/* Deal list */}
          <div className="col-xl-4">
            <div className="card mb-0">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <h6 className="mb-0">Deals by risk</h6>
                  <span className="badge bg-light text-dark">
                    {visibleDeals.length} of {deals.length}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-light shadow${riskFilter === "all" ? " active" : ""}`}
                    onClick={() => setRiskFilter("all")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-light shadow${riskFilter === "high" ? " active" : ""}`}
                    onClick={() => setRiskFilter("high")}
                  >
                    High
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-light shadow${riskFilter === "medium" ? " active" : ""}`}
                    onClick={() => setRiskFilter("medium")}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-light shadow${riskFilter === "low" ? " active" : ""}`}
                    onClick={() => setRiskFilter("low")}
                  >
                    Low
                  </button>
                </div>
              </div>
              <div className="card-body d-flex flex-column gap-2">
                {visibleDeals.map((deal) => {
                  const r = riskBand(deal.health);
                  return (
                    <button
                      type="button"
                      key={deal.id}
                      className={`border rounded p-2 text-start bg-transparent${selectedId === deal.id ? " border-primary" : ""}`}
                      onClick={() => setSelectedId(deal.id)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`ai-score ai-score-sm is-${r.key === "high" ? "hot" : r.key === "medium" ? "warm" : "good"}`}
                          style={{ "--ai-score": deal.health } as React.CSSProperties}
                        >
                          <span className="ai-score-value">{deal.health}</span>
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <span className="fw-medium text-dark d-block text-truncate">{deal.name}</span>
                          <span className="fs-12 text-muted">${deal.value.toLocaleString()} · {deal.stage}</span>
                        </div>
                        <span className={`badge bg-soft-${r.tone} text-${r.tone}`}>{r.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Detail */}
          <div className="col-xl-8">
            {selectedDeal && (() => {
              const deal = selectedDeal;
              const r = riskBand(deal.health);
              return (
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-start gap-3 flex-wrap justify-content-between mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`ai-score ai-score-lg is-${r.key === "high" ? "hot" : r.key === "medium" ? "warm" : "good"}`}
                          style={{ "--ai-score": deal.health } as React.CSSProperties}
                        >
                          <span className="ai-score-value">{deal.health}</span>
                          <span className="ai-score-max">/100</span>
                        </span>
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h5 className="mb-0">{deal.name}</h5>
                            <span className={`badge bg-soft-${r.tone} text-${r.tone}`}>{r.label}</span>
                            <span className="ai-chip">
                              <i className="ti ti-sparkles" />
                              AI assessed
                            </span>
                          </div>
                          <span className="fs-13 text-muted">{deal.company} · {deal.owner}</span>
                        </div>
                      </div>
                      <Link href={route.dealsDetails} className="btn btn-outline-light shadow">
                        <i className="ti ti-external-link me-1" />
                        Open deal
                      </Link>
                    </div>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-6 col-lg-3">
                        <span className="fs-12 text-muted d-block">Deal value</span>
                        <span className="fw-medium text-dark">${deal.value.toLocaleString()}</span>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <span className="fs-12 text-muted d-block">Closing probability</span>
                        <span className="fw-medium text-dark">{deal.probability}%</span>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <span className="fs-12 text-muted d-block">Expected close</span>
                        <span className="fw-medium text-dark">{deal.closeDate}</span>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <span className="fs-12 text-muted d-block">Deal age</span>
                        <span className="fw-medium text-dark">{deal.age} days</span>
                      </div>
                    </div>
                    <div className="ai-insight-why mb-4">
                      <span className="ai-chip mb-2">
                        <i className="ti ti-sparkles" />
                        AI deal summary
                      </span>
                      <p className="mb-0">{deal.summary}</p>
                    </div>
                    <div className="row g-4 mb-4">
                      <div className="col-lg-6">
                        <h6 className="fs-14 mb-2">What's working</h6>
                        <ul className="ai-signals mb-3">
                          {deal.positives.map((p) => (
                            <li key={p.label}>
                              <span className="ai-signal-icon bg-soft-success text-success">
                                <i className="ti ti-check" />
                              </span>
                              <span className="flex-grow-1 fs-13">{p.label}</span>
                            </li>
                          ))}
                        </ul>
                        <h6 className="fs-14 mb-2">Risks</h6>
                        <ul className="ai-signals">
                          {deal.risks.map((rk) => (
                            <li key={rk.label}>
                              <span className="ai-signal-icon bg-soft-danger text-danger">
                                <i className="ti ti-alert-triangle" />
                              </span>
                              <span className="flex-grow-1 fs-13">{rk.label}</span>
                              {rk.weight && <span className="fs-12 text-danger">{rk.weight}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="fs-14 mb-2">Customer engagement</h6>
                        <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                          <span className="text-muted">Engagement score</span>
                          <span className="fw-medium text-dark">{deal.engagement}</span>
                        </div>
                        <span className={`ai-meter ${meterTone(deal.engagement)} mb-1`}>
                          <span className="ai-meter-track">
                            <span className="ai-meter-fill" style={{ width: `${deal.engagement}%` }} />
                          </span>
                        </span>
                        <p className="fs-12 text-muted mb-3">Last contact: {deal.lastContact}</p>
                        <h6 className="fs-14 mb-2">Timeline</h6>
                        <ul className="ai-timeline">
                          {deal.timeline.map((t) => (
                            <li className={`is-${t.tone}`} key={t.time + t.title}>
                              <span className="ai-timeline-time">{t.time}</span>
                              <h6 className="ai-timeline-title">{t.title}</h6>
                              <p className="ai-timeline-text">{t.text}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="ai-action mb-3">
                      <span className="ai-action-icon bg-soft-primary text-primary">
                        <i className="ti ti-player-track-next" />
                      </span>
                      <div className="flex-grow-1">
                        <h6 className="ai-action-title">Next best action</h6>
                        <p className="ai-action-meta mb-2">{deal.nextAction}</p>
                        {deal.recommendations.length > 0 && (
                          <ul className="fs-13 text-muted mb-0 ps-3">
                            {deal.recommendations.map((rec) => (
                              <li key={rec}>{rec}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link href={route.aiEmailComposer} className="btn btn-primary btn-sm">
                        <i className="ti ti-mail-star me-1" />
                        Draft follow-up
                      </Link>
                      <Link href={route.dealsDetails} className="btn btn-outline-light shadow btn-sm">
                        <i className="ti ti-checklist me-1" />
                        Create task
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
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

export default DealRiskAnalysisComponent;