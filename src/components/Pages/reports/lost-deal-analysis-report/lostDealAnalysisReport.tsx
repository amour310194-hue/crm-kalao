"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { LostDealAnalysisReportData } from "../../../../core/json/lostDealAnalysisReportData";


/*
  Stat cards from html/lost-deal-analysis-report.html. These use SVG icon files
  rather than the icon font, so they go through ImageWithBasePath.
*/
const KPIS = [
  { Label: "Total Deals Lost", Value: "230", Icon: "assets/img/icons/lost-deal-01.svg", Tone: "orange" },
  { Label: "Total Revenue Lost", Value: "FCFA 845,000", Icon: "assets/img/icons/lost-deal-02.svg", Tone: "purple" },
  { Label: "Avg Lost Deal Size", Value: "FCFA 22,600", Icon: "assets/img/icons/lost-deal-03.svg", Tone: "info" },
  { Label: "Max Single Loss", Value: "FCFA 150,000", Icon: "assets/img/icons/lost-deal-04.svg", Tone: "cyan" },
];

const LostDealAnalysisReportComponent = () => {
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
      render: (text: string) => <Link href="#">{text}</Link>,
      sorter: (a: any, b: any) => a.DealName.length - b.DealName.length,
    },
    {
      title: "Lost Reason",
      dataIndex: "LostReason",
      sorter: (a: any, b: any) => a.LostReason.length - b.LostReason.length,
    },
    {
      title: "Sub Reason",
      dataIndex: "SubReason",
      sorter: (a: any, b: any) => a.SubReason.length - b.SubReason.length,
    },
    {
      title: "Competitor",
      dataIndex: "Competitor",
      sorter: (a: any, b: any) => a.Competitor.length - b.Competitor.length,
    },
    {
      title: "Deal Value",
      dataIndex: "DealValue",
      sorter: (a: any, b: any) => a.DealValue.length - b.DealValue.length,
    },
    {
      title: "Lost stage",
      dataIndex: "LostStage",
      render: (text: string, record: any) => (
        <span
          className={`badge badge-pill badge-status ${record.LostStageTone}`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.LostStage.length - b.LostStage.length,
    },
    {
      title: "Lost Date",
      dataIndex: "LostDate",
      sorter: (a: any, b: any) => a.LostDate.length - b.LostDate.length,
    },
  ];

  return (
    <ReportShell
      title="Lost Deal Analysis Report"
      charts={
        <div className="row row-gap-3 mb-4">
          {KPIS.map((kpi) => (
            <div className="col-xl-3 col-sm-6 d-flex" key={kpi.Label}>
              <div className="card flex-fill mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-2">
                    <span
                      className={`avatar avatar-lg rounded-circle bg-${kpi.Tone} text-white p-2`}
                    >
                      <ImageWithBasePath
                        src={kpi.Icon}
                        alt="img"
                        className="w-auto h-auto"
                      />
                    </span>
                    <div>
                      <span className="d-block mb-1 fw-bold fs-14 text-dark">
                        {kpi.Label}
                      </span>
                      <p className="mb-0 fs-13">From Last Month</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <span className="fw-bold fs-28 text-dark">{kpi.Value}</span>
                    <span className="badge bg-success bg-opacity-10 px-2 text-success border-0 fs-10 rounded-pill">
                      +2.5%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      columns={columns}
      data={LostDealAnalysisReportData}
      manageColumns={[
        "Deal ID",
        "Deal Name",
        "Lost Reason",
        "Sub Reason",
        "Competitor",
        "Deal Value",
        "Lost stage",
        "Lost Date",
      ]}
      runFilter={{ Label: "Deal Name", Icon: "ti-medal", Options: ["Annual Software Subscription","CRM Onboarding Package","Enterprise Plan Upgrade","BrightWorks Campaign","Sales Pipeline Optimization","CRM Migration Project","Multi-Store License Renewal"] }}
      runFilterSecondary={{ Label: "Stage", Icon: "ti-dashboard", Options: ["Appointment","Proposal Made","Presentation","Contact Made"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default LostDealAnalysisReportComponent;
