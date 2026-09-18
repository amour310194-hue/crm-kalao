"use client";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import { PipelineStageReportData } from "../../../../core/json/pipelineStageReportData";
import {
  PipelineStageOptions,
  PipelineStageSeries,
  WinRateOptions,
  WinRateSeries,
} from "../../../../core/json/reportChartsData";

const PipelineStageReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Stage",
      dataIndex: "Stage",
      sorter: (a: any, b: any) => a.Stage.length - b.Stage.length,
    },
    {
      title: "Total Deals",
      dataIndex: "TotalDeals",
      sorter: (a: any, b: any) => a.TotalDeals.length - b.TotalDeals.length,
    },
    {
      title: "Pipeline Value",
      dataIndex: "PipelineValue",
      sorter: (a: any, b: any) => a.PipelineValue.length - b.PipelineValue.length,
    },
    {
      title: "Avg Deal Size",
      dataIndex: "AvgDealSize",
      sorter: (a: any, b: any) => a.AvgDealSize.length - b.AvgDealSize.length,
    },
    {
      title: "Win Rate",
      dataIndex: "WinRate",
      sorter: (a: any, b: any) => a.WinRate.length - b.WinRate.length,
    },
    {
      title: "Avg Days in Stage",
      dataIndex: "AvgDaysInStage",
      sorter: (a: any, b: any) => a.AvgDaysInStage.length - b.AvgDaysInStage.length,
    },
  ];

  return (
    <ReportShell
      title="Pipeline Stage Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="No of Deals"
            className="col-md-12 col-xl-7"
            options={PipelineStageOptions}
            series={PipelineStageSeries}
            type="area"
            height={340}
          />
          <ReportChartCard
            title="Win Rate"
            className="col-md-12 col-xl-5"
            options={WinRateOptions}
            series={WinRateSeries}
            type="radar"
            height={340}
          />
        </div>
      }
      columns={columns}
      data={PipelineStageReportData}
      manageColumns={["Stage", "Total Deals", "Pipeline Value", "Avg Deal Size", "Win Rate", "Avg Days in Stage"]}
      runFilter={{ Label: "Deal Name", Icon: "ti-medal", Options: ["Quality To Buy","Contact Made","Presentation","Proposal Made","Appointment"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default PipelineStageReportComponent;
