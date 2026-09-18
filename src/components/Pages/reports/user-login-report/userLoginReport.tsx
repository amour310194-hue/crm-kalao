"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { UserLoginReportData } from "../../../../core/json/userLoginReportData";
import {
  LoginSplitOptions,
  LoginSplitSeries,
} from "../../../../core/json/reportChartsData";

/*
  Layout matches html/user-login-report.html: the Login Split chart occupies
  col-xl-7 on the left, with the six stat cards laid out as a 2-up grid in the
  remaining col-xl-5 on the right.
*/
const KPIS = [
  { Label: "Total Users", Value: "460", Icon: "ti-users", Tone: "orange" },
  { Label: "Active Users", Value: "380", Icon: "ti-user-edit", Tone: "teal" },
  { Label: "New Users", Value: "280", Icon: "ti-user-plus", Tone: "info" },
  { Label: "Login Success Rate", Value: "85%", Icon: "ti-login", Tone: "success" },
  { Label: "Inactive Users", Value: "120", Icon: "ti-user-x", Tone: "danger" },
  { Label: "Avg Login Time", Value: "1.2 sec", Icon: "ti-device-desktop", Tone: "pink" },
];

const UserLoginReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "User",
      dataIndex: "User",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.UserImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.User.length - b.User.length,
    },
    {
      title: "Total Logins",
      dataIndex: "TotalLogins",
      sorter: (a: any, b: any) => a.TotalLogins.length - b.TotalLogins.length,
    },
    {
      title: "Successful Logins",
      dataIndex: "SuccessfulLogins",
      sorter: (a: any, b: any) =>
        a.SuccessfulLogins.length - b.SuccessfulLogins.length,
    },
    {
      title: "Failed Logins",
      dataIndex: "FailedLogins",
      sorter: (a: any, b: any) => a.FailedLogins.length - b.FailedLogins.length,
    },
    {
      title: "Avg Session Time (Min)",
      dataIndex: "AvgSessionTime",
      sorter: (a: any, b: any) =>
        a.AvgSessionTime.length - b.AvgSessionTime.length,
    },
    {
      title: "Last Login",
      dataIndex: "LastLogin",
      sorter: (a: any, b: any) => a.LastLogin.length - b.LastLogin.length,
    },
  ];

  return (
    <ReportShell
      title="User Login Report"
      charts={
        <div className="row">
          <div className="col-md-12 col-xl-7 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="mb-0 fs-16 fw-bold text-dark">Login Split</div>
              </div>
              <div className="card-body">
                <Chart
                  options={LoginSplitOptions}
                  series={LoginSplitSeries}
                  type="area"
                  height={320}
                />
                <div className="d-flex alig-items-center gap-2 justify-content-center mt-2">
                  <span className="fw-medium border rounded text-gray-5 d-flex align-items-center px-2 gap-1">
                    <i className="ti ti-circle-filled fs-8 text-success" />{" "}
                    Successful Logins
                  </span>
                  <span className="fw-medium border rounded text-gray-5 d-flex align-items-center px-2 gap-1">
                    <i className="ti ti-circle-filled fs-8 text-danger" /> Failed
                    Logins
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-xl-5 d-flex">
            <div className="row row-gap-3 mb-4 flex-fill">
              {KPIS.map((kpi) => (
                <div className="col-md-6 d-flex" key={kpi.Label}>
                  <div className="card flex-fill mb-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2 border-bottom pb-2 mb-2">
                        <div>
                          <p className="mb-1 fs-13">{kpi.Label}</p>
                          <span className="fw-bold fs-28 text-dark">
                            {kpi.Value}
                          </span>
                        </div>
                        <span
                          className={`avatar avatar-md rounded bg-${kpi.Tone} text-white`}
                        >
                          <i className={`ti ${kpi.Icon} fs-20`} />
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-success bg-opacity-10 px-2 text-success border-0 fs-10 rounded-pill">
                          +2.5%
                        </span>
                        <p className="mb-0 fs-13">From Last Month</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      columns={columns}
      data={UserLoginReportData}
      manageColumns={[
        "User",
        "Total Logins",
        "Successful Logins",
        "Failed Logins",
        "Avg Session Time (Min)",
        "Last Login",
      ]}
      runFilter={{
        Label: "User Name",
        Icon: "ti-user",
        Options: [
          "Robert Johnson",
          "Isabella Cooper",
          "John Smith",
          "Sophia Parker",
          "Ethan Reynolds",
          "Liam Carter",
        ],
      }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default UserLoginReportComponent;
