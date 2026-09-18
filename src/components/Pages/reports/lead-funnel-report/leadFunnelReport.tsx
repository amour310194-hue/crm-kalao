"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { LeadFunnelReportData } from "../../../../core/json/leadFunnelReportData";
import {
  LeadsFunnelOptions,
  LeadsFunnelSeries,
} from "../../../../core/json/reportChartsData";

const LeadFunnelReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Lead ID",
      dataIndex: "LeadId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.LeadId.length - b.LeadId.length,
    },
    {
      title: "Lead Name",
      dataIndex: "LeadName",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.LeadImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.LeadName.length - b.LeadName.length,
    },
    {
      title: "Source",
      dataIndex: "Source",
      sorter: (a: any, b: any) => a.Source.length - b.Source.length,
    },
    {
      title: "Campaign",
      dataIndex: "Campaign",
      sorter: (a: any, b: any) => a.Campaign.length - b.Campaign.length,
    },
    {
      title: "Lead Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span className={`badge badge-status ${record.StatusTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Lead Owner",
      dataIndex: "OwnerName",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.OwnerImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.OwnerName.length - b.OwnerName.length,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      sorter: (a: any, b: any) => a.CreatedDate.length - b.CreatedDate.length,
    },
    {
      title: "Probability",
      dataIndex: "Probability",
      sorter: (a: any, b: any) => a.Probability.length - b.Probability.length,
    },
  ];

  return (
    <ReportShell
      title="Lead Funnel Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Leads Stages by Year"
            className="col-xl-8"
            options={LeadsFunnelOptions}
            series={LeadsFunnelSeries}
            type="bar"
            height={470}
          />
        </div>
      }
      columns={columns}
      data={LeadFunnelReportData}
      manageColumns={["Lead ID", "Lead Name", "Source", "Campaign", "Lead Status", "Lead Owner", "Created Date", "Probability"]}
      runFilter={{ Label: "Lead Name", Icon: "ti-user", Options: ["Elizabeth Morgan","Katherine Brooks","Sophia Lopez","John Michael","Natalie Brooks","William Turner","Ava Martinez","Nathan Reed","Lily Anderson","Ryan Coleman"] }}
      runFilterSecondary={{ Label: "Source", Icon: "ti-artboard", Options: ["Google","Insights","Campaigns","Google"], Search: true }}
      runFilterTertiary={{ Label: "Lead Status", Icon: "ti-status-change", Options: ["Connected","Closed","Not Connected","Contacted"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default LeadFunnelReportComponent;
