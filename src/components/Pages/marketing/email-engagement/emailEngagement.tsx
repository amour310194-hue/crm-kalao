"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { EmailEngagementListData } from "../../../../core/json/emailEngagementListData";
import ModalMarketingDelete from "../components/modalMarketingDelete";

const EmailEngagementComponent = () => {
  const data = EmailEngagementListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Period",
      dataIndex: "Period",
      sorter: (a: any, b: any) => a.Period.length - b.Period.length,
    },
    {
      title: "Email Sent",
      dataIndex: "EmailSent",
      sorter: (a: any, b: any) => a.EmailSent.length - b.EmailSent.length,
    },
    {
      title: "Open",
      dataIndex: "Open",
      sorter: (a: any, b: any) => a.Open.length - b.Open.length,
    },
    {
      title: "Clicks",
      dataIndex: "Clicks",
      sorter: (a: any, b: any) => a.Clicks.length - b.Clicks.length,
    },
    {
      title: "Replies",
      dataIndex: "Replies",
      sorter: (a: any, b: any) => a.Replies.length - b.Replies.length,
    },
    {
      title: "Engagement Rate %",
      dataIndex: "EngagementRate",
      render: (text: string, record: any) => (
        <span className={`text-${record.EngagementTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.EngagementRate.length - b.EngagementRate.length,
    },
    {
      title: "",
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
            title="Email Engagement"
            badgeCount={125}
            showModuleTile={true}
            moduleTitle="Marketing"
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
                manageColumns={["Period","Email Sent","Open","Clicks","Replies","Engagement Rate","Action"]}
                filters={[]}
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
      <ModalMarketingDelete label="Record" />
    </>
  );
};

export default EmailEngagementComponent;
