"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { LoginHistoryListData } from "../../../../core/json/loginHistoryListData";
import ModalLoginHistory from "./modal/modalLoginHistory";

const LoginHistoryComponent = () => {
  const data = LoginHistoryListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "User",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.UserImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.User.length - b.User.length,
    },
    {
      title: "Login Time",
      dataIndex: "LoginTime",
      sorter: (a: any, b: any) => a.LoginTime.length - b.LoginTime.length,
    },
    {
      title: "Logout Time",
      dataIndex: "LogoutTime",
      sorter: (a: any, b: any) => a.LogoutTime.length - b.LogoutTime.length,
    },
    {
      title: "Session Duration",
      dataIndex: "SessionDuration",
      sorter: (a: any, b: any) =>
        a.SessionDuration.length - b.SessionDuration.length,
    },
    {
      title: "IP Address",
      dataIndex: "IpAddress",
      sorter: (a: any, b: any) => a.IpAddress.length - b.IpAddress.length,
    },
    {
      title: "Device",
      dataIndex: "Device",
      sorter: (a: any, b: any) => a.Device.length - b.Device.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-pill badge-status ${
            text === "Success" ? "bg-success" : "bg-danger"
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
            <Link className="dropdown-item" href="#">
              <i className="ti ti-refresh text-blue" /> Clear History
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
            title="Login History"
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
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={[
                  "User",
                  "Login Time",
                  "Logout Time",
                  "Session duration",
                  "IP Address",
                  "Device",
                  "Status",
                  "Action",
                ]}
                filters={[
                  {
                    Id: "collapseTwo",
                    Title: "User",
                    Searchable: true,
                    LoadMore: true,
                    Options: [
                      { Label: "Elizabeth Morgan", Avatar: "assets/img/users/user-06.jpg" },
                      { Label: "Katherine Brooks", Avatar: "assets/img/users/user-40.jpg" },
                      { Label: "Sophia Lopez", Avatar: "assets/img/users/user-05.jpg" },
                      { Label: "John Michael", Avatar: "assets/img/users/user-10.jpg" },
                    ],
                  },
                  {
                    Id: "type",
                    Title: "Browser",
                    Options: [
                      { Label: "Chrome/Windows" },
                      { Label: "Edge/Windows" },
                      { Label: "Safari/macOS" },
                      { Label: "Firefox/Windows" },
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
      <ModalLoginHistory />
    </>
  );
};

export default LoginHistoryComponent;
