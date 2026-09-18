"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import { AppliedDiscountLogListData } from "../../../../core/json/appliedDiscountLogListData";
import ModalAppliedDiscountLog from "./modal/modalAppliedDiscountLog";

const AppliedDiscountLogComponent = () => {
  const data = AppliedDiscountLogListData;

  const columns = [
    {
      title: "Discount ID",
      dataIndex: "DiscountID",
      render: (text: string) => (
        <Link
          href="#"
          className="text-blue"
          data-bs-toggle="modal"
          data-bs-target="#edit_discount"
        >
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.DiscountID.length - b.DiscountID.length,
    },
    {
      title: "Deal ID",
      dataIndex: "DealID",
      render: (text: string) => (
        <Link href="#" className="text-blue">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.DealID.length - b.DealID.length,
    },
    {
      title: "Requested By",
      dataIndex: "RequestedBy",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            href="#"
            className="avatar avatar-sm avatar-rounded me-2 flex-shrink-0"
          >
            <ImageWithBasePath src={record.Avatar} alt="Img" />
          </Link>
          <h6 className="fs-14 fw-medium mb-0">
            <Link href="#">{text}</Link>
          </h6>
        </div>
      ),
      sorter: (a: any, b: any) => a.RequestedBy.length - b.RequestedBy.length,
    },
    {
      title: "Requested Discount %",
      dataIndex: "RequestedDiscount",
      render: (text: string) => <span className="text-dark">{text}</span>,
      sorter: (a: any, b: any) =>
        a.RequestedDiscount.length - b.RequestedDiscount.length,
    },
    {
      title: "Approved Discount %",
      dataIndex: "ApprovedDiscount",
      render: (text: string) => <span className="text-dark">{text}</span>,
      sorter: (a: any, b: any) =>
        a.ApprovedDiscount.length - b.ApprovedDiscount.length,
    },
    {
      title: "Final Deal Value",
      dataIndex: "FinalDealValue",
      render: (text: string) => <span className="text-dark">{text}</span>,
      sorter: (a: any, b: any) =>
        a.FinalDealValue.length - b.FinalDealValue.length,
    },
    {
      title: "Approval Status",
      dataIndex: "ApprovalStatus",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "Rejected" ? "bg-danger" : "bg-success"
          } badge-sm`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) =>
        a.ApprovalStatus.length - b.ApprovalStatus.length,
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
              data-bs-target="#edit_discount"
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_discount"
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
            title="Applied Discount Log"
            badgeCount={10}
            moduleTitle="CRM Settings"
            showModuleTile={true}
            showExport={true}
          />
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
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_discount"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Discount Log
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
                                data-bs-target="#collapseOne"
                                aria-expanded="false"
                                aria-controls="collapseOne"
                              >
                                Requested By
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-1 shadow mt-2">
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
                                  {[
                                    {
                                      name: "Albert Morgan",
                                      avatar: "assets/img/users/user-01.jpg",
                                    },
                                    {
                                      name: "Katherine Brooks",
                                      avatar: "assets/img/users/user-40.jpg",
                                    },
                                    {
                                      name: "Samantha Reed",
                                      avatar: "assets/img/users/user-02.jpg",
                                    },
                                    {
                                      name: "William Anderson",
                                      avatar: "assets/img/users/user-03.jpg",
                                    },
                                    {
                                      name: "Jonathan Mitchell",
                                      avatar: "assets/img/users/user-04.jpg",
                                    },
                                  ].map((user) => (
                                    <li className="mb-1" key={user.name}>
                                      <label className="dropdown-item px-2 d-flex align-items-center">
                                        <input
                                          className="form-check-input m-0 me-2"
                                          type="checkbox"
                                        />
                                        <span className="avatar avatar-xs avatar-rounded me-2">
                                          <ImageWithBasePath
                                            src={user.avatar}
                                            alt="Img"
                                          />
                                        </span>
                                        {user.name}
                                      </label>
                                    </li>
                                  ))}
                                  <li>
                                    <Link
                                      href="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex fs-12"
                                    >
                                      View More
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
                                data-bs-target="#collapseStatus"
                                aria-expanded="false"
                                aria-controls="collapseStatus"
                              >
                                Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseStatus"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-1 shadow mt-2">
                                <ul className="mb-0">
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />{" "}
                                      Approved
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />{" "}
                                      Rejected
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
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="btn bg-soft-indigo border-0"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-columns-3 me-2" />
                      Manage Columns
                    </Link>
                    <div className="dropdown-menu dropdown-menu-md dropdown-md p-3">
                      <ul>
                        {[
                          "Discount ID",
                          "Deal ID",
                          "Requested By",
                          "Requested Discount %",
                          "Approved Discount %",
                          "Final Deal Value",
                          "Approval Status",
                          "Action",
                        ].map((column) => (
                          <li
                            className="gap-1 d-flex align-items-center mb-2"
                            key={column}
                          >
                            <i className="ti ti-columns me-1" />
                            <div className="form-check form-switch w-100 ps-0">
                              <label className="form-check-label d-flex align-items-center gap-2 w-100">
                                <span>{column}</span>
                                <input
                                  className="form-check-input switchCheckDefault ms-auto"
                                  type="checkbox"
                                  role="switch"
                                  defaultChecked
                                />
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* table header */}
              {/* Applied Discount Log List */}
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
              {/* /Applied Discount Log List */}
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
      <ModalAppliedDiscountLog />
    </>
  );
};

export default AppliedDiscountLogComponent;
