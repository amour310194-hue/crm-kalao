"use client";
import Link from "next/link";
import { useState } from 'react'
import { all_routes } from "@/router/all_routes";
import { AI_MODEL_PROVIDERS } from "../../../core/json/aiCrmData";

const route = all_routes;

const AiSettingsComponent = () => {
  const [provider, setProvider] = useState("anthropic");
  const [showKey, setShowKey] = useState(false);
  const [sliders, setSliders] = useState({
    ai_temp: 3,
    score_hot: 75,
    score_warm: 45,
    risk_quiet: 8,
    risk_high: 45,
    call_min: 3,
  });
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };
  const setSlider = (key: keyof typeof sliders, value: number) =>
    setSliders((prev) => ({ ...prev, [key]: value }));

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
            <h4 className="mb-0">AI Settings</h4>
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
                AI Settings
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            onClick={() => {
              setProvider("anthropic");
              setSliders({ ai_temp: 3, score_hot: 75, score_warm: 45, risk_quiet: 8, risk_high: 45, call_min: 3 });
              showToast("Settings reset to defaults.");
            }}
          >
            <i className="ti ti-rotate me-1" />
            Reset to defaults
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => showToast("AI settings saved.")}
          >
            <i className="ti ti-device-floppy me-1" />
            Save changes
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
          <Link href={route.aiSettings} className="nav-link text-nowrap active">
            <i className="ti ti-adjustments-bolt me-1" />
            AI Settings
          </Link>
        </li>
      </ul>
      {/* End AI Section Nav */}
      <div data-ai-settings="">
        {toast && (
          <div className="alert alert-info mb-3" role="status">
            {toast}
          </div>
        )}
        <div className="row g-3">
          <div className="col-xl-8">
            {/* Provider */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">AI provider</h6>
                <p className="text-muted fs-12 mb-0">
                  Where AI requests are sent
                </p>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ai_provider">
                      Provider
                    </label>
                    <select
                      className="form-select"
                      id="ai_provider"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                    >
                      <option value="anthropic">Anthropic</option>
                      <option value="openai">OpenAI</option>
                      <option value="google">Google</option>
                      <option value="azure">Azure OpenAI</option>
                      <option value="selfhosted">Self-hosted</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ai_model">
                      Model
                    </label>
                    <select className="form-select" id="ai_model">
                      {(AI_MODEL_PROVIDERS[provider] ?? []).map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ai_key">
                      API key
                    </label>
                    <div className="input-group">
                      <input
                        type={showKey ? "text" : "password"}
                        className="form-control"
                        id="ai_key"
                        defaultValue="sk-ant-api03-xxxxxxxxxxxxxxxxxxxx"
                      />
                      <button
                        className="btn btn-outline-light shadow"
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        aria-label="Show API key"
                      >
                        <i className={`ti ${showKey ? "ti-eye-off" : "ti-eye"}`} />
                      </button>
                    </div>
                  </div>
                  <div className={`col-md-6${provider === "selfhosted" ? "" : " d-none"}`}>
                    <label className="form-label" htmlFor="ai_endpoint">
                      Endpoint URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ai_endpoint"
                      placeholder="https://ai.internal.example.com/v1"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ai_temp">
                      Response creativity
                      <span className="fw-medium text-dark ms-1">{sliders.ai_temp}</span>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      id="ai_temp"
                      min={0}
                      max={10}
                      step={1}
                      value={sliders.ai_temp}
                      onChange={(e) => setSlider("ai_temp", Number(e.target.value))}
                    />
                    <span className="fs-12 text-muted">
                      Lower is more consistent, higher is more varied.
                    </span>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ai_language">
                      Output language
                    </label>
                    <select className="form-select" id="ai_language" defaultValue="English (US)">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>German</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Feature controls */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">AI features</h6>
                <p className="text-muted fs-12 mb-0">
                  Turn individual capabilities on or off for your workspace
                </p>
              </div>
              <div className="card-body">
                {/* Lead scoring */}
                <div className="border rounded p-3 mb-3">
                  <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-3">
                    <label
                      className="form-check-label fw-medium text-dark"
                      htmlFor="feat_scoring"
                    >
                      <i className="ti ti-target-arrow text-warning me-1" />
                      AI Lead Scoring
                    </label>
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      id="feat_scoring"
                      defaultChecked
                      data-default-on=""
                      data-feature-toggle="scoring"
                      data-feature-name="AI Lead Scoring"
                    />
                  </div>
                  <div className="row g-3" data-feature-block="scoring">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="score_hot">
                        Hot threshold
                        <span className="fw-medium text-dark ms-1">{sliders.score_hot}</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        id="score_hot"
                        min={50}
                        max={95}
                        step={5}
                        value={sliders.score_hot}
                        onChange={(e) => setSlider("score_hot", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="score_warm">
                        Warm threshold
                        <span className="fw-medium text-dark ms-1">{sliders.score_warm}</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        id="score_warm"
                        min={20}
                        max={70}
                        step={5}
                        value={sliders.score_warm}
                        onChange={(e) => setSlider("score_warm", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="score_freq">
                        Rescore frequency
                      </label>
                      <select className="form-select" id="score_freq" defaultValue="Hourly">
                        <option>On every activity</option>
                        <option>Hourly</option>
                        <option>Daily</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <span className="fs-12 text-muted d-block mb-2">
                        Signals used in scoring
                      </span>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sig_engagement"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="sig_engagement"
                          >
                            Engagement behaviour
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sig_firmo"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="sig_firmo"
                          >
                            Firmographic fit
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sig_email"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="sig_email"
                          >
                            Email activity
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sig_web"
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="sig_web"
                          >
                            Website tracking
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Deal risk */}
                <div className="border rounded p-3 mb-3">
                  <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-3">
                    <label
                      className="form-check-label fw-medium text-dark"
                      htmlFor="feat_risk"
                    >
                      <i className="ti ti-shield-half text-danger me-1" />
                      Deal Risk Analysis
                    </label>
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      id="feat_risk"
                      defaultChecked
                      data-default-on=""
                      data-feature-toggle="risk"
                      data-feature-name="Deal Risk Analysis"
                    />
                  </div>
                  <div className="row g-3" data-feature-block="risk">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="risk_quiet">
                        Flag as stalled after
                        <span className="fw-medium text-dark ms-1">{sliders.risk_quiet} days</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        id="risk_quiet"
                        min={3}
                        max={30}
                        step={1}
                        value={sliders.risk_quiet}
                        onChange={(e) => setSlider("risk_quiet", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="risk_high">
                        High-risk below health
                        <span className="fw-medium text-dark ms-1">{sliders.risk_high}</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        id="risk_high"
                        min={20}
                        max={70}
                        step={5}
                        value={sliders.risk_high}
                        onChange={(e) => setSlider("risk_high", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="risk_alert">
                        Alert channel
                      </label>
                      <select className="form-select" id="risk_alert" defaultValue="In-app notification">
                        <option>In-app notification</option>
                        <option>Email digest</option>
                        <option>Both</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Email assistant */}
                <div className="border rounded p-3 mb-3">
                  <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-3">
                    <label
                      className="form-check-label fw-medium text-dark"
                      htmlFor="feat_email"
                    >
                      <i className="ti ti-mail-star text-success me-1" />
                      AI Email Composer
                    </label>
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      id="feat_email"
                      defaultChecked
                      data-default-on=""
                      data-feature-toggle="email"
                      data-feature-name="AI Email Composer"
                    />
                  </div>
                  <div className="row g-3" data-feature-block="email">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="email_tone">
                        Default tone
                      </label>
                      <select className="form-select" id="email_tone" defaultValue="Friendly">
                        <option>Friendly</option>
                        <option>Formal</option>
                        <option>Direct</option>
                        <option>Consultative</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="email_length">
                        Default length
                      </label>
                      <select className="form-select" id="email_length" defaultValue="Medium">
                        <option>Short</option>
                        <option>Medium</option>
                        <option>Long</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="email_sign">
                        Signature
                      </label>
                      <select className="form-select" id="email_sign" defaultValue="Use my CRM signature">
                        <option>Use my CRM signature</option>
                        <option>No signature</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="email_review"
                          defaultChecked
                          data-default-on=""
                        />
                        <label
                          className="form-check-label fs-13"
                          htmlFor="email_review"
                        >
                          Always require human review before sending
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Call summary */}
                <div className="border rounded p-3 mb-0">
                  <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-3">
                    <label
                      className="form-check-label fw-medium text-dark"
                      htmlFor="feat_call"
                    >
                      <i className="ti ti-phone-calling text-primary me-1" />
                      Call Summary
                    </label>
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      id="feat_call"
                      defaultChecked
                      data-default-on=""
                      data-feature-toggle="call"
                      data-feature-name="Call Summary"
                    />
                  </div>
                  <div className="row g-3" data-feature-block="call">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="call_min">
                        Summarise calls longer than
                        <span className="fw-medium text-dark ms-1">{sliders.call_min} min</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        id="call_min"
                        min={1}
                        max={15}
                        step={1}
                        value={sliders.call_min}
                        onChange={(e) => setSlider("call_min", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-md-8">
                      <span className="fs-12 text-muted d-block mb-2">
                        Extract from calls
                      </span>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="call_action"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="call_action"
                          >
                            Action items
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="call_sent"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="call_sent"
                          >
                            Sentiment
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="call_obj"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="call_obj"
                          >
                            Objections
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="call_transcript"
                            defaultChecked
                            data-default-on=""
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="call_transcript"
                          >
                            Full transcript
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Data & privacy */}
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Data &amp; privacy</h6>
                <p className="text-muted fs-12 mb-0">
                  Control what CRM data the AI can access
                </p>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="priv_train"
                    data-default-off=""
                  />
                  <label className="form-check-label" htmlFor="priv_train">
                    Allow provider to use our data for model training
                    <span className="fs-12 text-muted d-block">
                      Off by default. Most enterprise agreements require this to
                      stay off.
                    </span>
                  </label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="priv_pii"
                    defaultChecked
                    data-default-on=""
                  />
                  <label className="form-check-label" htmlFor="priv_pii">
                    Redact personal data before sending
                    <span className="fs-12 text-muted d-block">
                      Strips emails, phone numbers and addresses from prompts.
                    </span>
                  </label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="priv_log"
                    defaultChecked
                    data-default-on=""
                  />
                  <label className="form-check-label" htmlFor="priv_log">
                    Keep an audit log of all AI requests
                    <span className="fs-12 text-muted d-block">
                      Recommended for regulated industries.
                    </span>
                  </label>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="priv_retention">
                      Data retention
                    </label>
                    <select className="form-select" id="priv_retention" defaultValue="30 days">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>Do not retain</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="priv_region">
                      Processing region
                    </label>
                    <select className="form-select" id="priv_region" defaultValue="European Union (Frankfurt)">
                      <option>European Union (Frankfurt)</option>
                      <option>United States (Virginia)</option>
                      <option>Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Side rail */}
          <div className="col-xl-4">
            {/* Usage */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Usage this month</h6>
                <p className="text-muted fs-12 mb-0">01 - 31 Aug 2026</p>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="fs-28 fw-bold text-dark">1.84M</div>
                  <span className="fs-12 text-muted">of 3M tokens</span>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Tokens</span>
                    <span className="fw-medium text-dark">61%</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "61%" }} />
                  </div>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Email drafts</span>
                    <span className="fw-medium text-dark">742 / 1,000</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "74%" }} />
                  </div>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Call minutes</span>
                    <span className="fw-medium text-dark">168 / 500</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "34%" }} />
                  </div>
                </div>
                <div className="ai-usage">
                  <div className="ai-usage-head">
                    <span>Lead scores</span>
                    <span className="fw-medium text-dark">9.2K / 10K</span>
                  </div>
                  <div className="ai-usage-track">
                    <span style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Limits */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Usage limits</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="limit_monthly">
                    Monthly token cap
                  </label>
                  <select className="form-select" id="limit_monthly" defaultValue="3M tokens">
                    <option>1M tokens</option>
                    <option>3M tokens</option>
                    <option>10M tokens</option>
                    <option>Unlimited</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="limit_user">
                    Per-user daily cap
                  </label>
                  <select className="form-select" id="limit_user" defaultValue="200 requests">
                    <option>50 requests</option>
                    <option>200 requests</option>
                    <option>No limit</option>
                  </select>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="limit_alert"
                    defaultChecked
                    data-default-on=""
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="limit_alert"
                  >
                    Alert admins at 80% of cap
                  </label>
                </div>
              </div>
            </div>
            {/* Activity */}
            <div className="card mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <h6 className="mb-0">AI activity history</h6>
                <Link
                  href={route.userActivityLogs}
                  className="link-primary fs-13"
                >
                  All logs
                </Link>
              </div>
              <div className="card-body">
                <ul className="ai-timeline mb-0">
                  <li className="is-success">
                    <span className="ai-timeline-time">Today, 08:15</span>
                    <h6 className="ai-timeline-title">Insights regenerated</h6>
                    <p className="ai-timeline-text">
                      53 deals and 128 leads re-analysed.
                    </p>
                  </li>
                  <li className="is-primary">
                    <span className="ai-timeline-time">Yesterday, 16:40</span>
                    <h6 className="ai-timeline-title">Model changed</h6>
                    <p className="ai-timeline-text">
                      Switched to Claude Sonnet 4.5 by A. Herrera.
                    </p>
                  </li>
                  <li className="is-warning">
                    <span className="ai-timeline-time">22 Aug, 11:02</span>
                    <h6 className="ai-timeline-title">Usage warning</h6>
                    <p className="ai-timeline-text">
                      Lead scoring reached 80% of monthly cap.
                    </p>
                  </li>
                  <li className="is-primary">
                    <span className="ai-timeline-time">19 Aug, 09:27</span>
                    <h6 className="ai-timeline-title">Feature enabled</h6>
                    <p className="ai-timeline-text">
                      Call Summary turned on workspace-wide.
                    </p>
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

export default AiSettingsComponent;