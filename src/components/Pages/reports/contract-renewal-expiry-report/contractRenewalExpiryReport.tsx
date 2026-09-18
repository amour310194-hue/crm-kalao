"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { ContractRenewalExpiryReportData } from "../../../../core/json/contractRenewalExpiryReportData";
import {
  RenewalExpiryOptions,
  RenewalExpirySeries,
} from "../../../../core/json/reportChartsData";

const ContractRenewalExpiryReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Contract ID",
      dataIndex: "ContractId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.ContractId.length - b.ContractId.length,
    },
    {
      title: "Contract Name",
      dataIndex: "ContractName",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.ClientImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.ContractName.length - b.ContractName.length,
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
      title: "Contract Value",
      dataIndex: "ContractValue",
      sorter: (a: any, b: any) => a.ContractValue.length - b.ContractValue.length,
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
      title="Contract Renewal & Expiry Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Renewal vs Expiry Comparision"
            className="col-12"
            options={RenewalExpiryOptions}
            series={RenewalExpirySeries}
            type="bar"
            height={292}
          />
        </div>
      }
      columns={columns}
      data={ContractRenewalExpiryReportData}
      manageColumns={["Contract ID", "Contract Name", "Start Date", "End Date", "Contract Value", "Status"]}
      runFilter={{ Label: "Contract Name", Icon: "ti-users", Options: ["NovaWave LLC","BlueSky Industries","Silver Hawk","Sophia Parker","Summit LLC","RiverStone Ltd","Brightbridge Corp"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-category", Options: ["Active","Expiring Soon","Rejected"] }}
      showExport
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default ContractRenewalExpiryReportComponent;
