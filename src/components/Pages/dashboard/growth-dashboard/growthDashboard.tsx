"use client";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import ChurnedChart from "./chart/churnedChart";
import RetainedChart from "./chart/retainedChart";
import RevenueChart from "./chart/revenueChart";
import RegionWiseGrowthChart from "./chart/regionWiseGrowthChart";
import GrowthTrendChart from "./chart/growthTrendChart";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";

const GrowthDashboardComponent = () => {
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
              <h4 className="mb-1">Growth Dashboard</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Growth Dashboard
                  </li>
                </ol>
              </nav>
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
          <div className="row flex-fill">
            <div className="col-xl-9 d-flex">
              <div className="row g-3 flex-fill">
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="card growth-card flex-fill bg-soft-success border-0 shadow-none">
                    <div className="card-header text-center border-0 py-3">
                      <div className="avatar rounded avatar-md bg-success">
                        <ImageWithBasePath
                          src="assets/img/icons/carbon_growth.svg"
                          alt="icon"
                          className="img-fluid p-2"
                        />
                      </div>
                    </div>
                    <div className="card-body bg-white rounded border mb-1 p-3">
                      <p className="mb-2 fs-13 fw-medium text-dark">
                        Total Revenue Growth
                      </p>
                      <div className="fs-28 text-dark fw-bold mb-3">$400k</div>
                      <div className="fs-13 fw-medium">
                        <span className="text-success">
                          <i className="ti ti-clock" /> +12%
                        </span>{" "}
                        vs Last Month
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="card growth-card flex-fill bg-soft-danger border-0 shadow-none">
                    <div className="card-header text-center border-0 py-3">
                      <div className="avatar rounded avatar-md bg-danger">
                        <ImageWithBasePath
                          src="assets/img/icons/hand-icon.svg"
                          alt="icon"
                          className="img-fluid p-2"
                        />
                      </div>
                    </div>
                    <div className="card-body bg-white rounded border mb-1 p-3">
                      <p className="mb-2 fs-13 fw-medium text-dark">
                        Conversion Rate
                      </p>
                      <div className="fs-28 text-dark fw-bold mb-3">12.2%</div>
                      <div className="fs-13 fw-medium">
                        <span className="text-danger">
                          <i className="ti ti-clock" /> +90%
                        </span>{" "}
                        vs Last Month
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="card growth-card flex-fill bg-purple-subtle border-0 shadow-none">
                    <div className="card-header text-center border-0 py-3">
                      <div className="avatar rounded avatar-md bg-purple">
                        <ImageWithBasePath
                          src="assets/img/icons/users.svg"
                          alt="icon"
                          className="img-fluid p-2"
                        />
                      </div>
                    </div>
                    <div className="card-body bg-white rounded border mb-1 p-3">
                      <p className="mb-2 fs-13 fw-medium text-dark">
                        New Customers
                      </p>
                      <div className="fs-28 text-dark fw-bold mb-3">560</div>
                      <div className="fs-13 fw-medium">
                        <span className="text-purple">
                          <i className="ti ti-clock" /> +10%
                        </span>{" "}
                        vs Last Month
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="card growth-card flex-fill bg-soft-warning border-0 shadow-none">
                    <div className="card-header text-center border-0 py-3">
                      <div className="avatar rounded avatar-md bg-warning">
                        <ImageWithBasePath
                          src="assets/img/icons/fluent_arrow.svg"
                          alt="icon"
                          className="img-fluid p-2"
                        />
                      </div>
                    </div>
                    <div className="card-body bg-white rounded border mb-1 p-3">
                      <p className="mb-2 fs-13 fw-medium text-dark">
                        Monthly Grow
                      </p>
                      <div className="fs-28 text-dark fw-bold mb-3">8.9%</div>
                      <div className="fs-13 fw-medium">
                        <span className="text-warning">
                          <i className="ti ti-clock" /> +24%
                        </span>{" "}
                        vs Last Month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between border-0">
                  <span className="fs-18 fw-bold text-dark">Retention</span>
                  <Link
                    href="#"
                    className="btn btn-sm btn-icon btn-outline-light"
                  >
                    <i className="ti ti-refresh" />
                  </Link>
                </div>
                <div className="card-body pt-0">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                    <div id="retained-chart">
                      <RetainedChart />
                    </div>
                    <div className="text-end">
                      <div className="fs-24 text-dark fw-semibold mb-1 d-flex align-items-center gap-1">
                        82%{" "}
                        <i className="ti ti-arrow-big-up-filled text-success fs-16" />
                      </div>
                      <p className="mb-0 fs-13 fw-medium">Retained </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div id="churned-chart">
                      <ChurnedChart />
                    </div>
                    <div className="text-end">
                      <div className="fs-24 text-dark fw-semibold mb-1 d-flex align-items-center gap-1">
                        18%{" "}
                        <i className="ti ti-arrow-big-down-filled text-danger fs-16" />
                      </div>
                      <p className="mb-0 fs-13 fw-medium">Churned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-12 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div className="mb-0 fs-18 fw-bold text-dark">Revenue</div>
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
                          Last 30 Days
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 6 months
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 12 months
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div id="revenue-chart2">
                    <RevenueChart />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div className="mb-0 fs-18 fw-bold text-dark">
                      Region-wise Growth
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
                  <div id="region-wise-growth">
                    <RegionWiseGrowthChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="mb-0 fs-18 fw-bold text-dark">
                      Growth Trend
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
                  <div id="growth-trend">
                    <GrowthTrendChart />
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="position-relative p-1 d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-25 rounded-circle me-1 z-1">
                      <span className="p-1 bg-danger pb-0 position-absolute top-50 start-50 translate-middle w-100 z-n1" />
                      <span className="bg-danger rounded-circle p-1 border border-2 border-white" />
                    </span>
                    <span className="mb-0 fw-medium text-dark fs-12">
                      Revenue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="mb-4 fs-18 fw-bold text-dark">
                    Growth Overview
                  </div>
                  {/* Growth Overview List */}
                  <div className="table-responsive custom-table table-nowrap">
                    <table
                      className="table table-nowrap"
                      id="growth-overview-list"
                    >
                      <thead className="table-light">
                        <tr>
                          <th>Period</th>
                          <th>Customers</th>
                          <th>Conversion Rate</th>
                          <th>Revenue</th>
                          <th>Retention Rate</th>
                          <th>Growth</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd">
                          <td className="sorting_1">05 Oct 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-01.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Owen Sterling</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-danger">
                              8.5%
                            </span>
                          </td>
                          <td>$45,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-info">
                              85%
                            </span>
                          </td>
                          <td>8.5%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-danger">
                              Down
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td className="sorting_1">14 Oct 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-15.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Hazel Davenport</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-info">
                              3.0%
                            </span>
                          </td>
                          <td>$780,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-danger">
                              30%
                            </span>
                          </td>
                          <td>3.0%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-success">
                              Up
                            </span>
                          </td>
                        </tr>

                        <tr className="odd">
                          <td className="sorting_1">15 Nov 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-11.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Violet Ainsworth</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-info">
                              10.0%
                            </span>
                          </td>
                          <td>$80,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-success">
                              100%
                            </span>
                          </td>
                          <td>90%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-success">
                              Up
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td className="sorting_1">25 Nov 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-09.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Milo Rutherford</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-success">
                              8.5%
                            </span>
                          </td>
                          <td>$40,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-info">
                              85%
                            </span>
                          </td>
                          <td>8.5%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-danger">
                              Down
                            </span>
                          </td>
                        </tr>

                        <tr className="odd">
                          <td className="sorting_1">25 Sep 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-15.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Elijah Blackwood</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-info">
                              12.4%
                            </span>
                          </td>
                          <td>$250,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-success">
                              100%
                            </span>
                          </td>
                          <td>12.4%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-success">
                              Up
                            </span>
                          </td>
                        </tr>

                        <tr className="even">
                          <td className="sorting_1">29 Sep 2025</td>
                          <td>
                            <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
                              <a
                                href="#"
                                className="avatar avatar-sm border rounded-circle me-2"
                              >
                                <ImageWithBasePath
                                  className="rounded-circle"
                                  src="assets/img/profiles/avatar-05.jpg"
                                  alt="User Image"
                                />
                              </a>
                              <a href="#">Scarlett Beaumont</a>
                            </h6>
                          </td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-success">
                              18.4%
                            </span>
                          </td>
                          <td>$50,000</td>
                          <td>
                            <span className="priority badge badge-tag badge-soft-success">
                              100%
                            </span>
                          </td>
                          <td>18.4%</td>
                          <td>
                            <span className="badge badge-pill badge-status bg-danger">
                              Down
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Growth Overview List */}
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

export default GrowthDashboardComponent;
