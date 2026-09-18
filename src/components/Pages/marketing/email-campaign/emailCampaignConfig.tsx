"use client";
import Link from "next/link";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import type {
  CampaignKpi,
  CampaignTab,
} from "../components/campaignShell";
import type { TableFilterGroup } from "@/core/common/table-toolbar/tableToolbar";

const route = all_routes;

/*
  Column definitions, KPI cards, tabs and filter groups shared by the three
  Email Campaign pages (Active / Completed / Archived). The reference repeats
  all of this verbatim across the three HTML files.
*/

export const EMAIL_CAMPAIGN_COLUMNS = [
  {
    title: "Campaign ID",
    dataIndex: "CampaignId",
    render: (text: string) => (
      <h6 className="d-flex align-items-center fs-14 fw-normal mb-0">
        <Link
          href="#"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvas_edit"
        >
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
      <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
        <Link href="#">{text}</Link>
      </h6>
    ),
    sorter: (a: any, b: any) => a.Name.length - b.Name.length,
  },
  {
    title: "Type",
    dataIndex: "Type",
    sorter: (a: any, b: any) => a.Type.length - b.Type.length,
  },
  {
    title: "Email Template",
    dataIndex: "Template",
    sorter: (a: any, b: any) => a.Template.length - b.Template.length,
  },
  {
    title: "Sent Count",
    dataIndex: "SentCount",
    sorter: (a: any, b: any) => a.SentCount.length - b.SentCount.length,
  },
  {
    title: "Progress",
    dataIndex: "Opened",
    render: (_text: any, record: any) => (
      <ul className="list-progress d-flex gap-3">
        <li>
          <h6 className="fs-14 fw-semibold mb-1">{record.Opened}</h6>
          <p className="fs-13 mb-0">Opened</p>
        </li>
        <li>
          <h6 className="fs-14 fw-semibold mb-1">{record.Closed}</h6>
          <p className="fs-13 mb-0">Closed</p>
        </li>
      </ul>
    ),
  },
  {
    title: "Members",
    dataIndex: "Members",
    render: (members: string[]) => (
      <ul className="avatar-list-stacked avatar-group-sm d-flex align-items-center gap-2">
        {members.map((member) => (
          <li className="avatar avatar-rounded flex-shrink-0" key={member}>
            <Link href="#">
              <ImageWithBasePath src={member} alt="img" />
            </Link>
          </li>
        ))}
        <li className="avatar avatar-rounded flex-shrink-0 bg-light fs-10">
          <Link href="#">3+</Link>
        </li>
      </ul>
    ),
  },
  {
    title: "Status",
    dataIndex: "Status",
    render: (text: string, record: any) => (
      <span
        className={`badge badge-pill badge-status bg-${record.StatusTone}`}
      >
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

export const EMAIL_CAMPAIGN_KPIS: CampaignKpi[] = [
  { Label: "Campaign", Value: "474", Icon: "ti-brand-campaignmonitor", Tone: "secondary", Delta: "+5.62%", DeltaTone: "success" },
  { Label: "Sent", Value: "454", Icon: "ti-send", Tone: "info", Delta: "+4.12%", DeltaTone: "success" },
  { Label: "Opened", Value: "650", Icon: "ti-brand-feedly", Tone: "pink", Delta: "+3.14%", DeltaTone: "success" },
  { Label: "Completed", Value: "490", Icon: "ti-checks", Tone: "success", Delta: "+6.27%", DeltaTone: "success" },
];

export function emailCampaignTabs(active: "active" | "completed" | "archived"): CampaignTab[] {
  return [
    { Label: "Active Campaign", Link: route.emailCampaign, Active: active === "active" },
    { Label: "Completed Campaign", Link: route.emailCampaignCompleted, Active: active === "completed" },
    { Label: "Archived Campaign", Link: route.emailCampaignArchieved, Active: active === "archived" },
  ];
}

export const EMAIL_CAMPAIGN_FILTERS: TableFilterGroup[] = [
  {
    Id: "collapseThree",
    Title: "Name",
    Searchable: true,
    Options: [
      { Label: "New Year Super Sale" },
      { Label: "Feature Launch Update" },
      { Label: "Welcome Aboard" },
      { Label: "Upgrade to Pro" },
      { Label: "Weekly Product Digest" },
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
export const EMAIL_CAMPAIGN_MANAGE_COLUMNS: string[] = [
  "Campaign ID",
  "Name",
  "Type",
  "Progress",
  "Members",
  "Start Date",
];
