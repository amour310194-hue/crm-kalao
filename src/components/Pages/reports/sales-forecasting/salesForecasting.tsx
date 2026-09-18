"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useMemo, useState } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import {
  SalesForecastViews,
  SalesForecastCategoryBreakdown,
  SalesForecastStageBreakdown,
  type SalesForecastViewKey,
} from "../../../../core/json/salesForecastingData";

const route = all_routes;

const VIEW_LABELS: Record<SalesForecastViewKey, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const SalesForecastingComponent = () => {
  const [view, setView] = useState<SalesForecastViewKey>("monthly");
  const v = SalesForecastViews[view];

  const revenueChart = useMemo<{ options: ApexOptions; series: ApexOptions["series"] }>(
    () => ({
      options: {
        chart: { type: "bar", stacked: true, toolbar: { show: false } },
        xaxis: { categories: v.categories },
        colors: ["#0d6efd", "#0dcaf0", "#adb5bd"],
        legend: { position: "top" },
      },
      series: [
        { name: "Commit", data: v.commit },
        { name: "Best Case", data: v.best },
        { name: "Pipeline", data: v.pipe },
      ],
    }),
    [v]
  );

  const pipelineChart = useMemo<{ options: ApexOptions; series: ApexOptions["series"] }>(
    () => ({
      options: {
        chart: { type: "area", toolbar: { show: false } },
        xaxis: { categories: v.categories },
        dataLabels: { enabled: false },
      },
      series: [{ name: "Open Pipeline", data: v.openPipeline }],
    }),
    [v]
  );

  const quotaChart = useMemo<{ options: ApexOptions; series: ApexOptions["series"] }>(
    () => ({
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: { categories: v.categories },
        colors: ["#adb5bd", "#0d6efd"],
        legend: { position: "top" },
      },
      series: [
        { name: "Quota", data: v.quota },
        { name: "Actual", data: v.actual },
      ],
    }),
    [v]
  );

  const accuracyChart = useMemo<{ options: ApexOptions; series: ApexOptions["series"] }>(
    () => ({
      options: {
        chart: { type: "line", toolbar: { show: false } },
        xaxis: { categories: v.categories },
        stroke: { curve: "smooth", width: 2 },
      },
      series: [
        { name: "Forecast", data: v.forecast },
        { name: "Actual", data: v.actual },
      ],
    }),
    [v]
  );

  const categoryChart: { options: ApexOptions; series: number[] } = {
    options: { chart: { type: "donut" }, labels: SalesForecastCategoryBreakdown.labels },
    series: SalesForecastCategoryBreakdown.series,
  };

  const stageChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: SalesForecastStageBreakdown.categories },
    },
    series: SalesForecastStageBreakdown.series,
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
          <h4 className="mb-1">Sales Forecasting</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">Reports</li>
              <li className="breadcrumb-item active" aria-current="page">
                Sales Forecasting
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <div className="btn-group" role="group" aria-label="Forecast view">
            <button
              type="button"
              className={`btn btn-outline-light shadow${view === "monthly" ? " active" : ""}`}
              onClick={() => setView("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`btn btn-outline-light shadow${view === "quarterly" ? " active" : ""}`}
              onClick={() => setView("quarterly")}
            >
              Quarterly
            </button>
            <button
              type="button"
              className={`btn btn-outline-light shadow${view === "yearly" ? " active" : ""}`}
              onClick={() => setView("yearly")}
            >
              Yearly
            </button>
          </div>
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
      {/* Reports Nav */}
      <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto">
        <li className="nav-item">
          <Link href={route.reportBuilder} className="nav-link text-nowrap">
            <i className="ti ti-tool me-1" />
            Report Builder
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.scheduledReports} className="nav-link text-nowrap">
            <i className="ti ti-clock-hour-4 me-1" />
            Scheduled
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.salesForecasting}
            className="nav-link text-nowrap active"
          >
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
      <div data-forecast-page="">
        <div className="alert d-none" role="status" data-report-toast="" />
        {/* Filters */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="fc_rep">
                  Sales Rep
                </label>
                <select
                  className="form-select"
                  id="fc_rep"
                  data-fc-filter="rep"
                 defaultValue="all">
                  <option value="all">
                    All reps
                  </option>
                  <option>Adrian Herrera</option>
                  <option>Ellis Vandermeer</option>
                  <option>Priya Raghunathan</option>
                  <option>Tomas Lindqvist</option>
                  <option>Nadia Okonkwo</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="fc_team">
                  Team
                </label>
                <select
                  className="form-select"
                  id="fc_team"
                  data-fc-filter="team"
                 defaultValue="all">
                  <option value="all">
                    All teams
                  </option>
                  <option>Enterprise</option>
                  <option>Mid-Market</option>
                  <option>SMB</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="fc_region">
                  Region
                </label>
                <select
                  className="form-select"
                  id="fc_region"
                  data-fc-filter="region"
                 defaultValue="all">
                  <option value="all">
                    All regions
                  </option>
                  <option>North America</option>
                  <option>EMEA</option>
                  <option>APAC</option>
                  <option>LATAM</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="fc_pipeline">
                  Pipeline
                </label>
                <select
                  className="form-select"
                  id="fc_pipeline"
                  data-fc-filter="pipeline"
                 defaultValue="all">
                  <option value="all">
                    All pipelines
                  </option>
                  <option>New Business</option>
                  <option>Renewals</option>
                  <option>Expansion</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="fc_range">
                  Date range
                </label>
                <select
                  className="form-select"
                  id="fc_range"
                  data-fc-filter="range"
                 defaultValue="all">
                  <option value="all">
                    This Quarter
                  </option>
                  <option>Next Quarter</option>
                  <option>This Year</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <button
                  type="button"
                  className="btn btn-outline-light shadow w-100"
                  data-fc-reset=""
                >
                  <i className="ti ti-filter-off me-1" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Filters */}
        {/* KPI Cards */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-chart-arrows-vertical text-primary" />
                  Forecast Revenue
                </div>
                <div className="fs-20 fw-bold text-dark">$845K</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-up-right" /> 8.4% vs last quarter
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-trophy text-success" />
                  Closed Revenue
                </div>
                <div className="fs-20 fw-bold text-dark">$612K</div>
                <div className="fs-12 text-muted">42 deals won</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-filter text-warning" />
                  Open Pipeline
                </div>
                <div className="fs-20 fw-bold text-dark">$1.84M</div>
                <div className="fs-12 text-muted">53 open deals</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-target text-info" />
                  Sales Quota
                </div>
                <div className="fs-20 fw-bold text-dark">$920K</div>
                <div className="fs-12 text-muted">Q3 2026 team target</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-percentage text-primary" />
                  Attainment
                </div>
                <div className="fs-20 fw-bold text-dark">91.8%</div>
                <span className="ai-meter is-warning mt-1">
                  <span className="ai-meter-track">
                    <span className="ai-meter-fill" style={{ width: "91.8%" }} />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xxl-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-focus-2 text-success" />
                  Forecast Accuracy
                </div>
                <div className="fs-20 fw-bold text-dark">94.2%</div>
                <div className="fs-12 text-success">Last 4 quarters</div>
              </div>
            </div>
          </div>
        </div>
        {/* End KPI Cards */}
        {/* Forecast categories */}
        <div className="row g-3 justify-content-center mb-3">
          <div className="col-xl col-lg-4 col-md-4 col-sm-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="rel-strength is-strong" />
                <span className="fs-12 text-muted">Commit</span>
              </div>
              <div className="fs-20 fw-bold text-dark">$410K</div>
              <div className="fs-12 text-muted">18 deals · 92% avg</div>
            </div>
          </div>
          <div className="col-xl col-lg-4 col-md-4 col-sm-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="rel-strength is-good" />
                <span className="fs-12 text-muted">Best Case</span>
              </div>
              <div className="fs-20 fw-bold text-dark">$190K</div>
              <div className="fs-12 text-muted">11 deals · 61% avg</div>
            </div>
          </div>
          <div className="col-xl col-lg-4 col-md-4 col-sm-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="rel-strength is-weak" />
                <span className="fs-12 text-muted">Pipeline</span>
              </div>
              <div className="fs-20 fw-bold text-dark">$245K</div>
              <div className="fs-12 text-muted">24 deals · 28% avg</div>
            </div>
          </div>
          <div className="col-xl col-lg-4 col-md-6 col-sm-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="rel-strength is-strong" />
                <span className="fs-12 text-muted">Closed Won</span>
              </div>
              <div className="fs-20 fw-bold text-dark">$612K</div>
              <div className="fs-12 text-success">42 deals</div>
            </div>
          </div>
          <div className="col-xl col-lg-4 col-md-6 col-sm-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="rel-strength is-risk" />
                <span className="fs-12 text-muted">Closed Lost</span>
              </div>
              <div className="fs-20 fw-bold text-dark">$148K</div>
              <div className="fs-12 text-danger">19 deals</div>
            </div>
          </div>
        </div>
        {/* End Forecast categories */}
        {/* Main chart */}
        <div className="row g-3 mb-3">
          <div className="col-xxl-8">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">
                  Revenue Forecast — <span>{VIEW_LABELS[view]}</span>
                </h6>
                <p className="text-muted fs-12 mb-0">
                  Weighted pipeline by category against the quota line
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={revenueChart.options} series={revenueChart.series} type="bar" height={300} />
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Forecast Categories</h6>
                <p className="text-muted fs-12 mb-0">
                  Where this period's number comes from
                </p>
              </div>
              <div className="card-body">
                <Chart options={categoryChart.options} series={categoryChart.series} type="donut" height={280} />
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Pipeline Trend</h6>
                <p className="text-muted fs-12 mb-0">
                  Total open pipeline over time
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={pipelineChart.options} series={pipelineChart.series} type="area" height={230} />
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Quota vs Actual</h6>
                <p className="text-muted fs-12 mb-0">
                  Closed-won against target
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={quotaChart.options} series={quotaChart.series} type="bar" height={230} />
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Forecast vs Actual</h6>
                <p className="text-muted fs-12 mb-0">
                  Historical forecast accuracy
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={accuracyChart.options} series={accuracyChart.series} type="line" height={230} />
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-3">
          {/* Rep forecast */}
          <div className="col-xl-7">
            <div className="card mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <div>
                  <h6 className="mb-0">Rep-level Forecast</h6>
                  <p className="text-muted fs-12 mb-0">
                    Closed-won plus weighted forecast against quota
                  </p>
                </div>
                <Link
                  href={route.salesRepComparisonReport}
                  className="link-primary fs-13"
                >
                  Compare Reps
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Sales Rep</th>
                        <th scope="col">Team</th>
                        <th scope="col">Quota</th>
                        <th scope="col">Closed</th>
                        <th scope="col">Forecast</th>
                        <th scope="col" style={{ minWidth: 150 }}>
                          Attainment
                        </th>
                        <th scope="col" className="no-sort">
                          <span className="visually-hidden">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-medium text-dark">
                          Ellis Vandermeer
                        </td>
                        <td>Mid-Market</td>
                        <td>$150K</td>
                        <td>$139K</td>
                        <td>$39K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-success flex-grow-1">
                              <span className="ai-meter-track">
                                <span
                                  className="ai-meter-fill"
                                  style={{ width: "100%" }}
                                />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              118%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Adrian Herrera</td>
                        <td>Enterprise</td>
                        <td>$220K</td>
                        <td>$168K</td>
                        <td>$54K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-success flex-grow-1">
                              <span className="ai-meter-track">
                                <span
                                  className="ai-meter-fill"
                                  style={{ width: "100%" }}
                                />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              101%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">
                          Priya Raghunathan
                        </td>
                        <td>Mid-Market</td>
                        <td>$180K</td>
                        <td>$121K</td>
                        <td>$47K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-warning flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "93%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              93%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Tomas Lindqvist</td>
                        <td>Enterprise</td>
                        <td>$220K</td>
                        <td>$96K</td>
                        <td>$71K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-danger flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "76%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              76%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Nadia Okonkwo</td>
                        <td>SMB</td>
                        <td>$150K</td>
                        <td>$58K</td>
                        <td>$34K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-danger flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "61%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              61%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">John Doe</td>
                        <td>Enterprise</td>
                        <td>$420K</td>
                        <td>$310K</td>
                        <td>$286K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-success flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "92%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              92%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">
                          Marcus Lindqvist
                        </td>
                        <td>Mid-Market</td>
                        <td>$210K</td>
                        <td>$132K</td>
                        <td>$95K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-warning flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "72%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              72%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Fatima Al-Sayed</td>
                        <td>SMB</td>
                        <td>$95K</td>
                        <td>$41K</td>
                        <td>$18K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-danger flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "47%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              47%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Diego Fernandez</td>
                        <td>Enterprise</td>
                        <td>$275K</td>
                        <td>$198K</td>
                        <td>$164K</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ai-meter is-success flex-grow-1">
                              <span className="ai-meter-track">
                                <span className="ai-meter-fill" style={{ width: "84%" }} />
                              </span>
                            </span>
                            <span className="fs-12 fw-medium text-dark">
                              84%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link
                            href={route.manageusers}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View User
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Team + stage */}
          <div className="col-xl-5">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Team Forecast</h6>
                <p className="text-muted fs-12 mb-0">
                  Weighted forecast by segment
                </p>
              </div>
              <div className="card-body pb-0">
                <div className="table-responsive mb-3">
                  <table className="table table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Team</th>
                        <th scope="col">Quota</th>
                        <th scope="col">Forecast</th>
                        <th scope="col">Gap</th>
                        <th scope="col" className="no-sort">
                          <span className="visually-hidden">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-medium text-dark">Enterprise</td>
                        <td>$440K</td>
                        <td>$389K</td>
                        <td>
                          <span className="text-danger">-$51K</span>
                        </td>
                        <td>
                          <Link
                            href={route.teamsList}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View Team
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">Mid-Market</td>
                        <td>$330K</td>
                        <td>$346K</td>
                        <td>
                          <span className="text-success">+$16K</span>
                        </td>
                        <td>
                          <Link
                            href={route.teamsList}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View Team
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-medium text-dark">SMB</td>
                        <td>$150K</td>
                        <td>$110K</td>
                        <td>
                          <span className="text-danger">-$40K</span>
                        </td>
                        <td>
                          <Link
                            href={route.teamsList}
                            className="btn btn-sm btn-outline-light shadow"
                          >
                            View Team
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h6 className="fs-13 mb-2">Stage-based Forecast</h6>
                <Chart options={stageChart.options} series={stageChart.series} type="bar" height={220} />
              </div>
            </div>
          </div>
        </div>
        {/* Historical performance */}
        <div className="card mb-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div>
              <h6 className="mb-0">Historical Performance</h6>
              <p className="text-muted fs-12 mb-0">
                How each closed period landed against its forecast
              </p>
            </div>
            <Link href={route.revenueReport} className="link-primary fs-13">
              Revenue Report
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Period</th>
                    <th scope="col">Quota</th>
                    <th scope="col">Forecast</th>
                    <th scope="col">Actual</th>
                    <th scope="col">Attainment</th>
                    <th scope="col">Forecast accuracy</th>
                    <th scope="col">Deals won</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-medium text-dark">Q2 2026</td>
                    <td>$1.68M</td>
                    <td>$1.69M</td>
                    <td>$1.72M</td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        102%
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        98.3%
                      </span>
                    </td>
                    <td>128</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-dark">Q1 2026</td>
                    <td>$1.52M</td>
                    <td>$1.51M</td>
                    <td>$1.50M</td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        99%
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-soft-success text-success">
                        99.3%
                      </span>
                    </td>
                    <td>114</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-dark">Q4 2025</td>
                    <td>$1.40M</td>
                    <td>$1.42M</td>
                    <td>$1.38M</td>
                    <td>
                      <span className="badge bg-soft-warning text-warning">
                        99%
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-soft-warning text-warning">
                        97.2%
                      </span>
                    </td>
                    <td>106</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-dark">Q3 2025</td>
                    <td>$1.26M</td>
                    <td>$1.31M</td>
                    <td>$1.19M</td>
                    <td>
                      <span className="badge bg-soft-danger text-danger">
                        94%
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-soft-danger text-danger">
                        90.8%
                      </span>
                    </td>
                    <td>97</td>
                  </tr>
                </tbody>
              </table>
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

export default SalesForecastingComponent;