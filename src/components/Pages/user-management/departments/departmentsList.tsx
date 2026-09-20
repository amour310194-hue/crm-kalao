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
import { DepartmentsListData } from "../../../../core/json/departmentsListData";
import ModalDepartments from "./modal/modalDepartments";
import { useLiveRows } from "@/lib/useLiveRows";
import { fetchDepartments, toDepartmentsListRow } from "@/lib/crm";

const route = all_routes;

const DepartmentsListComponent = () => {
  const loadDepartments = useCallback(async () => {
    const rows = await fetchDepartments();
    return rows ? rows.map(toDepartmentsListRow) : null;
  }, []);
  const { rows: data } = useLiveRows(DepartmentsListData, loadDepartments);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Department ID",
      dataIndex: "DepartmentId",
      render: (text: string) => (
        <h6 className="fs-14 fw-normal mb-0">
          <Link href="#" data-bs-toggle="modal" data-bs-target="#edit_department">
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) =>
        a.DepartmentId.length - b.DepartmentId.length,
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      sorter: (a: any, b: any) =>
        a.DepartmentName.length - b.DepartmentName.length,
    },
    {
      title: "Department Head",
      dataIndex: "HeadName",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link href="#" className="d-flex align-items-center">
            <span className="avatar avatar-xs me-2">
              <ImageWithBasePath
                className="img-fluid rounded-circle"
                src={record.HeadImage}
                alt="User Image"
              />
            </span>
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.HeadName.length - b.HeadName.length,
    },
    {
      title: "Members Count",
      dataIndex: "MembersCount",
      sorter: (a: any, b: any) =>
        a.MembersCount.length - b.MembersCount.length,
    },
    {
      title: "Location",
      dataIndex: "Location",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <ImageWithBasePath
            src={record.LocationFlag}
            className="me-2 flag-img"
            alt="Flag"
            width={20}
          />
          {text}
        </div>
      ),
      sorter: (a: any, b: any) => a.Location.length - b.Location.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-status ${
            text === "Restructuring" ? "bg-purple" : "bg-success"
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
              data-bs-target="#edit_department"
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
            title="Departments"
            badgeCount={125}
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
                    href={route.departmentsList}
                    className="btn p-2 border-0 fs-14 active"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    href={route.departments}
                    className="flex-shrink-0 btn p-2 border-0 ms-1 fs-14"
                  >
                    <i className="ti ti-grid-dots" />
                  </Link>
                </div>
                <Link
                  href="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_department"
                >
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Add Department
                </Link>
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={["Department ID","Department Name","Department Head","Members Count","Associated Teams","Location","Status","Action"]}
                filters={[
                {
                  Id: "collapseThree",
                  Title: "Department Name",
                  Searchable: true,
                  Options: [
                    { Label: "Sales" },
                    { Label: "Engineering" },
                    { Label: "Marketing" },
                    { Label: "Designing" },
                    { Label: "Finance" },
                  ],
                },
                {
                  Id: "collapseTwo",
                  Title: "Department Head",
                  Searchable: true,
                  LoadMore: true,
                  Options: [
                    { Label: "Elizabeth Morgan", Avatar: "assets/img/users/user-06.jpg" },
                    { Label: "Katherine Brooks", Avatar: "assets/img/users/user-40.jpg" },
                    { Label: "Sophia Lopez", Avatar: "assets/img/users/user-05.jpg" },
                    { Label: "John Michael", Avatar: "assets/img/users/user-10.jpg" },
                    { Label: "Natalie Brooks", Avatar: "assets/img/users/user-01.jpg" },
                    { Label: "William Turner", Avatar: "assets/img/users/user-12.jpg" },
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
      <ModalDepartments />
    </>
  );
};

export default DepartmentsListComponent;
