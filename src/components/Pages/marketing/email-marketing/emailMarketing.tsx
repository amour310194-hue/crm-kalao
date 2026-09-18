"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { EmailMarketingListData } from "../../../../core/json/emailMarketingListData";
import ModalMarketingDelete from "../components/modalMarketingDelete";

const EmailMarketingComponent = () => {
  const data = EmailMarketingListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "List Name",
      dataIndex: "ListName",
      render: (text: string) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium">
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.ListName.length - b.ListName.length,
    },
    {
      title: "Total Contacts",
      dataIndex: "TotalContacts",
      sorter: (a: any, b: any) => a.TotalContacts.length - b.TotalContacts.length,
    },
    {
      title: "Active Subscribers",
      dataIndex: "ActiveSubscribers",
      sorter: (a: any, b: any) => a.ActiveSubscribers.length - b.ActiveSubscribers.length,
    },
    {
      title: "Bounce Rate %",
      dataIndex: "BounceRate",
      render: (text: string, record: any) => (
        <span className={`text-${record.BounceTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.BounceRate.length - b.BounceRate.length,
    },
    {
      title: "Last Campaign Date",
      dataIndex: "LastCampaignDate",
      sorter: (a: any, b: any) => a.LastCampaignDate.length - b.LastCampaignDate.length,
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
            title="Email Marketing"
            badgeCount={150}
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
                manageColumns={["List Name","Total Contacts","Active Subscribers","Bounce Rate","Last Campaign Date","Unsubscribed","Action"]}
                filters={[
                {
                  Id: "collapseTwo",
                  Title: "List Name",
                  Searchable: true,
                  Options: [
                    { Label: "Trail Users" },
                    { Label: "Promotional Offers" },
                    { Label: "Webinar Attendance" },
                    { Label: "Monthly Newsletter" },
                    { Label: "Industry News" },
                  ],
                },
                {
                  Id: "employee",
                  Title: "Last Campaign",
                  DateInput: true,
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
      <ModalMarketingDelete label="List" />
    </>
  );
};

export default EmailMarketingComponent;
