"use client";
import Link from "next/link";
import ImageWithBasePath from "../imageWithBasePath";
import PredefinedDatePicker from "../common-dateRangePicker/PredefinedDatePicker";

/*
  Shared in-card table toolbar: "Sort By" + date range on the left, "Filter"
  (and optionally "Manage Columns") on the right.

  Ported from the `<!-- table header -->` block that sits at the top of the
  card-body on the HTML reference list pages (attendance.html, leave-requests.html,
  milestones.html, timesheets.html, holidays.html, ...). The markup is identical
  across those pages - only the Filter accordion's groups differ - so it lives
  here once and is driven by the `filters` prop.
*/

export interface TableFilterOption {
  /** Visible label. */
  Label: string;
  /** Optional leading avatar, e.g. "assets/img/users/user-06.jpg". */
  Avatar?: string;
  /** Optional leading flag/icon, e.g. "assets/img/flags/us.svg". */
  Flag?: string;
}

export interface TableFilterGroup {
  /** Accordion collapse target id - must be unique on the page. */
  Id: string;
  /** Accordion heading, e.g. "Employee". */
  Title: string;
  /** Renders the small search box above the option list. */
  Searchable?: boolean;
  /** Renders a "Load More" link under the option list. */
  LoadMore?: boolean;
  /** Checkbox options. Omit entirely for a date-picker group. */
  Options?: TableFilterOption[];
  /** Renders a single date input instead of a checkbox list. */
  DateInput?: boolean;
}

interface TableToolbarProps {
  filters: TableFilterGroup[];
  /** Adds the "Manage Columns" dropdown (only some reference pages have it). */
  showManageColumns?: boolean;
  /** Column labels listed inside the Manage Columns dropdown. */
  manageColumns?: string[];
  /** Accordion wrapper id - override when two toolbars share a page. */
  accordionId?: string;
}

const TableToolbar = ({
  filters,
  showManageColumns = false,
  manageColumns = [],
  accordionId = "accordionExample",
}: TableToolbarProps) => (
  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
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
      <PredefinedDatePicker />
    </div>
    <div className="d-flex align-items-center gap-2 flex-wrap">
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
        <div className="filter-dropdown-menu dropdown-menu dropdown-menu-lg p-0">
          <div className="filter-header d-flex align-items-center justify-content-between border-bottom">
            <h4 className="mb-0 fs-16">
              <i className="ti ti-filter me-1" />
              Filter
            </h4>
            <button
              type="button"
              className="btn-close close-filter-btn"
              data-bs-dismiss="dropdown-menu"
              aria-label="Close"
            />
          </div>
          <div className="filter-set-view p-3">
            <div className="accordion" id={accordionId}>
              {filters.map((group) => (
                <div className="filter-set-content" key={group.Id}>
                  <div className="filter-set-content-head">
                    <Link
                      href="#"
                      className="collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${group.Id}`}
                      aria-expanded="false"
                      aria-controls={group.Id}
                    >
                      {group.Title}
                    </Link>
                  </div>
                  <div
                    className="filter-set-contents accordion-collapse collapse"
                    id={group.Id}
                    data-bs-parent={`#${accordionId}`}
                  >
                    <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                      {group.DateInput ? (
                        <div className="mb-0">
                          <div className="input-icon-end position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="dd/mm/yyyy"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
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
                            {group.Options?.map((option) => (
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
                                  {option.Flag && (
                                    <ImageWithBasePath
                                      src={option.Flag}
                                      alt="flag"
                                      className="me-2 img-fluid avatar avatar-xs"
                                    />
                                  )}
                                  {option.Label}
                                </label>
                              </li>
                            ))}
                            {group.LoadMore && (
                              <li>
                                <Link
                                  href="#"
                                  className="link-primary text-decoration-underline p-2 pt-0 d-flex"
                                >
                                  Load More
                                </Link>
                              </li>
                            )}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link href="#" className="btn btn-outline-light w-100">
                Reset
              </Link>
              <Link href="#" className="btn btn-primary w-100">
                Filter
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showManageColumns && (
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
      )}
    </div>
  </div>
);

export default TableToolbar;
