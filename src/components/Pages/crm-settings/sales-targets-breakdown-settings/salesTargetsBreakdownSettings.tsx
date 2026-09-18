"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import { SalesTargetsBreakdownListData } from "../../../../core/json/salesTargetsBreakdownListData";

const SalesTargetsBreakdownSettingsComponent = () => {
  const data = SalesTargetsBreakdownListData;

  const columns = [
    {
      title: "Target ID",
      dataIndex: "TargetID",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.TargetID.length - b.TargetID.length,
    },
    {
      title: "Product Name",
      dataIndex: "ProductName",
      render: (text: string) => (
        <Link href="#" className="fw-medium">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.ProductName.length - b.ProductName.length,
    },
    {
      title: "Target Amount",
      dataIndex: "TargetAmount",
      sorter: (a: any, b: any) => a.TargetAmount.length - b.TargetAmount.length,
    },
    {
      title: "Weight %",
      dataIndex: "Weight",
      sorter: (a: any, b: any) => a.Weight.length - b.Weight.length,
    },
    {
      title: "Expected Contribution",
      dataIndex: "ExpectedContribution",
      sorter: (a: any, b: any) =>
        a.ExpectedContribution.length - b.ExpectedContribution.length,
    },
    {
      title: "Achieved Amount",
      dataIndex: "AchievedAmount",
      sorter: (a: any, b: any) =>
        a.AchievedAmount.length - b.AchievedAmount.length,
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
            title="Sales Target Breakdown"
            moduleTitle="CRM Settings"
            showModuleTile={true}
            showExport={true}
          />
          {/* End Page Header */}
          {/* card start */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="dropdown">
                  <Link
                    href="#"
                    className="dropdown-toggle btn btn-outline-light shadow"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort By
                  </Link>
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <Link href="#" className="dropdown-item">
                          Newest
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="dropdown-item">
                          Oldest
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <PredefinedDatePicker />
              </div>
            </div>
            <div className="card-body">
              {/* Sales Target Breakdown List */}
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
              {/* /Sales Target Breakdown List */}
            </div>
          </div>
          {/* card end */}
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

export default SalesTargetsBreakdownSettingsComponent;
