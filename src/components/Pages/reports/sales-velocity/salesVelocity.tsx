"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import {
  VelocityPeriods,
  SalesVelocityKpis,
  VelocityTrendChart,
  VelocityByTeamChart,
  VelocityByRepChart,
  VelocityInputsChart,
  VelocityDealValueChart,
  VelocityComparisonData,
  VelocityDimensionTables,
  VelocityDimensionLabels,
  type VelocityDimensionKey,
} from "../../../../core/json/salesVelocityData";

const route = all_routes;

const lineChart = (data: { categories: string[]; series: { name: string; data: number[] }[] }, type: "area" | "line" | "bar" = "line"): { options: ApexOptions; series: ApexOptions["series"] } => ({
  options: {
    chart: { type, toolbar: { show: false } },
    xaxis: { categories: data.categories },
    stroke: { curve: "smooth", width: 2 },
    legend: { show: data.series.length > 1, position: "top" },
    dataLabels: { enabled: false },
  },
  series: data.series,
});

const SalesVelocityComponent = () => {
  const [dim, setDim] = useState<VelocityDimensionKey>("stage");
  const p = VelocityPeriods.current;

  const trendChart = lineChart(VelocityTrendChart, "area");
  const teamChart = lineChart(VelocityByTeamChart, "bar");
  const repChart = lineChart(VelocityByRepChart, "bar");
  const inputsChart = lineChart(VelocityInputsChart, "line");
  const valueChart = lineChart(VelocityDealValueChart, "area");

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
          <h4 className="mb-1">Sales Velocity</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link href={route.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">Reports</li>
              <li className="breadcrumb-item active" aria-current="page">
                Sales Velocity
              </li>
            </ol>
          </nav>
        </div>
        <div className="gap-2 d-flex align-items-center flex-wrap">
          <Link href={route.pipeline} className="btn btn-outline-light shadow">
            <i className="ti ti-chart-funnel me-1" />
            View Pipeline
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
          <Link href={route.winLossAnalysis} className="nav-link text-nowrap">
            <i className="ti ti-trophy me-1" />
            Win/Loss
          </Link>
        </li>
        <li className="nav-item">
          <Link href={route.salesVelocity} className="nav-link text-nowrap active">
            <i className="ti ti-rocket me-1" />
            Velocity
          </Link>
        </li>
      </ul>
      {/* End Reports Nav */}
      <div data-velocity="">
        <div className="alert d-none" role="status" data-report-toast="" />
        {/* Formula */}
        <div className="card mb-3">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div>
              <h6 className="mb-0">How sales velocity is calculated</h6>
              <p className="text-muted fs-12 mb-0">
                Opportunities × average deal value × win rate ÷ sales cycle
                length
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select form-select-sm w-auto"
                aria-label="Team"
                data-vel-filter=""
               defaultValue="all">
                <option value="all">
                  All teams
                </option>
                <option>Enterprise</option>
                <option>Mid-Market</option>
                <option>SMB</option>
              </select>
              <select
                className="form-select form-select-sm w-auto"
                aria-label="Period"
                data-vel-filter=""
               defaultValue="all">
                <option value="all">
                  This Quarter
                </option>
                <option>Last Quarter</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="rep-formula d-flex align-items-center flex-wrap gap-3">
              <div className="text-center">
                <div className="fs-20 fw-bold text-dark">{p.opps}</div>
                <div className="fs-12 text-muted">Opportunities</div>
              </div>
              <span className="fs-20 text-muted">×</span>
              <div className="text-center">
                <div className="fs-20 fw-bold text-dark">${p.value.toLocaleString()}</div>
                <div className="fs-12 text-muted">Avg. deal value</div>
              </div>
              <span className="fs-20 text-muted">×</span>
              <div className="text-center">
                <div className="fs-20 fw-bold text-dark">{Math.round(p.win * 100)}%</div>
                <div className="fs-12 text-muted">Win rate</div>
              </div>
              <span className="fs-20 text-muted">÷</span>
              <div className="text-center">
                <div className="fs-20 fw-bold text-dark">{p.cycle} days</div>
                <div className="fs-12 text-muted">Sales cycle</div>
              </div>
              <span className="fs-20 text-muted">=</span>
              <div className="text-center">
                <div className="fs-20 fw-bold text-primary">
                  ${Math.round((p.opps * p.value * p.win) / p.cycle).toLocaleString()}
                </div>
                <div className="fs-12 text-muted">Velocity / day</div>
              </div>
            </div>
          </div>
        </div>
        {/* End Formula */}
        {/* KPI Cards */}
        <div className="row g-3 justify-content-center mb-3">
          <div className="col-sm-6 col-xl">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-rocket text-primary" />
                  {SalesVelocityKpis.velocity.label}
                </div>
                <div className="fs-20 fw-bold text-dark">{SalesVelocityKpis.velocity.value}</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-up-right" /> {SalesVelocityKpis.velocity.deltaLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-briefcase text-info" />
                  {SalesVelocityKpis.openOpportunities.label}
                </div>
                <div className="fs-20 fw-bold text-dark">{SalesVelocityKpis.openOpportunities.value}</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-up-right" /> {SalesVelocityKpis.openOpportunities.deltaLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-coin text-success" />
                  {SalesVelocityKpis.avgDealValue.label}
                </div>
                <div className="fs-20 fw-bold text-dark">{SalesVelocityKpis.avgDealValue.value}</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-up-right" /> {SalesVelocityKpis.avgDealValue.deltaLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-percentage text-warning" />
                  {SalesVelocityKpis.winRate.label}
                </div>
                <div className="fs-20 fw-bold text-dark">{SalesVelocityKpis.winRate.value}</div>
                <span className="ai-meter is-success mt-1">
                  <span className="ai-meter-track">
                    <span className="ai-meter-fill" style={{ width: `${SalesVelocityKpis.winRate.meter}%` }} />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl">
            <div className="card mb-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-1 fs-12 text-muted mb-1">
                  <i className="ti ti-clock-hour-4 text-danger" />
                  {SalesVelocityKpis.avgSalesCycle.label}
                </div>
                <div className="fs-20 fw-bold text-dark">{SalesVelocityKpis.avgSalesCycle.value}</div>
                <div className="fs-12 text-success">
                  <i className="ti ti-arrow-down-right" /> {SalesVelocityKpis.avgSalesCycle.deltaLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End KPI Cards */}
        {/* Trend */}
        <div className="row g-3 mb-3">
          <div className="col-xxl-8">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Sales Velocity Trend</h6>
                <p className="text-muted fs-12 mb-0">
                  Revenue generated per day, against target
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={trendChart.options} series={trendChart.series} type="area" height={280} />
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="card mb-0">
              <div className="card-header">
                <h6 className="mb-0">Velocity by Team</h6>
                <p className="text-muted fs-12 mb-0">
                  Revenue per day by segment
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={teamChart.options} series={teamChart.series} type="bar" height={280} />
              </div>
            </div>
          </div>
        </div>
        {/* Comparison */}
        <div className="row g-3 mb-3">
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Period Comparison</h6>
                <p className="text-muted fs-12 mb-0">
                  Current period against the previous period and target
                </p>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Metric</th>
                        <th scope="col">This Quarter</th>
                        <th scope="col">Last Quarter</th>
                        <th scope="col">Change</th>
                        <th scope="col">Target</th>
                        <th scope="col">vs Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {VelocityComparisonData.map((row) => (
                        <tr key={row.key}>
                          <td className="fw-medium text-dark">{row.Metric}</td>
                          <td>{row.ThisQuarter}</td>
                          <td>{row.LastQuarter}</td>
                          <td>
                            <span className={`badge bg-soft-${row.ChangeVsLastQuarter >= 0 ? "success" : "danger"} text-${row.ChangeVsLastQuarter >= 0 ? "success" : "danger"}`}>
                              {row.ChangeVsLastQuarter >= 0 ? "+" : ""}{row.ChangeVsLastQuarter}%
                            </span>
                          </td>
                          <td>{row.Target}</td>
                          <td>
                            <span className={`badge bg-soft-${row.ChangeVsTarget >= 0 ? "success" : "danger"} text-${row.ChangeVsTarget >= 0 ? "success" : "danger"}`}>
                              {row.ChangeVsTarget >= 0 ? "+" : ""}{row.ChangeVsTarget}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-5 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Velocity by Sales Representative</h6>
                <p className="text-muted fs-12 mb-0">
                  Revenue per day, current quarter
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={repChart.options} series={repChart.series} type="bar" height={260} />
              </div>
            </div>
          </div>
        </div>
        {/* Inputs */}
        <div className="row g-3 mb-3">
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Velocity Inputs Over Time</h6>
                <p className="text-muted fs-12 mb-0">
                  Opportunity volume, win rate and cycle length together
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={inputsChart.options} series={inputsChart.series} type="line" height={260} />
              </div>
            </div>
          </div>
          <div className="col-xl-5 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <h6 className="mb-0">Deal Value Trend</h6>
                <p className="text-muted fs-12 mb-0">
                  Average closed-won value per month
                </p>
              </div>
              <div className="card-body pb-0">
                <Chart options={valueChart.options} series={valueChart.series} type="area" height={260} />
              </div>
            </div>
          </div>
        </div>
        {/* Breakdown */}
        <div className="card mb-0">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
              <div>
                <h6 className="mb-0">
                  Velocity by <span>{VelocityDimensionLabels[dim]}</span>
                </h6>
                <p className="text-muted fs-12 mb-0">
                  Each dimension recalculated with its own inputs
                </p>
              </div>
              <Link href={route.dealsGrid} className="link-primary fs-13">
                All deals
              </Link>
            </div>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm btn-outline-light shadow${dim === "stage" ? " active" : ""}`}
                onClick={() => setDim("stage")}
              >
                By Pipeline Stage
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
                    <th scope="col">Dimension</th>
                    <th scope="col">Opportunities</th>
                    <th scope="col">Avg. deal value</th>
                    <th scope="col">Win rate</th>
                    <th scope="col">Sales cycle</th>
                    <th scope="col">Velocity / day</th>
                    <th scope="col" className="no-sort">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VelocityDimensionTables[dim].map((row) => (
                    <tr key={row.key}>
                      <td className="fw-medium text-dark">{row.Dimension}</td>
                      <td>{row.Opportunities}</td>
                      <td>{row.AvgDealValue}</td>
                      <td>{row.WinRate}</td>
                      <td>{row.SalesCycle}</td>
                      <td>{row.VelocityPerDay}</td>
                      <td>
                        <Link href={route.dealsGrid} className="btn btn-sm btn-outline-light shadow">
                          View Deals
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

export default SalesVelocityComponent;