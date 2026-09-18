"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import { DealAgingReportData } from "../../../../core/json/dealAgingReportData";
import {
  DealAgingOptions,
  DealAgingSeries,
  DealRiskLevelOptions,
  DealRiskLevelSeries,
} from "../../../../core/json/reportChartsData";

/* Legend under the Risk Level Split donut (html/deal-aging-report.html). */
const RISK_LEGEND = [
  { Label: "Critical", Count: "16 Deals", Tone: "purple" },
  { Label: "Medium", Count: "67 Deals", Tone: "warning" },
  { Label: "High", Count: "24 Deals", Tone: "danger" },
  { Label: "Low", Count: "34 Deals", Tone: "success" },
];

const DealAgingReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Deal ID",
      dataIndex: "DealId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.DealId.length - b.DealId.length,
    },
    {
      title: "Deal Name",
      dataIndex: "DealName",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.DealName.length - b.DealName.length,
    },
    {
      title: "Stage",
      dataIndex: "Stage",
      sorter: (a: any, b: any) => a.Stage.length - b.Stage.length,
    },
    {
      title: "Days in Stage",
      dataIndex: "DaysInStage",
      sorter: (a: any, b: any) => a.DaysInStage.length - b.DaysInStage.length,
    },
    {
      title: "Stage SLA Days",
      dataIndex: "StageSlaDays",
      sorter: (a: any, b: any) => a.StageSlaDays.length - b.StageSlaDays.length,
    },
    {
      title: "Aging Bucket",
      dataIndex: "AgingBucket",
      sorter: (a: any, b: any) => a.AgingBucket.length - b.AgingBucket.length,
    },
    {
      title: "Risk Level",
      dataIndex: "RiskLevel",
      render: (text: string, record: any) => (
        <span className={`badge badge-pill badge-status ${record.RiskTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.RiskLevel.length - b.RiskLevel.length,
    },
    {
      title: "Closed Date",
      dataIndex: "ClosedDate",
      sorter: (a: any, b: any) => a.ClosedDate.length - b.ClosedDate.length,
    },
  ];

  return (
    <ReportShell
      title="Deal Aging Vs Conversion Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Deal Aging Vs Conversion"
            className="col-md-12 col-xl-7"
            options={DealAgingOptions}
            series={DealAgingSeries}
            type="scatter"
            height={390}
          />
          <div className="col-md-12 col-xl-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Risk Level Split</h5>
              </div>
              <div className="card-body">
                <Chart
                  options={DealRiskLevelOptions}
                  series={DealRiskLevelSeries}
                  type="donut"
                  height={350}
                />
                <div className="row g-4 mt-2">
                  {RISK_LEGEND.map((l) => (
                    <div
                      className="col-md-6 d-flex align-items-center justify-content-between"
                      key={l.Label}
                    >
                      <div className="d-flex align-items-center">
                        <span
                          className={`me-2 rounded-3 bg-${l.Tone} p-1 py-2 pe-0`}
                        />
                        <span className="mb-0 text-dark">{l.Label}</span>
                      </div>
                      <span
                        className={`badge badge-tag badge-soft-${l.Tone} text-${l.Tone}`}
                      >
                        {l.Count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      columns={columns}
      data={DealAgingReportData}
      manageColumns={["Deal ID", "Deal Name", "Stage", "Days in Stage", "Stage SLA Days", "Aging Bucket", "Risk Level", "Closed Date"]}
      runFilter={{ Label: "Deal Name", Icon: "ti-medal", Options: ["Annual Software Subscription","CRM Onboarding Package","Enterprise Plan Upgrade","BrightWorks Campaign","Sales Pipeline Optimization","CRM Migration Project","Multi-Store License Renewal"] }}
      runFilterSecondary={{ Label: "Risk Level", Icon: "ti-dashboard", Options: ["High","Medium","Critical","Low"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default DealAgingReportComponent;
