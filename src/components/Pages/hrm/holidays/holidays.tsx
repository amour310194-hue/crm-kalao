"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import { HolidaysListData } from "../../../../core/json/holidaysListData";
import ModalHolidays from "./modal/modalHolidays";

const HolidaysComponent = () => {
  const data = HolidaysListData;

  const columns = [
    {
      title: "Holiday ID",
      dataIndex: "HolidayId",
      render: (text: any) => (
        <h6 className="fs-14 fw-normal mb-0">
          <Link href="#" data-bs-toggle="modal" data-bs-target="#edit_holiday">
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.HolidayId.length - b.HolidayId.length,
    },
    {
      title: "Holiday Name",
      dataIndex: "Name",
      render: (text: any) => <p className="fs-14 mb-0">{text}</p>,
      sorter: (a: any, b: any) => a.Name.length - b.Name.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      render: (text: any) => <p className="fs-14 mb-0">{text}</p>,
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Day",
      dataIndex: "Day",
      render: (text: any) => <p className="fs-14 mb-0">{text}</p>,
      sorter: (a: any, b: any) => a.Day.length - b.Day.length,
    },
    {
      title: "Applicable Location",
      dataIndex: "LocationName",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center gap-2">
          <ImageWithBasePath
            src={`assets/img/flags/${record.LocationFlag}`}
            className="avatar avatar-xs rounded-circle"
            alt="img"
          />
          {text}
        </div>
      ),
      sorter: (a: any, b: any) => a.LocationName.length - b.LocationName.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: any) => (
        <span
          className={`badge badge-pill badge-status ${
            text === "Active" ? "bg-success" : "bg-danger"
          }`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
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
              data-bs-target="#edit_holiday"
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_holiday"
            >
              <i className="ti ti-trash" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="Holidays"
            badgeCount={15}
            showModuleTile={true}
            moduleTitle="HRM"
            showExport={true}
          />
          {/* End Page Header */}
          {/* row start */}
          <div className="row">
            <div className="col-xxl-3 col-xl-6 col-md-6 col-sm-6">
              <div className="card shadow holiday-card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <p className="mb-1 fs-13 fw-medium">Total Holidays</p>
                      <div className="mb-0 fs-29 text-indigo fw-bold">474</div>
                    </div>
                    <span className="avatar avatar-lg rounded-lg bg-soft-indigo text-indigo inset-indigo fs-24 flex-shrink-0">
                      <i className="ti ti-box fs-24" />
                    </span>
                  </div>
                  <div>
                    <span className="fs-13 fw-medium mb-1 d-block text-soft-indigo">
                      Active Holidays in 2026
                    </span>
                    <span className="bg-indigo border-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-6 col-md-6 col-sm-6">
              <div className="card shadow holiday-card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <p className="mb-1 fs-13 fw-medium">National Holidays </p>
                      <div className="mb-0 fs-29 text-success fw-bold">7</div>
                    </div>
                    <span className="avatar avatar-lg rounded-lg bg-soft-success text-success inset-success fs-24 flex-shrink-0">
                      <i className="ti ti-map-pin fs-24" />
                    </span>
                  </div>
                  <div>
                    <span className="fs-13 fw-medium mb-1 d-block text-soft-success">
                      Public Holidays{" "}
                    </span>
                    <span className="bg-success border-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-6 col-md-6 col-sm-6">
              <div className="card shadow holiday-card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <p className="mb-1 fs-13 fw-medium">Company Holidays</p>
                      <div className="mb-0 fs-29 text-info fw-bold">474</div>
                    </div>
                    <span className="avatar avatar-lg rounded-lg bg-soft-info text-info inset-info fs-24 flex-shrink-0">
                      <i className="ti ti-gift fs-24" />
                    </span>
                  </div>
                  <div>
                    <span className="fs-13 fw-medium mb-1 d-block text-soft-info">
                      Organization specific
                    </span>
                    <span className="bg-info border-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-6 col-md-6 col-sm-6">
              <div className="card shadow holiday-card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <p className="mb-1 fs-13 fw-medium">Optional Holidays</p>
                      <div className="mb-0 fs-29 text-danger fw-bold">8</div>
                    </div>
                    <span className="avatar avatar-lg rounded-lg bg-soft-danger text-danger inset-danger fs-24 flex-shrink-0">
                      <i className="ti ti-chart-line fs-24" />
                    </span>
                  </div>
                  <div>
                    <span className="fs-13 fw-medium mb-1 d-block text-soft-danger">
                      Employee Choice
                    </span>
                    <span className="bg-danger border-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* row end */}
          {/* card start */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_holiday"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Holiday
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
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
                            Newest
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="dropdown-item">
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
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Holiday Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-1">
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
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Good Friday
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Company Foundation Day
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Diwali
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Christmas
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      New Year Eve
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
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
                                Applicable Location
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="owner"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-1">
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
                                      <ImageWithBasePath
                                        src="assets/img/flags/us.svg"
                                        alt="us"
                                        className="me-2 img-fluid avatar avatar-xs"
                                      />{" "}
                                      USA
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <ImageWithBasePath
                                        src="assets/img/flags/ca.png"
                                        alt="us"
                                        className="me-2 img-fluid avatar avatar-xs"
                                      />
                                      Canada
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <ImageWithBasePath
                                        src="assets/img/flags/spain.svg"
                                        alt="spain"
                                        className="me-2 img-fluid avatar avatar-xs"
                                      />
                                      Spain
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <ImageWithBasePath
                                        src="assets/img/flags/india.svg"
                                        alt="india"
                                        className="me-2 img-fluid avatar avatar-xs"
                                      />
                                      India
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <ImageWithBasePath
                                        src="assets/img/flags/brazil.svg"
                                        alt="us"
                                        className="me-2 img-fluid avatar avatar-xs"
                                      />
                                      Brazil
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
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
                                data-bs-target="#Status"
                                aria-expanded="false"
                                aria-controls="Status"
                              >
                                Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
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
                                      Active
                                    </label>
                                  </li>
                                  <li>
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
                          <Link href="#" className="btn btn-outline-light w-100">
                            Reset
                          </Link>
                          <Link href="#" className="btn btn-primary w-100">
                            Filter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table header */}
              <div className="custom-table">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={false}
                  searchText={searchText}
                />
              </div>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="datatable-length" />
                </div>
                <div className="col-md-6">
                  <div className="datatable-paginate" />
                </div>
              </div>
            </div>
          </div>
          {/* card end */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <ModalHolidays />
    </>
  );
};

export default HolidaysComponent;
