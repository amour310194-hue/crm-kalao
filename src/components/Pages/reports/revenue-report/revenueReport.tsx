"use client";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ReportChartCard from "../components/reportChartCard";
import { RevenueReportData } from "../../../../core/json/revenueReportData";
import {
  RevenueSplitOptions,
  RevenueSplitSeries,
  GrowthOptions,
  GrowthSeries,
} from "../../../../core/json/reportChartsData";

const RevenueReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Period",
      dataIndex: "Period",
      sorter: (a: any, b: any) => a.Period.length - b.Period.length,
    },
    {
      title: "Total Revenue",
      dataIndex: "TotalRevenue",
      sorter: (a: any, b: any) => a.TotalRevenue.length - b.TotalRevenue.length,
    },
    {
      title: "New Revenue",
      dataIndex: "NewRevenue",
      sorter: (a: any, b: any) => a.NewRevenue.length - b.NewRevenue.length,
    },
    {
      title: "Expansion Revenue",
      dataIndex: "ExpansionRevenue",
      sorter: (a: any, b: any) => a.ExpansionRevenue.length - b.ExpansionRevenue.length,
    },
    {
      title: "MRR",
      dataIndex: "Mrr",
      sorter: (a: any, b: any) => a.Mrr.length - b.Mrr.length,
    },
    {
      title: "ARR",
      dataIndex: "Arr",
      sorter: (a: any, b: any) => a.Arr.length - b.Arr.length,
    },
    {
      title: "Growth %",
      dataIndex: "Growth",
      sorter: (a: any, b: any) => a.Growth.length - b.Growth.length,
    },
    {
      title: "Churn Impact %",
      dataIndex: "ChurnImpact",
      sorter: (a: any, b: any) => a.ChurnImpact.length - b.ChurnImpact.length,
    },
  ];

  return (
    <ReportShell
      title="Revenue Report"
      charts={
        <div className="row">
          <ReportChartCard
            title="Revenue Split"
            className="col-md-12 col-xl-7"
            options={RevenueSplitOptions}
            series={RevenueSplitSeries}
            type="line"
            height={260}
          />
          <div className="col-md-12 col-xl-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Growth % Vs Churn Impact %</h5>
              </div>
              <div className="card-body">
                <div className="row row-gap-3 alig-items-center">
                  <div className="col-md-5">
                    <div className="mb-4">
                      <p className="fw-semibold mb-1 fs-13 d-flex alig-items-center">
                        <span className="me-2 rounded-3 bg-info p-1 pb-0 pe-0" />
                        Growth Impact %
                      </p>
                      <div className="mb-1 fs-20 fw-bold text-dark">+6.12</div>
                      <span>Avg revenue $313,100</span>
                    </div>
                    <div>
                      <p className="fw-semibold mb-1 fs-13 d-flex alig-items-center">
                        <span className="me-2 rounded-3 bg-orange p-1 pb-0 pe-0" />
                        Churn Impact %
                      </p>
                      <div className="mb-1 fs-20 fw-bold text-dark">-1.28</div>
                      <span>Avg revenue $313,100</span>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <Chart
                      options={GrowthOptions}
                      series={GrowthSeries}
                      type="radialBar"
                      height={279}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      columns={columns}
      data={RevenueReportData}
      manageColumns={["Period", "Total Revenue", "New Revenue", "Expansion Revenue", "MRR", "ARR", "Growth %", "Churn Impact %"]}
      runFilter={{ Label: "$50000 - $500000", Icon: "ti-currency-dollar", Options: ["$0 - $50000", "$50000 - $500000", "$500000+"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default RevenueReportComponent;
