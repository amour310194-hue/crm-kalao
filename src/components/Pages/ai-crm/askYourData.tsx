"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState, type FormEvent } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import {
  findAskAnswer,
  AI_ASK_NO_MATCH_TEXT,
  AI_ASK_NO_MATCH_HINT,
  AI_ASK_DATA_SCOPE_LABEL,
  type AiAskAnswer,
} from "../../../core/json/aiCrmData";

const route = all_routes;

interface ChatTurn {
  question: string;
  answer: AiAskAnswer | null;
}

const AskYourDataComponent = () => {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const entry = findAskAnswer(q);
    setMessages((prev) => [...prev, { question: q, answer: entry ? entry.answer : null }]);
    setRecent((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, 5));
    setInput("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
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
            <h4 className="mb-0">Ask Your Data</h4>
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
                Ask Your Data
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            onClick={() => setMessages([])}
          >
            <i className="ti ti-eraser me-1" />
            Clear conversation
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
          <Link href={route.callSummary} className="nav-link text-nowrap">
            <i className="ti ti-phone-calling me-1" />
            Call Summary
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.askYourData} className="nav-link text-nowrap active">
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
      <div data-ai-ask="">
        <div className="row g-3">
          {/* Conversation */}
          <div className="col-xl-9">
            <div className="card mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="avatar avatar-sm rounded bg-soft-primary text-primary">
                    <i className="ti ti-message-chatbot" />
                  </span>
                  <div>
                    <h6 className="mb-0">CRM Analyst</h6>
                    <span className="fs-12 text-muted">
                      Connected to {AI_ASK_DATA_SCOPE_LABEL}
                    </span>
                  </div>
                </div>
                <span className="ai-chip ai-chip-muted">
                  <i className="ti ti-database" />
                  Live CRM data
                </span>
              </div>
              <div className="card-body">
                <div className="ai-chat">
                  {/* Intro / empty state */}
                  {messages.length === 0 && (
                  <div>
                    <div className="text-center py-4">
                      <span className="ai-empty-icon mb-3">
                        <i className="ti ti-message-chatbot" />
                      </span>
                      <h5 className="mb-1">Ask anything about your CRM</h5>
                      <p className="text-muted fs-13 mb-4">
                        Plain English in, KPIs, charts and tables out. Try one
                        of these to start.
                      </p>
                    </div>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("Which deals are most likely to close this month?")}
                        >
                          <i className="ti ti-briefcase" />
                          Which deals are most likely to close this month?
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("Which leads have the highest conversion probability?")}
                        >
                          <i className="ti ti-target-arrow" />
                          Which leads have the highest conversion probability?
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("Show my top-performing sales representatives.")}
                        >
                          <i className="ti ti-users" />
                          Show my top-performing sales representatives.
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("Which customers are at risk?")}
                        >
                          <i className="ti ti-heart-broken" />
                          Which customers are at risk?
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("What is our current pipeline value?")}
                        >
                          <i className="ti ti-chart-bar" />
                          What is our current pipeline value?
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="ai-suggestion w-100"
                          onClick={() => ask("Which deals have been inactive for more than 30 days?")}
                        >
                          <i className="ti ti-clock-exclamation" />
                          Which deals have been inactive for more than 30 days?
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                  {/* Conversation log */}
                  <div className="ai-chat-log">
                    {messages.map((turn, i) => (
                      <div key={i}>
                        <div className="ai-msg is-user">
                          <span className="ai-msg-avatar">
                            <i className="ti ti-user" />
                          </span>
                          <div className="ai-msg-body">
                            <span className="ai-msg-text">{turn.question}</span>
                          </div>
                        </div>
                        <div className="ai-msg is-ai">
                          <span className="ai-msg-avatar">
                            <i className="ti ti-sparkles" />
                          </span>
                          <div className="ai-msg-body">
                            <div className="ai-msg-answer">
                              {turn.answer ? (
                                <AskAnswer answer={turn.answer} onFollowup={ask} />
                              ) : (
                                <>
                                  <p className="mb-1">{AI_ASK_NO_MATCH_TEXT}</p>
                                  <p className="fs-12 text-muted mb-0">{AI_ASK_NO_MATCH_HINT}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <label className="visually-hidden" htmlFor="ask_input">
                        Ask a question about your CRM data
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ask_input"
                        placeholder="Ask a question about your CRM data..."
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary flex-shrink-0"
                    >
                      <i className="ti ti-send me-1" />
                      Ask
                    </button>
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-2">
                    <i className="ti ti-info-circle me-1" />
                    Demo dataset - answers come from a fixed library of example
                    questions in this template.
                  </p>
                </form>
              </div>
            </div>
          </div>
          {/* Side rail */}
          <div className="col-xl-3">
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">Suggested questions</h6>
              </div>
              <div className="card-body">
                <button
                  type="button"
                  className="ai-suggestion w-100"
                  onClick={() => ask("What is our current pipeline value?")}
                >
                  <i className="ti ti-chart-bar" />
                  <span className="text-truncate">Pipeline value</span>
                </button>
                <button
                  type="button"
                  className="ai-suggestion w-100"
                  onClick={() => ask("Which deals are most likely to close this month?")}
                >
                  <i className="ti ti-briefcase" />
                  <span className="text-truncate">Likely to close</span>
                </button>
                <button
                  type="button"
                  className="ai-suggestion w-100"
                  onClick={() => ask("Which customers are at risk?")}
                >
                  <i className="ti ti-heart-broken" />
                  <span className="text-truncate">Customers at risk</span>
                </button>
                <button
                  type="button"
                  className="ai-suggestion w-100"
                  onClick={() => ask("Which deals have been inactive for more than 30 days?")}
                >
                  <i className="ti ti-clock-exclamation" />
                  <span className="text-truncate">Inactive deals</span>
                </button>
                <button
                  type="button"
                  className="ai-suggestion w-100"
                  onClick={() => ask("Show my top-performing sales representatives.")}
                >
                  <i className="ti ti-users" />
                  <span className="text-truncate">Top reps</span>
                </button>
              </div>
            </div>
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">Recent questions</h6>
              </div>
              <div className="card-body">
                {recent.length === 0 ? (
                  <p className="fs-12 text-muted mb-0">
                    Your recent questions will appear here.
                  </p>
                ) : (
                  recent.map((q) => (
                    <button
                      type="button"
                      key={q}
                      className="ai-suggestion w-100"
                      onClick={() => ask(q)}
                    >
                      <i className="ti ti-history" />
                      <span className="text-truncate">{q}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Data sources</h6>
              </div>
              <div className="card-body">
                <ul className="ai-signals mb-0">
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span className="fs-13">Deals &amp; pipeline</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span className="fs-13">Leads &amp; scoring</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span className="fs-13">Accounts &amp; usage</span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-check" />
                    </span>
                    <span className="fs-13">Activities &amp; calls</span>
                  </li>
                </ul>
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

function AskAnswer({ answer, onFollowup }: { answer: AiAskAnswer; onFollowup: (q: string) => void }) {
  const chartOptions: ApexOptions | null = answer.chart
    ? {
        chart: { type: answer.chart.type, stacked: answer.chart.stacked, toolbar: { show: false } },
        xaxis: answer.chart.categories ? { categories: answer.chart.categories } : undefined,
        labels: answer.chart.categories,
        colors: answer.chart.colors,
        plotOptions: {
          bar: {
            horizontal: answer.chart.horizontal,
            distributed: answer.chart.distributed,
          },
        },
        legend: { show: answer.chart.type === "donut" || (answer.chart.series.length > 1) },
        dataLabels: { enabled: answer.chart.type === "donut" },
        yaxis: {
          labels: {
            formatter: (val: number) =>
              `${answer.chart?.valuePrefix ?? ""}${val}${answer.chart?.valueSuffix ?? ""}`,
          },
        },
      }
    : null;

  return (
    <>
      <p className="mb-3" dangerouslySetInnerHTML={{ __html: answer.text }} />
      {answer.kpis.length > 0 && (
        <div className="row g-2 mb-3">
          {answer.kpis.map((kpi) => (
            <div className="col-6 col-md-3" key={kpi.label}>
              <div className="border rounded p-2 h-100">
                <div className="fs-11 text-muted">{kpi.label}</div>
                <div className={`fs-16 fw-bold${kpi.tone ? ` text-${kpi.tone}` : " text-dark"}`}>{kpi.value}</div>
                {kpi.sub && <div className="fs-11 text-muted">{kpi.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {answer.table && (
        <div className="table-responsive mb-3">
          <table className="table table-sm table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                {answer.table.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {answer.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => {
                    const tone = answer.table?.cellTones?.[ri]?.[ci];
                    return (
                      <td key={ci}>
                        {tone ? <span className={`badge bg-soft-${tone} text-${tone}`}>{cell}</span> : cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {answer.chart && chartOptions && (
        <div className="mb-3">
          <Chart options={chartOptions} series={answer.chart.series} type={answer.chart.type} height={240} />
        </div>
      )}
      {answer.followups.length > 0 && (
        <div className="d-flex flex-wrap gap-1">
          {answer.followups.map((f) => (
            <button type="button" key={f} className="ai-suggestion" onClick={() => onFollowup(f)}>
              {f}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default AskYourDataComponent;