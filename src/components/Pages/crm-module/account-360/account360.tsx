"use client";
import Link from "next/link";
import { type CSSProperties } from "react";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";

const route = all_routes;

const Account360Component = () => {
  return (
    <>
  {/* ========================
			Start Page Content
		========================= */}
  <div className="page-wrapper acc360-page-wrapper">
    {/* Start Content */}
    <div className="content">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
        <div>
          <h4 className="mb-1">Account 360</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={route.companiesGrid}>Companies</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Halcyon Partners
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link
            href={route.relationshipMap}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-affiliate me-1" />
            Relationship Map
          </Link>
          <Link
            href={route.companiesDetails}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-building me-1" />
            Company Record
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
      <div data-account-360="">
        <div className="alert d-none" role="status" data-acc-toast="" />
        {/* Account Header */}
        <div className="acc-header mb-3">
          <div className="acc-header-inner">
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="acc-logo">
                  <ImageWithBasePath
                    src="assets/img/company/company-01.svg"
                    alt="Halcyon Partners"
                  />
                </span>
                <div className="pt-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <h4 className="mb-0">Halcyon Partners</h4>
                    <span className="badge bg-success">Active Customer</span>
                    <span className="badge bg-primary">Enterprise</span>
                  </div>
                  <p className="text-muted fs-13 mb-0">
                    Financial Services · Customer since 12 Mar 2024
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-sm-block">
                  <span className="fs-12 text-muted d-block mb-1">
                    Account health
                  </span>
                  <span className="badge bg-success">Healthy</span>
                </div>
                <span
                  className="ai-score is-good"
                  style={{ "--ai-score": 82 } as CSSProperties}
                >
                  <span className="ai-score-value">82</span>
                  <span className="ai-score-max">/100</span>
                </span>
              </div>
            </div>
            {/* Facts */}
            <div className="acc-facts">
              <div>
                <span className="acc-fact-label">Industry</span>
                <span className="acc-fact-value">Financial Services</span>
              </div>
              <div>
                <span className="acc-fact-label">Account owner</span>
                <span className="acc-fact-value">Tomas Lindqvist</span>
              </div>
              <div>
                <span className="acc-fact-label">Account status</span>
                <span className="acc-fact-value">
                  Active · Renewal in 74 days
                </span>
              </div>
              <div>
                <span className="acc-fact-label">Customer since</span>
                <span className="acc-fact-value">12 Mar 2024</span>
              </div>
              <div>
                <span className="acc-fact-label">Primary contact</span>
                <span className="acc-fact-value">
                  <Link href={route.contactDetails} className="link-primary">
                    Ellis Vandermeer
                  </Link>
                  · CFO
                </span>
              </div>
            </div>
            {/* Quick actions */}
            <div className="d-flex align-items-center gap-2 flex-wrap mt-3 pt-3 border-top">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                data-acc-action="New contact form opened for Halcyon Partners."
              >
                <i className="ti ti-user-plus me-1" />
                Add Contact
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light shadow"
                data-acc-action="New deal drafted against Halcyon Partners."
              >
                <i className="ti ti-briefcase me-1" />
                Create Deal
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light shadow"
                data-acc-action="Meeting scheduler opened for Ellis Vandermeer."
              >
                <i className="ti ti-calendar-event me-1" />
                Schedule Meeting
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light shadow"
                data-acc-action="Activity logged against Halcyon Partners."
              >
                <i className="ti ti-bolt me-1" />
                Add Activity
              </button>
              <Link
                href={route.aiEmailComposer}
                className="btn btn-sm btn-outline-light shadow"
              >
                <i className="ti ti-mail me-1" />
                Send Email
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-outline-light shadow"
                data-acc-action="Note saved to the Halcyon Partners account."
              >
                <i className="ti ti-note me-1" />
                Add Note
              </button>
            </div>
          </div>
        </div>
        {/* End Account Header */}
        {/* KPI Cards */}
        <div className="row g-3 mb-3">
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-coin text-primary" />
                  Total Revenue
                </div>
                <div className="fs-20 fw-bold text-dark">$486,400</div>
                <div className="fs-12 text-success">Lifetime value</div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-briefcase text-warning" />
                  Open Deal Value
                </div>
                <div className="fs-20 fw-bold text-dark">$162,000</div>
                <div className="fs-12 text-muted">2 active deals</div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-trophy text-success" />
                  Won Revenue
                </div>
                <div className="fs-20 fw-bold text-dark">$324,400</div>
                <div className="fs-12 text-success">6 closed-won deals</div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-file-certificate text-info" />
                  Active Contracts
                </div>
                <div className="fs-20 fw-bold text-dark">3</div>
                <div className="fs-12 text-muted">1 renews in 74 days</div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-receipt text-danger" />
                  Outstanding
                </div>
                <div className="fs-20 fw-bold text-dark">$18,600</div>
                <div className="fs-12 text-danger">1 invoice overdue</div>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-xl-4 col-lg-6 col-sm-6">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-heartbeat text-success" />
                  Customer Health
                </div>
                <div className="fs-20 fw-bold text-dark">82 / 100</div>
                <div className="fs-12 text-success">Healthy</div>
              </div>
            </div>
          </div>
        </div>
        {/* End KPI Cards */}
        <div className="row g-3 mb-3">
          {/* Account Overview */}
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <h6 className="mb-0">Account Overview</h6>
                <Link href={route.companiesDetails} className="link-primary fs-13">
                  Edit
                </Link>
              </div>
              <div className="card-body">
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-building" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Company
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      Halcyon Partners
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-briefcase" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Industry
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      Financial Services
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-users" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Company size
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      640 employees
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-world" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Website
                    </span>
                    <Link
                      href="#"
                      className="fs-13 fw-medium link-primary"
                    >
                      halcyon.partners
                    </Link>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-map-pin" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Location
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      Chicago, USA
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-user-check" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Account owner
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      Tomas Lindqvist
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-secondary text-secondary">
                      <i className="ti ti-target" />
                    </span>
                    <span className="flex-grow-1 fs-12 text-muted">
                      Customer segment
                    </span>
                    <span className="fs-13 fw-medium text-dark">
                      Enterprise
                    </span>
                  </li>
                </ul>
                <h6 className="fs-13 mb-2">Contact information</h6>
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-mail" />
                    </span>
                    <span className="flex-grow-1 fs-13">
                      hello@halcyon.partners
                    </span>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-phone" />
                    </span>
                    <span className="flex-grow-1 fs-13">+1 312 555 0100</span>
                  </li>
                </ul>
                <h6 className="fs-13 mb-2">Tags</h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge bg-soft-primary text-primary">
                    Strategic
                  </span>
                  <span className="badge bg-soft-success text-success">
                    Expansion Ready
                  </span>
                  <span className="badge bg-soft-info text-info">
                    Multi-region
                  </span>
                  <span className="badge bg-soft-warning text-warning">
                    Renewal Q4
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Account Health */}
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Account Health</h6>
                <p className="text-muted fs-12 mb-0">Six weighted factors</p>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="acc-health is-healthy d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <span
                    className="ai-score ai-score-sm is-good"
                    style={{ "--ai-score": 82 } as CSSProperties}
                  >
                    <span className="ai-score-value">82</span>
                  </span>
                  <div>
                    <h6 className="mb-1">Healthy</h6>
                    <p className="fs-12 mb-0">
                      Strong engagement and payment behaviour. The only drag is
                      one overdue invoice and rising support volume.
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Engagement</span>
                    <span className="fw-medium text-dark">88</span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "88%" }} />
                    </span>
                  </span>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Revenue trend</span>
                    <span className="fw-medium text-dark">91</span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "91%" }} />
                    </span>
                  </span>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Deal activity</span>
                    <span className="fw-medium text-dark">84</span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "84%" }} />
                    </span>
                  </span>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Payment status</span>
                    <span className="fw-medium text-dark">64</span>
                  </div>
                  <span className="ai-meter is-warning">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "64%" }} />
                    </span>
                  </span>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Support activity</span>
                    <span className="fw-medium text-dark">58</span>
                  </div>
                  <span className="ai-meter is-warning">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "58%" }} />
                    </span>
                  </span>
                </div>
                <div className="mb-0">
                  <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                    <span>Contract status</span>
                    <span className="fw-medium text-dark">95</span>
                  </div>
                  <span className="ai-meter is-success">
                    <span className="ai-meter-track">
                      <span className="ai-meter-fill" style={{ width: "95%" }} />
                    </span>
                  </span>
                </div>
                {/* what is moving the score, so the card ends on information */}
                <div className="ai-card-foot" data-acc-health-foot="">
                  <div className="row g-2 text-center">
                    <div className="col-4">
                      <span className="fs-12 text-muted d-block">
                        last quarter
                      </span>
                      <span className="fs-15 fw-semibold text-success">+6</span>
                    </div>
                    <div className="col-4">
                      <span className="fs-12 text-muted d-block">
                        Percentile
                      </span>
                      <span className="fs-15 fw-semibold text-dark">
                        Top 25%
                      </span>
                    </div>
                    <div className="col-4">
                      <span className="fs-12 text-muted d-block">Reviewed</span>
                      <span className="fs-15 fw-semibold text-dark">Today</span>
                    </div>
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-2 d-none">
                    <i className="ti ti-alert-triangle text-warning me-1" />
                    Biggest drag:
                    <span className="fw-medium text-dark">
                      Support activity (58)
                    </span>{" "}
                    - ticket volume rose 34% this quarter.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* AI Account Insights */}
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="ai-chip">
                    <i className="ti ti-sparkles" />
                    AI
                  </span>
                  <h6 className="mb-0">Account Insights</h6>
                </div>
                <Link href={route.aiInsights} className="link-primary fs-13">
                  All
                </Link>
              </div>
              <div className="card-body">
                <ul className="ai-signals mb-3">
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-heartbeat" />
                    </span>
                    <div className="flex-grow-1">
                      <span className="fs-13 fw-medium text-dark d-block">
                        Account health
                      </span>
                      <span className="fs-12 text-muted">
                        Healthy at 82 - top quartile of your enterprise book.
                      </span>
                    </div>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-success text-success">
                      <i className="ti ti-trending-up" />
                    </span>
                    <div className="flex-grow-1">
                      <span className="fs-13 fw-medium text-dark d-block">
                        Growth opportunity
                      </span>
                      <span className="fs-12 text-muted">
                        88% seat utilisation - $64K expansion is the median for
                        this cohort.
                      </span>
                    </div>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-warning text-warning">
                      <i className="ti ti-alert-triangle" />
                    </span>
                    <div className="flex-grow-1">
                      <span className="fs-13 fw-medium text-dark d-block">
                        Churn risk
                      </span>
                      <span className="fs-12 text-muted">
                        Low, but support volume rose 34% while an expansion is
                        open.
                      </span>
                    </div>
                  </li>
                  <li>
                    <span className="ai-signal-icon bg-soft-primary text-primary">
                      <i className="ti ti-activity" />
                    </span>
                    <div className="flex-grow-1">
                      <span className="fs-13 fw-medium text-dark d-block">
                        Recent engagement
                      </span>
                      <span className="fs-12 text-muted">
                        14 interactions in 30 days across 5 stakeholders.
                      </span>
                    </div>
                  </li>
                  <li className="d-none d-xxl-block">
                    <span className="ai-signal-icon bg-soft-info text-info">
                      <i className="ti ti-refresh" />
                    </span>
                    <div className="flex-grow-1">
                      <span className="fs-13 fw-medium text-dark d-block">
                        Renewal opportunity
                      </span>
                      <span className="fs-12 text-muted">
                        $96K renews in 74 days. Multi-year terms already
                        requested.
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="ai-action mb-0">
                  <span className="ai-action-icon bg-soft-primary text-primary">
                    <i className="ti ti-player-track-next" />
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="ai-action-title">Recommended next action</h6>
                    <p className="ai-action-meta">
                      Send multi-year renewal pricing while the CFO is actively
                      engaged
                    </p>
                  </div>
                </div>
                <Link
                  href={route.aiEmailComposer}
                  className="btn btn-primary btn-sm w-100 mt-3"
                >
                  <i className="ti ti-mail-star me-1" />
                  Draft the renewal email
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Key Contacts */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div>
              <h6 className="mb-0">Key Contacts</h6>
              <p className="text-muted fs-12 mb-0">
                7 stakeholders mapped to the buying process
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link
                href={route.relationshipMap}
                className="btn btn-sm btn-outline-light shadow"
              >
                <i className="ti ti-affiliate me-1" />
                Relationship map
              </Link>
              <Link
                href={route.contactGrid}
                className="btn btn-sm btn-outline-light shadow"
              >
                All contacts
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Contact</th>
                    <th scope="col">Department</th>
                    <th scope="col">Role in buying process</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Last interaction</th>
                    <th scope="col">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-05.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Ellis Vandermeer
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Chief Financial Officer
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Finance</td>
                    <td>
                      <span className="badge bg-soft-danger text-danger">
                        Decision Maker
                      </span>
                    </td>
                    <td>e.vandermeer@halcyon.partners</td>
                    <td>+1 312 555 0119</td>
                    <td>6 hours ago</td>
                    <td>
                      <span className="rel-strength is-strong">Strong</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Marcus Whitfield
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            VP Operations
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Operations</td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        Champion
                      </span>
                    </td>
                    <td>m.whitfield@halcyon.partners</td>
                    <td>+1 415 555 0134</td>
                    <td>1 day ago</td>
                    <td>
                      <span className="rel-strength is-strong">Strong</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-07.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Dana Reyes
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Chief Technology Officer
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Technology</td>
                    <td>
                      <span className="badge bg-soft-info text-info">
                        Technical Contact
                      </span>
                    </td>
                    <td>d.reyes@halcyon.partners</td>
                    <td>+1 312 555 0164</td>
                    <td>2 days ago</td>
                    <td>
                      <span className="rel-strength is-good">Good</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-02.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Priya Raghunathan
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Head of IT Operations
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Technology</td>
                    <td>
                      <span className="badge bg-soft-secondary text-secondary">
                        User
                      </span>
                    </td>
                    <td>p.raghunathan@halcyon.partners</td>
                    <td>+1 617 555 0188</td>
                    <td>11 days ago</td>
                    <td>
                      <span className="rel-strength is-neutral">Neutral</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-08.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Tomas Berg
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Financial Controller
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Finance</td>
                    <td>
                      <span className="badge bg-soft-primary text-primary">
                        Finance
                      </span>
                    </td>
                    <td>t.berg@halcyon.partners</td>
                    <td>+46 8 555 0142</td>
                    <td>18 days ago</td>
                    <td>
                      <span className="rel-strength is-good">Good</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-04.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Nadia Okonkwo
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Group COO
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Executive</td>
                    <td>
                      <span className="badge bg-soft-warning text-warning">
                        Executive Sponsor
                      </span>
                    </td>
                    <td>n.okonkwo@halcyon.partners</td>
                    <td>+44 20 5550 173</td>
                    <td>34 days ago</td>
                    <td>
                      <span className="rel-strength is-weak">Weak</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar avatar-sm rounded">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-06.jpg"
                            alt="Contact"
                            className="img-fluid rounded"
                          />
                        </span>
                        <div>
                          <Link
                            href={route.contactDetails}
                            className="fw-medium text-dark"
                          >
                            Sofia Marchetti
                          </Link>
                          <span className="fs-12 text-muted d-block">
                            Procurement Lead
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>Finance</td>
                    <td>
                      <span className="badge bg-soft-dark text-dark">
                        Blocker
                      </span>
                    </td>
                    <td>s.marchetti@halcyon.partners</td>
                    <td>+39 02 5550 921</td>
                    <td>23 days ago</td>
                    <td>
                      <span className="rel-strength is-risk">At Risk</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* End Key Contacts */}
        {/* Deals & Pipeline */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between gap-2">
            <div>
              <h6 className="mb-0">Deals &amp; Pipeline</h6>
              <p className="text-muted fs-12 mb-0">
                $162,000 open across 2 deals
              </p>
            </div>
            <Link href={route.dealsGrid} className="link-primary fs-13">
              All deals
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Deal</th>
                    <th scope="col">Value</th>
                    <th scope="col">Stage</th>
                    <th scope="col" style={{ minWidth: 150 }}>
                      Probability
                    </th>
                    <th scope="col">Expected close</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Deal health</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link
                        href={route.dealsDetails}
                        className="fw-medium text-dark"
                      >
                        Halcyon Partners - Pilot
                      </Link>
                    </td>
                    <td>$128,000</td>
                    <td>
                      <span className="badge bg-soft-warning text-warning">
                        Negotiation
                      </span>
                    </td>
                    <td>
                      <span className="ai-meter is-success">
                        <span className="ai-meter-track">
                          <span className="ai-meter-fill" style={{ width: "74%" }} />
                        </span>
                        <span className="ai-meter-value">74%</span>
                      </span>
                    </td>
                    <td>19 Sep 2026</td>
                    <td>Tomas Lindqvist</td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        Low Risk · 76
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link
                        href={route.dealsDetails}
                        className="fw-medium text-dark"
                      >
                        Halcyon - Support Renewal
                      </Link>
                    </td>
                    <td>$34,000</td>
                    <td>
                      <span className="badge bg-soft-info text-info">
                        Contract Review
                      </span>
                    </td>
                    <td>
                      <span className="ai-meter is-success">
                        <span className="ai-meter-track">
                          <span className="ai-meter-fill" style={{ width: "88%" }} />
                        </span>
                        <span className="ai-meter-value">88%</span>
                      </span>
                    </td>
                    <td>02 Oct 2026</td>
                    <td>Adrian Herrera</td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        Low Risk · 84
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* End Deals & Pipeline */}
        <div className="row g-3">
          {/* Activity Timeline */}
          <div className="col-xl-5">
            <div className="card mb-0">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <h6 className="mb-0">Account Timeline</h6>
                  <span
                    className="badge bg-light text-dark"
                    data-acc-timeline-count=""
                  />
                </div>
                <div className="d-flex align-items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow active"
                    data-acc-filter="all"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="call"
                  >
                    Calls
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="email"
                  >
                    Emails
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="meeting"
                  >
                    Meetings
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="note"
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="task"
                  >
                    Tasks
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="deal"
                  >
                    Deals
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="proposal"
                  >
                    Proposals
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="contract"
                  >
                    Contracts
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    data-acc-filter="payment"
                  >
                    Payments
                  </button>
                </div>
              </div>
              <div className="card-body">
                <ul className="ai-timeline" data-acc-timeline="">
                  <li className="is-success" data-activity-type="deal">
                    <span className="ai-timeline-time">Today, 09:12</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-briefcase me-1" />
                      Deal updated
                    </h6>
                    <p className="ai-timeline-text">
                      <Link href={route.dealsDetails} className="link-primary">
                        Halcyon Partners - Pilot
                      </Link>{" "}
                      moved to Negotiation at $128,000.
                    </p>
                  </li>
                  <li className="is-primary" data-activity-type="email">
                    <span className="ai-timeline-time">Today, 06:40</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-mail me-1" />
                      Email received
                    </h6>
                    <p className="ai-timeline-text">
                      Ellis Vandermeer asked about multi-year contract terms.
                    </p>
                  </li>
                  <li className="is-primary" data-activity-type="call">
                    <span className="ai-timeline-time">24 Aug, 14:30</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-phone me-1" />
                      Call logged
                    </h6>
                    <p className="ai-timeline-text">
                      32-minute pricing call with Ellis and Dana.
                      <Link href={route.callSummary} className="link-primary">
                        View AI summary
                      </Link>
                    </p>
                  </li>
                  <li className="is-warning" data-activity-type="payment">
                    <span className="ai-timeline-time">23 Aug, 11:05</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-credit-card me-1" />
                      Payment overdue
                    </h6>
                    <p className="ai-timeline-text">
                      Invoice{" "}
                      <Link href={route.invoice_details} className="link-primary">
                        INV-2048
                      </Link>{" "}
                      for $18,600 is 6 days past due.
                    </p>
                  </li>
                  <li className="is-primary" data-activity-type="meeting">
                    <span className="ai-timeline-time">21 Aug, 10:00</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-calendar-event me-1" />
                      Meeting held
                    </h6>
                    <p className="ai-timeline-text">
                      Executive briefing with the full leadership team.
                    </p>
                  </li>
                  <li className="is-success" data-activity-type="contract">
                    <span className="ai-timeline-time">19 Aug, 16:22</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-file-certificate me-1" />
                      Contract activity
                    </h6>
                    <p className="ai-timeline-text">
                      <Link href={route.ContractsGrid} className="link-primary">
                        CNT-0091
                      </Link>{" "}
                      sent for signature.
                    </p>
                  </li>
                  <li className="is-primary" data-activity-type="proposal">
                    <span className="ai-timeline-time">16 Aug, 09:48</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-file-text me-1" />
                      Proposal viewed
                    </h6>
                    <p className="ai-timeline-text">
                      <Link href={route.ProposalsGrid} className="link-primary">
                        PRP-0342
                      </Link>{" "}
                      opened 4 times by 2 stakeholders.
                    </p>
                  </li>
                  <li className="is-primary" data-activity-type="note">
                    <span className="ai-timeline-time">14 Aug, 15:10</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-note me-1" />
                      Note added
                    </h6>
                    <p className="ai-timeline-text">
                      Procurement wants three competing quotes before sign-off.
                    </p>
                  </li>
                  <li className="is-warning" data-activity-type="task">
                    <span className="ai-timeline-time">12 Aug, 08:30</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-checklist me-1" />
                      Task created
                    </h6>
                    <p className="ai-timeline-text">
                      Prepare the implementation plan — due 28 Aug.
                    </p>
                  </li>
                  <li className="is-success" data-activity-type="payment">
                    <span className="ai-timeline-time">02 Aug, 12:00</span>
                    <h6 className="ai-timeline-title">
                      <i className="ti ti-credit-card me-1" />
                      Payment received
                    </h6>
                    <p className="ai-timeline-text">
                      $42,000 received against INV-2039.
                    </p>
                  </li>
                </ul>
                <div className="d-none" data-acc-timeline-empty="">
                  <div className="ai-empty">
                    <span className="ai-empty-icon">
                      <i className="ti ti-timeline-event" />
                    </span>
                    <h6>No activities of this type</h6>
                    <p>
                      Try a different filter to see more of the account history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Documents & Financials */}
          <div className="col-xl-7">
            <div className="card mb-0 acc-docs">
              <div className="card-header">
                <h6 className="mb-2">Documents &amp; Financials</h6>
                <ul
                  className="nav nav-tabs nav-bordered mb-0 flex-nowrap gap-1 overflow-auto"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_proposals"
                      type="button"
                      role="tab"
                    >
                      Proposals
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_quotes"
                      type="button"
                      role="tab"
                    >
                      Quotations
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_contracts"
                      type="button"
                      role="tab"
                    >
                      Contracts
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_invoices"
                      type="button"
                      role="tab"
                    >
                      Invoices
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_payments"
                      type="button"
                      role="tab"
                    >
                      Payments
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_projects"
                      type="button"
                      role="tab"
                    >
                      Projects
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-nowrap"
                      data-bs-toggle="tab"
                      data-bs-target="#acc_tickets"
                      type="button"
                      role="tab"
                    >
                      Tickets
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="acc_proposals"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Proposal</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Sent</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.ProposalsGrid}
                                className="fw-medium text-dark"
                              >
                                PRP-0342
                              </Link>
                            </td>
                            <td>$128,000</td>
                            <td>16 Aug 2026</td>
                            <td>
                              <span className="badge bg-soft-warning text-warning">
                                Under Review
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.ProposalsGrid}
                                className="fw-medium text-dark"
                              >
                                PRP-0298
                              </Link>
                            </td>
                            <td>$96,000</td>
                            <td>04 Mar 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Accepted
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_quotes"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Quotation</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Valid until</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.quotationsList}
                                className="fw-medium text-dark"
                              >
                                QT-1188
                              </Link>
                            </td>
                            <td>$128,000</td>
                            <td>30 Sep 2026</td>
                            <td>
                              <span className="badge bg-soft-info text-info">
                                Sent
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.quotationsList}
                                className="fw-medium text-dark"
                              >
                                QT-1042
                              </Link>
                            </td>
                            <td>$34,000</td>
                            <td>15 Oct 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Approved
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_contracts"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Contract</th>
                            <th scope="col">Value</th>
                            <th scope="col">Term</th>
                            <th scope="col">Renews</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.ContractsGrid}
                                className="fw-medium text-dark"
                              >
                                CNT-0091
                              </Link>
                            </td>
                            <td>$96,000</td>
                            <td>12 months</td>
                            <td>07 Nov 2026</td>
                            <td>
                              <span className="badge bg-soft-warning text-warning">
                                Awaiting Signature
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.ContractsGrid}
                                className="fw-medium text-dark"
                              >
                                CNT-0064
                              </Link>
                            </td>
                            <td>$142,000</td>
                            <td>24 months</td>
                            <td>12 Mar 2027</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Active
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.ContractsGrid}
                                className="fw-medium text-dark"
                              >
                                CNT-0031
                              </Link>
                            </td>
                            <td>$88,400</td>
                            <td>12 months</td>
                            <td>01 Feb 2027</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Active
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_invoices"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Invoice</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Issued</th>
                            <th scope="col">Due</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.invoice_details}
                                className="fw-medium text-dark"
                              >
                                INV-2048
                              </Link>
                            </td>
                            <td>$18,600</td>
                            <td>04 Aug 2026</td>
                            <td>19 Aug 2026</td>
                            <td>
                              <span className="badge bg-soft-danger text-danger">
                                Overdue
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.invoice_details}
                                className="fw-medium text-dark"
                              >
                                INV-2039
                              </Link>
                            </td>
                            <td>$42,000</td>
                            <td>18 Jul 2026</td>
                            <td>02 Aug 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Paid
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.invoice_details}
                                className="fw-medium text-dark"
                              >
                                INV-2016
                              </Link>
                            </td>
                            <td>$36,800</td>
                            <td>02 Jun 2026</td>
                            <td>17 Jun 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Paid
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_payments"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Payment</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Method</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.payments}
                                className="fw-medium text-dark"
                              >
                                PAY-5521
                              </Link>
                            </td>
                            <td>$42,000</td>
                            <td>Bank Transfer</td>
                            <td>02 Aug 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Cleared
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.payments}
                                className="fw-medium text-dark"
                              >
                                PAY-5410
                              </Link>
                            </td>
                            <td>$36,800</td>
                            <td>Bank Transfer</td>
                            <td>16 Jun 2026</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Cleared
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_projects"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Project</th>
                            <th scope="col">Lead</th>
                            <th scope="col">Due</th>
                            <th scope="col" style={{ minWidth: 140 }}>
                              Progress
                            </th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.projectDetails}
                                className="fw-medium text-dark"
                              >
                                Pilot Implementation
                              </Link>
                            </td>
                            <td>Priya Raghunathan</td>
                            <td>14 Oct 2026</td>
                            <td>
                              <span className="ai-meter">
                                <span className="ai-meter-track">
                                  <span
                                    className="ai-meter-fill"
                                    style={{ width: "62%" }}
                                  />
                                </span>
                                <span className="ai-meter-value">62%</span>
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-soft-info text-info">
                                In Progress
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.projectDetails}
                                className="fw-medium text-dark"
                              >
                                Data Migration
                              </Link>
                            </td>
                            <td>Dana Reyes</td>
                            <td>28 Jun 2026</td>
                            <td>
                              <span className="ai-meter is-success">
                                <span className="ai-meter-track">
                                  <span
                                    className="ai-meter-fill"
                                    style={{ width: "100%" }}
                                  />
                                </span>
                                <span className="ai-meter-value">100%</span>
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Completed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="acc_tickets"
                    role="tabpanel"
                  >
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Ticket</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Updated</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                href={route.ticketsDetails}
                                className="fw-medium text-dark"
                              >
                                TKT-8841
                              </Link>
                            </td>
                            <td>SSO session timeout on Okta</td>
                            <td>
                              <span className="badge bg-soft-danger text-danger">
                                High
                              </span>
                            </td>
                            <td>2 days ago</td>
                            <td>
                              <span className="badge bg-soft-warning text-warning">
                                In Progress
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.ticketsDetails}
                                className="fw-medium text-dark"
                              >
                                TKT-8790
                              </Link>
                            </td>
                            <td>Export missing custom fields</td>
                            <td>
                              <span className="badge bg-soft-warning text-warning">
                                Medium
                              </span>
                            </td>
                            <td>9 days ago</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Resolved
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                href={route.ticketsDetails}
                                className="fw-medium text-dark"
                              >
                                TKT-8702
                              </Link>
                            </td>
                            <td>Add EU data residency confirmation</td>
                            <td>
                              <span className="badge bg-soft-secondary text-secondary">
                                Low
                              </span>
                            </td>
                            <td>21 days ago</td>
                            <td>
                              <span className="badge bg-soft-success text-success">
                                Closed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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

export default Account360Component;