"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import Footer from "@/core/common/footer/footer";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { all_routes } from "@/router/all_routes";
import { TimesheetsListData } from "../../../../core/json/timesheetsListData";
import ModalTimesheets from "./modal/modalTimesheets";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { useLiveRows } from "@/lib/useLiveRows";
import { fetchPayRuns, markPayRunPaid, toTimesheetRow } from "@/lib/crm";
import { docHref, isLiveId } from "@/lib/docs";

const TimesheetsComponent = () => {
  const loadPay = useCallback(async () => {
    const rows = await fetchPayRuns();
    return rows ? rows.map(toTimesheetRow) : null;
  }, []);
  const { rows: data, live, reload } = useLiveRows(TimesheetsListData, loadPay);

  const columns = [
    {
      title: "Timesheet ID",
      dataIndex: "TimesheetID",
      render: (text: any, record: { key?: string }) => (
        <h6 className="d-flex align-items-center fs-14 fw-normal mb-0">
          <Link
            href={isLiveId(record.key) ? docHref("payslip", record.key) : "#"}
            data-bs-toggle={isLiveId(record.key) ? undefined : "modal"}
            data-bs-target={isLiveId(record.key) ? undefined : "#edit_timesheet"}
            target={isLiveId(record.key) ? "_blank" : undefined}
          >
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.TimesheetID.length - b.TimesheetID.length,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (text: any, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link href={all_routes.contactDetails} className="avatar me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={`assets/img/profiles/${record.EmployeeImage}`}
              alt="User Image"
            />
          </Link>
          <Link href={all_routes.contactDetails} className="d-flex flex-column">
            {text}{" "}
            <span className="text-body fs-13 fw-normal mt-1">
              {record.Role}
            </span>
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.EmployeeName.length - b.EmployeeName.length,
    },
    {
      title: "Project Name",
      dataIndex: "ProjectName",
      render: (text: any, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link href="#" className="avatar border rounded-circle p-2 me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={`assets/img/icons/${record.ProjectImage}`}
              alt="User Image"
            />
          </Link>
          <Link href="#" className="d-flex flex-column">
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.ProjectName.length - b.ProjectName.length,
    },
    {
      title: "Task",
      dataIndex: "Task",
      sorter: (a: any, b: any) => a.Task.length - b.Task.length,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      sorter: (a: any, b: any) => a.CreatedDate.length - b.CreatedDate.length,
    },
    {
      title: "Hours Worked",
      dataIndex: "HoursWorked",
      sorter: (a: any, b: any) => a.HoursWorked.length - b.HoursWorked.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: any) => (
        <span
          className={`badge badge-status ${
            text === "Approved" ? "bg-success" : "bg-purple"
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
      render: (_: any, record: any) => (
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
            {live && record.Status === "Pending" ? (
              <Link
                className="dropdown-item"
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await markPayRunPaid(record.key);
                    await reload();
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Erreur");
                  }
                }}
              >
                <i className="ti ti-checks" /> Mark as Paid
              </Link>
            ) : null}
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_timesheet"
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
            title="Timesheets"
            showModuleTile={true}
            moduleTitle="Projects"
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
              <div className="d-inline-flex align-items-center gap-3">
                <Link
                  href="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_timesheet"
                >
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Add Log
                </Link>
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={[
                  "Timesheet ID",
                  "Employee Name",
                  "Project Name",
                  "Task",
                  "Date",
                  "Hours Worked",
                  "Billable",
                  "Status",
                  "Action",
                ]}
                filters={[
                  {
                    Id: "collapseTwo",
                    Title: "Project Name",
                    Searchable: true,
                    LoadMore: true,
                    Options: [
                      { Label: "Trip Flow" },
                      { Label: "Connect Hub" },
                      { Label: "Gig Market" },
                      { Label: "Book Ease" },
                      { Label: "Retail POS" },
                    ],
                  },
                  {
                    Id: "employee",
                    Title: "Employee",
                    Searchable: true,
                    LoadMore: true,
                    Options: [
                      { Label: "Elizabeth Morgan", Avatar: "assets/img/users/user-06.jpg" },
                      { Label: "Katherine Brooks", Avatar: "assets/img/users/user-40.jpg" },
                      { Label: "Sophia Lopez", Avatar: "assets/img/users/user-05.jpg" },
                      { Label: "John Michael", Avatar: "assets/img/users/user-10.jpg" },
                      { Label: "Lily Anderson", Avatar: "assets/img/users/user-03.jpg" },
                      { Label: "Ryan Coleman", Avatar: "assets/img/users/user-18.jpg" },
                    ],
                  },
                  {
                    Id: "collapseFive",
                    Title: "Status",
                    Options: [{ Label: "Pending" }, { Label: "Approved" }],
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
      <ModalTimesheets onSaved={reload} />
    </>
  );
};

export default TimesheetsComponent;
