"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import {
  MilestonesListData,
  type MilestoneData,
} from "../../../../core/json/milestonesListData";
import ModalMilestones from "./modal/modalMilestones";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";

const MilestonesComponent = () => {
  const data = MilestonesListData;

  const columns = [
    {
      title: "Project Name",
      dataIndex: "ProjectName",
      render: (text: string, record: MilestoneData) => (
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
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.ProjectName.length - b.ProjectName.length,
    },
    {
      title: "Milestone ID",
      dataIndex: "MilestoneId",
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.MilestoneId.length - b.MilestoneId.length,
    },
    {
      title: "Milestone Name",
      dataIndex: "MilestoneName",
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.MilestoneName.length - b.MilestoneName.length,
    },
    {
      title: "Due Date",
      dataIndex: "DueDate",
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.DueDate.length - b.DueDate.length,
    },
    {
      title: "Completion",
      dataIndex: "Completion",
      render: (text: number) => (
        <div className="pipeline-progress d-flex align-items-center">
          <div
            className="progress bg-light"
            style={{ width: "100px", marginRight: "10px" }}
          >
            <div
              className={`progress-bar ${
                text === 100 ? "bg-success" : "bg-warning"
              }`}
              role="progressbar"
              style={{ width: `${text}%` }}
              aria-valuenow={text}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-body">{text}%</span>
        </div>
      ),
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.Completion - b.Completion,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-status ${
            text === "Completed" ? "bg-success" : "bg-purple"
          }`}
        >
          {text}
        </span>
      ),
      sorter: (a: MilestoneData, b: MilestoneData) =>
        a.Status.length - b.Status.length,
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
              data-bs-target="#edit_milestone"
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
            title="Milestones"
            badgeCount={false}
            showModuleTile={true}
            moduleTitle="Projects"
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
              <div className="d-inline-flex align-items-center gap-3">
                <Link
                  href="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_milestone"
                >
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Add Milestone
                </Link>
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={[
                  "Project Name",
                  "Milestone ID",
                  "Milestone Name",
                  "Due Date",
                  "Completion",
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
                    Title: "Assignee",
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
      <ModalMilestones />
    </>
  );
};

export default MilestonesComponent;
