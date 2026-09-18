"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useMemo, useState } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from '@/core/common/imageWithBasePath';

const route = all_routes;

const TRANSCRIPT = [
  { time: "00:04", name: "Tomas", role: "rep", text: "Thanks both for making the time. I thought we'd start with the pilot scope and then move to commercials - does that work?" },
  { time: "00:18", name: "Ellis", role: "customer", text: "That works. I'll say up front that budget is approved for this fiscal year, so the question for us is really about structure rather than whether we're doing it." },
  { time: "01:02", name: "Tomas", role: "rep", text: "Good to know. The pilot as scoped covers 40 seats across your London and Frankfurt teams." },
  { time: "02:47", name: "Dana", role: "customer", text: "Before we go further on commercials - can you confirm SSO works with our Okta tenant, and that client records stay in the EU?" },
  { time: "03:10", name: "Tomas", role: "rep", text: "Both yes. Okta is a supported identity provider out of the box, and we run an EU region in Frankfurt with data residency guaranteed contractually." },
  { time: "08:22", name: "Ellis", role: "customer", text: "Right now producing one board report takes three separate exports and someone manually reconciling them. That is the thing I actually want to stop doing." },
  { time: "14:51", name: "Ellis", role: "customer", text: "What would multi-year pricing look like? If there's a meaningful difference we'd consider committing for three years rather than one." },
  { time: "15:20", name: "Tomas", role: "rep", text: "There is - roughly 14% off the annual figure on a three-year term. I'll put both options in writing today." },
  { time: "19:38", name: "Ellis", role: "customer", text: "One thing I want to be careful about is the timeline. If onboarding runs past our Q4 close, adoption slips a whole quarter and the business case weakens." },
  { time: "20:15", name: "Tomas", role: "rep", text: "Understood. Standard onboarding is three to four weeks. I'll send an implementation plan with dates so you can see it lands well before the close." },
  { time: "26:04", name: "Dana", role: "customer", text: "Why per-seat rather than a flat platform fee? Our headcount moves around a fair bit." },
  { time: "26:30", name: "Tomas", role: "rep", text: "Per-seat keeps the entry cost lower, and we band it so you're not repricing every time headcount shifts by one or two." },
];

