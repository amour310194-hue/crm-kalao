"use client";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import { LeaveBalanceSummaryReportData } from "../../../../core/json/leaveBalanceSummaryReportData";
import {
  LeaveBalanceGauges,
  leaveBalanceGaugeOptions,
} from "../../../../core/json/reportChartsData";

/*
  Stat cards from html/leave-balance-summary-report.html: a coloured icon tile
  with the label beneath it, the half-gauge to its right, then the value and a
  soft status pill below a divider.
*/
const KPIS = [
  { Label: "Total Allocated", Value: "254", Icon: "ti-sort-ascending-2", Tone: "success", Status: "Active" },
  { Label: "Leave Used", Value: "37", Icon: "ti-user-x", Tone: "pink", Status: "In Use" },
  { Label: "Available Leave", Value: "204", Icon: "ti-brand-gravatar", Tone: "purple", Status: "Available" },
  { Label: "Pending Request", Value: "6", Icon: "ti-clock-share", Tone: "danger", Status: "Pending" },
];

const LeaveBalanceSummaryReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    { title: "Leave Type", dataIndex: "LeaveType", sorter: (a: any, b: any) => a.LeaveType.length - b.LeaveType.length },
    { title: "Allocated", dataIndex: "Allocated", sorter: (a: any, b: any) => a.Allocated.length - b.Allocated.length },
    { title: "Remaining", dataIndex: "Remaining", sorter: (a: any, b: any) => a.Remaining.length - b.Remaining.length },
    { title: "Used", dataIndex: "Used", sorter: (a: any, b: any) => a.Used.length - b.Used.length },
    { title: "Pending", dataIndex: "Pending", sorter: (a: any, b: any) => a.Pending.length - b.Pending.length },
    { title: "Utilization", dataIndex: "Utilization", sorter: (a: any, b: any) => a.Utilization.length - b.Utilization.length },
  ];

  return (
    <ReportShell
      title="Leave Balance Summary Report"
      showHeaderDateRange={false}
      charts={
        <div className="row row-gap-3 mb-4">
          {KPIS.map((kpi, i) => {
            const gauge = LeaveBalanceGauges[i];
            return (
              <div
                className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12"
                key={kpi.Label}
              >
                <div className="card overflow-hidden mb-0 border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between flex-xl-nowrap gap-2 mb-2 pb-2 border-bottom">
                      <div>
                        <div
                          className={`avatar rounded-lg bg-${kpi.Tone} text-white fs-20`}
                        >
                          <i className={`ti ${kpi.Icon}`} />
                        </div>
                        <p className="text-dark mt-1 mb-0 fs-13 fw-medium">
                          {kpi.Label}
                        </p>
                      </div>
                      <Chart
                        options={leaveBalanceGaugeOptions(
                          gauge.from,
                          gauge.to,
                          kpi.Label
                        )}
                        series={[gauge.value]}
                        type="radialBar"
                        height={100}
                        width={100}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h2 className={`fs-28 text-${kpi.Tone} mb-0`}>
                        {kpi.Value}
                      </h2>
                      <span
                        className={`badge badge-soft-${kpi.Tone} border-0 rounded-pill px-3 py-2`}
                      >
                        {kpi.Status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      columns={columns}
      data={LeaveBalanceSummaryReportData}
      manageColumns={[
        "Leave Type",
        "Allocated",
        "Remaining",
        "Used",
        "Pending",
        "Utilization",
      ]}
      runFilter={{ Label: "Leave Type", Icon: "ti-outbound", Options: ["Annual Leave","Sick Leave","Casual Leave","Maternity Leave","Paternity Leave"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default LeaveBalanceSummaryReportComponent;
