"use client";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import StorageRequestChart from "./chart/storageRequestChart";
import MtdRevenueChart from "./chart/mtdRevenueChart";
import YtdRevenueChart from "./chart/ytdRevenueChart";
import DealSizeChart from "./chart/dealSizeChart";
import DealChart from "./chart/dealChart";
import Link from "next/link";
import { formatMoney, kpisChartMonths, useKalaoKpis } from "@/lib/kpi";

const SalesDashboardComponent = () => {
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
              <h4 className="mb-0">Sales Dashboard</h4>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <PredefinedDatePicker />
              <CollapseIcons />
            </div>
          </div>
          {/* End Page Header */}
          {/* start row */}
          <div className="row">
            <div className="col-xxl-8 col-xl-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
                    <div>
                      <h5 className="sub-title mb-1">Total Revenue</h5>
                      <p className="mb-0">26 Jan 2026 - 26 Jan 2027</p>
                    </div>
                    <div className="avatar-group avatar-group-sm">
                      <Link
                        href="#"
                        className="avatar avatar-rounded border bg-white p-1 d-inline-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="w-auto h-auto img-fluid"
                          src="assets/img/company/company-09.svg"
                          alt="img"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="avatar avatar-rounded border bg-white p-1 d-inline-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="w-auto h-auto img-fluid"
                          src="assets/img/company/company-10.svg"
                          alt="img"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="avatar avatar-rounded border bg-white p-1 d-inline-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="w-auto h-auto img-fluid"
                          src="assets/img/company/company-01.svg"
                          alt="img"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="avatar avatar-rounded border bg-white p-1 d-inline-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="w-auto h-auto img-fluid"
                          src="assets/img/company/company-02.svg"
                          alt="img"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="avatar avatar-rounded border bg-white p-1 d-inline-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="w-auto h-auto img-fluid"
                          src="assets/img/company/company-11.svg"
                          alt="img"
                        />
                      </Link>
                    </div>
                  </div>
                  <ul
                    className="nav nav-tabs nav-border nav-solid-primary gap-2 justify-content-end mb-4"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        href="#weekly"
                        data-bs-toggle="tab"
                      >
                        Weekly
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        href="#monthly"
                        data-bs-toggle="tab"
                      >
                        Monthly
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        href="#yearly"
                        data-bs-toggle="tab"
                      >
                        Yearly
                      </Link>
                    </li>
                  </ul>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="bg-secondary rounded-4 rounded-end-5 d-flex">
                        <div className="ps-3 d-flex align-items-center justify-content-center position-relative pe-2 z-1">
                          <p className="fs-16 fw-medium text-white mb-0 z-2">
                            MTD
                          </p>
                          <span className="arrow-icon d-block position-absolute" />
                        </div>
                        <div className="bg-light rounded-4 w-100 p-3">
                          <p className="text-dark mb-2">Total MTD Revenue</p>
                          <h3 className="mb-4">
                            {live && kpis
                              ? formatMoney(kpis.collectedMtd)
                              : "FCFA 18,50,800.00"}
                          </h3>
                          <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                              <span
                                className={`badge badge-pill rounded-pill border badge-soft-success border-0${
                                  live ? " d-none" : ""
                                }`}
                              >
                                +2.5%
                              </span>
                              <p className="mb-0">Month Till Date</p>
                            </div>
                            <div id="mtd-revenue">
                              <MtdRevenueChart data={chartMonths?.collectedK} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-danger rounded-4 rounded-end-5 d-flex">
                        <div className="ps-3 d-flex align-items-center justify-content-center position-relative pe-2 z-1">
                          <p className="fs-16 fw-medium text-white mb-0">YTD</p>
                          <span className="arrow-icon arrow-primary d-block position-absolute" />
                        </div>
                        <div className="bg-light rounded-4 w-100 p-3">
                          <p className="text-dark mb-2">Total YTD Revenue</p>
                          <h3 className="mb-4">
                            {live && kpis
                              ? formatMoney(kpis.collectedYtd)
                              : "FCFA 85,25,800.00"}
                          </h3>
                          <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                              <span
                                className={`badge badge-pill rounded-pill border badge-soft-danger border-0${
                                  live ? " d-none" : ""
                                }`}
                              >
                                -5.0%
                              </span>
                              <p className="mb-0">Year Till Date</p>
                            </div>
                            <div id="ytd-revenue">
                              <YtdRevenueChart data={chartMonths?.invoicedK} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-4 col-xl-12 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
                    <div>
                      <h3 className="sub-title mb-1">Conversion Rate</h3>
                      <p className="mb-0">26 Jan 2026 - 26 Jan 2027</p>
                    </div>
                  </div>
                  <div>
                    <StorageRequestChart
                      percentage={live && kpis ? kpis.conversionRate : undefined}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-wrap">
                    <h3 className="sub-title mb-0">
                      {live && kpis ? `${kpis.conversionRate}%` : "55.6%"}
                    </h3>
                    <span
                      className={`badge badge-pill rounded-pill border badge-soft-success border-0${
                        live ? " d-none" : ""
                      }`}
                    >
                      +2.5%
                    </span>
                    <p className="mb-0">
                      {live && kpis
                        ? `${kpis.dealsWon} deals gagnés`
                        : "Last Week"}
                    </p>
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
                    <div>
                      <h2 className="sub-title mb-1">Deals Won Vs Lost</h2>
                      <p className="mb-0">+15% vs last month</p>
                    </div>
                    <Link
                      href="#"
                      className="btn btn-sm btn-icon btn-outline-light"
                    >
                      <i className="ti ti-refresh" />
                    </Link>
                  </div>
                  <div className="d-flex alig-items-center flex-wrap flex-xl-nowrap flex-xl-row gap-2">
                    <div className="w-100">
                      <div className="border rounded p-3 d-flex align-items-center mb-3">
                        <div className="avatar avatar-lg bg-secondary-subtle border border-secondary text-dark rounded me-3 flex-shrink-0">
                          <i className="ti ti-tag fs-20" />
                        </div>
                        <div>
                          <p className="text-dark fw-medium mb-1">Deals Won</p>
                          <div className="d-flex align-items-center gap-1 flex-wrap">
                            <h3 className="custom-title mb-0 me-1">
                              {live && kpis ? kpis.dealsWon : 68}
                            </h3>
                            <p className={`fs-12 mb-0${live ? " d-none" : ""}`}>
                              <span className="text-success">+2.5%</span> Last
                              Week
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded p-3 d-flex align-items-center">
                        <div className="avatar avatar-lg bg-primary-subtle border border-primary text-dark rounded me-3 flex-shrink-0">
                          <i className="ti ti-tag-off fs-20" />
                        </div>
                        <div>
                          <p className="text-dark fw-medium mb-1">Deals Lost</p>
                          <div className="d-flex align-items-center gap-1 flex-wrap">
                            <h3 className="custom-title text-danger mb-0 me-1">
                              {live && kpis ? kpis.dealsLost : 16}
                            </h3>
                            <p className={`fs-12 mb-0${live ? " d-none" : ""}`}>
                              <span className="text-danger">-5.8%</span> Last
                              Week
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div id="deals-won" />
                    </div>
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="mb-3">
                    <h2 className="sub-title mb-0">Sales Pipeline Overview</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-wrap mb-3">
                    <h3 className="custom-title mb-0">FCFA 2,56,054.50</h3>
                    <p className="fs-12 mb-0">
                      <span className="text-success">+2.5%</span> Last Week
                    </p>
                  </div>
                  <div
                    className="progress progress-bg progress-2xl mb-2"
                    role="progressbar"
                    aria-valuenow={10}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar bg-purple-subtle text-dark fw-medium text-start ps-4"
                      style={{ width: "60%" }}
                    >
                      Probability - FCFA 50,000
                    </div>
                  </div>
                  <div
                    className="progress progress-bg progress-2xl mb-2"
                    role="progressbar"
                    aria-valuenow={10}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar bg-success-subtle text-dark fw-medium text-start ps-4"
                      style={{ width: "75%" }}
                    >
                      Proposal Sent - FCFA 56,054
                    </div>
                  </div>
                  <div
                    className="progress progress-bg progress-2xl mb-2"
                    role="progressbar"
                    aria-valuenow={10}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar bg-warning-subtle text-dark fw-medium text-start ps-4"
                      style={{ width: "40%" }}
                    >
                      Opportunity - FCFA 1,00,000
                    </div>
                  </div>
                  <div
                    className="progress progress-bg progress-2xl mb-0"
                    role="progressbar"
                    aria-valuenow={10}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar bg-danger-subtle text-dark fw-medium text-start ps-4"
                      style={{ width: "60%" }}
                    >
                      Total Deals - FCFA 1,00,000
                    </div>
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="sub-title mb-0">Recently Created Deals</h2>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        Weekly
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link href="#" className="dropdown-item">
                          Yearly
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Weekly
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Monthly
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive custom-table">
                  <table
                    className="table border-start-0 dataTable table-nowrap"
                    id="recent-deals"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>Deals</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    {live && kpis ? (
                      <tbody>
                        {kpis.recentDeals.map((deal, index) => (
                          <tr className={index % 2 ? "even" : "odd"} key={deal.key}>
                            <td>
                              <p className="text-dark fw-medium mb-1">
                                {deal.title}
                              </p>
                              <p className="mb-0">{deal.company}</p>
                            </td>
                            <td>
                              <p className="text-dark mb-0">{deal.amount}</p>
                            </td>
                            <td>
                              <span
                                className={`badge badge-pill ${
                                  deal.stage === "Gagné"
                                    ? "bg-soft-success text-success"
                                    : deal.stage === "Perdu"
                                    ? "bg-soft-danger text-danger"
                                    : "bg-soft-info text-info"
                                }`}
                              >
                                {deal.stage}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : null}
                    <tbody className={live ? "d-none" : ""}>
                      <tr className="odd">
                        <td>
                          <p className="text-dark fw-medium mb-1">
                            <a href="deals_details.html">
                              SkyHigh Annual Booking
                            </a>
                          </p>
                          <p className="mb-0">Appointment</p>
                        </td>
                        <td>
                          <p className="text-dark mb-0">FCFA 78,11,800</p>
                        </td>
                        <td>
                          <span className="badge badge-pill bg-soft-success text-success">
                            Won
                          </span>
                        </td>
                      </tr>

                      <tr className="even">
                        <td>
                          <p className="text-dark fw-medium mb-1">
                            <a href="deals_details.html">
                              CRM Onboarding Package
                            </a>
                          </p>
                          <p className="mb-0">Appointment</p>
                        </td>
                        <td>
                          <p className="text-dark mb-0">FCFA 72,11,289</p>
                        </td>
                        <td>
                          <span className="badge badge-pill bg-soft-danger text-danger">
                            Lost
                          </span>
                        </td>
                      </tr>

                      <tr className="odd">
                        <td>
                          <p className="text-dark fw-medium mb-1">
                            <a href="deals_details.html">
                              Enterprise Plan Upgrade
                            </a>
                          </p>
                          <p className="mb-0">Appointment</p>
                        </td>
                        <td>
                          <p className="text-dark mb-0">FCFA 16,11,457</p>
                        </td>
                        <td>
                          <span className="badge badge-pill bg-soft-success text-success">
                            Won
                          </span>
                        </td>
                      </tr>

                      <tr className="even">
                        <td>
                          <p className="text-dark fw-medium mb-1">
                            <a href="deals_details.html">
                              CRM Migration Project
                            </a>
                          </p>
                          <p className="mb-0">Appointment</p>
                        </td>
                        <td>
                          <p className="text-dark mb-0">FCFA 85,11,789</p>
                        </td>
                        <td>
                          <span className="badge badge-pill bg-soft-success text-success">
                            Won
                          </span>
                        </td>
                      </tr>

                      <tr className="odd">
                        <td>
                          <p className="text-dark fw-medium mb-1">
                            <a href="deals_details.html">Project Management</a>
                          </p>
                          <p className="mb-0">Appointment</p>
                        </td>
                        <td>
                          <p className="text-dark mb-0">FCFA 65,12,589</p>
                        </td>
                        <td>
                          <span className="badge badge-pill bg-soft-success text-success">
                            Won
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="mb-3">
                    <h2 className="sub-title mb-0">Avg Deal Size</h2>
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-wrap mb-3">
                    <h3 className="custom-title mb-0">FCFA 1,56,054.50</h3>
                    <p className="fs-12 mb-0">
                      <span className="text-success">+2.5%</span> Last Week
                    </p>
                  </div>
                  <div id="deal-size">
                    <DealSizeChart
                      categories={live ? kpis?.pipeline.map((stage) => stage.label) : undefined}
                      data={
                        live
                          ? kpis?.pipeline.map((stage) => Math.round(stage.value / 1000))
                          : undefined
                      }
                    />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="sub-title mb-0">Sales Growth</h2>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        Last Year
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link href="#" className="dropdown-item">
                          Last 30 Days
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 6 months
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last Year
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div id="deal-chart">
                    <DealChart
                      categories={chartMonths?.categories}
                      data={chartMonths?.collectedK}
                    />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
          <p className="mb-md-0 mb-1">
            Copyright ©
            <Link href="#" className="link-primary text-decoration-underline">
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
  );
};

export default SalesDashboardComponent;
