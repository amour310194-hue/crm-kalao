"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import { TeamPerformanceReportData } from "../../../../core/json/teamPerformanceReportData";
import {
  TeamPerformanceSparks,
  teamPerformanceSparkOptions,
} from "../../../../core/json/reportChartsData";

/*
  Layout matches html/team-performance-report.html: four stat cards, each with a
  round icon above its label, the value on the right, a delta line beneath, and
  a full-bleed sparkline area chart across the bottom of the card.
*/
const KPIS = [
  {
    Key: "members",
    Label: "Team Performance",
    Value: "600",
    Icon: "ti-users",
    Tone: "success",
    DeltaIcon: "ti-trending-up",
    Delta: "+12%",
    DeltaTone: "success",
    DeltaLabel: "vs Last Month",
  },
  {
    Key: "pending",
    Label: "Pending Target",
    Value: "120",
    Icon: "ti-target-arrow",
    Tone: "danger",
    DeltaIcon: "ti-clock",
    Delta: "",
    DeltaTone: "danger",
    DeltaLabel: "Urgent Attention",
  },
  {
    Key: "totalDeals",
    Label: "Total Deals",
    Value: "348",
    Icon: "ti-medal",
    Tone: "indigo",
    DeltaIcon: "ti-trending-up",
    Delta: "+12%",
    DeltaTone: "success",
    DeltaLabel: "Success Rate",
  },
  {
    Key: "totalRevenue",
    Label: "Total Revenue",
    Value: "FCFA 4348",
    Icon: "ti-coin",
    Tone: "info",
    DeltaIcon: "ti-trending-up",
    Delta: "+12%",
    DeltaTone: "success",
    DeltaLabel: "Pipeline Growth",
  },
];

const TeamPerformanceReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Team ID",
      dataIndex: "TeamId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.TeamId.length - b.TeamId.length,
    },
    {
      title: "Team Name",
      dataIndex: "TeamName",
      sorter: (a: any, b: any) => a.TeamName.length - b.TeamName.length,
    },
    {
      title: "Total Members",
      dataIndex: "TotalMembers",
      sorter: (a: any, b: any) => a.TotalMembers.length - b.TotalMembers.length,
    },
    {
      title: "Total Deals",
      dataIndex: "TotalDeals",
      sorter: (a: any, b: any) => a.TotalDeals.length - b.TotalDeals.length,
    },
    {
      title: "Target Achieved",
      dataIndex: "TargetAchieved",
      render: (text: string, record: any) => (
        <span className={`badge ${record.TargetTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.TargetAchieved.length - b.TargetAchieved.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span
          className={`badge border-0 badge-pill badge-status ${record.StatusTone}`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
  ];

  return (
    <ReportShell
      title="Team Performance Report"
      badgeCount={15}
      charts={
        <div className="row row-gap-3 mb-4">
          {KPIS.map((kpi) => {
            const spark = TeamPerformanceSparks.find((s) => s.key === kpi.Key)!;
            return (
              <div
                className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12"
                key={kpi.Key}
              >
                <div className="card overflow-hidden mb-0">
                  <div className="card-body pb-0">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <div>
                        <span
                          className={`avatar avatar-lg rounded-circle bg-${kpi.Tone} flex-shrink-0 mb-2`}
                        >
                          <i className={`ti ${kpi.Icon} fs-20`} />
                        </span>
                        <div className="mb-1 fs-13 fw-medium text-dark">
                          {kpi.Label}
                        </div>
                      </div>
                      <h2 className="fs-24 fw-bold mb-0">{kpi.Value}</h2>
                    </div>
                    <p className="mb-0 fs-12 fw-medium d-flex align-items-center gap-1">
                      <span className={`text-${kpi.DeltaTone}`}>
                        <i className={`ti ${kpi.DeltaIcon}`} /> {kpi.Delta}
                      </span>
                      {kpi.DeltaLabel}
                    </p>
                  </div>
                  <Chart
                    options={teamPerformanceSparkOptions(spark.color)}
                    series={[{ name: "performance", data: spark.data }]}
                    type="area"
                    height={80}
                  />
                </div>
              </div>
            );
          })}
        </div>
      }
      columns={columns}
      data={TeamPerformanceReportData}
      manageColumns={[
        "Team ID",
        "Team Name",
        "Total Members",
        "Total Deals",
        "Target Achieved",
        "Status",
      ]}
      runFilter={{ Label: "Team Name", Icon: "ti-user", Options: ["Business Development","Brand & Communications","Application Development","Systems Engineering","Accounting & Finance","Customer Support"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-category", Options: ["Excellent","Good","Average","Poor"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default TeamPerformanceReportComponent;
