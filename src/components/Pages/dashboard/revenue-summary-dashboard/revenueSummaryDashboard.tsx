"use client";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import RevenueBreakdownChart from "./chart/revenueBreakdownChart";
import DealValueChart from "./chart/dealValueChart";
import ForecastedRevenue from "./chart/forecastedRevenue";
import RevenuePerformanceChart from "./chart/revenuePerformanceChart";
import RevenueExpenseChart from "./chart/revenueExpense";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import Link from "next/link";
import { formatMoney, kpisChartMonths, useKalaoKpis } from "@/lib/kpi";

const RevenueSummaryDashboardComponent = () => {
  const { kpis, live } = useKalaoKpis();
  const chartMonths = kpisChartMonths(live ? kpis : null);
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div>
              <h4 className="mb-0">Revenue Summary</h4>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <div className="dropdown">
                <Link
                  href="#"
                  className="dropdown-toggle btn btn-outline-light px-2 shadow"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-package-export me-2" />
                  Export
                </Link>
                <div className="dropdown-menu  dropdown-menu-end">
                  <ul>
                    <li>
                      <Link href="#" className="dropdown-item">
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item">
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <CollapseIcons />
            </div>
          </div>
          {/* End Page Header */}
          {/* start row */}
          <div className="row">
            <div className={live ? "col-12 d-flex" : "col-xxl-7 d-flex"}>
              <div className="row">
                <div className="col-md-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                        <h5 className="mb-0 fs-18 fw-bold d-inline-flex items-center">
                          Overview Statistics
                        </h5>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                        >
                          <i className="ti ti-arrow-right" />
                        </Link>
                      </div>
                      <div className="border rounded">
                        <div className="row g-4">
                          <div className="col-md-4 d-flex pe-md-0">
                            <div className="p-3 card-hover text-center mb-0 flex-fill border-end">
                              <div className="avatar avatar-md bg-primary-gradient-100 fs-16 mb-2">
                                <i className="ti ti-coin fs-22" />
                              </div>
                              <p className="mb-1">
                                {live ? "Encaissé" : "Total Revenue"}
                              </p>
                              <h5 className="mb-3">
                                {live && kpis ? formatMoney(kpis.collected) : "FCFA 2.45M"}
                              </h5>
                              <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                <span
                                  className={`d-inline-flex align-items-center badge rounded-pill badge-soft-success border-0${
                                    live ? " d-none" : ""
                                  }`}
                                >
                                  +2.5%
                                </span>
                                <p className="text-dark mb-0">
                                  {live && kpis
                                    ? `Facturé ${formatMoney(kpis.invoiced)}`
                                    : "vs Last Period"}
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col*/}
                          <div className="col-md-4 d-flex px-md-0">
                            <div className="p-3 card-hover text-center mb-0 flex-fill border-end">
                              <div className="avatar avatar-md bg-secondary fs-16 mb-2">
                                <i className="ti ti-antenna-bars-5 fs-22" />
                              </div>
                              <p className="mb-1">Revenue Growth</p>
                              <h5 className="mb-3">
                                {live && kpis ? `${kpis.collectedGrowth}%` : "18.2%"}
                              </h5>
                              <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                <span
                                  className={`d-inline-flex align-items-center badge rounded-pill badge-soft-success border-0${
                                    live ? " d-none" : ""
                                  }`}
                                >
                                  +3.4%
                                </span>
                                <p className="text-dark mb-0">
                                  {live ? "vs mois précédent" : "QoQ Improved"}
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col*/}
                          <div className="col-md-4 d-flex ps-md-0">
                            <div className="p-3 card-hover text-center mb-0 flex-fill">
                              <div className="avatar avatar-md bg-info fs-16 mb-2">
                                <i className="ti ti-box fs-22" />
                              </div>
                              <p className="mb-1">
                                {live ? "Impayé" : "Annual Recurring"}
                              </p>
                              <h5 className="mb-3">
                                {live && kpis ? formatMoney(kpis.outstanding) : "FCFA 28.4M"}
                              </h5>
                              <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                <span
                                  className={`d-inline-flex align-items-center badge rounded-pill badge-soft-success border-0${
                                    live ? " d-none" : ""
                                  }`}
                                >
                                  +2.5%
                                </span>
                                <p className="text-dark mb-0">
                                  {live && kpis
                                    ? `${kpis.unpaidCount} facture${
                                        kpis.unpaidCount > 1 ? "s" : ""
                                      } en attente`
                                    : "ARR Growth"}
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col*/}
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end card */}
                </div>{" "}
                {/* end col */}
                <div className="col-md-12">
                  <div className="row">
                    <div className={live ? "col-12 d-flex" : "col-md-5 d-flex"}>
                      <div className="card flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                            <h5 className="mb-0">Deal Value</h5>
                            <Link
                              href="#"
                              className="btn btn-sm btn-icon btn-outline-light"
                            >
                              <i className="ti ti-arrow-right" />
                            </Link>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <div className="mb-2">
                                <p className="d-flex align-items-center mb-1">
                                  <i className="ti ti-square-filled fs-8 text-purple-gradient me-1" />
                                  Avg Deal Value
                                </p>
                                <h5 className="main-title mb-0">
                                  {live && kpis
                                    ? formatMoney(kpis.avgDealValue)
                                    : "FCFA 43.2K"}
                                </h5>
                              </div>
                              <div className="mb-0">
                                <p className="d-flex align-items-center mb-1">
                                  <i className="ti ti-square-filled fs-8 text-danger-gradient me-1" />
                                  {live ? "Devis en attente" : "Previous"}
                                </p>
                                <h5 className="main-title mb-0">
                                  {live && kpis
                                    ? formatMoney(kpis.quotesPendingValue)
                                    : "FCFA 39.8K"}
                                </h5>
                              </div>
                            </div>
                            <div id="deal-value-chart">
                              <DealValueChart
                                data={
                                  live && kpis
                                    ? [
                                        Math.round(kpis.avgDealValue / 1000),
                                        Math.round(kpis.quotesPendingValue / 1000),
                                      ]
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span
                              className={`d-inline-flex align-items-center badge rounded-pill badge-soft-success border-0${
                                live ? " d-none" : ""
                              }`}
                            >
                              +2.5%
                            </span>
                            <p className="text-dark mb-0">
                              {live && kpis
                                ? `${kpis.dealsTotal} deals suivis`
                                : "From Last Week"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                    <div className={live ? "d-none" : "col-md-7 d-flex"}>
                      <div className="card flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-lg bg-cyan me-2">
                                <i className="ti ti-file-text fs-24" />
                              </div>
                              <div>
                                <p className="mb-1">Forecasted Revenue</p>
                                <h4 className="mb-0">FCFA 8.45M</h4>
                              </div>
                            </div>
                            <span className="d-inline-flex align-items-center badge badge-soft-success border border-success">
                              +5.1% Growth
                            </span>
                          </div>
                          <div id="forecasted-revenue">
                            <ForecastedRevenue data={chartMonths?.collectedK} />
                          </div>
                          <div className="d-flex align-items-center justify-content-between border p-2 rounded mt-3">
                            <p className="fs-13 fw-medium text-success d-inline-flex align-items-center mb-0">
                              <i className="ti ti-trending-up me-1" />
                              +15.2%
                            </p>
                            <p className="d-inline-flex align-items-center mb-0">
                              Forecast Increase
                              <i className="ti ti-info-circle ms-2" />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                  </div>
                </div>{" "}
                {/* end col */}
              </div>
            </div>{" "}
            {/* end col */}
            <div className={live ? "d-none" : "col-xxl-5 d-flex flex-column"}>
              <div className="row flex-fill">
                <div className="col-md-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <h5 className="mb-0">Revenue Breakdown</h5>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                        >
                          <i className="ti ti-refresh" />
                        </Link>
                      </div>
                      <div id="revenue-breakdown-chart">
                        <RevenueBreakdownChart
                          categories={
                            live ? kpis?.pipeline.map((stage) => stage.label) : undefined
                          }
                          data={
                            live
                              ? kpis?.pipeline.map((stage) =>
                                  Math.round(stage.value / 1_000_000)
                                )
                              : undefined
                          }
                        />
                      </div>
                      <div className="border rounded">
                        <div className="row">
                          <div className="col-sm-6 pe-sm-0">
                            <div className="p-3 border-end border-bottom bg-light">
                              <p className="d-flex align-items-center mb-1">
                                <i className="ti ti-circle-filled fs-8 text-purple-gradient me-1" />
                                Enterprise Suite
                              </p>
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <h5 className="main-title mb-0">40.9%</h5>
                                <p className="fs-13 fw-medium text-success d-inline-flex align-items-center mb-0">
                                  <i className="ti ti-trending-up me-1" />
                                  +18.4%
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col */}
                          <div className="col-sm-6 ps-sm-0">
                            <div className="p-3 border-bottom bg-light">
                              <p className="d-flex align-items-center mb-1">
                                <i className="ti ti-circle-filled fs-8 text-danger-gradient me-1" />
                                Professional Plan
                              </p>
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <h5 className="main-title mb-0">30.4%</h5>
                                <p className="fs-13 fw-medium text-success d-inline-flex align-items-center mb-0">
                                  <i className="ti ti-trending-up me-1" />
                                  +12.7%
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col */}
                          <div className="col-sm-6 pe-sm-0">
                            <div className="p-3 border-end bg-light">
                              <p className="d-flex align-items-center mb-1">
                                <i className="ti ti-circle-filled fs-8 text-warning-gradient me-1" />
                                Starter Package
                              </p>
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <h5 className="main-title mb-0">16.4%</h5>
                                <p className="fs-13 fw-medium text-success d-inline-flex align-items-center mb-0">
                                  <i className="ti ti-trending-up me-1" />
                                  +8.9%
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col */}
                          <div className="col-sm-6 ps-sm-0">
                            <div className="p-3 bg-light">
                              <p className="d-flex align-items-center mb-1">
                                <i className="ti ti-circle-filled fs-8 text-info-gradient me-1" />
                                Add-ons &amp; Services
                              </p>
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <h5 className="main-title mb-0">12.2%</h5>
                                <p className="fs-13 fw-medium text-success d-inline-flex align-items-center mb-0">
                                  <i className="ti ti-trending-up me-1" />
                                  +22.1%
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col */}
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end card */}
                </div>
              </div>
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className={live ? "d-none" : "col-12"}>
              <div className="card">
                <div className="card-header border-0 d-flex align-items-center justify-content-between">
                  <div className="mb-0 fs-18 fw-bold text-dark d-flex align-items-center gap-2">
                    Revenue Performance Trend{" "}
                    <Link
                      href="#"
                      className="btn btn-sm btn-icon btn-outline-light"
                    >
                      <i className="ti ti-refresh" />
                    </Link>
                  </div>
                  <div className="dropdown">
                    <Link
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                      href="#"
                    >
                      2026
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link href="#" className="dropdown-item">
                        2025
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2024
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2023
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span>
                      Comparing actual revenue vs. forecast and prior year
                    </span>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-medium border rounded text-gray-5 d-flex align-items-center px-2 gap-1">
                        <i className="ti ti-circle-filled fs-8 text-info" />{" "}
                        Actual Revenue
                      </span>
                      <span className="fw-medium border rounded text-gray-5 d-flex align-items-center px-2 gap-1">
                        <i className="ti ti-circle-filled fs-8 text-success" />{" "}
                        Forecasted
                      </span>
                      <span className="fw-medium border rounded text-gray-5 d-flex align-items-center px-2 gap-1">
                        <i className="ti ti-circle-filled fs-8 text-danger" />{" "}
                        Prior Year
                      </span>
                    </div>
                  </div>
                  <div id="revenue-performance-chart">
                    <RevenuePerformanceChart
                      categories={chartMonths?.categories}
                      invoiced={chartMonths?.invoicedK}
                      collected={chartMonths?.collectedK}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-2">
                    <p className="mb-0 d-flex">
                      <span className="me-2 rounded-3 bg-danger p-1 pb-0 pe-0" />
                      Avg. Monthly Revenue
                      <span className="fs-16 fw-semibold text-dark ms-2">
                        FCFA 608K
                      </span>
                    </p>
                    <p className="mb-0 d-flex">
                      <span className="me-2 rounded-3 bg-info p-1 pb-0 pe-0" />
                      Forecast Accuracy
                      <span className="fs-16 fw-semibold text-dark ms-2">
                        96.3%
                      </span>
                    </p>
                    <p className="mb-0 d-flex">
                      <span className="me-2 rounded-3 bg-success p-1 pb-0 pe-0" />
                      YoY Growth
                      <span className="fs-16 fw-semibold text-dark ms-2">
                        +24.8%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          <div className="row">
            <div className={live ? "d-none" : "col-xl-6 d-flex"}>
              <div className="card flex-fill">
                <div className="card-header border-0 d-flex align-items-center justify-content-between">
                  <div className="mb-0 fs-18 fw-bold text-dark">
                    Revenue VS Expense
                  </div>
                  <div className="dropdown">
                    <Link
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                      href="#"
                    >
                      2026
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link href="#" className="dropdown-item">
                        2025
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2024
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2023
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div id="revenue_expense">
                    <RevenueExpenseChart
                      categories={live ? ["Facturé", "Reste"] : undefined}
                      data={
                        live && kpis
                          ? [
                              Math.round(kpis.invoiced / 1_000_000),
                              Math.round(kpis.outstanding / 1_000_000),
                            ]
                          : undefined
                      }
                    />
                  </div>
                  <span>Detailed revenue analysis by product segment</span>
                </div>
              </div>
            </div>
            <div className={live ? "d-none" : "col-xl-6 d-flex"}>
              <div className="card flex-fill">
                <div className="card-header border-0 d-flex align-items-center justify-content-between">
                  <div className="mb-0 fs-18 fw-bold text-dark">Comparison</div>
                  <div className="dropdown">
                    <Link
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                      href="#"
                    >
                      2026
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link href="#" className="dropdown-item">
                        2025
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2024
                      </Link>
                      <Link href="#" className="dropdown-item">
                        2023
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {/* Row 1 */}
                  <div className="p-4 d-flex justify-content-between align-items-center deals-closed bg-purple-subtle">
                    <div className="row w-100 g-1">
                      <div className="col-6">
                        <p className="mb-1 fs-14 text-dark">Deals Closed</p>
                        <h2 className="fw-bold mb-0 fs-20">156</h2>
                      </div>
                      <div className="col-4">
                        <p className="mb-1 fs-14 text-dark">Previous</p>
                        <div className="fw-bold mb-0 fs-20 text-dark">152</div>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                        <span className="badge rounded-pill bg-white text-dark py-2 fs-12">
                          +3.3%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="p-4 d-flex justify-content-between align-items-center win-rate bg-info-subtle">
                    <div className="row w-100 g-1">
                      <div className="col-6">
                        <p className="mb-1 fs-14 text-dark">Win Rate</p>
                        <h2 className="fw-bold mb-0 fs-20">28.4%</h2>
                      </div>
                      <div className="col-4">
                        <p className="mb-1 fs-14 text-dark">Previous</p>
                        <div className="fw-bold mb-0 fs-20 text-dark">
                          26.9%
                        </div>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                        <span className="badge rounded-pill bg-white text-dark py-2 fs-12">
                          +5.6%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="p-4 d-flex justify-content-between align-items-center sales-cycle bg-warning-subtle">
                    <div className="row w-100 g-1">
                      <div className="col-6">
                        <p className="mb-1 fs-14 text-dark">
                          Sales Cycle (days)
                        </p>
                        <h2 className="fw-bold mb-0 fs-20">47</h2>
                      </div>
                      <div className="col-4">
                        <p className="mb-1 fs-14 text-dark">Previous</p>
                        <div className="fw-bold mb-0 fs-20 text-dark">42</div>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                        <span className="badge rounded-pill bg-white text-dark py-2 fs-12">
                          +10.6%
                        </span>
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
        <CommonFooter />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default RevenueSummaryDashboardComponent;
