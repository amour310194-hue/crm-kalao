"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { DealConversionReportData } from "../../../../core/json/dealConversionReportData";
import {
  EstimationTrendOptions,
  EstimationTrendSeries,
  DealsStatusOptions,
  DealsStatusSeries,
} from "../../../../core/json/reportChartsData";

const DealConversionReportComponent = () => {
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
      sorter: (a: any, b: any) => a.DealName.length - b.DealName.length,
    },
    {
      title: "Deal Value",
      dataIndex: "DealValue",
      sorter: (a: any, b: any) => a.DealValue.length - b.DealValue.length,
    },
    {
      title: "Discount %",
      dataIndex: "Discount",
      sorter: (a: any, b: any) => a.Discount.length - b.Discount.length,
    },
    {
      title: "Final Value",
      dataIndex: "FinalValue",
      sorter: (a: any, b: any) => a.FinalValue.length - b.FinalValue.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span className={`badge badge-status ${record.StatusTone}`}>{text}</span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Owner",
      dataIndex: "Owner",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath className="rounded-circle" src={record.OwnerImage} alt="User Image" />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.Owner.length - b.Owner.length,
    },
    {
      title: "Closed Date",
      dataIndex: "ClosedDate",
      sorter: (a: any, b: any) => a.ClosedDate.length - b.ClosedDate.length,
    },
    {
      title: "Win Probability",
      dataIndex: "WinProbability",
      sorter: (a: any, b: any) => a.WinProbability.length - b.WinProbability.length,
    },
  ];

  return (
    <ReportShell
      title="Deal Conversion Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="No of Deals"
            className="col-xxl-7 col-xl-7"
            options={EstimationTrendOptions}
            series={EstimationTrendSeries}
            type="bar"
            height={375}
          />
          <ReportChartCard
            title="Deal Status"
            className="col-xxl-5 col-xl-5"
            options={DealsStatusOptions}
            series={DealsStatusSeries}
            type="pie"
            height={350}
          />
        </div>
      }
      columns={columns}
      data={DealConversionReportData}
      manageColumns={["Deal ID", "Deal Name", "Deal Value", "Discount %", "Final Value", "Status", "Owner", "Closed Date", "Win Probability"]}
      runFilter={{ Label: "Deal Name", Icon: "ti-medal", Options: ["Annual Software Subscription","CRM Onboarding Package","Enterprise Plan Upgrade","BrightWorks Campaign","Sales Pipeline Optimization","CRM Migration Project"] }}
      runFilterSecondary={{ Label: "Owner", Icon: "ti-user", Options: ["Elizabeth Morgan","Katherine Brooks","Sophia Lopez","John Michael","Natalie Brooks","William Turner"], Search: true }}
      runFilterTertiary={{ Label: "Status", Icon: "ti-status-change", Options: ["Won","Lost","Open"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default DealConversionReportComponent;
