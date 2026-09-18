"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { LeadAgingReportData } from "../../../../core/json/leadAgingReportData";
import {
  LeadRiskLevelOptions,
  LeadRiskLevelSeries,
  AgingBucketOptions,
  AgingBucketSeries,
} from "../../../../core/json/reportChartsData";

const LeadAgingReportComponent = () => {
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
      title: "Current Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span className={`badge badge-status ${record.StatusTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Days in Status",
      dataIndex: "DaysInStatus",
      sorter: (a: any, b: any) => a.DaysInStatus.length - b.DaysInStatus.length,
    },
    {
      title: "Aging Bucket",
      dataIndex: "AgingBucket",
      sorter: (a: any, b: any) => a.AgingBucket.length - b.AgingBucket.length,
    },
    {
      title: "Last Activity",
      dataIndex: "LastActivity",
      sorter: (a: any, b: any) => a.LastActivity.length - b.LastActivity.length,
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
      title: "Risk Level",
      dataIndex: "RiskLevel",
      render: (text: string, record: any) => (
        <span className={`badge border-0 badge-pill badge-status ${record.RiskTone}`}>
          <i className="ti ti-point-filled fs-12 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.RiskLevel.length - b.RiskLevel.length,
    },
  ];

  return (
    <ReportShell
      title="Lead Aging Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Risk Level Split"
            className="col-xl-5"
            options={LeadRiskLevelOptions}
            series={LeadRiskLevelSeries}
            type="donut"
            height={300}
          />
          <ReportChartCard
            title="Aging Bucket Split"
            className="col-xl-7"
            options={AgingBucketOptions}
            series={AgingBucketSeries}
            type="bar"
            height={380}
          />
        </div>
      }
      columns={columns}
      data={LeadAgingReportData}
      manageColumns={["Lead ID", "Lead Name", "Current Status", "Days in Status", "Aging Bucket", "Last Activity", "Lead Owner", "Risk Level"]}
      runFilter={{ Label: "Lead Name", Icon: "ti-user", Options: ["Elizabeth Morgan","Katherine Brooks","Sophia Lopez","John Michael","Natalie Brooks","William Turner","Ava Martinez","Nathan Reed","Lily Anderson","Ryan Coleman"] }}
      runFilterSecondary={{ Label: "Lead Status", Icon: "ti-status-change", Options: ["Connected","Closed","Not Connected","Contacted"] }}
      runFilterTertiary={{ Label: "Risk Level", Icon: "ti-dashboard", Options: ["Critical","High","Low"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default LeadAgingReportComponent;
