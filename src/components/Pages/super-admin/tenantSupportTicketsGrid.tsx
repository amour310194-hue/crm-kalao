"use client";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TenantSupportModal from "./tenantSupportModal";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";

const TenantSupportTicketsGridComponent = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
            <div>
              <h4 className="mb-1">
                Tenant Support Tickets
                <span className="badge badge-soft-primary ms-2">125</span>
              </h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Tenant Support Tickets
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
             <PredefinedDatePicker/>
              <div
                className="btn-group support-btn-group"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio1"
                  defaultChecked
                />
                <label
                  className="btn btn-outline-primary border fw-normal"
                  htmlFor="btnradio1"
                >
                  Day
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio2"
                />
                <label
                  className="btn btn-outline-primary border fw-normal"
                  htmlFor="btnradio2"
                >
                  Week
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio3"
                />
                <label
                  className="btn btn-outline-primary border fw-normal"
                  htmlFor="btnradio3"
                >
                  Month
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio4"
                />
                <label
                  className="btn btn-outline-primary border fw-normal"
                  htmlFor="btnradio4"
                >
                  Date Range
                </label>
              </div>
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
          {/* Start Add Ticket */}
          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-4">
            <div className="d-inline-flex align-items-center gap-3">
              <div className="dropdown">
                <Link
                  href="#"
                  className="dropdown-toggle btn btn-outline-light shadow"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort By
                </Link>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Recently Added
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Descending
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="d-inline-flex align-items-center gap-3 flex-wrap">
              <div className="dropdown">
                <Link
                  href="#"
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
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="true"
                            aria-controls="collapseTwo"
                          >
                            Assigned
                          </Link>
                        </div>
                        <div
                          className="filter-set-contents accordion-collapse collapse show"
                          id="collapseTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                            <div className="mb-2">
                              <div className="input-icon-start input-icon position-relative">
                                <span className="input-icon-addon fs-12">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-md"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <ul className="mb-0">
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-06.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Elizabeth Morgan
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-40.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Katherine Brooks
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-05.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Sophia Lopez
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-10.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  John Michael
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-15.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Natalie Brooks
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-01.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  William Turner
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-13.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Ava Martinez
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-12.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Nathan Reed
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-03.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Lily Anderson
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-18.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Ryan Coleman
                                </label>
                              </li>
                              <li>
                                <Link
                                  href="#"
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
                                  href="#"
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
                            Priority
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
                                  High
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Medium
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Low
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
                                  Resolved
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Open
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Closed
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Pending
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Link href="#" className="btn btn-outline-light w-100">
                        Reset
                      </Link>
                      <Link
                        href={all_routes.tenantSupportTicketsGrid}
                        className="btn btn-primary w-100"
                      >
                        Filter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-inline-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                <Link
                  href={all_routes.tenantSupportTickets}
                  className="btn p-2 border-0 fs-14"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  href={all_routes.tenantSupportTicketsGrid}
                  className="flex-shrink-0 btn p-2 border-0 ms-1 fs-14 active"
                >
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_ticktet"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Ticket
              </Link>
            </div>
          </div>
          {/* Start row */}
          <div className="row row-gap-4">
            <div className="col-lg-8">
              {/* Card 1 */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center flex-wrap text-dark">
                      Ticket ID :{" "}
                      <span className="badge badge-outline-info ms-2">
                        #TKT0020
                      </span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="badge bg-success">Resloved</span>
                      <div>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                          data-bs-toggle="dropdown"
                          aria-label="more options"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <ul className="dropdown-menu p-2">
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_ticket"
                            >
                              <i className="ti ti-edit me-2" />
                              Edit Ticket
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_modal"
                            >
                              <i className="ti ti-trash me-2" />
                              Delete
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={all_routes.tenantSupportTicketsDetails}
                              className="dropdown-item"
                            >
                              <i className="ti ti-eye me-2" />
                              View Details
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="fs-16 mb-2 d-flex align-items-center flex-wrap gap-2">
                      Login Access Error
                      <span className="badge badge-soft-teal">
                        Authentication
                      </span>
                    </h5>
                    <p className="mb-0">
                      Our team is unable to log in to the account and requires
                      assistance to regain access.
                    </p>
                  </div>
                  <div className="bg-light border border-color p-2 rounded d-flex align-items-center">
                    {/* start row */}
                    <div className="row w-100 align-items-center row-gap-3 g-0">
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <p className="mb-0">
                          Tenant :{" "}
                          <span className="fw-medium text-dark">
                            Sunburst Tech
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6">
                        <p className="mb-0 text-dark d-flex align-items-center justify-content-start justify-content-xl-center gap-1">
                          Priority :{" "}
                          <span className="badge badge-soft-danger border-0">
                            {" "}
                            <i className="ti ti-point-filled" /> High
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-5 col-lg-12 col-md-5 col-sm-12">
                        <div className="d-flex align-items-center justify-content-xl-end justify-content-start flex-wrap gap-2">
                          <p className="mb-0 text-dark">Assignee :</p>
                          <ImageWithBasePath
                            src="assets/img/users/avatar-5.jpg"
                            alt="avatar"
                            className="avatar avatar-sm rounded-circle"
                          />
                          <p className="fw-medium d-flex align-items-center justify-content-between gap-2 text-nowrap mb-0 text-dark">
                            Robert Johnson{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center flex-wrap text-dark">
                      Ticket ID :{" "}
                      <span className="badge badge-outline-info ms-2">
                        #TKT0019
                      </span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="badge bg-cyan">Open</span>
                      <div>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                          data-bs-toggle="dropdown"
                          aria-label="more options"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <ul className="dropdown-menu p-2">
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_ticket"
                            >
                              <i className="ti ti-edit me-2" />
                              Edit Ticket
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_modal"
                            >
                              <i className="ti ti-trash me-2" />
                              Delete
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={all_routes.tenantSupportTicketsDetails}
                              className="dropdown-item"
                            >
                              <i className="ti ti-eye me-2" />
                              View Details
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="fs-16 mb-2 d-flex align-items-center flex-wrap gap-2">
                      Invoice Mismatch
                      <span className="badge badge-soft-cyan">Billing</span>
                    </h5>
                    <p className="mb-0">
                      Our account shows an invoice amount that does not match
                      the actual usage and needs verification.
                    </p>
                  </div>
                  <div className="bg-light border border-color p-2 rounded d-flex align-items-center">
                    {/* start row */}
                    <div className="row w-100 align-items-center row-gap-3 g-0">
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <p className="mb-0">
                          Tenant :{" "}
                          <span className="fw-medium text-dark">
                            Veridian Systems
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6">
                        <p className="mb-0 text-dark d-flex align-items-center justify-content-start justify-content-xl-center gap-1">
                          Priority :{" "}
                          <span className="badge badge-soft-danger border-0">
                            {" "}
                            <i className="ti ti-point-filled" /> High
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-5 col-lg-12 col-md-5 col-sm-12">
                        <div className="d-flex align-items-center justify-content-xl-end justify-content-start flex-wrap gap-2">
                          <p className="mb-0 text-dark">Assignee :</p>
                          <ImageWithBasePath
                            src="assets/img/users/avatar-6.jpg"
                            alt="avatar"
                            className="avatar avatar-sm rounded-circle"
                          />
                          <p className="fw-medium d-flex align-items-center justify-content-between gap-2 text-nowrap mb-0 text-dark">
                            John Smith{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center flex-wrap text-dark">
                      Ticket ID :{" "}
                      <span className="badge badge-outline-info ms-2">
                        #TKT0018
                      </span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="badge bg-success">Pending</span>
                      <div>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                          data-bs-toggle="dropdown"
                          aria-label="more options"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <ul className="dropdown-menu p-2">
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_ticket"
                            >
                              <i className="ti ti-edit me-2" />
                              Edit Ticket
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_modal"
                            >
                              <i className="ti ti-trash me-2" />
                              Delete
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={all_routes.tenantSupportTicketsDetails}
                              className="dropdown-item"
                            >
                              <i className="ti ti-eye me-2" />
                              View Details
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="fs-16 mb-2 d-flex align-items-center flex-wrap gap-2">
                      Invoice Mismatch
                      <span className="badge badge-soft-pink">Performance</span>
                    </h5>
                    <p className="mb-0">
                      We are experiencing issues with the dashboard not loading
                      and need support.
                    </p>
                  </div>
                  <div className="bg-light border border-color p-2 rounded d-flex align-items-center">
                    {/* start row */}
                    <div className="row w-100 align-items-center row-gap-3 g-0">
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <p className="mb-0">
                          Tenant :{" "}
                          <span className="fw-medium text-dark">
                            Zenith Holdings
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6">
                        <p className="mb-0 text-dark d-flex align-items-center justify-content-start justify-content-xl-center gap-1">
                          Priority :{" "}
                          <span className="badge badge-soft-warning border-0">
                            {" "}
                            <i className="ti ti-point-filled" /> Medium
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-5 col-lg-12 col-md-5 col-sm-12">
                        <div className="d-flex align-items-center justify-content-xl-end justify-content-start flex-wrap gap-2">
                          <p className="mb-0 text-dark">Assignee :</p>
                          <ImageWithBasePath
                            src="assets/img/users/avatar-7.jpg"
                            alt="avatar"
                            className="avatar avatar-sm rounded-circle"
                          />
                          <p className="fw-medium d-flex align-items-center justify-content-between gap-2 text-nowrap mb-0 text-dark">
                            Isabella Cooper{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center flex-wrap text-dark">
                      Ticket ID :{" "}
                      <span className="badge badge-outline-info ms-2">
                        #TKT0017
                      </span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="badge bg-danger">Closed</span>
                      <div>
                        <Link
                          href="#"
                          className="btn btn-sm btn-icon btn-outline-light"
                          data-bs-toggle="dropdown"
                          aria-label="more options"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <ul className="dropdown-menu p-2">
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_ticket"
                            >
                              <i className="ti ti-edit me-2" />
                              Edit Ticket
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_modal"
                            >
                              <i className="ti ti-trash me-2" />
                              Delete
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={all_routes.tenantSupportTicketsDetails}
                              className="dropdown-item"
                            >
                              <i className="ti ti-eye me-2" />
                              View Details
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="fs-16 mb-2 d-flex align-items-center flex-wrap gap-2">
                      Export Format Issue
                      <span className="badge badge-soft-indigo">Reports</span>
                    </h5>
                    <p className="mb-0">
                      The exported data is not in the expected format and
                      requires support.
                    </p>
                  </div>
                  <div className="bg-light border border-color p-2 rounded d-flex align-items-center">
                    {/* start row */}
                    <div className="row w-100 align-items-center row-gap-3 g-0">
                      <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <p className="mb-0">
                          Tenant :{" "}
                          <span className="fw-medium text-dark">
                            Everest Group
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6">
                        <p className="mb-0 text-dark d-flex align-items-center justify-content-start justify-content-xl-center gap-1">
                          Priority :{" "}
                          <span className="badge badge-soft-success border-0">
                            {" "}
                            <i className="ti ti-point-filled" /> Low
                          </span>{" "}
                        </p>
                      </div>
                      <div className="col-xl-5 col-lg-12 col-md-5 col-sm-12">
                        <div className="d-flex align-items-center justify-content-xl-end justify-content-start flex-wrap gap-2">
                          <p className="mb-0 text-dark">Assignee :</p>
                          <ImageWithBasePath
                            src="assets/img/users/avatar-9.jpg"
                            alt="avatar"
                            className="avatar avatar-sm rounded-circle"
                          />
                          <p className="fw-medium d-flex align-items-center justify-content-between gap-2 text-nowrap mb-0 text-dark">
                            Sophia Parker{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Link
                  href="#"
                  className="btn btn-dark d-inline-flex align-items-center gap-1"
                >
                  <i className="ti ti-loader" /> Load More
                </Link>
              </div>
            </div>
            <div className="col-lg-4">
              {/* Categories */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Ticket Categories </h5>
                </div>
                <div className="card-body">
                  <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    Authentication <span className="count-value">4</span>{" "}
                  </p>
                  <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    Billing <span className="count-value">2</span>{" "}
                  </p>
                  <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    Performance <span className="count-value">5</span>{" "}
                  </p>
                  <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    Reports <span className="count-value">5</span>{" "}
                  </p>
                  <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                    Notifications <span className="count-value">8</span>{" "}
                  </p>
                </div>
              </div>
              {/* Support Agents */}
              <div className="card mb-0">
                <div className="card-header">
                  <h5 className="mb-0">Support Agents </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-5.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Robert Johnson{" "}
                      </p>
                    </div>
                    <span className="count-value">4</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-6.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Isabella Cooper{" "}
                      </p>
                    </div>
                    <span className="count-value">5</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-7.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Ron Thompson{" "}
                      </p>
                    </div>
                    <span className="count-value">2</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-8.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Sophia Parker{" "}
                      </p>
                    </div>
                    <span className="count-value">8</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-9.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Mason Hayes{" "}
                      </p>
                    </div>
                    <span className="count-value">4</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/avatar-10.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Ethan Reynolds{" "}
                      </p>
                    </div>
                    <span className="count-value">3</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/user-11.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Liam Carter{" "}
                      </p>
                    </div>
                    <span className="count-value">5</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/user-12.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        John Smith{" "}
                      </p>
                    </div>
                    <span className="count-value">3</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/user-13.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Noah Mitchell{" "}
                      </p>
                    </div>
                    <span className="count-value">2</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                    <div className="d-flex align-items-center gap-2">
                      <ImageWithBasePath
                        src="assets/img/users/user-14.jpg"
                        alt="avatar"
                        className="avatar avatar-sm rounded-circle"
                      />
                      <p className="fw-medium d-flex align-items-center justify-content-between gap-2 flex-wrap mb-0">
                        Linda Stanley{" "}
                      </p>
                    </div>
                    <span className="count-value">6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End row */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <CommonFooter />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <TenantSupportModal />
    </>
  );
};

export default TenantSupportTicketsGridComponent;
