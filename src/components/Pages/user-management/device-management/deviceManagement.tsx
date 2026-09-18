"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { DeviceManagementListData } from "../../../../core/json/deviceManagementListData";

const DeviceManagementComponent = () => {
  const data = DeviceManagementListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Device ID",
      dataIndex: "DeviceId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.DeviceId.length - b.DeviceId.length,
    },
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
      title: "Device Type",
      dataIndex: "DeviceType",
      sorter: (a: any, b: any) => a.DeviceType.length - b.DeviceType.length,
    },
    {
      title: "OS & Version",
      dataIndex: "OsVersion",
      sorter: (a: any, b: any) => a.OsVersion.length - b.OsVersion.length,
    },
    {
      title: "Browser/App",
      dataIndex: "Browser",
      sorter: (a: any, b: any) => a.Browser.length - b.Browser.length,
    },
    {
      title: "IP Address",
      dataIndex: "IpAddress",
      sorter: (a: any, b: any) => a.IpAddress.length - b.IpAddress.length,
    },
    {
      title: "Last Active",
      dataIndex: "LastActive",
      sorter: (a: any, b: any) => a.LastActive.length - b.LastActive.length,
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
            <Link className="dropdown-item" href="#">
              <i className="ti ti-info-triangle text-blue me-1" /> Block
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
            title="Device Management"
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
                  "Device ID",
                  "User",
                  "Device Type",
                  "OS & Version",
                  "Browser / App",
                  "IP Address",
                  "Last Active",
                  "Location",
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
                    Id: "collapseFive",
                    Title: "Location",
                    Options: [
                      { Label: "USA", Flag: "assets/img/flags/us.svg" },
                      { Label: "UAE", Flag: "assets/img/flags/ae.svg" },
                      { Label: "Germany", Flag: "assets/img/flags/de.svg" },
                    ],
                  },
                  {
                    Id: "type",
                    Title: "Status",
                    Options: [{ Label: "Active" }, { Label: "Blocked" }],
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
    </>
  );
};

export default DeviceManagementComponent;
