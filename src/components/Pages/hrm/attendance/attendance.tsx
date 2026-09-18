"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { AttendanceListData } from "../../../../core/json/attendanceListData";
import ModalAttendance from "./modal/modalAttendance";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";

const AttendanceComponent = () => {
  const data = AttendanceListData;

  const columns = [
    {
      title: "Attendance ID",
      dataIndex: "AttendanceId",
      render: (text: any) => (
        <Link href="#" data-bs-toggle="modal" data-bs-target="#edit-modal">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.AttendanceId.length - b.AttendanceId.length,
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeId",
      render: (text: any) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.EmployeeId.length - b.EmployeeId.length,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (text: any, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.EmployeeImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.EmployeeName.length - b.EmployeeName.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: any) => (
        <span
          className={`badge badge-pill badge-status ${
            text === "Present" ? "bg-success" : "bg-danger"
          }`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Location",
      dataIndex: "LocationName",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center mb-0">
          <Link href="#" className="avatar avatar-xss me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={record.LocationImage}
              alt="User Image"
            />
          </Link>
          {text}
        </div>
      ),
      sorter: (a: any, b: any) => a.LocationName.length - b.LocationName.length,
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      render: (text: any) =>
        text === "info" ? (
          <i className="ti ti-info-circle-filled fs-24 text-dark" />
        ) : (
          text
        ),
      sorter: (a: any, b: any) => a.Remarks.length - b.Remarks.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: () => (
        <div className="dropdown table-action">
          <Link
            href="#"
            className="action-icon btn btn-xs shadow d-inline-flex btn-outline-light"
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
              data-bs-target="#edit-modal"
            >
              <i className="ti ti-edit text-blue" /> Edit
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
            title="Attendance"
            badgeCount={15}
            showModuleTile={true}
            moduleTitle="HRM"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row row-gap-3 mb-4">
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="card flex-fill mb-0 position-relative overflow-hidden bg-soft-success">
                <div className="card-body position-relative z-1">
                  <span className="avatar avatar-md rounded-3 bg-success text-white mb-1 shadow">
                    <i className="ti ti-users fs-20" />
                  </span>
                  <span className="d-block text-dark fw-bold fs-28">120</span>
                  <div className="d-flex alig-items-center justify-content-between">
                    <span className="fs-13">Total Employees</span>
                    <span className="badge bg-success bg-opacity-10 px-2 text-success border-0 fs-10 rounded-pill">
                      +5%
                    </span>
                  </div>
                </div>
                <ImageWithBasePath
                  src="assets/img/icons/half-circle2.svg"
                  alt="img"
                  className="img-fluid position-absolute top-0 end-0"
                />
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="card flex-fill mb-0 position-relative overflow-hidden bg-soft-info">
                <div className="card-body position-relative z-1">
                  <span className="avatar avatar-md rounded-3 bg-info text-white mb-1 shadow">
                    <i className="ti ti-circle-check fs-20" />
                  </span>
                  <span className="d-block text-dark fw-bold fs-28">100</span>
                  <div className="d-flex alig-items-center justify-content-between">
                    <span className="fs-13">Present Today</span>
                    <span className="badge bg-info bg-opacity-10 px-2 text-info border-0 fs-10 rounded-pill">
                      90%
                    </span>
                  </div>
                </div>
                <ImageWithBasePath
                  src="assets/img/icons/half-circle3.svg"
                  alt="img"
                  className="img-fluid position-absolute top-0 end-0"
                />
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="card flex-fill mb-0 position-relative overflow-hidden bg-soft-danger">
                <div className="card-body position-relative z-1">
                  <span className="avatar avatar-md rounded-3 bg-danger text-white mb-1 shadow">
                    <i className="ti ti-x fs-20" />
                  </span>
                  <span className="d-block text-dark fw-bold fs-28">10</span>
                  <div className="d-flex alig-items-center justify-content-between">
                    <span className="fs-13">Absent Today</span>
                    <span className="badge bg-danger bg-opacity-10 px-2 text-danger border-0 fs-10 rounded-pill">
                      10%
                    </span>
                  </div>
                </div>
                <ImageWithBasePath
                  src="assets/img/icons/half-circle4.svg"
                  alt="img"
                  className="img-fluid position-absolute top-0 end-0"
                />
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="card flex-fill mb-0 position-relative overflow-hidden bg-soft-orange">
                <div className="card-body position-relative z-1">
                  <span className="avatar avatar-md rounded-3 bg-orange text-white mb-1 shadow">
                    <i className="ti ti-time-duration-15 fs-20" />
                  </span>
                  <span className="d-block text-dark fw-bold fs-28">10</span>
                  <div className="d-flex alig-items-center justify-content-between">
                    <span className="fs-13">Absent Today</span>
                    <span className="badge bg-danger bg-opacity-10 px-2 text-orange border-0 fs-10 rounded-pill">
                      8%
                    </span>
                  </div>
                </div>
                <ImageWithBasePath
                  src="assets/img/icons/half-circle5.svg"
                  alt="img"
                  className="img-fluid position-absolute top-0 end-0"
                />
              </div>
            </div>
          </div>
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
                data-bs-target="#add-modal"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Attendance
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                filters={[
                  {
                    Id: "collapseTwo",
                    Title: "Employee",
                    Searchable: true,
                    LoadMore: true,
                    Options: [
                      { Label: "Elizabeth Morgan", Avatar: "assets/img/users/user-06.jpg" },
                      { Label: "Katherine Brooks", Avatar: "assets/img/users/user-40.jpg" },
                      { Label: "Sophia Lopez", Avatar: "assets/img/users/user-05.jpg" },
                      { Label: "John Michael", Avatar: "assets/img/users/user-10.jpg" },
                      { Label: "Natalie Brooks", Avatar: "assets/img/users/user-15.jpg" },
                    ],
                  },
                  { Id: "attendance_date", Title: "Date", DateInput: true },
                  {
                    Id: "type",
                    Title: "Status",
                    Options: [{ Label: "Present" }, { Label: "Absent" }],
                  },
                ]}
              />
              {/* table header */}
              <div className=" custom-table">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={true}
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
      <ModalAttendance />
    </>
  );
};

export default AttendanceComponent;
