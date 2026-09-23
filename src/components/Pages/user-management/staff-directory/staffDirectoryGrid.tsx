"use client";
import Link from "next/link";
import { useCallback } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { all_routes } from "@/router/all_routes";
import { StaffDirectoryListData } from "../../../../core/json/staffDirectoryListData";
import ModalStaffDirectory from "./modal/modalStaffDirectory";
import { useLiveRows } from "@/lib/useLiveRows";
import { fetchEmployees, toStaffListRow } from "@/lib/crm";
import { docHref, isLiveId } from "@/lib/docs";

const route = all_routes;

/*
  Card-grid view of the Staff Directory (html/staff-directory-grid.html). The
  reference hardcodes each card in markup; here the same cards render from the
  shared staffDirectoryListData used by the list view, so the two stay in sync.
*/
const StaffDirectoryGridComponent = () => {
  const loadStaff = useCallback(async () => {
    const rows = await fetchEmployees();
    return rows ? rows.map(toStaffListRow) : null;
  }, []);
  const { rows: data, reload } = useLiveRows(StaffDirectoryListData, loadStaff);
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
              <input type="text" className="form-control" placeholder="Search" />
            </div>
            <div className="d-inline-flex align-items-center flex-wrap gap-3">
              <div className="d-inline-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                <Link
                  href={route.staffDirectoryList}
                  className="btn btn-sm p-2 border-0 fs-14"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  href={route.staffDirectoryGrid}
                  className="flex-shrink-0 btn btn-sm p-2 border-0 ms-1 fs-14 active"
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
            <TableToolbar filters={[
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
              ]} />
            {/* table header */}
            <div className="row row-gap-3">
              {data.map((staff) => (
                <div className="col-xl-4 col-md-6" key={staff.key}>
                  <div className="card border shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <Link
                            href={isLiveId(staff.key) ? docHref("employment", staff.key) : route.contactDetails}
                            className="avatar avatar-md flex-shrink-0 me-2 position-relative"
                            target={isLiveId(staff.key) ? "_blank" : undefined}
                          >
                            <ImageWithBasePath
                              src={staff.EmployeeImage}
                              alt="img"
                              className="rounded-circle"
                            />
                            <span className="online text-success position-absolute end-0 bottom-0 fs-8">
                              <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white" />
                            </span>
                          </Link>
                          <div>
                            <div className="fs-14 mb-1 text-dark">
                              <Link
                                href={isLiveId(staff.key) ? docHref("employment", staff.key) : route.contactDetails}
                                className="fw-semibold"
                                target={isLiveId(staff.key) ? "_blank" : undefined}
                              >
                                {staff.EmployeeName}
                              </Link>
                            </div>
                            <p className="text-default mb-0 fs-13">
                              {staff.Email}
                            </p>
                          </div>
                        </div>
                        <div className="dropdown table-action">
                          <Link
                            href="#"
                            className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
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
                      </div>
                      <div className="bg-light p-3 border rounded">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span>
                            <i className="ti ti-briefcase text-dark" /> Role
                          </span>
                          <span className="fw-medium text-dark">
                            {staff.Role}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-0">
                          <span>
                            <i className="ti ti-float-center text-dark" />{" "}
                            Department
                          </span>
                          <span className="fw-medium text-dark">
                            {staff.Department}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default StaffDirectoryGridComponent;
