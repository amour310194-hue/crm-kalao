"use client";
import Link from "next/link";
import { Fragment, useState } from "react";
import { all_routes } from "@/router/all_routes";
import {
  composeEmail,
  parseMergeFields,
  wordCount,
  readingTimeMinutes,
  type AiEmailPurpose,
  type AiEmailTone,
  type AiEmailLength,
} from "../../../core/json/aiCrmData";

const route = all_routes;

function wordCountLabel(text: string): string {
  const words = wordCount(text);
  return `${words} words · ${readingTimeMinutes(words)} min read`;
}

const MERGE_FIELDS = [
  "first_name", "last_name", "company", "job_title", "deal_name", "deal_value", "renewal_date", "sender_name",
];

const AiEmailComposerComponent = () => {
  const [purpose, setPurpose] = useState<AiEmailPurpose>("followup");
  const [tone, setTone] = useState<AiEmailTone>("friendly");
  const [length, setLength] = useState<AiEmailLength>("medium");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const generate = () => {
    setStatus("loading");
    window.setTimeout(() => {
      const draft = composeEmail(purpose, tone, length);
      setSubject(draft.subject);
      setBody(notes ? `${draft.body}\n\n(Note: ${notes})` : draft.body);
      setStatus("done");
    }, 900);
  };

  const applyRefine = (kind: string) => {
    const nextLength: AiEmailLength = kind === "shorten" ? "short" : kind === "expand" ? "long" : length;
    setLength(nextLength);
    const draft = composeEmail(purpose, tone, nextLength);
    setSubject(draft.subject);
    setBody(draft.body);
  };

  const applyTone = (t: AiEmailTone) => {
    setTone(t);
    const draft = composeEmail(purpose, t, length);
    setSubject(draft.subject);
    setBody(draft.body);
  };

  const insertVariable = (field: string) => {
    setBody((b) => `${b} {{${field}}}`);
  };

  const copyBody = () => {
    navigator.clipboard?.writeText(body).catch(() => {});
    showToast("Draft copied to clipboard.");
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
            <h4 className="mb-0">AI Email Composer</h4>
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
                AI Email Composer
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link href={route.email} className="btn btn-outline-light shadow">
            <i className="ti ti-inbox me-1" />
            Open inbox
          </Link>
          <Link
            href="#"
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-template me-1" />
            Template library
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
          <Link
            href={route.aiEmailComposer}
            className="nav-link text-nowrap active"
          >
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
      <div className="ai-compose" data-ai-compose="">
        <div className="row g-3">
          {/* Setup panel */}
          <div className="col-xl-4">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Who and why</h6>
                <p className="text-muted fs-12 mb-0">
                  The AI uses these to personalise the draft
                </p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="compose_contact">
                    Contact / lead
                  </label>
                  <select
                    className="form-select"
                    id="compose_contact"
                    name="contact"
                    defaultValue=""
                  >
                    <option value="">Select a contact...</option>
                    <option value="marcus">
                      Marcus Whitfield · Northwind Logistics
                    </option>
                    <option value="priya">
                      Priya Raghunathan · Meridian Health
                    </option>
                    <option value="tomas">
                      Tomas Lindqvist · Cobalt Studio
                    </option>
                    <option value="ellis">
                      Ellis Vandermeer · Halcyon Partners
                    </option>
                    <option value="nadia">
                      Nadia Okonkwo · Ridgeway Manufacturing
                    </option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="compose_deal">
                    Related deal
                  </label>
                  <select className="form-select" id="compose_deal" name="deal" defaultValue="">
                    <option value="">No deal linked</option>
                    <option>Northwind Logistics - Renewal · $96K</option>
                    <option>Meridian Health - Expansion · $74.5K</option>
                    <option>Cobalt Studio - New Business · $48K</option>
                    <option>Halcyon Partners - Pilot · $128K</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="compose_purpose">
                    Email purpose
                  </label>
                  <select
                    className="form-select"
                    id="compose_purpose"
                    name="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as AiEmailPurpose)}
                  >
                    <option value="followup">Follow-up after a call</option>
                    <option value="intro">Cold introduction</option>
                    <option value="proposal">Send a proposal</option>
                    <option value="reengage">Re-engage a quiet deal</option>
                    <option value="renewal">Renewal outreach</option>
                    <option value="thanks">Thank you &amp; recap</option>
                  </select>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label" htmlFor="compose_tone">
                      Tone
                    </label>
                    <select
                      className="form-select"
                      id="compose_tone"
                      name="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value as AiEmailTone)}
                    >
                      <option value="friendly">Friendly</option>
                      <option value="formal">Formal</option>
                      <option value="direct">Direct</option>
                      <option value="consultative">Consultative</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="compose_length">
                      Length
                    </label>
                    <select
                      className="form-select"
                      id="compose_length"
                      name="length"
                      value={length}
                      onChange={(e) => setLength(e.target.value as AiEmailLength)}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="compose_notes">
                    Anything to include?
                  </label>
                  <textarea
                    className="form-control"
                    id="compose_notes"
                    rows={3}
                    placeholder="e.g. mention the Q3 rollout timeline and the volume discount"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={generate}
                  disabled={status === "loading"}
                >
                  <i className="ti ti-sparkles me-1" />
                  Generate email
                </button>
              </div>
            </div>
            {/* Personalisation variables */}
            <div className="card mt-3 mb-0">
              <div className="card-header">
                <h6 className="mb-0">Personalisation variables</h6>
                <p className="text-muted fs-12 mb-0">
                  Click to insert into the draft
                </p>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-1">
                  {MERGE_FIELDS.map((field) => (
                    <button
                      type="button"
                      key={field}
                      className="ai-suggestion"
                      onClick={() => insertVariable(field)}
                    >
                      {"{{"}{field}{"}}"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Draft panel */}
          <div className="col-xl-8">
            <div className="card mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <h6 className="mb-0">Draft</h6>
                {status === "done" && (
                  <span className="fs-12 text-muted">{wordCountLabel(body)}</span>
                )}
              </div>
              <div className="card-body">
                {/* Empty state */}
                {status === "idle" && (
                  <div className="ai-empty">
                    <span className="ai-empty-icon">
                      <i className="ti ti-mail-star" />
                    </span>
                    <h6>No draft yet</h6>
                    <p>
                      Pick a contact and a purpose on the left, then generate a
                      first draft.
                    </p>
                  </div>
                )}
                {/* Loading state */}
                {status === "loading" && (
                  <div className="py-5 text-center">
                    <span className="ai-thinking mb-3">
                      <span className="ai-thinking-dots">
                        <span />
                        <span />
                        <span />
                      </span>
                      Writing your email...
                    </span>
                    <div className="ai-skeleton mt-4 mx-auto" style={{ maxWidth: 520 }}>
                      <span style={{ width: "40%" }} />
                      <span style={{ width: "96%" }} />
                      <span style={{ width: "88%" }} />
                      <span style={{ width: "92%" }} />
                      <span style={{ width: "64%" }} />
                    </div>
                  </div>
                )}
                {/* Result */}
                {status === "done" && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="compose_subject">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="compose_subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <label className="form-label" htmlFor="compose_body">
                      Body
                    </label>
                    <div
                      className="ai-compose-output"
                      id="compose_body"
                      contentEditable
                      role="textbox"
                      aria-multiline="true"
                      aria-label="Email body"
                      suppressContentEditableWarning
                      onBlur={(e) => setBody(e.currentTarget.textContent ?? "")}
                    >
                      {parseMergeFields(body).map((seg, i) =>
                        seg.isMergeField ? (
                          <span className="ai-var" key={i}>{seg.text}</span>
                        ) : (
                          <Fragment key={i}>{seg.text}</Fragment>
                        )
                      )}
                    </div>
                    {/* Refinement toolbar */}
                    <div className="mt-3">
                      <span className="fs-12 text-muted d-block mb-2">
                        Refine with AI
                      </span>
                      <div className="ai-compose-toolbar mb-3">
                        <button type="button" className="btn btn-sm btn-outline-light shadow" onClick={() => applyRefine("regenerate")}>
                          <i className="ti ti-refresh me-1" />
                          Regenerate
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-light shadow" onClick={() => applyRefine("improve")}>
                          <i className="ti ti-wand me-1" />
                          Improve
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-light shadow" onClick={() => applyRefine("shorten")}>
                          <i className="ti ti-arrows-minimize me-1" />
                          Shorten
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-light shadow" onClick={() => applyRefine("expand")}>
                          <i className="ti ti-arrows-maximize me-1" />
                          Expand
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-light shadow" onClick={() => applyRefine("followup")}>
                          <i className="ti ti-corner-down-right me-1" />
                          Follow-up version
                        </button>
                      </div>
                      <span className="fs-12 text-muted d-block mb-2">
                        Change tone
                      </span>
                      <div className="ai-compose-toolbar">
                        <button type="button" className={`btn btn-sm btn-outline-light shadow${tone === "friendly" ? " active" : ""}`} onClick={() => applyTone("friendly")}>
                          Friendly
                        </button>
                        <button type="button" className={`btn btn-sm btn-outline-light shadow${tone === "formal" ? " active" : ""}`} onClick={() => applyTone("formal")}>
                          Formal
                        </button>
                        <button type="button" className={`btn btn-sm btn-outline-light shadow${tone === "direct" ? " active" : ""}`} onClick={() => applyTone("direct")}>
                          Direct
                        </button>
                        <button type="button" className={`btn btn-sm btn-outline-light shadow${tone === "consultative" ? " active" : ""}`} onClick={() => applyTone("consultative")}>
                          Consultative
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {toast && (
                <div className="px-3">
                  <div className="alert alert-info mb-0">{toast}</div>
                </div>
              )}
              <div className="card-footer d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <span className="fs-12 text-muted">
                  <i className="ti ti-info-circle me-1" />
                  Merge fields resolve when the email is sent.
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-light shadow"
                    disabled={status !== "done"}
                    onClick={() => showToast("Draft saved as a template.")}
                  >
                    <i className="ti ti-bookmark me-1" />
                    Save as template
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light shadow"
                    disabled={status !== "done"}
                    onClick={copyBody}
                  >
                    <i className="ti ti-copy me-1" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={status !== "done"}
                    onClick={() => showToast("Email sent.")}
                  >
                    <i className="ti ti-send me-1" />
                    Send email
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

export default AiEmailComposerComponent;