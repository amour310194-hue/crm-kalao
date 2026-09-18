"use client";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import TableToolbar, {
  type TableFilterGroup,
} from "@/core/common/table-toolbar/tableToolbar";

/*
  Shared shell for the Marketing campaign trios (email / sms / social / whatsapp).

  In the HTML reference each campaign type has three near-identical pages -
  Active, Completed, Archived - that differ only by which tab carries the active
  class and which data file the table reads. Rather than triplicate ~400 lines of
  markup per family, the common chrome lives here and each page passes its own
  title, KPI cards, tabs, columns and data.
*/

export interface CampaignKpi {
  Label: string;
  Value: string;
  Icon: string;
  /** bg-* tone for the icon bubble, e.g. "secondary" | "info" | "pink". */
  Tone: string;
  /** e.g. "+5.62%" */
  Delta: string;
  /** badge-soft-* tone for the delta chip. */
  DeltaTone: string;
}

export interface CampaignTab {
  Label: string;
  Link: string;
  /** Small count shown beside the label on the active tab (reference shows it only there). */
  Active?: boolean;
}

interface CampaignShellProps {
  title: string;
  badgeCount?: number;
  tabs: CampaignTab[];
  kpis: CampaignKpi[];
  columns: any[];
  data: any[];
  filters: TableFilterGroup[];
  /** Column labels for the "Manage Columns" dropdown (per campaign family). */
  manageColumns?: string[];
  /**
   * Replaces the default KPI card row. Social Campaign uses a different card
   * style (.social-card with an accent line), so it supplies its own row here
   * and leaves `kpis` empty.
   */
  kpiSlot?: React.ReactNode;
  addLabel: string;
  /** Bootstrap offcanvas/modal target for the Add button, e.g. "#offcanvas_add". */
  addTarget: string;
  addToggle?: "offcanvas" | "modal";
  searchText: string;
  onSearch: (value: string) => void;
  children?: React.ReactNode;
}

const CampaignShell = ({
  title,
  badgeCount,
  tabs,
  kpis,
  columns,
  data,
  filters,
  manageColumns,
  kpiSlot,
  addLabel,
  addTarget,
  addToggle = "offcanvas",
  searchText,
  onSearch,
  children,
}: CampaignShellProps) => (
  <>
    {/* ========================
			Start Page Content
		========================= */}
    <div className="page-wrapper">
      {/* Start Content */}
      <div className="content pb-0">
        {/* Page Header */}
        <PageHeader
          title={title}
          badgeCount={badgeCount}
          showModuleTile={true}
          moduleTitle="Marketing"
          showExport={true}
        />
        {/* End Page Header */}
        {/* row start */}
        {kpiSlot ?? (
        <div className="row">
          {kpis.map((kpi) => (
            <div className="col-xl-3 col-md-6" key={kpi.Label}>
              <div className="card shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`avatar avatar-lg rounded-circle bg-${kpi.Tone} fs-24 flex-shrink-0`}
                      >
                        <i className={`ti ${kpi.Icon} fs-24`} />
                      </span>
                      <div>
                        <p className="mb-1 text-truncate">{kpi.Label}</p>
                        <h4 className="mb-0 fs-16">{kpi.Value}</h4>
                      </div>
                    </div>
                    <span className={`badge badge-soft-${kpi.DeltaTone}`}>
                      {kpi.Delta}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
        {/* row end */}
        {/* Campaign Tab */}
        <div className="campaign-tab">
          <ul className="nav nav-tabs nav-bordered mb-4">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.Label}>
                <Link
                  href={tab.Link}
                  className={`nav-link bg-transparent${
                    tab.Active ? " active text-primary" : ""
                  }`}
                >
                  {tab.Label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Campaign Tab */}
        {/* card start */}
        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search" />
              </span>
              <SearchInput value={searchText} onChange={onSearch} />
            </div>
            <Link
              href="#"
              className="btn btn-primary"
              data-bs-toggle={addToggle}
              data-bs-target={addTarget}
            >
              <i className="ti ti-square-rounded-plus-filled me-1" />
              {addLabel}
            </Link>
          </div>
          <div className="card-body">
            {/* table header */}
            <TableToolbar
              filters={filters}
              showManageColumns={!!manageColumns}
              manageColumns={manageColumns}
            />
            {/* table header */}
            <div className="custom-table">
              <Datatable
                columns={columns}
                dataSource={data}
                Selection={false}
                searchText={searchText}
              />
            </div>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="datatable-length" />
              </div>
              <div className="col-md-6">
                <div className="datatable-paginate" />
              </div>
            </div>
          </div>
        </div>
        {/* card end */}
      </div>
      {/* End Content */}
      {/* Start Footer */}
      <Footer />
      {/* End Footer */}
    </div>
    {/* ========================
			End Page Content
		========================= */}
    {children}
  </>
);

export default CampaignShell;
