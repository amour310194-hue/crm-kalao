"use client";

import { all_routes } from '@/router/all_routes';
import Link from 'next/link';
import { useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/I18nProvider';

const PATH_RESOURCE: Record<string, string> = {
  clients: "accounts",
  companies: "companies",
  contacts: "contacts",
  leads: "leads",
  deals: "deals",
  invoices: "invoices",
  quotations: "quotes",
  products: "catalog",
  payments: "payments",
  voyages: "travel",
  immigration: "immigration",
  evenements: "events",
  lignes: "eventLines",
  agriculture: "plantations",
  chantiers: "sites",
  materiel: "siteEquipment",
  equipes: "siteAssignments",
  avancement: "siteMilestones",
  immobilier: "properties",
  baux: "leases",
  paie: "payroll",
  departments: "departments",
};

const IMAGE_KEYS = new Set([
  "image",
  "Image",
  "Owner_Img",
  "clientImage",
  "Project_Image",
  "LeadImage",
  "CompanyImage",
  "OwnerImage",
  "HeadImage",
  "LocationFlag",
]);

function inferResource(explicit: string | undefined, pathname: string) {
  if (explicit) return explicit;
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return PATH_RESOURCE[last] ?? last;
}

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]).filter((key) => !IMAGE_KEYS.has(key));
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [keys.join(";"), ...rows.map((row) => keys.map((key) => escape(row[key])).join(";"))].join("\n");
}

interface PageHeaderProps {
  title?: string;
  badgeCount?: any;
  showExport?: boolean;
  moduleTitle?: string;
  showModuleTile:any;
  /** Optional control rendered at the start of the right-hand button group (e.g. a date-range picker). */
  headerExtra?: ReactNode;
  exportPdfResource?: string;
  onRefresh?: () => void;
}

const PageHeader = ({
  title = "",
  badgeCount = null,
  showExport = false,
  moduleTitle = "",
  showModuleTile = true,
  headerExtra,
  exportPdfResource,
  onRefresh,
}: PageHeaderProps) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const exportResource = inferResource(exportPdfResource, pathname ?? "");

  useEffect(() => {
    // Initialize Bootstrap tooltips
    // @ts-ignore
    if (window.bootstrap) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        // @ts-ignore
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, []);

  const handleCollapseToggle = () => {
    const body = document.body;

    if (isCollapsed) {
      body.classList.remove('header-collapse');
    } else {
      body.classList.add('header-collapse');
    }

    setIsCollapsed(!isCollapsed);
  };

  const handleRefresh = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (onRefresh) {
      onRefresh();
      return;
    }
    window.location.reload();
  };

  const handleExportPdf = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!exportResource) return;
    window.location.assign(`/api/v1/export/pdf?resource=${encodeURIComponent(exportResource)}`);
  };

  const handleExportCsv = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!exportResource) return;
    const response = await fetch(`/api/v1/${exportResource}`, { cache: "no-store" });
    if (!response.ok) return;
    const json = (await response.json()) as { data?: Array<Record<string, unknown>> };
    const rows = json.data ?? [];
    const csv = toCsv(rows);
    triggerDownload(
      `${exportResource}.csv`,
      new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" })
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
      <div>
        <h4 className="mb-1">
          {t(title)}
          <span className="badge badge-soft-primary ms-2">{badgeCount}</span>
        </h4>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 p-0">
            <li className="breadcrumb-item">
              <Link href={all_routes.dashboard}>{t("Home")}</Link>
            </li>
            {showModuleTile && (
            <li className="breadcrumb-item" aria-current="page">
              <Link href="#">{t(moduleTitle)}</Link>
            </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {t(title)}
            </li>
          </ol>
        </nav>
      </div>

      <div className="gap-2 d-flex align-items-center flex-wrap">
        {headerExtra}
        {showExport && (
          <div className="dropdown">
            <Link
              href="#"
              className="dropdown-toggle btn btn-outline-light px-2 shadow"
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-package-export me-2" />
              {t("Export")}
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <ul>
                <li>
                  <Link href={`/api/v1/export/pdf?resource=${encodeURIComponent(exportResource)}`} className="dropdown-item" onClick={handleExportPdf}>
                    <i className="ti ti-file-type-pdf me-1" />
                    {t("Export as PDF")}
                  </Link>
                </li>
                <li>
                  <Link href={`/api/v1/${exportResource}`} className="dropdown-item" onClick={handleExportCsv}>
                    <i className="ti ti-file-type-xls me-1" />
                    {t("Export as Excel")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <Link
          href="#"
          className="btn btn-icon btn-outline-light shadow"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Refresh"
          aria-label="Refresh"
          onClick={handleRefresh}
        >
          <i className="ti ti-refresh" />
        </Link>

        <Link
          href="#"
          id='collapse-header'
          onClick={handleCollapseToggle}
          className={`btn btn-icon btn-outline-light shadow ${isCollapsed === true ? 'active' : ''}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title={isCollapsed ? "Expand" : "Collapse"}
          aria-label="Collapse"
        >
          <i className="ti ti-transition-top" />
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