const CallSummaryComponent = () => {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([false, false, true, false]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const visibleTurns = useMemo(
    () => TRANSCRIPT.filter((t) => !search || t.text.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const remaining = tasks.filter((t) => !t).length;

  const talkRatioChart: { options: ApexOptions; series: number[] } = {
    options: {
      chart: { type: "donut" },
      labels: ["Rep", "Customer"],
      colors: ["#0d6efd", "#28a745"],
      legend: { position: "bottom" },
      dataLabels: { formatter: (val: number) => `${Math.round(val)}%` },
    },
    series: [38, 62],
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
            <h4 className="mb-0">Call Summary</h4>
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
                Call Summary
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link href={route.callHistory} className="btn btn-outline-light shadow">
            <i className="ti ti-history me-1" />
            Call history
          </Link>
          <button
            type="button"
            className="btn btn-outline-light shadow"
            onClick={() => {
              navigator.clipboard?.writeText(
                "Tomas walked Ellis and Dana through the pilot scope and commercial structure for Halcyon Partners."
              ).catch(() => {});
              showToast("Summary copied to clipboard.");
            }}
          >
            <i className="ti ti-copy me-1" />
            Copy summary
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => showToast("Summary logged to the Halcyon Partners deal.")}
          >
            <i className="ti ti-checklist me-1" />
            Log to deal
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
          <Link href={route.callSummary} className="nav-link text-nowrap active">
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
      <div data-ai-call="">
        {toast && (
          <div className="alert alert-info" role="status">
            {toast}
          </div>
        )}
        {/* Call header */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-4">
              <div className="col-xl-5">
                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <span className="avatar avatar-xl rounded flex-shrink-0">
                    <ImageWithBasePath
                      src="assets/img/profiles/avatar-05.jpg"
                      alt="Ellis Vandermeer"
                      className="img-fluid rounded"
                    />
                  </span>
                  <div>
                    <h5 className="mb-1">Ellis Vandermeer</h5>
                    <p className="text-muted fs-13 mb-1">
                      CFO ·{" "}
                      <Link href={route.companiesDetails} className="link-primary">
                        Halcyon Partners
                      </Link>
                    </p>
                    <Link
                      href={route.dealsDetails}
                      className="badge bg-soft-primary text-primary"
                    >
                      Halcyon Partners - Pilot · $128K
                    </Link>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <span className="fs-12 text-muted d-block">
                      Date &amp; time
                    </span>
                    <span className="fw-medium text-dark">
                      24 Aug 2026, 14:30
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="fs-12 text-muted d-block">Duration</span>
                    <span className="fw-medium text-dark">32 min 14 sec</span>
                  </div>
                  <div className="col-6">
                    <span className="fs-12 text-muted d-block">Direction</span>
                    <span className="fw-medium text-dark">Outbound</span>
                  </div>
                  <div className="col-6">
                    <span className="fs-12 text-muted d-block">
                      Recorded by
                    </span>
                    <span className="fw-medium text-dark">Tomas Lindqvist</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="fs-12 text-muted d-block mb-2">
                    Participants
                  </span>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge bg-light text-dark d-inline-flex align-items-center gap-1">
                      <span className="avatar avatar-xs rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-03.jpg"
                          alt=""
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      Tomas Lindqvist{" "}
                      <span className="text-muted">· Sales</span>
                    </span>
                    <span className="badge bg-light text-dark d-inline-flex align-items-center gap-1">
                      <span className="avatar avatar-xs rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-05.jpg"
                          alt=""
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      Ellis Vandermeer <span className="text-muted">· CFO</span>
                    </span>
                    <span className="badge bg-light text-dark d-inline-flex align-items-center gap-1">
                      <span className="avatar avatar-xs rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-07.jpg"
                          alt=""
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      Dana Reyes <span className="text-muted">· CTO</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <h6 className="fs-13 mb-3">Conversation metrics</h6>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span className="text-muted">Customer sentiment</span>
                    <span className="badge bg-soft-success text-success">
                      <i className="ti ti-mood-happy me-1" />
                      Positive
                    </span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "78%" }} />
                    </span>
                    <span className="ai-meter-value">78</span>
                  </span>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span className="text-muted">Buying intent</span>
                    <span className="fw-medium text-dark">High</span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "84%" }} />
                    </span>
                    <span className="ai-meter-value">84</span>
                  </span>
                </div>
                <div className="mb-0">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span className="text-muted">Engagement</span>
                    <span className="fw-medium text-dark">Strong</span>
                  </div>
                  <span className="ai-meter is-info">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "81%" }} />
                    </span>
                    <span className="ai-meter-value">81</span>
                  </span>
                </div>
              </div>
              <div className="col-xl-3">
                <h6 className="fs-13 mb-2">Talk ratio</h6>
                <Chart options={talkRatioChart.options} series={talkRatioChart.series} type="donut" height={200} />
                <p className="fs-12 text-muted text-center mb-0">
                  Customer spoke 62% of the time - above your 45% benchmark.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End Call header */}
        <div className="row g-3 mb-3">
          {/* AI summary */}
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <h6 className="mb-0">
                  <i className="ti ti-sparkles text-primary me-1" />
                  AI summary
                </h6>
                <span className="ai-chip ai-chip-muted">
                  <i className="ti ti-clock" />
                  Generated in 4.2s
                </span>
              </div>
              <div className="card-body" data-call-summary="">
                <p className="mb-3">
                  Tomas walked Ellis and Dana through the pilot scope and
                  commercial structure for Halcyon Partners. Ellis confirmed
                  budget is approved for the current fiscal year and asked
                  directly about multi-year pricing - the clearest buying signal
                  on the call. Dana raised two technical questions around SSO
                  and data residency, both of which were answered on the call.
                </p>
                <p className="mb-3">
                  The main open item is the implementation timeline. Ellis needs
                  confirmation that onboarding can complete before the end of
                  Q4, as their finance close would otherwise delay adoption by a
                  full quarter.
                </p>
                <p className="mb-0">
                  Overall the conversation moved the deal materially forward.
                  Sentiment stayed positive throughout and the customer drove
                  most of the agenda, which historically correlates with a
                  shorter time to close.
                </p>
                <h6 className="fs-13 mt-4 mb-2">Key discussion points</h6>
                <ul className="ai-signals">
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-point" />
                    </span>
                    <span>
                      Pilot scope confirmed at 40 seats across two regions
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-point" />
                    </span>
                    <span>Multi-year pricing requested by the CFO</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-point" />
                    </span>
                    <span>
                      SSO via Okta and EU data residency both confirmed as
                      supported
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-point" />
                    </span>
                    <span>
                      Implementation must complete before the Q4 finance close
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Requirements, pain points, objections */}
          <div className="col-xl-5 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">What the customer told us</h6>
              </div>
              <div className="card-body">
                <h6 className="fs-13 mb-2">
                  <i className="ti ti-list-check text-success me-1" />
                  Customer requirements
                </h6>
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span>SSO through their existing Okta tenant</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span>EU data residency for client records</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span>Onboarding complete before the Q4 close</span>
                  </li>
                </ul>
                <h6 className="fs-13 mb-2">
                  <i className="ti ti-alert-triangle text-warning me-1" />
                  Pain points
                </h6>
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-warning text-warning">
                      <i className="ti ti-minus" />
                    </span>
                    <span>
                      Current tooling needs 3 exports to produce one board
                      report
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-warning text-warning">
                      <i className="ti ti-minus" />
                    </span>
                    <span>
                      No single view of pipeline across the two regions
                    </span>
                  </li>
                </ul>
                <h6 className="fs-13 mb-2">
                  <i className="ti ti-thumb-down text-danger me-1" />
                  Objections raised
                </h6>
                <ul className="ai-signals mb-0">
                  <li>
                    <span className="ai-signal-icon bg-soft-danger text-danger">
                      <i className="ti ti-x" />
                    </span>
                    <span>
                      Concerned the rollout could slip past the finance close
                      <span className="badge bg-soft-warning text-warning ms-1">
                        Open
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-danger text-danger">
                      <i className="ti ti-x" />
                    </span>
                    <span>
                      Asked why pricing is per-seat rather than flat
                      <span className="badge bg-soft-success text-success ms-1">
                        Handled
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3">
          {/* Transcript */}
          <div className="col-xl-7">
            <div className="card mb-0">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <h6 className="mb-0">
                    <i className="ti ti-microphone me-1" />
                    Transcript
                  </h6>
                  <span className="badge bg-light text-dark">
                    {visibleTurns.length} of {TRANSCRIPT.length} turns
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search the transcript..."
                  aria-label="Search transcript"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="card-body">
                <div className="ai-transcript">
                  {visibleTurns.map((turn) => (
                    <div className={`ai-turn is-${turn.role}`} key={turn.time}>
                      <span className="ai-turn-time">{turn.time}</span>
                      <div>
                        <span className="ai-turn-name">{turn.name}</span>
                        <p className="ai-turn-text">{turn.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="col-xl-5">
            <div className="card mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <h6 className="mb-0">Action items</h6>
                <span className="badge bg-soft-warning text-warning">
                  {remaining} remaining
                </span>
              </div>
              <div className="card-body">
                {[
                  { title: "Send multi-year pricing options", meta: "Owner: Tomas · due today" },
                  { title: "Share the implementation plan with dates", meta: "Owner: Tomas · due 26 Aug" },
                  { title: "Confirm Okta SSO support in writing", meta: "Owner: Tomas · completed" },
                  { title: "Book the technical deep-dive with Dana", meta: "Owner: Tomas · due 28 Aug" },
                ].map((task, i) => (
                  <label className="ai-action" key={task.title}>
                    <input
                      className="form-check-input mt-0 flex-shrink-0"
                      type="checkbox"
                      checked={tasks[i]}
                      onChange={() =>
                        setTasks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                      }
                    />
                    <div className="flex-grow-1">
                      <h6 className="ai-action-title">{task.title}</h6>
                      <p className="ai-action-meta">{task.meta}</p>
                    </div>
                  </label>
                ))}
                <h6 className="fs-13 mt-4 mb-2">
                  <i className="ti ti-sparkles text-primary me-1" />
                  Follow-up recommendations
                </h6>
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-arrow-right" />
                    </span>
                    <span>
                      Send pricing within 24 hours - contract-terms requests
                      answered same-day close 1.8x more often
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-arrow-right" />
                    </span>
                    <span>
                      Attach the implementation plan pre-emptively to close the
                      timeline objection
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-arrow-right" />
                    </span>
                    <span>
                      Keep Dana on the thread - multi-stakeholder deals close
                      40% faster
                    </span>
                  </li>
                </ul>
                <div className="ai-action mb-0">
                  <span className="ai-action-icon bg-soft-primary text-primary">
                    <i className="ti ti-player-track-next" />
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="ai-action-title">Next best action</h6>
                    <p className="ai-action-meta">
                      Draft and send the multi-year pricing email today
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <Link
                    href={route.aiEmailComposer}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="ti ti-mail-star me-1" />
                    Draft follow-up
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-light shadow btn-sm"
                    onClick={() => showToast("4 tasks created and assigned to Tomas Lindqvist.")}
                  >
                    <i className="ti ti-checklist me-1" />
                    Create tasks
                  </button>
                </div>
              </div>
            </div>
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

export default CallSummaryComponent;