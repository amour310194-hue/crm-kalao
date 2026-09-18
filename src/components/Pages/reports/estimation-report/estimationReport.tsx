"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { EstimationReportData } from "../../../../core/json/estimationReportData";
import {
  MonthlyEstimationOptions,
  MonthlyEstimationSeries,
  PerformanceMetricsOptions,
  PerformanceMetricsSeries,
} from "../../../../core/json/reportChartsData";

const EstimationReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Estimation ID",
      dataIndex: "EstimationId",
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.EstimationId.length - b.EstimationId.length,
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
      title: "Estimation Date",
      dataIndex: "EstimationDate",
      sorter: (a: any, b: any) => a.EstimationDate.length - b.EstimationDate.length,
    },
    {
      title: "Estimation Value",
      dataIndex: "EstimationValue",
      sorter: (a: any, b: any) => a.EstimationValue.length - b.EstimationValue.length,
    },
    {
      title: "Created By",
      dataIndex: "CreatedBy",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.CreatedByImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.CreatedBy.length - b.CreatedBy.length,
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
      title="Estimation Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Monthly Estimation"
            className="col-md-12 col-xl-7"
            options={MonthlyEstimationOptions}
            series={MonthlyEstimationSeries}
            type="area"
            height={280}
          />
          <ReportChartCard
            title="Performance Metrics"
            className="col-md-12 col-xl-5"
            options={PerformanceMetricsOptions}
            series={PerformanceMetricsSeries}
            type="radialBar"
            height={350}
          />
        </div>
      }
      columns={columns}
      data={EstimationReportData}
      manageColumns={["Estimation ID", "Client", "Estimation Date", "Estimation Value", "Created By", "Status"]}
      runFilter={{ Label: "Client Name", Icon: "ti-users", Options: ["Robert Johnson","Isabella Cooper","John Smith","Sophia Parker","Ethan Reynolds","Liam Carter","Noah Mitchell"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-category", Options: ["Active","Expiring Soon","Rejected"] }}
      showExport
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default EstimationReportComponent;
