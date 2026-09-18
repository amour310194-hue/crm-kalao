"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { InvitationsListData } from "../../../../core/json/invitationsListData";
import ModalInvitations from "./modal/modalInvitations";

const STATUS_TONE: Record<string, string> = {
  Accepted: "bg-success",
  Pending: "bg-warning",
  Expired: "bg-danger",
};

/*
  Stat cards from html/invitations-list.html - a bottom-border-accented card with
  a round icon on the left and the value above its label.
*/
const INVITE_KPIS = [
  { Label: "Total Invites", Value: "8956", Icon: "ti-send", Tone: "danger", Delta: "+4.12%", DeltaTone: "success" },
  { Label: "Accepted", Value: "7454", Icon: "ti-checkbox", Tone: "success", Delta: "+8.48%", DeltaTone: "success" },
  { Label: "Pending", Value: "654", Icon: "ti-checklist", Tone: "orange", Delta: "-8.22%", DeltaTone: "danger" },
  { Label: "Expired", Value: "152", Icon: "ti-calendar-x", Tone: "danger", Delta: "+20.12%", DeltaTone: "success" },
];

const InvitationsListComponent = () => {
  const data = InvitationsListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.NameImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.Name.length - b.Name.length,
    },
    {
      title: "Invite Email",
      dataIndex: "InviteEmail",
      sorter: (a: any, b: any) => a.InviteEmail.length - b.InviteEmail.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-pill badge-status ${
            STATUS_TONE[text] ?? "bg-danger"
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
            title="Invitations"
            showModuleTile={true}
            moduleTitle="User Management"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row row-gap-3 mb-4">
            {INVITE_KPIS.map((kpi) => (
              <div className="col-xl-3 col-md-6 d-flex" key={kpi.Label}>
                <div
                  className={`card flex-fill mb-0 border-0 border-5 border-bottom border-${kpi.Tone}`}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`avatar avatar-lg rounded-circle bg-${kpi.Tone} text-white`}
                        >
                          <i className={`ti ${kpi.Icon} fs-24`} />
                        </span>
                        <div>
                          <span className="d-block mb-1 fw-bold fs-16 text-dark">
                            {kpi.Value}
                          </span>
                          <p className="mb-0 fs-13">{kpi.Label}</p>
                        </div>
                      </div>
                      <span className={`badge badge-soft-${kpi.DeltaTone}`}>
                        {kpi.Delta}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                Add Invite
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={["Name","Invite Email","Date","Status","Action"]}
                filters={[
                {
                  Id: "type",
                  Title: "Name",
                  Searchable: true,
                  Options: [
                    { Label: "Jamison Reichert", Avatar: "assets/img/users/user-06.jpg" },
                    { Label: "Kobe Balistreri", Avatar: "assets/img/users/user-40.jpg" },
                    { Label: "Joaquin Jast", Avatar: "assets/img/users/user-05.jpg" },
                    { Label: "Shea Trantow", Avatar: "assets/img/users/user-10.jpg" },
                    { Label: "Gussie Crona", Avatar: "assets/img/users/user-01.jpg" },
                  ],
                },
                {
                  Id: "Status",
                  Title: "Status",
                  Options: [
                    { Label: "Accepted" },
                    { Label: "Pending" },
                    { Label: "Expired" },
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
      <ModalInvitations />
    </>
  );
};

export default InvitationsListComponent;
