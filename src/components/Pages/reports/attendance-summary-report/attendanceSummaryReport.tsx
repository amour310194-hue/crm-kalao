"use client";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import { AttendanceSummaryReportData } from "../../../../core/json/attendanceSummaryReportData";
import {
  AttendanceSparkSeries,
  attendanceSparkOptions,
} from "../../../../core/json/reportChartsData";

/*
  Stat cards from html/attendance-summary-report.html: a soft gradient card with
  a white icon tile, label + tinted value, then a delta line on the left and the
  sparkline bar chart tucked to the right.
*/
const KPIS = [
  { Key: "blue" as const, Label: "Total Employees", Value: "256", Icon: "ti-users", Tone: "indigo", Bg: "bg-info-gradient-6", Delta: "+12" },
  { Key: "green" as const, Label: "Present Today", Value: "156", Icon: "ti-user-check", Tone: "success", Bg: "bg-success-gradient-6", Delta: "+11" },
  { Key: "purple" as const, Label: "Absent Today", Value: "20", Icon: "ti-user-x", Tone: "purple", Bg: "bg-purple-gradient-6", Delta: "+16" },
  { Key: "red" as const, Label: "Late Arrival", Value: "30", Icon: "ti-user-down", Tone: "danger", Bg: "bg-danger-gradient-6", Delta: "+11" },
];

const AttendanceSummaryReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    { title: "Period", dataIndex: "Period", sorter: (a: any, b: any) => a.Period.length - b.Period.length },
    { title: "Total Working Days", dataIndex: "TotalWorkingDays", sorter: (a: any, b: any) => a.TotalWorkingDays.length - b.TotalWorkingDays.length },
    { title: "Present Days", dataIndex: "PresentDays", sorter: (a: any, b: any) => a.PresentDays.length - b.PresentDays.length },
    { title: "Absent Days", dataIndex: "AbsentDays", sorter: (a: any, b: any) => a.AbsentDays.length - b.AbsentDays.length },
    { title: "Late Entries", dataIndex: "LateEntries", sorter: (a: any, b: any) => a.LateEntries.length - b.LateEntries.length },
    { title: "Average Work Hours", dataIndex: "AverageWorkHours", sorter: (a: any, b: any) => a.AverageWorkHours.length - b.AverageWorkHours.length },
    { title: "Attendance Rate", dataIndex: "AttendanceRate", sorter: (a: any, b: any) => a.AttendanceRate.length - b.AttendanceRate.length },
  ];

  return (
    <ReportShell
      title="Attendance Summary Report"
      showHeaderDateRange={false}
      charts={
        <div className="row row-gap-3 mb-4">
          {KPIS.map((kpi) => (
            <div
              className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12"
              key={kpi.Label}
            >
              <div className={`card overflow-hidden ${kpi.Bg} mb-0 border-0`}>
                <div className="card-body">
                  <div className="d-flex align-items-start flex-wrap gap-2 mb-2">
                    <div className={`avatar rounded-lg bg-white text-${kpi.Tone} fs-20`}>
                      <i className={`ti ${kpi.Icon}`} />
                    </div>
                    <div>
                      <p className="text-dark mb-1 fs-13 fw-medium">
                        {kpi.Label}
                      </p>
                      <h2 className={`fs-28 text-${kpi.Tone} mb-0`}>
                        {kpi.Value}
                      </h2>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`text-${kpi.Tone}`}>
                        <i className="ti ti-trending-up" />
                      </span>
                      <p className="d-flex align-items-center fw-medium mb-0 gap-1 text-dark">
                        <span className={`text-${kpi.Tone}`}>{kpi.Delta}</span>{" "}
                        vs Last Week
                      </p>
                    </div>
                    <Chart
                      options={attendanceSparkOptions(kpi.Key)}
                      series={AttendanceSparkSeries}
                      type="bar"
                      height={40}
                      width={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      columns={columns}
      data={AttendanceSummaryReportData}
      manageColumns={[
        "Period",
        "Total Working Days",
        "Present Days",
        "Absent Days",
        "Late Entries",
        "Average Work Hours",
        "Attendance Rate",
      ]}
      runFilter={{ Label: "Working Days", Icon: "ti-rotate-clockwise-2", Options: ["20 Days","21 Days","22 Days","23 Days","24 Days","25 Days"] }}
      runFilterSecondary={{ Label: "Attendance Rate", Icon: "ti-layout-grid", Options: ["100%","85%","80%","40%","30%","20%"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default AttendanceSummaryReportComponent;
