"use client";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import type { TableFilterGroup } from "@/core/common/table-toolbar/tableToolbar";

/*
  Shared chrome for the Reports module.

  Every report page in the HTML reference has the same shape: page header, an
  optional row of chart cards, then a card whose header carries the search box
  plus a "Sort By" / date-range / "Manage Columns" toolbar, and whose body holds
  the table. Only the charts, columns and data differ, so that lives here once.
*/

export interface ReportKpi {
  Label: string;
  Value: string;
  Icon: string;
  /** bg-* tone for the icon bubble, e.g. "orange" | "info" | "pink". */
  Tone: string;
  /** e.g. "+2.5%" */
  Delta: string;
  /** Trailing copy after the delta chip, e.g. "From Last Month". */
  DeltaLabel: string;
}

/** One dropdown in the "Run Report" row. `Search` overrides the default,
    which shows the search box on the first dropdown only. */
interface RunFilter {
  Label: string;
  Icon: string;
  Options: string[];
  Search?: boolean;
}

interface ReportShellProps {
  title: string;
  badgeCount?: number;
  /** Chart cards rendered between the page header and the table card. */
  charts?: React.ReactNode;
  columns: any[];
  data: any[];
  /** Column labels listed in the Manage Columns dropdown. */
  manageColumns: string[];
  /**
   * Filter accordion groups. Only some reference report pages carry a Filter
   * dropdown; pass none (the default) for those that do not.
   */
  filters?: TableFilterGroup[];
  /**
   * Stat cards rendered directly under the page header, above any charts.
   * Several reference report pages carry a row of these.
   */
  kpis?: ReportKpi[];
  /** Page-header date range. All but two reference report pages have one. */
  showHeaderDateRange?: boolean;
  /** Show the Export dropdown in the page header (only 3 reference pages do). */
  showExport?: boolean;
  /**
   * Left-hand dropdown of the "Run Report" row, e.g. { Label: "User Name",
   * Icon: "ti-user", Options: [...] }. Every reference report page has this row.
   */
  runFilter?: RunFilter;
  /** Optional second dropdown in the "Run Report" row (a few pages have two). */
  runFilterSecondary?: RunFilter;
  /** Optional third dropdown - the lead/deal reports carry three. */
  runFilterTertiary?: RunFilter;
  /**
   * Renders the "Run Report" row. Every reference report page has it; a few
   * carry no left-hand dropdown, so it is independent of runFilter.
   */
  showRunReport?: boolean;
  searchText: string;
  onSearch: (value: string) => void;
  children?: React.ReactNode;
}

