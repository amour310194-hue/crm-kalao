"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { SalesRepComparisonReportData } from "../../../../core/json/salesRepComparisonReportData";
import {
  SalesRepOptions,
  SalesRepSeries,
} from "../../../../core/json/reportChartsData";

/*
  Layout matches html/sales-rep-comparison-report.html: the chart card sits in
  col-xxl-8 on the left (with its subtitle and the Deals Closed / Revenue
  legend), and a "Top Performer" card fills col-xxl-4 on the right.
*/
const TOP_PERFORMERS = [
  {
    Value: "FCFA 285K",
    Name: "Robert Sheldon",
    Avatar: "assets/img/profiles/avatar-01.jpg",
    Deals: "45 deals closed",
    Conversion: "86.5% conversion",
  },
  {
    Value: "FCFA 194K",
    Name: "John Smith",
    Avatar: "assets/img/profiles/avatar-02.jpg",
    Deals: "32 deals closed",
    Conversion: "78.2% conversion",
  },
];

const SalesRepComparisonReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Sales Rep ID",
      dataIndex: "SalesRepId",
      render: (text: string) => (
        <h6 className="fs-14 fw-normal mb-0">
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.SalesRepId.length - b.SalesRepId.length,
    },
    {
      title: "Sales Rep Name",
      dataIndex: "Name",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <span className="avatar avatar-sm me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={record.Avatar}
              alt="User Image"
            />
          </span>
          {text}
        </h6>
      ),
      sorter: (a: any, b: any) => a.Name.length - b.Name.length,
    },
    {
      title: "Team",
      dataIndex: "Team",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.Team.length - b.Team.length,
    },
    {
      title: "Total Deals",
      dataIndex: "TotalDeals",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.TotalDeals.length - b.TotalDeals.length,
    },
    {
      title: "Total Revenue",
      dataIndex: "TotalRevenue",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.TotalRevenue.length - b.TotalRevenue.length,
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
      title="Sales Rep Comparison Report"
      badgeCount={15}
      charts={
        <div className="row row-gap-3">
          <div className="col-xxl-8 col-xl-7">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-1 fs-16">Monthly Estimation Trend</h5>
                <p className="mb-0">Deals &amp; Revenue metrics</p>
              </div>
              <div className="card-body">
                <Chart
                  options={SalesRepOptions}
                  series={SalesRepSeries}
                  type="line"
                  height={280}
                />
                <div className="d-flex align-items-center justify-content-center">
                  <p className="fs-14 fw-medium mb-0 text-dark d-flex align-items-center gap-2">
                    Deals Closed{" "}
                    <ImageWithBasePath
                      src="assets/img/icons/arrow-icon.svg"
                      alt="arrow"
                    />{" "}
                    <span className="text-success">Revenue</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0 fs-16">Top Performer</h5>
              </div>
              <div className="card-body">
                {TOP_PERFORMERS.map((performer, i) => (
                  <div
                    className={`card border-0 ${
                      i === TOP_PERFORMERS.length - 1 ? "mb-0" : "mb-4"
                    } bg-light-gradient`}
                    key={performer.Name}
                  >
                    <div className="card-body">
                      <h6 className="fs-28 mb-3">{performer.Value}</h6>
                      <div className="d-flex align-items-center fs-14 fw-medium mb-2">
                        <Link href="#" className="d-flex align-items-center">
                          <span className="avatar me-2">
                            <ImageWithBasePath
                              className="img-fluid rounded-circle"
                              src={performer.Avatar}
                              alt="User Image"
                            />
                          </span>
                          {performer.Name}
                        </Link>
                      </div>
                      <p className="d-flex align-items-center gap-1 mb-0">
                        {performer.Deals}{" "}
                        <span className="d-flex align-items-center fs-6">
                          <i className="ti ti-point-filled" />
                        </span>{" "}
                        {performer.Conversion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      columns={columns}
      data={SalesRepComparisonReportData}
      manageColumns={[
        "Sales Rep ID",
        "Sales Rep Name",
        "Team",
        "Total Deals",
        "Total Revenue",
        "Status",
      ]}
      runFilter={{ Label: "Sales Rep Name", Icon: "ti-user", Options: ["Robert Sheldon","Emma Sandoval","Mike Matheson","Natalie Ensley","Antonio Warthen","Carol Robillard"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default SalesRepComparisonReportComponent;
