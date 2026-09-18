"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { TeamsListData } from "../../../../core/json/teamsListData";
import ModalTeams from "./modal/modalTeams";

const TeamsListComponent = () => {
  const data = TeamsListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Team ID",
      dataIndex: "TeamId",
      render: (text: string) => (
        <Link href="#" data-bs-toggle="modal" data-bs-target="#edit-modal">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.TeamId.length - b.TeamId.length,
    },
    {
      title: "Team Name",
      dataIndex: "TeamName",
      sorter: (a: any, b: any) => a.TeamName.length - b.TeamName.length,
    },
    {
      title: "Team Lead",
      dataIndex: "TeamLead",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.TeamLeadImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.TeamLead.length - b.TeamLead.length,
    },
    {
      title: "Members Count",
      dataIndex: "MembersCount",
      sorter: (a: any, b: any) =>
        a.MembersCount.length - b.MembersCount.length,
    },
    {
      title: "Target Revenue",
      dataIndex: "TargetRevenue",
      sorter: (a: any, b: any) =>
        a.TargetRevenue.length - b.TargetRevenue.length,
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
            title="Teams"
            badgeCount={150}
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
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-modal"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Team
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={["Team ID","Team Name","Team Lead","Members Count","Target Revenue","Status","Action"]}
                filters={[
                {
                  Id: "team",
                  Title: "Team Name",
                  Searchable: true,
                  Options: [
                    { Label: "Customer Success" },
                    { Label: "Product Strategy" },
                    { Label: "Business Operations" },
                    { Label: "Legal & Compliance" },
                    { Label: "Business Intelligence" },
                  ],
                },
                {
                  Id: "type",
                  Title: "Team Lead",
                  Searchable: true,
                  Options: [
                    { Label: "Jamison Reichert", Avatar: "assets/img/users/user-06.jpg" },
                    { Label: "Kobe Balistreri", Avatar: "assets/img/users/user-40.jpg" },
                    { Label: "Joaquin Jast", Avatar: "assets/img/users/user-05.jpg" },
                  ],
                },
                {
                  Id: "order",
                  Title: "Order Status",
                  Options: [
                    { Label: "Active" },
                    { Label: "Inactive" },
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
      <ModalTeams />
    </>
  );
};

export default TeamsListComponent;
