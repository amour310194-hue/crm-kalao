"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import {
  LeaveRequestsListData,
  LeaveStatusChartSeries,
} from "../../../../core/json/leaveRequestsListData";
import ModalLeaveRequests from "./modal/modalLeaveRequests";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";

const LeaveRequestsComponent = () => {
  const data = LeaveRequestsListData;

  const attendanceStatusOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    colors: ["#22C55E", "#F59E0B", "#EF4444", "#3B82F6"],
    labels: ["Approved", "Pending", "Declined", "Request"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "65%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    stroke: {
      width: 8,
      colors: ["#ffffff"],
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
  };

  const columns = [
    {
      title: "Leave ID",
      dataIndex: "LeaveId",
      render: (text: any) => (
        <Link href="#" data-bs-toggle="modal" data-bs-target="#edit-modal">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.LeaveId.length - b.LeaveId.length,
    },
    {
      title: "Employee",
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
      title: "Leave Type",
      dataIndex: "LeaveType",
      sorter: (a: any, b: any) => a.LeaveType.length - b.LeaveType.length,
    },
    {
      title: "Duration",
      dataIndex: "Duration",
      sorter: (a: any, b: any) => a.Duration.length - b.Duration.length,
    },
    {
      title: "Days",
      dataIndex: "Days",
      sorter: (a: any, b: any) => a.Days.length - b.Days.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: any) => (
        <span
          className={`badge badge-pill badge-status ${
            text === "Approved"
              ? "bg-success"
              : text === "Rejected"
              ? "bg-danger"
              : "bg-warning"
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
            title="Leave Requests"
            badgeCount={15}
            showModuleTile={true}
            moduleTitle="HRM"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="row flex-fill">
                <div className="col-lg-6 d-flex">
                  <div className="card flex-fill mb-4 bg-success-gradient w-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="avatar avatar-lg rounded bg-success text-white">
                          <i className="ti ti-circle-check fs-24" />
                        </span>
                        <div className="text-end">
                          <p className="mb-0 text-white">Success Rate</p>
                          <span className="d-block fw-bold fs-28 text-white">
                            228
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 pb-2 text-white border-bottom">
                        Approved
                      </p>
                      <div className="d-flex align-items-center justify-content-between fs-12 text-white">
                        Approval Rate <span>92%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex">
                  <div className="card flex-fill mb-4 bg-danger-gradient w-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="avatar avatar-lg rounded bg-danger text-white">
                          <i className="ti ti-x fs-24" />
                        </span>
                        <div className="text-end">
                          <p className="mb-0 text-white">Declined</p>
                          <span className="d-block fw-bold fs-28 text-white">
                            8
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 pb-2 text-white border-bottom">
                        Rejected
                      </p>
                      <div className="d-flex align-items-center justify-content-between fs-12 text-white">
                        Rejection Rate <span>3.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex">
                  <div className="card flex-fill mb-4 bg-info-gradient w-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="avatar avatar-lg rounded bg-info text-white">
                          <i className="ti ti-user-question fs-24" />
                        </span>
                        <div className="text-end">
                          <p className="mb-0 text-white">Total</p>
                          <span className="d-block fw-bold fs-28 text-white">
                            300
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 pb-2 text-white border-bottom">
                        Leave Request
                      </p>
                      <div className="d-flex align-items-center justify-content-between fs-12 text-white">
                        This Month <span>+10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex">
                  <div className="card flex-fill mb-4 bg-warning-gradient w-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="avatar avatar-lg rounded bg-warning text-white">
                          <i className="ti ti-clock fs-24" />
                        </span>
                        <div className="text-end">
                          <p className="mb-0 text-white">Urgent</p>
                          <span className="d-block fw-bold fs-28 text-white">
                            12
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 pb-2 text-white border-bottom">
                        Pending Approvals
                      </p>
                      <div className="d-flex align-items-center justify-content-between fs-12 text-white">
                        Action Required <span>+10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header border-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <div className="mb-0 fs-17 fw-bold text-dark">
                      Attendance Status
                    </div>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="#"
                      >
                        Last 30 days
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link href="#" className="dropdown-item">
                          Last 15 days
                        </Link>
                        <Link href="#" className="dropdown-item">
                          Last 30 days
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <div id="attendance-status">
                        <Chart
                          options={attendanceStatusOptions}
                          series={LeaveStatusChartSeries}
                          type="donut"
                          height={350}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row row-gap-3">
                        <div className="col-6 pe-1">
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex align-items-center gap-1 mb-1 fs-13">
                              <i className="ti ti-circle-filled fs-10 text-success" />{" "}
                              Approved
                            </div>
                            <span className="text-dark fs-18 fw-bold">45</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex align-items-center gap-1 mb-1 fs-13">
                              <i className="ti ti-circle-filled fs-10 text-warning" />{" "}
                              Pending
                            </div>
                            <span className="text-dark fs-18 fw-bold">3</span>
                          </div>
                        </div>
                        <div className="col-6 pe-1">
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex align-items-center gap-1 mb-1 fs-13">
                              <i className="ti ti-circle-filled fs-10 text-danger" />{" "}
                              Declined
                            </div>
                            <span className="text-dark fs-18 fw-bold">5</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-3 rounded bg-light">
                            <div className="d-flex align-items-center gap-1 mb-1 fs-13">
                              <i className="ti ti-circle-filled fs-10 text-info" />{" "}
                              Request
                            </div>
                            <span className="text-dark fs-18 fw-bold">23</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                Add Leave Request
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
                  {
                    Id: "collapseFive",
                    Title: "Leave Type",
                    Options: [{ Label: "Annual Leave" }, { Label: "Paternity Leave" }],
                  },
                  {
                    Id: "type",
                    Title: "Status",
                    Options: [{ Label: "Approved" }, { Label: "Rejected" }],
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
      <ModalLeaveRequests />
    </>
  );
};

export default LeaveRequestsComponent;
