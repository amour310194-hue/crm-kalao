"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useMemo } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import { aiLink } from "./aiLinks";
import {
  leads,
  deals,
  insights,
  actions,
  band,
  riskBand,
  qualityTone,
  severityRank,
  moneyShort,
  isRecentActivity,
  AI_COMMAND_ACTIONS_REVENUE_IMPACT,
} from "../../../core/json/aiCrmData";

const route = all_routes;

const AiCommandCenterComponent = () => {
  const topInsights = useMemo(
    () => [...insights].sort((a, b) => severityRank(a.severity) - severityRank(b.severity)).slice(0, 3),
    []
  );
  const priorityLeads = useMemo(() => [...leads].sort((a, b) => b.score - a.score).slice(0, 4), []);
  const riskDeals = useMemo(
    () => [...deals].filter((d) => d.health < 80).sort((a, b) => a.health - b.health).slice(0, 4),
    []
  );
  const leadsFoot = useMemo(() => {
    const avgScore = Math.round(priorityLeads.reduce((s, l) => s + l.score, 0) / priorityLeads.length);
    const totalValue = priorityLeads.reduce((s, l) => s + l.value, 0);
    const recentCount = priorityLeads.filter((l) => isRecentActivity(l.lastActivity)).length;
    return { avgScore, totalValue, recentCount };
  }, [priorityLeads]);
  const dealsFoot = useMemo(() => {
    const valueAtRisk = riskDeals.reduce((s, d) => s + d.value, 0);
    const avgHealth = Math.round(riskDeals.reduce((s, d) => s + d.health, 0) / riskDeals.length);
    return { valueAtRisk, avgHealth, count: riskDeals.length };
  }, [riskDeals]);
  const actionsFoot = useMemo(() => {
    const openCount = actions.length;
    const dangerCount = actions.filter((a) => a.tone === "danger").length;
    return { openCount, dangerCount };
  }, []);

  const pipelineHealthChart: { options: ApexOptions; series: ApexOptions["series"] } = useMemo(() => {
    const stages = ["Qualification", "Proposal", "Negotiation", "Contract"];
    const healthy = stages.map((s) => deals.filter((d) => d.stage === s && d.health >= 70).length);
    const atRisk = stages.map((s) => deals.filter((d) => d.stage === s && d.health < 70).length);
    return {
      options: {
        chart: { type: "bar", stacked: true, toolbar: { show: false } },
        xaxis: { categories: stages },
        colors: ["#28a745", "#dc3545"],
        legend: { position: "top" },
      },
      series: [
        { name: "Healthy", data: healthy },
        { name: "At risk", data: atRisk },
      ],
    };
  }, []);

  const activityChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "area", toolbar: { show: false } },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      legend: { position: "top" },
    },
    series: [
      { name: "Leads scored", data: [48, 62, 54, 71, 68, 45, 42] },
      { name: "Emails drafted", data: [12, 18, 15, 20, 22, 11, 11] },
      { name: "Calls summarised", data: [7, 9, 8, 11, 10, 8, 8] },
    ],
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
            <h4 className="mb-0">AI Command Center</h4>
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
              <li className="breadcrumb-item">AI CRM</li>
              <li className="breadcrumb-item active" aria-current="page">
                AI Command Center
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <select className="form-select w-auto" aria-label="Scope" defaultValue="All Teams">
            <option>All Teams</option>
            <option>Enterprise</option>
            <option>Mid-Market</option>
            <option>SMB</option>
          </select>
          <button
            type="button"
            className="btn btn-outline-light shadow"
            data-ai-refresh=""
          >
            <i className="ti ti-refresh me-1" />
            Re-analyse
          </button>
          <Link href={route.aiSettings} className="btn btn-outline-light shadow">
            <i className="ti ti-adjustments-bolt me-1" />
            AI Settings
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
          <Link
            href={route.aiCommandCenter}
            className="nav-link text-nowrap active"
          >
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
      <div data-ai-command="">
        {/* AI Overview */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
              <div className="d-flex align-items-start gap-3 flex-wrap">
                <span className="avatar avatar-lg rounded bg-soft-primary text-primary flex-shrink-0">
                  <i className="ti ti-sparkles fs-24" />
                </span>
                <div>
                  <h5 className="mb-1">
                    Here is what needs your attention today
                  </h5>
                  <p className="text-muted fs-13 mb-0" data-ai-stamp="">
                    Analysed 53 open deals, 128 leads and 47 accounts · last run
                    25 Aug 2026, 08:15
                  </p>
                </div>
              </div>
              <Link href={route.aiInsights} className="btn btn-primary">
                <i className="ti ti-bulb me-1" />
                All insights
              </Link>
            </div>
            <div className="row g-3">
              <div className="col-xl-3 col-sm-6">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                    <i className="ti ti-alert-hexagon text-danger" />
                    Revenue at risk
                  </div>
                  <div className="fs-22 fw-bold text-dark">$184K</div>
                  <div className="fs-12 text-danger">3 deals gone quiet</div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                    <i className="ti ti-coin text-success" />
                    Revenue opportunity
                  </div>
                  <div className="fs-22 fw-bold text-dark">$240K</div>
                  <div className="fs-12 text-success">
                    6 accounts ready to expand
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                    <i className="ti ti-flame text-warning" />
                    Hot leads waiting
                  </div>
                  <div className="fs-22 fw-bold text-dark">5</div>
                  <div className="fs-12 text-warning">Uncontacted for 24h+</div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                    <i className="ti ti-heart-broken text-danger" />
                    Customer health alerts
                  </div>
                  <div className="fs-22 fw-bold text-dark">3</div>
                  <div className="fs-12 text-danger">$248K ARR exposed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End AI Overview */}
        {/* Top Insights */}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2 flex-wrap">
          <h6 className="mb-0">AI-generated business insights</h6>
          <Link href={route.aiInsights} className="link-primary fs-13">
            View all 9
          </Link>
        </div>
        <div className="row g-3 mb-3">
          {topInsights.map((ins) => (
            <div className="col-xl-4" key={ins.id}>
              <div className="card mb-0 h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className={`ai-insight-icon bg-soft-${ins.tone} text-${ins.tone}`}>
                      <i className={`ti ${ins.icon}`} />
                    </span>
                    <span className={`badge bg-soft-${ins.tone} text-${ins.tone} text-capitalize`}>
                      {ins.severity}
                    </span>
                  </div>
                  <h6 className="mb-1">{ins.title}</h6>
                  <p className="fs-13 text-muted mb-2">{ins.body}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-12 text-muted">{ins.metricLabel}: <strong className="text-dark">{ins.metric}</strong></span>
                    <Link href={aiLink(ins.link)} className="btn btn-sm btn-outline-light shadow">{ins.action}</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* End Top Insights */}
        <div className="row g-3 mb-3">
          {/* High-priority leads */}
          <div className="col-xxl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <div>
                  <h6 className="mb-0">High-priority leads</h6>
                  <p className="text-muted fs-12 mb-0">Ranked by AI score</p>
                </div>
                <Link href={route.aiLeadScoring} className="link-primary fs-13">
                  View all
                </Link>
              </div>
              <div className="card-body pt-2 d-flex flex-column">
                <ul className="ai-signals mb-3 flex-grow-1">
                  {priorityLeads.map((lead) => {
                    const b = band(lead.score);
                    return (
                      <li key={lead.id}>
                        <span className={`ai-signal-icon bg-soft-${b.tone} text-${b.tone}`}>
                          <i className={`ti ${b.icon}`} />
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <Link href={route.aiLeadScoring} className="fs-13 fw-medium text-dark d-block text-truncate">
                            {lead.name}
                          </Link>
                          <span className="fs-12 text-muted">
                            {lead.company} · <span className={`badge bg-soft-${qualityTone(lead.quality)} text-${qualityTone(lead.quality)}`}>{lead.quality}</span>
                          </span>
                        </div>
                        <span className="ai-signal-weight">{lead.score}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="ai-card-foot row g-2 text-center">
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Avg score</span>
                    <span className="fs-15 fw-semibold text-dark">{leadsFoot.avgScore}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Pipeline</span>
                    <span className="fs-15 fw-semibold text-dark">{moneyShort(leadsFoot.totalValue)}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Recent</span>
                    <span className="fs-15 fw-semibold text-dark">{leadsFoot.recentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Deals at risk */}
          <div className="col-xxl-4 col-xl-6 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <div>
                  <h6 className="mb-0">Deals at risk</h6>
                  <p className="text-muted fs-12 mb-0">
                    Lowest health score first
                  </p>
                </div>
                <Link
                  href={route.dealRiskAnalysis}
                  className="link-primary fs-13"
                >
                  View all
                </Link>
              </div>
              <div className="card-body pt-2 d-flex flex-column">
                <ul className="ai-signals mb-3 flex-grow-1">
                  {riskDeals.map((deal) => {
                    const r = riskBand(deal.health);
                    return (
                      <li key={deal.id}>
                        <span className={`ai-signal-icon bg-soft-${r.tone} text-${r.tone}`}>
                          <i className="ti ti-alert-triangle" />
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <Link href={route.dealRiskAnalysis} className="fs-13 fw-medium text-dark d-block text-truncate">
                            {deal.name}
                          </Link>
                          <span className="fs-12 text-muted">
                            {deal.risks[0]?.label ?? "At risk"}
                          </span>
                        </div>
                        <span className="ai-signal-weight">{deal.health}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="ai-card-foot row g-2 text-center">
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">At risk</span>
                    <span className="fs-15 fw-semibold text-danger">{moneyShort(dealsFoot.valueAtRisk)}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Avg health</span>
                    <span className="fs-15 fw-semibold text-dark">{dealsFoot.avgHealth}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Deals</span>
                    <span className="fs-15 fw-semibold text-dark">{dealsFoot.count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Recommended actions */}
          <div className="col-xxl-4 col-xl-6 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="ti ti-sparkles text-primary me-1" />
                  Recommended next actions
                </h6>
                <p className="text-muted fs-12 mb-0">
                  Ordered by expected revenue impact
                </p>
              </div>
              <div className="card-body d-flex flex-column">
                <ul className="ai-signals mb-3 flex-grow-1">
                  {actions.map((act) => (
                    <li key={act.title}>
                      <span className={`ai-signal-icon bg-soft-${act.tone} text-${act.tone}`}>
                        <i className={`ti ${act.icon}`} />
                      </span>
                      <div className="flex-grow-1 min-w-0">
                        <Link href={route.aiCommandCenter} className="fs-13 fw-medium text-dark d-block">
                          {act.title}
                        </Link>
                        <span className="fs-12 text-muted">{act.meta}</span>
                      </div>
                      <Link
                        href={aiLink(act.link)}
                        className="btn btn-sm btn-outline-light shadow flex-shrink-0"
                      >
                        {act.cta}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="ai-card-foot row g-2 text-center">
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Open</span>
                    <span className="fs-15 fw-semibold text-dark">{actionsFoot.openCount}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Urgent</span>
                    <span className="fs-15 fw-semibold text-danger">{actionsFoot.dangerCount}</span>
                  </div>
                  <div className="col-4">
                    <span className="fs-12 text-muted d-block">Impact</span>
                    <span className="fs-15 fw-semibold text-dark">{AI_COMMAND_ACTIONS_REVENUE_IMPACT}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-3">
          {/* Pipeline health */}
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Pipeline health by stage</h6>
                <p className="text-muted fs-12 mb-0">
                  Deals flagged healthy vs at risk
                </p>
              </div>
              <div className="card-body">
                <Chart options={pipelineHealthChart.options} series={pipelineHealthChart.series} type="bar" height={280} />
              </div>
            </div>
          </div>
          {/* AI activity summary */}
          <div className="col-xl-5 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">AI activity this week</h6>
                <p className="text-muted fs-12 mb-0">
                  What the assistant did for your team
                </p>
              </div>
              <div className="card-body">
                <Chart options={activityChart.options} series={activityChart.series} type="area" height={220} />
                <div className="row g-2 mt-2">
                  <div className="col-4 text-center">
                    <div className="fs-18 fw-bold text-dark">390</div>
                    <div className="fs-12 text-muted">Leads scored</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="fs-18 fw-bold text-dark">109</div>
                    <div className="fs-12 text-muted">Emails drafted</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="fs-18 fw-bold text-dark">61</div>
                    <div className="fs-12 text-muted">Calls summarised</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick actions */}
        <h6 className="mb-2">AI tools</h6>
        <div className="row g-3 mb-3">
          <div className="col-lg-3 col-sm-6 d-flex">
            <Link href={route.aiLeadScoring} className="ai-quick w-100">
              <span className="ai-quick-icon bg-soft-warning text-warning">
                <i className="ti ti-target-arrow" />
              </span>
              <h6 className="ai-quick-title">AI Lead Scoring</h6>
              <p className="ai-quick-desc">
                Rank every lead 0-100 with the reasoning behind the score.
              </p>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex">
            <Link href={route.dealRiskAnalysis} className="ai-quick w-100">
              <span className="ai-quick-icon bg-soft-danger text-danger">
                <i className="ti ti-shield-half" />
              </span>
              <h6 className="ai-quick-title">Deal Risk Analysis</h6>
              <p className="ai-quick-desc">
                Spot stalling deals before they slip the forecast.
              </p>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex">
            <Link href={route.aiEmailComposer} className="ai-quick w-100">
              <span className="ai-quick-icon bg-soft-success text-success">
                <i className="ti ti-mail-star" />
              </span>
              <h6 className="ai-quick-title">AI Email Composer</h6>
              <p className="ai-quick-desc">
                Draft, refine and re-tone outreach in seconds.
              </p>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex">
            <Link href={route.askYourData} className="ai-quick w-100">
              <span className="ai-quick-icon bg-soft-primary text-primary">
                <i className="ti ti-message-chatbot" />
              </span>
              <h6 className="ai-quick-title">Ask Your Data</h6>
              <p className="ai-quick-desc">
                Question your CRM in plain English, get charts back.
              </p>
            </Link>
          </div>
        </div>
        {/* End Quick actions */}
        {/* AI usage */}
        <div className="card mb-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div>
              <h6 className="mb-0">AI usage this month</h6>
              <p className="text-muted fs-12 mb-0">
                Billing period 01 - 31 Aug 2026
              </p>
            </div>
            <Link href={route.aiSettings} className="link-primary fs-13">
              Manage limits
            </Link>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Tokens consumed</span>
                    <span className="fw-medium text-dark">1.84M of 3M</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "61%" }} />
                  </div>
                </div>
                <div className="ai-usage is-warning">
                  <div className="ai-usage-head">
                    <span>Email drafts</span>
                    <span className="fw-medium text-dark">742 of 1,000</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "74%" }} />
                  </div>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Call transcriptions</span>
                    <span className="fw-medium text-dark">
                      168 of 500 hours
                    </span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "34%" }} />
                  </div>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Deal risks</span>
                    <span className="fw-medium text-dark">
                      100 of 300 hours
                    </span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "54%" }} className="bg-info" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="border rounded p-3 h-100">
                  <h6 className="fs-13 mb-3">Estimated cost</h6>
                  <div className="fs-24 fw-bold text-dark mb-1">$248.60</div>
                  <p className="fs-12 text-muted mb-3">
                    Projected $384 by month end
                  </p>
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-2">
                    <span className="text-muted">Model</span>
                    <span className="fw-medium text-dark">
                      Claude Sonnet 4.5
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between fs-13">
                    <span className="text-muted">Avg. response</span>
                    <span className="fw-medium text-dark">1.4s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End AI usage */}
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

export default AiCommandCenterComponent;