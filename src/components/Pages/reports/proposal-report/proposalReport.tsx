"use client";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { ProposalReportData } from "../../../../core/json/proposalReportData";


/*
  Gradient stat cards from html/proposal-report.html - each card has a coloured
  gradient head (label + value + icon) and a footer carrying a small badge and
  the delta copy.
*/
const KPIS = [
  { Label: "Total Proposals", Value: "6", Icon: "ti-file", Tone: "success", BadgeIcon: "ti-clock", Delta: "+12", DeltaLabel: "vs Last Month" },
  { Label: "Pending Review", Value: "20", Icon: "ti-cash-edit", Tone: "danger", BadgeIcon: "ti-trending-up", Delta: "", DeltaLabel: "Urgent Attention" },
  { Label: "Approved", Value: "44", Icon: "ti-checkbox", Tone: "info", BadgeIcon: "ti-trending-up", Delta: "+12", DeltaLabel: "Success Rate" },
  { Label: "Total Value", Value: "$2000", Icon: "ti-cash-banknote", Tone: "warning", BadgeIcon: "ti-trending-up", Delta: "", DeltaLabel: "Pipeline Growth" },
];

const ProposalReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "Proposal",
      dataIndex: "Proposal",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.Proposal.length - b.Proposal.length,
    },
    {
      title: "Client",
      dataIndex: "Client",
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
      sorter: (a: any, b: any) => a.Client.length - b.Client.length,
    },
    {
      title: "Value",
      dataIndex: "Value",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.Value.length - b.Value.length,
    },
    {
      title: "Submited Date",
      dataIndex: "SubmittedDate",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) =>
        a.SubmittedDate.length - b.SubmittedDate.length,
    },
    {
      title: "Due Date",
      dataIndex: "DueDate",
      render: (text: string) => <span className="fs-14">{text}</span>,
      sorter: (a: any, b: any) => a.DueDate.length - b.DueDate.length,
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
      title="Proposal Report"
      charts={
        <div className="row row-gap-3 mb-4">
          {KPIS.map((kpi) => (
            <div
              className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-6"
              key={kpi.Label}
            >
              <div className="card overflow-hidden proposal-card mb-0">
                <div
                  className={`d-flex align-items-start justify-content-between flex-wrap gap-2 bg-${kpi.Tone}-gradient-5 p-3`}
                >
                  <div>
                    <p className="text-white mb-1">{kpi.Label}</p>
                    <h2 className="fs-32 text-white mb-0">{kpi.Value}</h2>
                  </div>
                  <div className="avatar rounded-lg shadow fs-16">
                    <i className={`ti ${kpi.Icon}`} />
                  </div>
                </div>
                <div className="card-body d-flex align-items-center gap-2 p-3">
                  <span
                    className={`avatar avatar-xs rounded-lg bg-soft-${kpi.Tone} text-${kpi.Tone} border border-${kpi.Tone}`}
                  >
                    <i className={`ti ${kpi.BadgeIcon}`} />
                  </span>
                  <p className="d-flex align-items-center fw-semibold mb-0 gap-1">
                    {kpi.Delta && (
                      <span className={`text-${kpi.Tone}`}>{kpi.Delta}</span>
                    )}
                    {kpi.DeltaLabel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      columns={columns}
      data={ProposalReportData}
      manageColumns={[
        "Proposal",
        "Client",
        "Value",
        "Submited Date",
        "Due Date",
        "Status",
      ]}
      runFilter={{ Label: "Client", Icon: "ti-users", Options: ["Robert Johnson","Isabella Cooper","John Smith","Sophia Parker","Ethan Reynolds","Liam Carter"] }}
      runFilterSecondary={{ Label: "Status", Icon: "ti-layout-grid", Options: ["Approved","Sent","Pending","Rejected"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default ProposalReportComponent;
