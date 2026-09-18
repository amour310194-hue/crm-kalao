"use client";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import { useState } from "react";
import { usageMetricesData } from "../../../core/json/tenantUsageMatrics";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import UsageChart from "./superadmin-chart/usageChart";
import UsageChartOption from "./superadmin-chart/usageChartOptions";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";

const TenantUsageMetricsComponent = () => {
  const [searchText, setSearchText] = useState<string>("");
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const data = usageMetricesData;
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "Ticket_ID",
      key: "Ticket_ID",
      render: (text: string) => (
        <h6 className="d-flex align-items-center fs-14 fw-normal mb-0">
          <Link href={all_routes.tenantSupportTicketsDetails}>{text}</Link>
        </h6>
      ),
    },
    {
      title: "Tenant Name",
      dataIndex: "Tenant_Name",
      key: "Tenant_Name",
      render: (text: string) => (
        <h6 className="fs-14 fw-medium mb-0">
          <Link href="/contact-details" className="d-flex flex-column">
            {text}
          </Link>
        </h6>
      ),
    },
    {
      title: "Plan",
      dataIndex: "Plan",
      key: "Plan",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => {
        const normalizedStatus = status?.toLowerCase() ?? "";
        let className = "bg-danger";
        let statusName = "Inactive";

        if (normalizedStatus === "active") {
          className = "bg-success";
          statusName = "Active";
        }

        return (
          <span className={`badge badge-status ${className}`}>
            {statusName}
          </span>
        );
      },
    },
    {
      title: "Active Users",
      dataIndex: "Active_Users",
      key: "Active_Users",
    },
    {
      title: "Storage Used (GB)",
      dataIndex: "Storage_Used",
      key: "Storage_Used",
    },
    {
      title: "Storage Limit (GB)",
      dataIndex: "Storage_Limit",
      key: "Storage_Limit",
    },
    {
      title: "API Calls (Monthly)",
      dataIndex: "API_Calls",
      key: "API_Calls",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      className: "text-end no-sort",
      render: () => (
        <div className="dropdown table-action">
          <Link
            href="#"
            className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="ti ti-dots-vertical" />
          </Link>

          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#view_details"
            >
              <i className="ti ti-eye text-blue-light" /> View Details
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <i className="ti ti-trash" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
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
              <h4 className="mb-1">
                Tenant Usage Metrices
                <span className="badge badge-soft-primary ms-2">125</span>
              </h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Tenant Usage Metrices
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <div className="dropdown">
                <Link
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-outline-light px-2 shadow"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-package-export me-2" />
                  Export
                </Link>
                <div className="dropdown-menu  dropdown-menu-end">
                  <ul>
                    <li>
                      <Link
                        href="javascript:void(0);"
                        className="dropdown-item"
                      >
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="javascript:void(0);"
                        className="dropdown-item"
                      >
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
          {/* card start */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="dropdown">
                    <Link
                      href="javascript:void(0);"
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort By
                    </Link>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <Link
                            href="javascript:void(0);"
                            className="dropdown-item"
                          >
                            Newest
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="javascript:void(0);"
                            className="dropdown-item"
                          >
                            Oldest
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <PredefinedDatePicker />
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="dropdown">
                    <Link
                      href="javascript:void(0);"
                      className="btn btn-outline-light shadow px-2"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                      <i className="ti ti-chevron-down ms-2" />
                    </Link>
                    <div className="filter-dropdown-menu dropdown-menu dropdown-menu-lg p-0">
                      <div className="filter-header d-flex align-items-center justify-content-between border-bottom">
                        <h4 className="mb-0 fs-16">
                          <i className="ti ti-filter me-1" />
                          Filter
                        </h4>
                        <button
                          type="button"
                          className="btn-close close-filter-btn"
                          data-bs-dismiss="dropdown-menu"
                          aria-label="Close"
                        />
                      </div>
                      <div className="filter-set-view p-3">
                        <div className="accordion" id="accordionExample">
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                href="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Tenant Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Sunburst Tech
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Veridian Systems
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Apex Solution
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Zenith Holdings
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Onyx Enterprises
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      href="javascript:void(0);"
                                      className="link-primary text-decoration-underline p-2 d-flex"
                                    >
                                      Load More
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                href="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#owner"
                                aria-expanded="false"
                                aria-controls="owner"
                              >
                                Plan
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="owner"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul className="mb-0">
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Advance
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Enterprise
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Basic
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                href="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFive"
                                aria-expanded="false"
                                aria-controls="collapseFive"
                              >
                                Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseFive"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul className="mb-0">
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Active
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Inactive
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Link
                            href="javascript:void(0);"
                            className="btn btn-outline-light w-100"
                          >
                            Reset
                          </Link>
                          <Link
                            href={all_routes.contactList}
                            className="btn btn-primary w-100"
                          >
                            Filter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      href="javascript:void(0);"
                      className="btn bg-soft-indigo border-0"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-columns-3 me-2" />
                      Manage Columns
                    </Link>
                    <div className="dropdown-menu dropdown-menu-md dropdown-md p-3">
                      <ul>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Ticket ID</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Tenant ID</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Tenant Name</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Subject</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Category</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Assigned Agent</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Priority</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Created Date</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Status</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Last Updated</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Action</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* table header */}
              {/* Contact List */}
              <div className="table-responsive custom-table">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={true}
                  searchText={searchText}
                />
              </div>

              {/* /Contact List */}
            </div>
          </div>
          {/* card end */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <CommonFooter />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <>
        {/* View details */}
        <div
          className="modal custom-modal fade"
          id="view_details"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title mb-0">Tenant Usage Detail</h5>
                <button
                  className="btn-close custom-btn-close border p-1 me-0 text-dark"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="bg-light border border-color p-3 d-flex align-items-center justify-content-between rounded mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Link
                        href="#"
                        className="avatar border rounded-circle flex-shrink-0 bg-white"
                      >
                        <ImageWithBasePath
                          src="assets/img/icons/company-icon-01.svg"
                          className="w-auto h-auto"
                          alt="img"
                        />
                      </Link>
                      <h5 className="fs-16 mb-0">
                        <Link href="#">NovaWave LLC</Link>
                      </h5>
                    </div>
                    <span className="badge badge-pill bg-success">Active</span>
                  </div>
                  {/* start row */}
                  <div className="row">
                    <div className="col-lg-4 d-flex">
                      <div className="card flex-fill">
                        <div className="card-body">
                          <h5 className="fs-16 mb-0 d-flex align-items-center gap-2 mb-3">
                            <span className="custom-avatar avatar bg-danger text-white rounded">
                              {" "}
                              <i className="ti ti-box" />{" "}
                            </span>
                            Module Usage
                          </h5>
                          <div id="usage-chart">
                            <UsageChart />
                          </div>
                          {/* start row */}
                          <div className="row row-gap-3">
                            <div className="col-6">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                {" "}
                                <i className="ti ti-point-filled text-indigo" />{" "}
                                Leads{" "}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                {" "}
                                <i className="ti ti-point-filled text-warning" />{" "}
                                Deals{" "}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                {" "}
                                <i className="ti ti-point-filled text-cyan" />{" "}
                                Contacts{" "}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                {" "}
                                <i className="ti ti-point-filled text-pink" />{" "}
                                Pipeline{" "}
                              </p>
                            </div>
                          </div>
                          {/* end row */}
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                    <div className="col-lg-8 d-flex">
                      <div className="card flex-fill">
                        <div className="card-body  pb-0">
                          <div className="mb-3 d-flex align-items-center justify-content-between">
                            <h5 className="fs-16 mb-0 d-flex align-items-center gap-2">
                              <span className="custom-avatar avatar bg-danger text-white rounded">
                                {" "}
                                <i className="ti ti-lock" />{" "}
                              </span>
                              Login Activity
                            </h5>
                            <p className="d-flex align-items-center gap-1 mb-0">
                              {" "}
                              <i className="ti ti-point-filled text-info" />{" "}
                              Login Users{" "}
                            </p>
                          </div>
                          <div id="Usage-chart">
                            <UsageChartOption />
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                  </div>
                  {/* end row */}
                  {/* Accordion Info */}
                  <div className="accordion accordion-bordered">
                    {/* Basic Info */}
                    <div className="accordion-item border-top rounded mb-3">
                      <div className="accordion-header">
                        <Link
                          href="#"
                          className="accordion-button accordion-custom-button rounded"
                          data-bs-toggle="collapse"
                          data-bs-target="#address"
                        >
                          <span className="avatar avatar-md rounded me-2">
                            <i className="ti ti-chart-circles" />
                          </span>
                          Basic Info
                        </Link>
                      </div>
                      <div
                        className="accordion-collapse collapse show"
                        id="address"
                        data-bs-parent="#main_accordion"
                      >
                        <div className="accordion-body border-top">
                          {/* start row */}
                          <div className="row row-gap-3">
                            <div className="col-lg-3">
                              <p className="mb-1">Plan</p>
                              <h6 className="mb-0 fs-14 fw-medium">
                                Advanced (Monthly)
                              </h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Total Users</p>
                              <h6 className="mb-0 fs-14 fw-medium">70</h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Active Users</p>
                              <h6 className="mb-0 fs-14 fw-medium">50</h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Inative Users</p>
                              <h6 className="mb-0 fs-14 fw-medium">20</h6>
                            </div>
                          </div>
                          {/* end row */}
                        </div>
                      </div>
                    </div>
                    {/* CRM Activity */}
                    <div className="accordion-item border-top rounded mb-0">
                      <div className="accordion-header">
                        <Link
                          href="#"
                          className="accordion-button accordion-custom-button rounded"
                          data-bs-toggle="collapse"
                          data-bs-target="#activity"
                        >
                          <span className="avatar avatar-md rounded me-2">
                            <i className="ti ti-circle-dashed" />
                          </span>
                          CRM Activity
                        </Link>
                      </div>
                      <div
                        className="accordion-collapse collapse show"
                        id="activity"
                        data-bs-parent="#main_accordion"
                      >
                        <div className="accordion-body border-top">
                          {/* start row */}
                          <div className="row row-gap-3">
                            <div className="col-lg-3">
                              <p className="mb-1">Leads Created</p>
                              <h6 className="mb-0 fs-14 fw-medium">125</h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Leads Converted</p>
                              <h6 className="mb-0 fs-14 fw-medium">68</h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Deals Created</p>
                              <h6 className="mb-0 fs-14 fw-medium">98</h6>
                            </div>
                            <div className="col-lg-3">
                              <p className="mb-1">Deals Won</p>
                              <h6 className="mb-0 fs-14 fw-medium">48</h6>
                            </div>
                          </div>
                          {/* end row */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="d-flex align-items-center justify-content-end gap-2">
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-light"
                    >
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Create New
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* View details */}
        {/* delete modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
            <div className="modal-content">
              <div className="modal-body p-4 text-center position-relative">
                <div className="mb-3 position-relative z-1">
                  <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                    <i className="ti ti-trash fs-24" />
                  </span>
                </div>
                <h5 className="mb-1">Delete Confirmation</h5>
                <p className="mb-3">
                  Are you sure you want to remove usage metric you selected.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    href="#"
                    className="btn btn-light position-relative z-1 me-2 w-100"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    href="#"
                    className="btn btn-primary position-relative z-1 w-100"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* delete modal */}
      </>
    </>
  );
};

export default TenantUsageMetricsComponent;
