"use client";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { all_routes } from "@/router/all_routes";
import { DepartmentsListData } from "../../../../core/json/departmentsListData";
import ModalDepartments from "./modal/modalDepartments";
import { useCrmList } from "@/lib/api/useCrmList";

const route = all_routes;

/*
  Card-grid view of Departments (html/departments.html). The reference hardcodes
  each card in markup; here the same cards are rendered from the shared
  departmentsListData used by the list view, so the two stay in sync.
*/
const DepartmentsComponent = () => {
  const data = useCrmList("departments", DepartmentsListData);
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
          badgeCount={data.length}
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
                  href={route.departmentsList}
                  className="btn p-2 border-0 fs-14"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  href={route.departments}
                  className="flex-shrink-0 btn p-2 border-0 ms-1 fs-14 active"
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
            <TableToolbar filters={[
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
                  Title: "Department",
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
              ]} />
            {/* table header */}
            <div className="row row-gap-3">
              {data.map((department) => (
                <div
                  className="col-xl-4 col-lg-6 col-md-6"
                  key={department.key}
                >
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                        <h4 className="fs-14 fw-semibold mb-0">
                          {department.DepartmentName}
                        </h4>
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
                                data-bs-target="#edit_department"
                              >
                                <i className="ti ti-edit me-2" />
                                Edit
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
                          </ul>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <Link href="#" className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              src={department.HeadImage}
                              alt="img"
                              className="rounded-circle"
                            />
                          </Link>
                          <div>
                            <div className="fs-14 mb-1">
                              <Link href="#" className="fw-medium">
                                {department.HeadName}
                              </Link>
                            </div>
                            <p className="text-default mb-0">Department Head</p>
                          </div>
                        </div>
                        <span
                          className={`badge ${
                            department.Status === "Restructuring"
                              ? "bg-purple"
                              : "bg-success"
                          }`}
                        >
                          {department.Status}
                        </span>
                      </div>
                      <p className="mb-0">
                        Total Members:{" "}
                        <span className="fw-normal text-dark">
                          {String(department.MembersCount).replace(/ Members| membres/gi, "")}
                        </span>
                      </p>
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
    <ModalDepartments />
  </>
  );
};

export default DepartmentsComponent;
