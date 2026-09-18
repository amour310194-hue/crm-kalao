"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { ContractReportData } from "../../../../core/json/contractReportData";
import {
  MonthlyContractOptions,
  MonthlyContractSeries,
} from "../../../../core/json/reportChartsData";

const ContractReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Contract ID",
      dataIndex: "ContractId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.ContractId.length - b.ContractId.length,
    },
    {
      title: "Client",
      dataIndex: "Client",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.ClientImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.Client.length - b.Client.length,
    },
    {
      title: "Contract Value",
      dataIndex: "ContractValue",
      sorter: (a: any, b: any) => a.ContractValue.length - b.ContractValue.length,
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      sorter: (a: any, b: any) => a.StartDate.length - b.StartDate.length,
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      sorter: (a: any, b: any) => a.EndDate.length - b.EndDate.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span className={`badge badge-pill badge-status ${record.StatusTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
  ];

  return (
    <ReportShell
      title="Contract Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Monthly Contract trend"
            className="col-12"
            options={MonthlyContractOptions}
            series={MonthlyContractSeries}
            type="line"
            height={292}
          />
        </div>
      }
      columns={columns}
      data={ContractReportData}
      manageColumns={["Contract ID", "Client", "Contract Value", "Start Date", "End Date", "Status"]}
      runFilter={{ Label: "Client", Icon: "ti-users", Options: ["Robert Johnson","Isabella Cooper","John Smith","Sophia Parker","Ethan Reynolds","Liam Carter","Noah Mitchell"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-category", Options: ["Active","Upcoming","Rejected"] }}
      showExport
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default ContractReportComponent;
