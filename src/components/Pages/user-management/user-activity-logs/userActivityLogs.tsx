"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { UserActivityLogsListData } from "../../../../core/json/userActivityLogsListData";

const UserActivityLogsComponent = () => {
  const data = UserActivityLogsListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Log ID",
      dataIndex: "LogId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.LogId.length - b.LogId.length,
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
      title: "Action",
      dataIndex: "Action",
      sorter: (a: any, b: any) => a.Action.length - b.Action.length,
    },
    {
      title: "Module",
      dataIndex: "Module",
      sorter: (a: any, b: any) => a.Module.length - b.Module.length,
    },
    {
      title: "Record ID",
      dataIndex: "RecordId",
      sorter: (a: any, b: any) => a.RecordId.length - b.RecordId.length,
    },
    {
      title: "Action Date",
      dataIndex: "ActionDate",
      sorter: (a: any, b: any) => a.ActionDate.length - b.ActionDate.length,
    },
    {
      title: "IP Address",
      dataIndex: "IpAddress",
      sorter: (a: any, b: any) => a.IpAddress.length - b.IpAddress.length,
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
            title="User Activity Logs"
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
                  "Login ID",
                  "Action",
                  "Module",
                  "Record ID",
                  "Action Date",
                  "IP Address",
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
                    Title: "Module",
                    Options: [
                      { Label: "Deal" },
                      { Label: "Lead" },
                      { Label: "Project" },
                      { Label: "Report" },
                      { Label: "Invoice" },
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
    </>
  );
};

export default UserActivityLogsComponent;