const ReportShell = ({
  title,
  badgeCount,
  charts,
  columns,
  data,
  manageColumns,
  filters = [],
  kpis = [],
  showHeaderDateRange = true,
  showExport = false,
  runFilter,
  runFilterSecondary,
  runFilterTertiary,
  showRunReport = true,
  searchText,
  onSearch,
  children,
}: ReportShellProps) => (
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
          moduleTitle="Reports"
          showExport={showExport}
          headerExtra={showHeaderDateRange ? <PredefinedDatePicker /> : undefined}
        />
        {/* End Page Header */}
        {kpis.length > 0 && (
          <div className="row row-gap-3 mb-4 row-cols-1 row-cols-md-3 row-cols-xl-5">
            {kpis.map((kpi) => (
              <div className="col d-flex" key={kpi.Label}>
                <div className="card flex-fill mb-0">
                  <div className="card-body">
                    <p className="mb-2 fs-13">{kpi.Label}</p>
                    <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-2">
                      <span
                        className={`avatar avatar-md rounded-circle bg-${kpi.Tone} text-white`}
                      >
                        <i className={`ti ${kpi.Icon} fs-20`} />
                      </span>
                      <span className="d-block mb-0 fw-bold fs-28 text-dark">
                        {kpi.Value}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap fs-13">
                      <span className="badge bg-success bg-opacity-10 px-2 text-success border-0 fs-10 rounded-pill">
                        {kpi.Delta}
                      </span>
                      {kpi.DeltaLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {charts}
        {/* card start */}
        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search" />
              </span>
              <SearchInput value={searchText} onChange={onSearch} />
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="dropdown">
                <Link
                  href="#"
                  className="dropdown-toggle btn btn-outline-light shadow"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort By
                </Link>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Newest
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item">
                        Oldest
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {filters.length > 0 && (
                <div className="dropdown">
                  <Link
                    href="#"
                    className="btn btn-outline-light shadow px-2"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                    <i className="ti ti-chevron-down ms-2" />
                  </Link>
                  <div className="filter-dropdown-menu dropdown-menu dropdown-menu-lg bg-light p-0">
                    <div className="filter-set-view p-3">
                      <div className="accordion" id="reportFilterAccordion">
                        {filters.map((group) => (
                          <div className="filter-set-content mb-0" key={group.Id}>
                            <div
                              className="filter-set-contents accordion-collapse collapse show"
                              id={group.Id}
                              data-bs-parent="#reportFilterAccordion"
                            >
                              <div className="filter-content-list">
                                {group.Searchable && (
                                  <div className="mb-2">
                                    <div className="input-icon-start input-icon position-relative">
                                      <span className="input-icon-addon fs-12">
                                        <i className="ti ti-search" />
                                      </span>
                                      <input
                                        type="text"
                                        className="form-control form-control-md"
                                        placeholder="Search"
                                      />
                                    </div>
                                  </div>
                                )}
                                <ul className="mb-0">
                                  {(group.Options ?? []).map((option) => (
                                    <li className="mb-1" key={option.Label}>
                                      <label className="dropdown-item px-2 d-flex align-items-center">
                                        <input
                                          className="form-check-input m-0 me-1"
                                          type="checkbox"
                                        />
                                        {option.Avatar && (
                                          <span className="avatar avatar-xs rounded-circle me-2">
                                            <ImageWithBasePath
                                              src={option.Avatar}
                                              className="flex-shrink-0 rounded-circle"
                                              alt="img"
                                            />
                                          </span>
                                        )}
                                        {option.Label}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                                {group.LoadMore && (
                                  <Link href="#" className="p-2 d-block fw-medium">
                                    More
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="dropdown">
                <Link
                  href="#"
                  className="dropdown-toggle btn btn-outline-light shadow px-2"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-columns-3 me-2" />
                  Manage Columns
                </Link>
                <div className="dropdown-menu dropdown-menu-md dropdown-md p-3">
                  <ul>
                    {manageColumns.map((column) => (
                      <li
                        className="gap-1 d-flex align-items-center mb-2"
                        key={column}
                      >
                        <i className="ti ti-columns me-1" />
                        <div className="form-check form-switch w-100 ps-0">
                          <label className="form-check-label d-flex align-items-center gap-2 w-100">
                            <span>{column}</span>
                            <input
                              className="form-check-input switchCheckDefault ms-auto"
                              type="checkbox"
                              role="switch"
                              defaultChecked
                            />
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            {showRunReport && (
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {[runFilter, runFilterSecondary, runFilterTertiary]
                    .filter(Boolean)
                    .map((filter, index) => {
                      const f = filter as RunFilter;
                      // The reference puts a search box in some dropdowns only;
                      // by default just the first one has it.
                      const withSearch = f.Search ?? index === 0;
                      return (
                        <div className="dropdown" key={f.Label}>
                          <Link
                            href="#"
                            className="dropdown-toggle btn btn-outline-light px-2 shadow"
                            data-bs-toggle="dropdown"
                          >
                            <i className={`ti ${f.Icon} me-2`} />
                            {f.Label}
                          </Link>
                          <div className="dropdown-menu">
                            {withSearch && (
                              <div className="mb-2">
                                <div className="input-icon-start input-icon position-relative">
                                  <span className="input-icon-addon fs-12">
                                    <i className="ti ti-search" />
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control form-control-md"
                                    placeholder="Search"
                                  />
                                </div>
                              </div>
                            )}
                            <ul>
                              {f.Options.map((option) => (
                                <li key={option}>
                                  <Link href="#" className="dropdown-item">
                                    {option}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Link href="#" className="btn btn-primary">
                    <i className="ti ti-player-play me-1" />
                    Run Report
                  </Link>
                  <Link href="#" className="btn btn-icon btn-outline-light shadow">
                    <i className="ti ti-download" />
                  </Link>
                </div>
              </div>
            )}
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

export default ReportShell;
