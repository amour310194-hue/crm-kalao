"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import { StaffDirectoryListData } from "../../../../core/json/staffDirectoryListData";
import ModalStaffDirectory from "./modal/modalStaffDirectory";
import { useLiveRows } from "@/lib/useLiveRows";
import { fetchEmployees, toStaffListRow } from "@/lib/crm";

const route = all_routes;

const StaffDirectoryListComponent = () => {
  const loadStaff = useCallback(async () => {
    const rows = await fetchEmployees();
    return rows ? rows.map(toStaffListRow) : null;
  }, []);
  const { rows: data, reload } = useLiveRows(StaffDirectoryListData, loadStaff);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "EmployeeId",
      render: (text: string) => (
        <Link href="#" data-bs-toggle="modal" data-bs-target="#edit-modal">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.EmployeeId.length - b.EmployeeId.length,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (text: string, record: any) => (
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
      sorter: (a: any, b: any) =>
        a.EmployeeName.length - b.EmployeeName.length,
    },
    {
      title: "Role",
      dataIndex: "Role",
      sorter: (a: any, b: any) => a.Role.length - b.Role.length,
    },
    {
      title: "Department",
      dataIndex: "Department",
      render: (text: string, record: any) => (
        <span className={`badge badge-soft-${record.DepartmentTone}`}>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Department.length - b.Department.length,
    },
    {
      title: "Email",
      dataIndex: "Email",
      sorter: (a: any, b: any) => a.Email.length - b.Email.length,
    },
    {
      title: "Phone",
      dataIndex: "Phone",
      sorter: (a: any, b: any) => a.Phone.length - b.Phone.length,
    },
    {
      title: "Location",
      dataIndex: "LocationName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center mb-0">
          <Link href="#" className="avatar avatar-xss me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={record.LocationFlag}
              alt="Location"
            />
          </Link>
          {text}
        </div>
      ),
      sorter: (a: any, b: any) => a.LocationName.length - b.LocationName.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
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
            title="Staff Directory"
            showModuleTile={true}
            moduleTitle="User Management"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
              <div className="d-inline-flex align-items-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                  <Link
                    href={route.staffDirectoryList}
                    className="btn btn-sm p-2 border-0 fs-14 active"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    href={route.staffDirectoryGrid}
                    className="flex-shrink-0 btn btn-sm p-2 border-0 ms-1 fs-14"
                  >
                    <i className="ti ti-grid-dots" />
                  </Link>
                </div>
                <Link
                  href="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add-modal"
                >
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Add Staff
                </Link>
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={["Employee ID","Employee Name","Role","Department","Email","Phone","Location","Status"]}
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
                    { Label: "Natalie Brooks", Avatar: "assets/img/users/user-01.jpg" },
                  ],
                },
                {
                  Id: "owner",
                  Title: "Department Name",
                  Options: [
                    { Label: "Sales" },
                    { Label: "Marketing" },
                    { Label: "Engineering" },
                    { Label: "Designing" },
                    { Label: "Finance" },
                  ],
                },
              ]}
              />
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
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <ModalStaffDirectory onSaved={reload} />
    </>
  );
};

export default StaffDirectoryListComponent;
