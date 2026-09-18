"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { LeadConversionTimeReportData } from "../../../../core/json/leadConversionTimeReportData";
import {
  ConversionSparks,
  conversionSparkOptions,
  LeadSourcesOptions,
  LeadSourcesSeries,
} from "../../../../core/json/reportChartsData";

const KPI_LABELS: Record<string, { Label: string; Value: string }> = {
  total: { Label: "Total Leads", Value: "1,248" },
  average: { Label: "Average Conversion Days", Value: "18" },
  within: { Label: "Within SLA", Value: "874" },
  breach: { Label: "SLA Breached", Value: "126" },
};

const LeadConversionTimeReportComponent = () => {
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
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <span className="avatar avatar-sm me-2">
            <ImageWithBasePath className="img-fluid rounded-circle" src={record.LeadImage} alt="User Image" />
          </span>
          {text}
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
      title: "Created Date",
      dataIndex: "CreatedDate",
      sorter: (a: any, b: any) => a.CreatedDate.length - b.CreatedDate.length,
    },
    {
      title: "Converted Date",
      dataIndex: "ConvertedDate",
      sorter: (a: any, b: any) => a.ConvertedDate.length - b.ConvertedDate.length,
    },
    {
      title: "Conversion Days",
      dataIndex: "ConversionDays",
      sorter: (a: any, b: any) => a.ConversionDays.length - b.ConversionDays.length,
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
      title="Lead Conversion Time Report"
      charts={
        <>
          <div className="row">
            {ConversionSparks.map((spark) => (
              <div className="col-xl-3 col-md-6" key={spark.key}>
                <div className="card">
                  <div className="card-body d-flex align-items-center justify-content-between gap-2">
                    <div>
                      <p className="mb-1 text-truncate">{KPI_LABELS[spark.key].Label}</p>
                      <h5 className="mb-0">{KPI_LABELS[spark.key].Value}</h5>
                    </div>
                    <Chart
                      options={conversionSparkOptions(spark.color)}
                      series={[{ name: "performance", data: spark.data }]}
                      type="area"
                      height={45}
                      width={80}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row">
            <ReportChartCard
              title="Lead Sources Vs SLA Status"
              className="col-xxl-6 col-xl-12"
              options={LeadSourcesOptions}
              series={LeadSourcesSeries}
              type="heatmap"
              height={280}
            />
          </div>
        </>
      }
      columns={columns}
      data={LeadConversionTimeReportData}
      manageColumns={["Lead ID", "Lead Name", "Source", "Created Date", "Converted Date", "Conversion Days", "Status"]}
      runFilter={{ Label: "Lead Name", Icon: "ti-user", Options: ["Elizabeth Morgan","Katherine Brooks","Sophia Lopez","John Michael","Natalie Brooks","William Turner","Ava Martinez","Nathan Reed","Lily Anderson","Ryan Coleman"] }}
      runFilterSecondary={{ Label: "Source", Icon: "ti-artboard", Options: ["Phone calls","Social Media","Referral Sites","Campaigns"], Search: true }}
      runFilterTertiary={{ Label: "SLA Status", Icon: "ti-dashboard", Options: ["Paused","On Track","At Risk","Breached"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default LeadConversionTimeReportComponent;
