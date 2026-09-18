"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { ProposalConversionRateReportData } from "../../../../core/json/proposalConversionRateReportData";
import {
  ProposalConversionOptions,
  ProposalConversionSeries,
} from "../../../../core/json/reportChartsData";

const ProposalConversionRateReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Proposal ID",
      dataIndex: "ProposalId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.ProposalId.length - b.ProposalId.length,
    },
    {
      title: "Client",
      dataIndex: "Client",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.Avatar} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.Client.length - b.Client.length,
    },
    {
      title: "Value",
      dataIndex: "Value",
      sorter: (a: any, b: any) => a.Value.length - b.Value.length,
    },
    {
      title: "Probability",
      dataIndex: "Probability",
      render: (text: string, record: any) => (
        <span className={`badge ${record.ProbabilityTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Probability.length - b.Probability.length,
    },
    {
      title: "Timeline",
      dataIndex: "Timeline",
      sorter: (a: any, b: any) => a.Timeline.length - b.Timeline.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span className={`badge border-0 badge-pill badge-status ${record.StatusTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
  ];

  return (
    <ReportShell
      title="Proporsal Conversion Trend Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Proporsal Conversion Trend"
            className="col-12"
            options={ProposalConversionOptions}
            series={ProposalConversionSeries}
            type="line"
            height={350}
          />
        </div>
      }
      columns={columns}
      data={ProposalConversionRateReportData}
      manageColumns={["Proposal ID", "Client", "Value", "Probability", "Timeline", "Status"]}
      runFilter={{ Label: "Client", Icon: "ti-users", Options: ["Robert Johnson","Isabella Cooper","John Smith","Sophia Parker","Ethan Reynolds","Liam Carter"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-layout-grid", Options: ["Approved","Sent","Under Review","Rejected"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default ProposalConversionRateReportComponent;
