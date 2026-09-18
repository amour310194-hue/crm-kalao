"use client";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import type { CampaignKpi, CampaignTab } from "../components/campaignShell";
import type { TableFilterGroup } from "@/core/common/table-toolbar/tableToolbar";

const route = all_routes;

/*
  Shared column definitions, KPI cards, tabs and filters for the three WhatsApp
  Campaign pages (Active / Completed / Archived).
*/

export const WHATSAPP_CAMPAIGN_COLUMNS = [
  {
    title: "Campaign ID",
    dataIndex: "CampaignId",
    render: (text: string) => (
      <h6 className="fs-14 fw-normal mb-0">
        <Link href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_edit">
          {text}
        </Link>
      </h6>
    ),
    sorter: (a: any, b: any) => a.CampaignId.length - b.CampaignId.length,
  },
  {
    title: "Name",
    dataIndex: "Name",
    render: (text: string) => (
      <h6 className="fs-14 fw-medium mb-0">
        <Link href="#">{text}</Link>
      </h6>
    ),
    sorter: (a: any, b: any) => a.Name.length - b.Name.length,
  },
  {
    title: "Audience Segment",
    dataIndex: "AudienceSegment",
    render: (text: string) => (
      <span className="badge bg-light text-dark">{text}</span>
    ),
    sorter: (a: any, b: any) =>
      a.AudienceSegment.length - b.AudienceSegment.length,
  },
  {
    title: "Message Template",
    dataIndex: "MessageTemplate",
    render: (text: string) => <p className="mb-0">{text}</p>,
    sorter: (a: any, b: any) =>
      a.MessageTemplate.length - b.MessageTemplate.length,
  },
  {
    title: "Sent Count",
    dataIndex: "SentCount",
    sorter: (a: any, b: any) => a.SentCount.length - b.SentCount.length,
  },
  {
    title: "Progress",
    dataIndex: "ReadRate",
    render: (_text: any, record: any) => (
      <ul className="list-progress d-flex gap-3">
        <li>
          <h6 className="fs-14 fw-semibold mb-1">{record.ReadRate}</h6>
          <p className="fs-13 mb-0">Read Rate</p>
        </li>
        <li>
          <h6 className="fs-14 fw-semibold mb-1">{record.ReplyRate}</h6>
          <p className="fs-13 mb-0">Reply Rate</p>
        </li>
      </ul>
    ),
  },
  {
    title: "Status",
    dataIndex: "Status",
    render: (text: string, record: any) => (
      <span className={`badge badge-pill badge-status bg-${record.StatusTone}`}>
        {text}
      </span>
    ),
    sorter: (a: any, b: any) => a.Status.length - b.Status.length,
  },
  {
    title: "Action",
    dataIndex: "Action",
    render: () => (
      <div className="dropdown table-action">
        <Link
          href="#"
          className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="ti ti-dots-vertical" />
        </Link>
        <div className="dropdown-menu dropdown-menu-right">
          <Link
            className="dropdown-item"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas_edit"
            href="#"
          >
            <i className="ti ti-edit text-blue" /> Edit
          </Link>
          <Link
            className="dropdown-item"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#delete_campaign"
          >
            <i className="ti ti-trash" /> Delete
          </Link>
        </div>
      </div>
    ),
  },
];

export const WHATSAPP_CAMPAIGN_KPIS: CampaignKpi[] = [
  { Label: "Campaign", Value: "474", Icon: "ti-box", Tone: "secondary", Delta: "+5.62%", DeltaTone: "success" },
  { Label: "Sent", Value: "454", Icon: "ti-book-download", Tone: "info", Delta: "+4.12%", DeltaTone: "success" },
  { Label: "Delivered", Value: "650", Icon: "ti-replace", Tone: "pink", Delta: "+3.14%", DeltaTone: "success" },
  { Label: "Completed Campaign", Value: "650", Icon: "ti-align-box-right-stretch", Tone: "success", Delta: "+6.27%", DeltaTone: "success" },
];

export function whatsappCampaignTabs(
  active: "active" | "completed" | "archived"
): CampaignTab[] {
  return [
    { Label: "Active Campaign", Link: route.whatsappCampaign, Active: active === "active" },
    { Label: "Completed Campaign", Link: route.whatsappCampaignCompleted, Active: active === "completed" },
    { Label: "Archived Campaign", Link: route.whatsappCampaignArchieved, Active: active === "archived" },
  ];
}

export const WHATSAPP_CAMPAIGN_FILTERS: TableFilterGroup[] = [
  {
    Id: "collapseThree",
    Title: "Name",
    Searchable: true,
    Options: [
      { Label: "Renewal Reminder" },
      { Label: "Order Update" },
      { Label: "Payment Due" },
      { Label: "Welcome Message" },
      { Label: "Festive Offer" },
    ],
  },
  {
    Id: "type",
    Title: "Status",
    Options: [
      { Label: "Completed" },
      { Label: "Pending" },
      { Label: "Bounced" },
      { Label: "Running" },
      { Label: "Paused" },
    ],
  },
];

/* "Manage Columns" dropdown entries - matches the html reference, which lists
   fewer columns than the table itself. */
export const WHATSAPP_CAMPAIGN_MANAGE_COLUMNS: string[] = [
  "Campaign ID",
  "Name",
  "Platform",
  "Objective",
  "Start Date",
  "End Date",
];
