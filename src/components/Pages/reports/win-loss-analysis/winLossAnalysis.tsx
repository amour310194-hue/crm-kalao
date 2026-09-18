"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import {
  WinLossTrendChart,
  WinLossLostReasonsChart,
  WinLossCompetitorChart,
  WinLossCycleChart,
  WinLossDimensionTables,
  WinLossDimensionColumns,
  type WinLossDimensionKey,
} from "../../../../core/json/winLossAnalysisData";

const route = all_routes;

const WinLossAnalysisComponent = () => {
  const [dim, setDim] = useState<WinLossDimensionKey>("rep");
  const cols = WinLossDimensionColumns[dim];
  const rows = WinLossDimensionTables[dim];

  const trendChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "bar", stacked: true, toolbar: { show: false } },
      xaxis: { categories: WinLossTrendChart.categories },
      colors: ["#28a745", "#dc3545"],
      legend: { position: "top" },
    },
    series: WinLossTrendChart.series,
  };
  const reasonChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: WinLossLostReasonsChart.categories },
    },
    series: WinLossLostReasonsChart.series,
  };
  const competitorChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: WinLossCompetitorChart.categories },
      colors: ["#28a745", "#dc3545"],
      legend: { position: "top" },
    },
    series: WinLossCompetitorChart.series,
  };
  const cycleChart: { options: ApexOptions; series: ApexOptions["series"] } = {
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: WinLossCycleChart.categories },
      colors: ["#28a745", "#dc3545"],
      legend: { position: "top" },
    },
    series: WinLossCycleChart.series,
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
          <h4 className="mb-1">Win/Loss Analysis</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">Reports</li>
              <li className="breadcrumb-item active" aria-current="page">
                Win/Loss Analysis
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link
            href={route.lostDealAnalysisReport}
            className="btn btn-outline-light shadow"
          >
            <i className="ti ti-thumb-down me-1" />
            Lost Deal Report
          </Link>
          <div className="dropdown">
            <Link
              href="#"
              className="btn btn-outline-light shadow dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-file-export me-1" />
              Export Data
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
      <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto overflow-y-hidden">
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
          <Link href={route.salesForecasting} className="nav-link text-nowrap">
            <i className="ti ti-chart-arrows-vertical me-1" />
            Forecasting
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href={route.winLossAnalysis}
            className="nav-link text-nowrap active"
          >
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
      <div data-winloss="">
        {/* Filters */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="wl_range">
                  Date range
                </label>
                <select className="form-select" id="wl_range" data-wl-filter="" defaultValue="all">
                  <option value="all">
                    Last 6 months
                  </option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="wl_rep">
                  Sales rep
                </label>
                <select className="form-select" id="wl_rep" data-wl-filter="" defaultValue="all">
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
                <label className="form-label" htmlFor="wl_team">
                  Team
                </label>
                <select className="form-select" id="wl_team" data-wl-filter="" defaultValue="all">
                  <option value="all">
                    All teams
                  </option>
                  <option>Enterprise</option>
                  <option>Mid-Market</option>
                  <option>SMB</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="wl_industry">
                  Industry
                </label>
                <select
                  className="form-select"
                  id="wl_industry"
                  data-wl-filter=""
                 defaultValue="all">
                  <option value="all">
                    All industries
                  </option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Technology</option>
                  <option>Logistics</option>
                  <option>Manufacturing</option>
                  <option>Media</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="wl_source">
                  Source
                </label>
                <select
                  className="form-select"
                  id="wl_source"
                  data-wl-filter=""
                 defaultValue="all">
                  <option value="all">
                    All sources
                  </option>
                  <option>Referral</option>
                  <option>Webinar</option>
                  <option>Outbound</option>
                  <option>Trade Show</option>
                  <option>Paid Search</option>
                </select>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6">
                <label className="form-label" htmlFor="wl_reason">
                  Lost reason
                </label>
                <select
                  className="form-select"
                  id="wl_reason"
                  data-wl-filter=""
                 defaultValue="all">
                  <option value="all">
                    All reasons
                  </option>
                  <option>Price too high</option>
                  <option>Lost to competitor</option>
                  <option>No budget</option>
                  <option>No decision</option>
                  <option>Missing feature</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-light shadow"
                data-wl-reset=""
              >
                <i className="ti ti-filter-off me-1" />
                Reset filters
              </button>
            </div>
          </div>
        </div>
        {/* End Filters */}
        {/* KPI Cards */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-briefcase text-primary" />
                  Total Deals
                </div>
                <div className="fs-20 fw-bold text-dark">163</div>
                <div className="fs-12 text-muted">Closed in the period</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-trophy text-success" />
                  Won Deals
                </div>
                <div className="fs-20 fw-bold text-dark">98</div>
                <div className="fs-12 text-success">$4.52M won</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-thumb-down text-danger" />
                  Lost Deals
                </div>
                <div className="fs-20 fw-bold text-dark">65</div>
                <div className="fs-12 text-danger">$2.14M lost</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-percentage text-success" />
                  Win Rate
                </div>
                <div className="fs-20 fw-bold text-dark">60.1%</div>
                <div className="rep-winloss mt-2">
                  <span className="rep-won" style={{ width: "60.1%" }} />
                  <span className="rep-lost" style={{ width: "39.9%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-coin text-info" />
                  Avg. Deal Value
                </div>
                <div className="fs-20 fw-bold text-dark">$46,122</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-up-right" /> 6.4% vs prior
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-4 col-xx-2">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-clock-hour-4 text-warning" />
                  Avg. Sales Cycle
                </div>
                <div className="fs-20 fw-bold text-dark">46 days</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-down-right" /> 6 days faster
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End KPI Cards */}
        {/* Trend + reasons */}
        <div className="row g-3 mb-3">
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Win/Loss Trend</h6>
                <p className="text-muted fs-12 mb-0">
                  Closed deals by outcome, last 6 months
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={trendChart.options} series={trendChart.series} type="bar" height={280} />
              </div>
            </div>
          </div>
          <div className="col-xl-5 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between gap-2">
                <div>
                  <h6 className="mb-0">Lost Deal Reasons</h6>
                  <p className="text-muted fs-12 mb-0">
                    Why the 65 lost deals were lost
                  </p>
                </div>
                <Link href={route.lostReason} className="link-primary fs-13">
                  Manage
                </Link>
              </div>
              <div className="card-body pb-0">
                <Chart options={reasonChart.options} series={reasonChart.series} type="bar" height={280} />
              </div>
            </div>
          </div>
        </div>
        {/* Competitor + cycle */}
        <div className="row g-3 mb-3">
          <div className="col-xl-6 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Competitor Analysis</h6>
                <p className="text-muted fs-12 mb-0">
                  Head-to-head record where a competitor was named
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={competitorChart.options} series={competitorChart.series} type="bar" height={260} />
              </div>
            </div>
          </div>
          <div className="col-xl-6 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Sales Cycle Comparison</h6>
                <p className="text-muted fs-12 mb-0">
                  Days to close, won vs lost, by deal size
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={cycleChart.options} series={cycleChart.series} type="bar" height={260} />
              </div>
            </div>
          </div>
        </div>
        {/* Breakdown */}
        <div className="card mb-0">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
              <div>
                <h6 className="mb-0">Win Rate Breakdown</h6>
                <p className="text-muted fs-12 mb-0">
                  Drill into any dimension to see the underlying records
                </p>
              </div>
              <Link href={route.dealsGrid} className="link-primary fs-13">
                All deals
              </Link>
            </div>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "rep" ? " active" : ""}`}
                onClick={() => setDim("rep")}
              >
                By Sales Rep
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "industry" ? " active" : ""}`}
                onClick={() => setDim("industry")}
              >
                By Industry
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "source" ? " active" : ""}`}
                onClick={() => setDim("source")}
              >
                By Source
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "size" ? " active" : ""}`}
                onClick={() => setDim("size")}
              >
                By Deal Size
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "product" ? " active" : ""}`}
                onClick={() => setDim("product")}
              >
                By Product
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">{cols.dimensionLabel}</th>
                    <th scope="col">Deals</th>
                    <th scope="col">Won</th>
                    <th scope="col">Lost</th>
                    <th scope="col" style={{ minWidth: 140 }}>Win Rate</th>
                    <th scope="col">{cols.metricLabel}</th>
                    <th scope="col" className="no-sort">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td className="fw-medium text-dark">{row.Dimension}</td>
                      <td>{row.Deals}</td>
                      <td className="text-success">{row.Won}</td>
                      <td className="text-danger">{row.Lost}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`ai-meter ${row.WinRate >= 60 ? "is-success" : row.WinRate >= 45 ? "is-warning" : "is-danger"} flex-grow-1`}>
                            <span className="ai-meter-track">
                              <span className="ai-meter-fill" style={{ width: `${row.WinRate}%` }} />
                            </span>
                          </span>
                          <span className="fs-12 fw-medium text-dark">{row.WinRate}%</span>
                        </div>
                      </td>
                      <td>{row.Metric}</td>
                      <td>
                        <Link href={route.dealsGrid} className="btn btn-sm btn-outline-light shadow">
                          <i className="ti ti-eye me-1" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
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

export default WinLossAnalysisComponent;