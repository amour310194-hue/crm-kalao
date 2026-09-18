"use client";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import {
  CustomerRevenueChart,
  ProfitRevenueChart,
  SalesRevenueChart,
  TargetRevenueChart,
} from "./chart/revenueMiniCharts";
import SalespersonChart from "./chart/salespersonChart";
import TopDealsChart from "./chart/topDeals";
import ForecastChart from "./chart/forecastChart";
import Link from "next/link";

const ExecutiveDashboardComponent = () => {
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
              <h4 className="mb-0">Executive Dashboard</h4>
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
              <Link
                href="#"
                className="btn btn-icon btn-outline-light shadow"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Refresh"
                data-bs-original-title="Refresh"
              >
                <i className="ti ti-refresh" />
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
          {/* start row */}
          <div className="row">
            <div className="col-xxl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6 d-flex">
                      <div className="card mb-0 flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="avatar bg-success-subtle text-success border border-success fs-24">
                              <i className="ti ti-trending-up-3" />
                            </div>
                            <p className="mb-0 fs-13 fw-medium text-dark">
                              Sales Revenue
                            </p>
                          </div>
                          <div className="border rounded p-3 d-flex align-items-sm-center gap-2 justify-content-between flex-sm-row flex-column">
                            <div>
                              <h2 className="mb-2 text-success">$400k</h2>
                              <p className="fs-13 fw-medium mb-0">
                                <span className="text-success">+12%</span> vs
                                Last Year
                              </p>
                            </div>
                            <i className="ti ti-arrow-big-up-filled text-success"></i>
                            <div className="border-bottom px-1 pb-2 border-bottom-dashed border-top-0 border-start-0 border-end-0">
                              <div id="sales-revenue">
                                <SalesRevenueChart />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col*/}
                    <div className="col-md-6 d-flex">
                      <div className="card mb-0 flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="avatar bg-purple-subtle text-purple border border-purple fs-24">
                              <i className="ti ti-user-dollar" />
                            </div>
                            <p className="mb-0 fs-13 fw-medium text-dark">
                              New Customers
                            </p>
                          </div>
                          <div className="border rounded p-3 d-flex align-items-sm-center gap-2 justify-content-between flex-sm-row flex-column">
                            <div>
                              <h2 className="mb-2 text-purple">450</h2>
                              <p className="fs-13 fw-medium mb-0">
                                <span className="text-purple">+8.2%</span> vs
                                Last Year
                              </p>
                            </div>
                            <i className="ti ti-arrow-big-up-filled text-purple" />
                            <div className="border-bottom px-1 pb-2 border-bottom-dashed border-top-0 border-start-0 border-end-0">
                              <div id="customer-revenue">
                                <CustomerRevenueChart />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col*/}
                    <div className="col-md-6 d-flex">
                      <div className="card mb-0 flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="avatar bg-secondary-subtle text-secondary border border-secondary fs-24">
                              <i className="ti ti-target-arrow" />
                            </div>
                            <p className="mb-0 fs-13 fw-medium text-dark">
                              Target Achievement
                            </p>
                          </div>
                          <div className="border rounded p-3 d-flex align-items-sm-center gap-2 justify-content-between flex-sm-row flex-column">
                            <div>
                              <h2 className="mb-2 text-secondary">68%</h2>
                              <p className="fs-13 fw-medium mb-0">
                                <span className="text-secondary">-1.2%</span> vs
                                Last Year
                              </p>
                            </div>
                            <i className="ti ti-arrow-big-down-filled text-secondary" />
                            <div className="border-bottom px-1 pb-2 border-bottom-dashed border-top-0 border-start-0 border-end-0">
                              <div id="target-revenue">
                                <TargetRevenueChart />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col*/}
                    <div className="col-md-6 d-flex">
                      <div className="card mb-0 flex-fill">
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="avatar bg-info-subtle text-info border border-info fs-18">
                              <ImageWithBasePath
                                src="assets/img/icons/profit.svg"
                                alt="icon"
                                className="img-fluid p-2"
                              />
                            </div>
                            <p className="mb-0 fs-13 fw-medium text-dark">
                              Profit
                            </p>
                          </div>
                          <div className="border rounded p-3 d-flex align-items-sm-center gap-2 justify-content-between flex-sm-row flex-column">
                            <div>
                              <h2 className="mb-2 text-info">40%</h2>
                              <p className="fs-13 fw-medium mb-0">
                                <span className="text-info">+1.2%</span> vs Last
                                Year
                              </p>
                            </div>
                            <i className="ti ti-arrow-big-up-filled text-info" />
                            <div className="border-bottom px-1 pb-2 border-bottom-dashed border-top-0 border-start-0 border-end-0">
                              <div id="profit-revenue">
                                <ProfitRevenueChart />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col*/}
                  </div>
                </div>
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-4 d-flex flex-column">
              <div className="row flex-fill">
                <div className="col-md-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h2 className="card-subtitle mb-3">Activity Count</h2>
                      <div className="d-flex align-items-center justify-content-between gap-3 border-bottom pb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="circular-progress"
                            data-progress={70}
                            data-color="#27AE60"
                            style={
                              {
                                "--pg": "70%",
                                "--clr": "#27AE60",
                              } as React.CSSProperties
                            }
                          >
                            <span className="avatar avatar-rounded avatar-xss text-success">
                              <i className="ti ti-phone-call fs-18" />
                            </span>
                          </div>
                          <p className="fs-13 fw-medium text-dark mb-0">
                            Calls
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fs-16 fw-semibold text-dark mb-1">
                            342
                          </p>
                          <p className="fs-12 text-success mb-0">+12%</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3 border-bottom py-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="circular-progress"
                            data-progress={85}
                            data-color="#800080"
                            style={
                              {
                                "--pg": "85%",
                                "--clr": "#800080",
                              } as React.CSSProperties
                            }
                          >
                            <span className="avatar avatar-rounded avatar-xss text-purple">
                              <i className="ti ti-mail fs-18" />
                            </span>
                          </div>
                          <p className="fs-13 fw-medium text-dark mb-0">
                            Emails
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fs-16 fw-semibold text-dark mb-1">
                            567
                          </p>
                          <p className="fs-12 text-purple mb-0">+22%</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3 py-2 pb-0">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="circular-progress"
                            data-progress={50}
                            data-color="#2F80ED"
                            style={
                              {
                                "--pg": "50%",
                                "--clr": "#2F80ED",
                              } as React.CSSProperties
                            }
                          >
                            <span className="avatar avatar-rounded avatar-xss text-info">
                              <i className="ti ti-users fs-18" />
                            </span>
                          </div>
                          <p className="fs-13 fw-medium text-dark mb-0">
                            Meetings
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fs-16 fw-semibold text-dark mb-1">42</p>
                          <p className="fs-12 text-info mb-0">+15%</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end card */}
                </div>
                <div className="col-md-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h2 className="card-subtitle mb-3">Conversion Split</h2>
                      <div className="row align-items-center justify-content-between g-4">
                        <div className="col-sm-6">
                          <div id="conversion-chart" />
                        </div>
                        <div className="col-sm-6">
                          <div className="bg-light p-2 rounded mb-2">
                            <p className="mb-0 text-dark fs-12 fw-medium">
                              <i className="ti ti-circle-filled text-success-gradient me-2" />
                              Converted
                            </p>
                          </div>
                          <div className="bg-light p-2 rounded">
                            <p className="mb-0 text-dark fs-12 fw-medium">
                              <i className="ti ti-circle-filled text-purple-gradient me-2" />
                              On Progress
                            </p>
                          </div>
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
            <div className="col-xl-6 d-flex ">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="card-subtitle mb-0">
                      Top Revenue per Salesperson
                    </h2>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        Last 6 Months
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link href="#" className="dropdown-item">
                          Last Month
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 6 Months
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 3 Months
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div id="salesperson-chart">
                    <SalespersonChart />
                  </div>
                </div>
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xl-6 d-flex ">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="card-subtitle mb-0">
                      Top Deals Closed per User
                    </h2>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        2025
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
                  <div id="top-deals">
                    <TopDealsChart />
                  </div>
                </div>
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-xl-4 d-flex ">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="mb-3">
                    <h2 className="card-subtitle mb-4">Pipeline</h2>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <p className="fs-12 mb-0 mw-74">Prospecting</p>
                    <div className="d-flex align-items-center w-100 gap-2">
                      <div
                        className="progress w-100 progress-animate bg-white progress-xxl"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-purple-gradient-100 rounded-pill"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <p className="fs-12 fw-medium text-dark mb-0 flex-shrink-0">
                        15 Deals
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <p className="fs-12 mb-0 mw-74">Qualification</p>
                    <div className="d-flex align-items-center w-100 gap-2">
                      <div
                        className="progress w-100 progress-animate bg-white progress-xxl"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-purple-gradient-100 rounded-pill"
                          style={{ width: "80%" }}
                        />
                      </div>
                      <p className="fs-12 fw-medium text-dark mb-0 flex-shrink-0">
                        10 Deals
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <p className="fs-12 mb-0 mw-74">Proporsal</p>
                    <div className="d-flex align-items-center w-100 gap-2">
                      <div
                        className="progress w-100 progress-animate bg-white progress-xxl"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-purple-gradient-100 rounded-pill"
                          style={{ width: "60%" }}
                        />
                      </div>
                      <p className="fs-12 fw-medium text-dark mb-0 flex-shrink-0">
                        8 Deals
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <p className="fs-12 mb-0 mw-74">Negotiation</p>
                    <div className="d-flex align-items-center w-100 gap-2">
                      <div
                        className="progress w-100 progress-animate bg-white progress-xxl"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-purple-gradient-100 rounded-pill"
                          style={{ width: "40%" }}
                        />
                      </div>
                      <p className="fs-12 fw-medium text-dark mb-0 flex-shrink-0">
                        5 Deals
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <p className="fs-12 mb-0 mw-74">Closing</p>
                    <div className="d-flex align-items-center w-100 gap-2">
                      <div
                        className="progress w-100 progress-animate bg-white progress-xxl"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-purple-gradient-100 rounded-pill"
                          style={{ width: "30%" }}
                        />
                      </div>
                      <p className="fs-12 fw-medium text-dark mb-0 flex-shrink-0">
                        2 Deals
                      </p>
                    </div>
                  </div>
                  <p className="fs-12 d-flex align-items-center gap-2 mb-0">
                    <span className="fs-12 fw-semibold text-purple">30%</span>
                    The performance is 30% better compare to last week
                  </p>
                </div>
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xl-8 d-flex ">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="card-subtitle mb-0">Forecast Overview</h2>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        2025
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
                  <div id="forecast-chart">
                    <ForecastChart />
                  </div>
                </div>
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
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
                    <h2 className="card-subtitle mb-0">
                      Executive Performance Overview
                    </h2>
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
                  <div className="table-responsive custom-table">
                    <table
                      className="table dataTable table-nowrap"
                      id="executive-project"
                    >
                      <thead className="table-light">
                        <tr>
                          <th>Executive Name</th>
                          <th>Deal Closed</th>
                          <th>Revenue Generated</th>
                          <th>Conversion %</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-25.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Robert Johnson</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-success">98</p>
                          </td>

                          <td>$7500</td>

                          <td>
                            <span className="badge badge-pill badge-soft-success">
                              100%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-success text-white">
                              Excellent
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-04.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Isabella Cooper</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-success">87</p>
                          </td>

                          <td>$2000</td>

                          <td>
                            <span className="badge badge-pill badge-soft-success">
                              100%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-success text-white">
                              Excellent
                            </span>
                          </td>
                        </tr>

                        <tr className="odd">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-27.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">John Smith</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-info">56</p>
                          </td>

                          <td>$1600</td>

                          <td>
                            <span className="badge badge-pill badge-soft-info">
                              85%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-info text-white">
                              Good
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-07.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Sophia Parker</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-danger">10</p>
                          </td>

                          <td>$600</td>

                          <td>
                            <span className="badge badge-pill badge-soft-primary">
                              30%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-danger text-white">
                              Average
                            </span>
                          </td>
                        </tr>

                        <tr className="odd">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-08.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Ethan Reynolds</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-success">87</p>
                          </td>

                          <td>$2800</td>

                          <td>
                            <span className="badge badge-pill badge-soft-success">
                              100%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-success text-white">
                              Excellent
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td>
                            <p className="d-flex align-items-center fs-14 mb-0">
                              <a
                                href="#"
                                className="avatar avatar-sm avatar-rounded border me-2"
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  src="assets/img/profiles/avatar-09.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Liam Carter</a>
                            </p>
                          </td>

                          <td>
                            <p className="fw-medium mb-0 text-info">87</p>
                          </td>

                          <td>$6955</td>

                          <td>
                            <span className="badge badge-pill badge-soft-info">
                              85%
                            </span>
                          </td>

                          <td>
                            <span className="badge badge-pill bg-danger text-white">
                              Average
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
        <CommonFooter />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default ExecutiveDashboardComponent;
