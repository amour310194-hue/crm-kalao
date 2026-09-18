"use client";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import type { CampaignTab } from "../components/campaignShell";
import type { TableFilterGroup } from "@/core/common/table-toolbar/tableToolbar";

const route = all_routes;

/*
  Shared column definitions, KPI cards, tabs and filters for the three Social
  Campaign pages (Active / Completed / Archived).

  Social uses a different KPI card style from the other families - the
  `.social-card` variant with a coloured accent line across the top - so its
  cards are declared here with their own shape rather than reusing CampaignKpi.
*/

export interface SocialKpi {
  Value: string;
  Label: string;
  Delta: string;
  /** "success" | "danger" - drives both the accent line and the delta text. */
  Tone: string;
  Icon: string;
  /** bg-* tone for the icon bubble. */
  IconTone: string;
}

export const SOCIAL_CAMPAIGN_KPIS: SocialKpi[] = [
  { Value: "454", Label: "Campaign", Delta: "+4.12%", Tone: "success", Icon: "ti-brand-campaignmonitor", IconTone: "primary" },
  { Value: "144", Label: "Active Campaign", Delta: "+8.48%", Tone: "success", Icon: "ti-anchor", IconTone: "success" },
  { Value: "250", Label: "Completed Campaign", Delta: "-8.22%", Tone: "danger", Icon: "ti-checklist", IconTone: "danger" },
  { Value: "60", Label: "Archived Campaign", Delta: "+20.12%", Tone: "success", Icon: "ti-chart-arrows-vertical", IconTone: "pink" },
];

export const SOCIAL_CAMPAIGN_COLUMNS = [
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
    title: "Platform",
    dataIndex: "Platform",
    render: (text: string) => <p className="mb-0">{text}</p>,
    sorter: (a: any, b: any) => a.Platform.length - b.Platform.length,
  },
  {
    title: "Objective",
    dataIndex: "Objective",
    render: (text: string) => <p className="mb-0">{text}</p>,
    sorter: (a: any, b: any) => a.Objective.length - b.Objective.length,
  },
  {
    title: "Start Date",
    dataIndex: "StartDate",
    sorter: (a: any, b: any) => a.StartDate.length - b.StartDate.length,
  },
  {
    title: "End Date",
    dataIndex: "EndDate",
    sorter: (a: any, b: any) => a.EndDate.length - b.EndDate.length,
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

export function socialCampaignTabs(
  active: "active" | "completed" | "archived"
): CampaignTab[] {
  return [
    { Label: "Active Campaign", Link: route.socialCampaign, Active: active === "active" },
    { Label: "Completed Campaign", Link: route.socialCampaignCompleted, Active: active === "completed" },
    { Label: "Archived Campaign", Link: route.socialCampaignArchieved, Active: active === "archived" },
  ];
}

export const SOCIAL_CAMPAIGN_FILTERS: TableFilterGroup[] = [
  {
    Id: "collapseThree",
    Title: "Name",
    Searchable: true,
    Options: [
      { Label: "CRM Lead Gen" },
      { Label: "Brand Awareness" },
      { Label: "Product Launch" },
      { Label: "Retargeting Push" },
      { Label: "Webinar Promo" },
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
export const SOCIAL_CAMPAIGN_MANAGE_COLUMNS: string[] = [
  "Campaign ID",
  "Name",
  "Type",
  "Progress",
  "Members",
  "Start Date",
];
