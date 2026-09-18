"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useMemo, useState } from 'react'
import type { ApexOptions } from "apexcharts";
import { all_routes } from "@/router/all_routes";
import {
  ReportObjectsData,
  ReportBuilderDefaultState,
  ReportFilterOperators,
  ReportFilterValues,
  ReportAggregationOptions,
  ReportSortDirectionOptions,
  ReportDateRangeOptions,
  ReportVisualizationOptions,
  ReportSampleDeals,
  ReportSampleLeads,
  ReportGenericSampleBase,
  ReportPreviewKpiTiles,
  ReportPreviewChartCategories,
  ReportPreviewChartValues,
  ReportPreviewStackedSeries,
  ReportActionMessages,
  type ReportObjectKey,
} from "../../../../core/json/reportBuilderData";

const route = all_routes;

interface FilterRow {
  field: string;
  op: string;
  value: string;
}
interface FilterGroup {
  join: "and" | "or";
  rows: FilterRow[];
}

const STEPS = [
  { num: 1, label: "Select Object", hint: "CRM record type" },
  { num: 2, label: "Select Fields", hint: "Report columns" },
  { num: 3, label: "Add Filters", hint: "Narrow the data" },
  { num: 4, label: "Group & Sort", hint: "Aggregate" },
  { num: 5, label: "Visualization", hint: "Chart type" },
  { num: 6, label: "Preview", hint: "Save & share" },
];

const ReportBuilderComponent = () => {
  const [step, setStep] = useState(1);
  const [reportName, setReportName] = useState("Pipeline by Stage - Q3 2026");
  const [reportDesc, setReportDesc] = useState(
    "Open pipeline grouped by stage, excluding closed-lost deals."
  );
  const [objectKey, setObjectKey] = useState<ReportObjectKey>(ReportBuilderDefaultState.object);
  const [fields, setFields] = useState<string[]>(ReportBuilderDefaultState.fields);
  const [groups, setGroups] = useState<FilterGroup[]>(ReportBuilderDefaultState.groups);
  const [groupBy, setGroupBy] = useState("");
  const [sortBy, setSortBy] = useState(ReportBuilderDefaultState.sortBy);
  const [sortDir, setSortDir] = useState(ReportBuilderDefaultState.sortDir);
  const [aggregation, setAggregation] = useState(ReportBuilderDefaultState.aggregation);
  const [range, setRange] = useState(ReportBuilderDefaultState.range);
  const [viz, setViz] = useState(ReportBuilderDefaultState.viz);
  const [toast, setToast] = useState<string | null>(null);

  const currentObject = useMemo(
    () => ReportObjectsData.find((o) => o.key === objectKey) ?? ReportObjectsData[0],
    [objectKey]
  );

  const availableFields = currentObject.fields.filter((f) => !fields.includes(f.name));
  const filterCount = groups.reduce((n, g) => n + g.rows.length, 0);

  const showToast = (action: keyof typeof ReportActionMessages) => {
    setToast(ReportActionMessages[action]);
    window.setTimeout(() => setToast(null), 3500);
  };

  const toggleField = (name: string) => {
    setFields((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const addFilterGroup = () => {
    setGroups((prev) => [...prev, { join: "and", rows: [{ field: currentObject.fields[0]?.name ?? "", op: "is", value: "" }] }]);
  };
  const addFilterRow = (groupIdx: number) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIdx
          ? { ...g, rows: [...g.rows, { field: currentObject.fields[0]?.name ?? "", op: "is", value: "" }] }
          : g
      )
    );
  };
  const updateFilterRow = (groupIdx: number, rowIdx: number, patch: Partial<FilterRow>) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIdx
          ? { ...g, rows: g.rows.map((r, j) => (j === rowIdx ? { ...r, ...patch } : r)) }
          : g
      )
    );
  };
  const removeFilterRow = (groupIdx: number, rowIdx: number) => {
    setGroups((prev) =>
      prev
        .map((g, i) => (i === groupIdx ? { ...g, rows: g.rows.filter((_, j) => j !== rowIdx) } : g))
        .filter((g) => g.rows.length > 0)
    );
  };
  const removeFilterGroup = (groupIdx: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== groupIdx));
  };
  const clearFilters = () => setGroups([]);

  // Fabricate a plausible preview row set for any object without a
  // hand-authored sample array, cycling through the generic base values.
  const sampleFor = (cols: string[]) => {
    const base = ReportGenericSampleBase;
    return Array.from({ length: 5 }, (_, i) => {
      const row: Record<string, string | number> = { key: String(i + 1) };
      cols.forEach((col, j) => {
        const type = currentObject.fields.find((f) => f.name === col)?.type;
        if (type === "num") row[col] = base.amounts[(i + j) % base.amounts.length];
        else if (type === "date") row[col] = base.dates[(i + j) % base.dates.length];
        else if (type === "pick") row[col] = base.statuses[(i + j) % base.statuses.length];
        else row[col] = j === 0 ? `${currentObject.label.slice(0, -1)} ${i + 1}` : base.companies[(i + j) % base.companies.length];
      });
      return row;
    });
  };

  const previewRows = useMemo(() => {
    if (objectKey === "deals" && fields.length) {
      return ReportSampleDeals;
    }
    if (objectKey === "leads" && fields.length) {
      return ReportSampleLeads;
    }
    return sampleFor(fields.length ? fields : currentObject.fields.slice(0, 4).map((f) => f.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectKey, fields, currentObject]);

  const previewColumns =
    objectKey === "deals"
      ? ["DealName", "Company", "Stage", "Amount", "Probability", "Owner", "Source", "Team", "Region", "ExpectedClose"]
      : objectKey === "leads"
      ? ["LeadName", "Company", "Email", "Phone", "LeadSource", "LeadStatus", "LeadScore", "Owner", "Industry", "Region", "EstValue", "CreatedDate"]
      : fields.length
      ? fields
      : currentObject.fields.slice(0, 4).map((f) => f.name);

  const chartSeries: ApexOptions["series"] =
    viz === "stacked"
      ? ReportPreviewStackedSeries
      : viz === "donut" || viz === "funnel"
      ? ReportPreviewChartValues
      : [{ name: aggregation === "count" ? "Count" : "Amount", data: ReportPreviewChartValues }];

  const chartOptions: ApexOptions = {
    chart: { type: viz === "stacked" ? "bar" : (viz as ApexOptions["chart"] extends { type?: infer T } ? T : any) || "bar", stacked: viz === "stacked", toolbar: { show: false } },
    xaxis: { categories: ReportPreviewChartCategories },
    labels: ReportPreviewChartCategories,
    legend: { show: viz === "stacked" || viz === "donut" },
    dataLabels: { enabled: viz === "donut" || viz === "funnel" },
    plotOptions: viz === "funnel" ? { bar: { horizontal: true, isFunnel: true } } : undefined,
  };

  const summaryText = `${previewRows.length < 6 ? previewRows.length : 53} records · Grouped by ${groupBy || "none"} · ${aggregation} of ${sortBy || "Amount"}`;

  return (
    <>
      {/* ========================
				Start Page Content
			========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div>
              <h4 className="mb-1">Report Builder</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">Reports</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Report Builder
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light shadow"
                onClick={() => showToast("export")}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </button>
              <button
                type="button"
                className="btn btn-outline-light shadow"
                onClick={() => showToast("print")}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <button
                type="button"
                className="btn btn-outline-light shadow"
                onClick={() => showToast("share")}
              >
                <i className="ti ti-share me-1" />
                Share
              </button>
              <Link href={route.scheduledReports} className="btn btn-outline-light shadow">
                <i className="ti ti-clock me-1" />
                Schedule
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => showToast("save")}
              >
                <i className="ti ti-device-floppy me-1" />
                Save Report
              </button>
              <Link
                href="#"
                className="btn btn-icon btn-outline-light shadow"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Collapse"
                data-bs-original-title="Collapse"
                id="collapse-header"
              >
                <i className="ti ti-transition-top" />
              </Link>
            </div>
          </div>
          {/* End Page Header */}
          {/* Reports Nav */}
          <ul className="nav nav-tabs nav-bordered mb-4 flex-nowrap overflow-x-auto">
            <li className="nav-item">
              <Link href={route.reportBuilder} className="nav-link text-nowrap active">
                <i className="ti ti-tool me-1" />
                Report Builder
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.scheduledReports} className="nav-link text-nowrap">
                <i className="ti ti-clock-hour-4 me-1" />
                Scheduled
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.salesForecasting} className="nav-link text-nowrap">
                <i className="ti ti-chart-arrows-vertical me-1" />
                Forecasting
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.winLossAnalysis} className="nav-link text-nowrap">
                <i className="ti ti-trophy me-1" />
                Win/Loss
              </Link>
            </li>
            <li className="nav-item">
              <Link href={route.salesVelocity} className="nav-link text-nowrap">
                <i className="ti ti-rocket me-1" />
                Velocity
              </Link>
            </li>
          </ul>
          {/* End Reports Nav */}
          <div className="report-builder">
            {toast && (
              <div className="alert alert-info" role="status">
                {toast}
              </div>
            )}
            <div className="card mb-0">
              <div className="card-body">
                {/* Workflow steps */}
                <ol className="import-steps">
                  {STEPS.map((s) => (
                    <li key={s.num}>
                      <button
                        type="button"
                        className={`import-step${step === s.num ? " is-active" : ""}${step > s.num ? " is-complete" : ""}`}
                        aria-current={step === s.num ? "step" : undefined}
                        onClick={() => setStep(s.num)}
                      >
                        <span className="import-step-num">{s.num}</span>
                        <span>
                          <span className="import-step-label">{s.label}</span>
                          <span className="import-step-hint">{s.hint}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
                {/* End Workflow steps */}
                {/* Step 1 : Object */}
                {step === 1 && (
                  <div className="import-pane is-active">
                    <div className="row g-3 mb-4">
                      <div className="col-lg-5">
                        <label className="form-label" htmlFor="rb_name">
                          Report name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rb_name"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-7">
                        <label className="form-label" htmlFor="rb_desc">
                          Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rb_desc"
                          value={reportDesc}
                          onChange={(e) => setReportDesc(e.target.value)}
                        />
                      </div>
                    </div>
                    <h6 className="mb-1">Which CRM object is this report about?</h6>
                    <p className="text-muted fs-13 mb-3">
                      The object decides which fields and filters are available in the
                      next steps.
                    </p>
                    <div className="row g-2">
                      {ReportObjectsData.map((o) => (
                        <div className="col-lg-3 col-md-4 col-6 d-flex" key={o.key}>
                          <button
                            type="button"
                            className={`rb-viz w-100${objectKey === o.key ? " is-selected" : ""}`}
                            onClick={() => {
                              setObjectKey(o.key);
                              setFields(o.fields.slice(0, 5).map((f) => f.name));
                              setGroupBy("");
                              setSortBy(o.fields[0]?.name ?? "");
                            }}
                          >
                            <i className={`ti ${o.icon}`} />
                            <span>{o.label}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* End Step 1 */}
                {/* Step 2 : Fields */}
                {step === 2 && (
                  <div className="import-pane">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                      <div>
                        <h6 className="mb-1">
                          Choose the columns for your <span>{currentObject.label}</span> report
                        </h6>
                        <p className="text-muted fs-13 mb-0">
                          Click a field to add or remove it. Order follows the order
                          you pick.
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => setFields([])}
                        >
                          Clear all
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => setFields(currentObject.fields.map((f) => f.name))}
                        >
                          Select all
                        </button>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-lg-5">
                        <span className="fs-12 text-muted d-block mb-2">
                          Available fields
                        </span>
                        <div className="rb-fields">
                          {availableFields.map((f) => (
                            <button
                              type="button"
                              key={f.name}
                              className="rb-field-chip"
                              onClick={() => toggleField(f.name)}
                            >
                              <i className="ti ti-plus me-1" />
                              {f.name}
                            </button>
                          ))}
                          {availableFields.length === 0 && (
                            <p className="fs-12 text-muted mb-0">All fields selected.</p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <span className="fs-12 text-muted d-block mb-2">
                          Selected columns
                        </span>
                        <div className="rb-selected">
                          {fields.map((name, idx) => (
                            <button
                              type="button"
                              key={name}
                              className="rb-field-chip is-selected"
                              onClick={() => toggleField(name)}
                            >
                              <span className="badge bg-light text-dark me-1">{idx + 1}</span>
                              {name}
                              <i className="ti ti-x ms-1" />
                            </button>
                          ))}
                          {fields.length === 0 && (
                            <p className="fs-12 text-muted mb-0">No columns selected yet.</p>
                          )}
                        </div>
                        <div className="ai-insight is-medium mt-3">
                          <div className="d-flex align-items-start gap-2">
                            <span className="ai-chip flex-shrink-0">
                              <i className="ti ti-bulb" />
                              Tip
                            </span>
                            <p className="mb-0 fs-13">
                              Reports with 5-8 columns stay readable when exported to
                              PDF. Add more only if the report is meant for Excel.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* End Step 2 */}
                {/* Step 3 : Filters */}
                {step === 3 && (
                  <div className="import-pane">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                      <div>
                        <h6 className="mb-1">Filter the data</h6>
                        <p className="text-muted fs-13 mb-0">
                          Conditions inside a group combine with AND/OR. Groups always
                          combine with AND.
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-light text-dark">
                          {filterCount} filter{filterCount === 1 ? "" : "s"}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={clearFilters}
                        >
                          <i className="ti ti-filter-off me-1" />
                          Clear All
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={addFilterGroup}
                        >
                          <i className="ti ti-layers-intersect me-1" />
                          Add group
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() =>
                            groups.length
                              ? addFilterRow(groups.length - 1)
                              : addFilterGroup()
                          }
                        >
                          <i className="ti ti-plus me-1" />
                          Add filter
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => showToast("save")}
                        >
                          <i className="ti ti-check me-1" />
                          Apply Filters
                        </button>
                      </div>
                    </div>
                    {groups.map((g, gi) => (
                      <div className="card mb-2" key={gi}>
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fs-12 fw-medium text-dark">
                              Filter group {gi + 1}
                            </span>
                            {groups.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light shadow"
                                onClick={() => removeFilterGroup(gi)}
                              >
                                <i className="ti ti-x me-1" />
                                Remove group
                              </button>
                            )}
                          </div>
                          {g.rows.map((r, ri) => {
                            const picklist = ReportFilterValues[r.field];
                            return (
                              <div className="row g-2 align-items-center mb-2" key={ri}>
                                <div className="col-lg-3">
                                  <select
                                    className="form-select"
                                    value={r.field}
                                    onChange={(e) => updateFilterRow(gi, ri, { field: e.target.value })}
                                  >
                                    {currentObject.fields.map((f) => (
                                      <option key={f.name} value={f.name}>{f.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="col-lg-3">
                                  <select
                                    className="form-select"
                                    value={r.op}
                                    onChange={(e) => updateFilterRow(gi, ri, { op: e.target.value })}
                                  >
                                    {ReportFilterOperators.map((op) => (
                                      <option key={op} value={op}>{op}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="col-lg-5">
                                  {picklist ? (
                                    <select
                                      className="form-select"
                                      value={r.value}
                                      onChange={(e) => updateFilterRow(gi, ri, { value: e.target.value })}
                                    >
                                      <option value="">Select value</option>
                                      {picklist.map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Value"
                                      value={r.value}
                                      onChange={(e) => updateFilterRow(gi, ri, { value: e.target.value })}
                                    />
                                  )}
                                </div>
                                <div className="col-lg-1">
                                  <button
                                    type="button"
                                    className="btn btn-icon btn-outline-light shadow"
                                    onClick={() => removeFilterRow(gi, ri)}
                                  >
                                    <i className="ti ti-trash" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light shadow mt-2"
                            onClick={() => addFilterRow(gi)}
                          >
                            <i className="ti ti-plus me-1" />
                            Add condition
                          </button>
                        </div>
                      </div>
                    ))}
                    {groups.length === 0 && (
                      <p className="fs-13 text-muted">No filters yet — add a group to narrow the data.</p>
                    )}
                  </div>
                )}
                {/* End Step 3 */}
                {/* Step 4 : Group & Sort */}
                {step === 4 && (
                  <div className="import-pane">
                    <h6 className="mb-1">Group, sort and aggregate</h6>
                    <p className="text-muted fs-13 mb-3">
                      Grouping rolls records up; aggregation decides how numeric
                      columns are summarised.
                    </p>
                    <div className="row g-3">
                      <div className="col-lg-3 col-md-6">
                        <label className="form-label" htmlFor="rb_groupby">
                          Group by
                        </label>
                        <select
                          className="form-select"
                          id="rb_groupby"
                          value={groupBy}
                          onChange={(e) => setGroupBy(e.target.value)}
                        >
                          <option value="">None</option>
                          {currentObject.fields.map((f) => (
                            <option key={f.name} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label className="form-label" htmlFor="rb_sortby">
                          Sort by
                        </label>
                        <select
                          className="form-select"
                          id="rb_sortby"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          {currentObject.fields.map((f) => (
                            <option key={f.name} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-2 col-md-6">
                        <label className="form-label" htmlFor="rb_sortdir">
                          Direction
                        </label>
                        <select
                          className="form-select"
                          id="rb_sortdir"
                          value={sortDir}
                          onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                        >
                          {ReportSortDirectionOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-2 col-md-6">
                        <label className="form-label" htmlFor="rb_agg">
                          Aggregation
                        </label>
                        <select
                          className="form-select"
                          id="rb_agg"
                          value={aggregation}
                          onChange={(e) => setAggregation(e.target.value)}
                        >
                          {ReportAggregationOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-2 col-md-6">
                        <label className="form-label" htmlFor="rb_range">
                          Date range
                        </label>
                        <select
                          className="form-select"
                          id="rb_range"
                          value={range}
                          onChange={(e) => setRange(e.target.value)}
                        >
                          {ReportDateRangeOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="ai-insight is-medium mt-4">
                      <div className="d-flex align-items-start gap-2">
                        <span className="ai-chip flex-shrink-0">
                          <i className="ti ti-bulb" />
                          Tip
                        </span>
                        <p className="mb-0 fs-13">
                          Grouping by <strong>Stage</strong> with a{" "}
                          <strong>Sum</strong> of Amount produces the classic pipeline
                          report - pair it with a Funnel or Stacked chart on the next
                          step.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* End Step 4 */}
                {/* Step 5 : Visualization */}
                {step === 5 && (
                  <div className="import-pane">
                    <h6 className="mb-1">How should this report be displayed?</h6>
                    <p className="text-muted fs-13 mb-3">
                      You can change this at any time without rebuilding the report.
                    </p>
                    <div className="row g-2">
                      {ReportVisualizationOptions.map((v) => (
                        <div className="col-lg-3 col-md-4 col-6 d-flex" key={v.value}>
                          <button
                            type="button"
                            className={`rb-viz${viz === v.value ? " is-selected" : ""}`}
                            onClick={() => setViz(v.value)}
                          >
                            <i className={`ti ${v.icon}`} />
                            <span>{v.label}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* End Step 5 */}
                {/* Step 6 : Preview */}
                {step === 6 && (
                  <div className="import-pane">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                      <div>
                        <h6 className="mb-1">Report preview</h6>
                        <p className="text-muted fs-12 mb-0">{summaryText}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => showToast("dashboard")}
                        >
                          <i className="ti ti-layout-dashboard me-1" />
                          Pin to dashboard
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => showToast("edit")}
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => showToast("saveas")}
                        >
                          <i className="ti ti-copy me-1" />
                          Save As
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow text-danger"
                          onClick={() => showToast("delete")}
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="border rounded p-3">
                      {viz === "table" && (
                        <div className="table-responsive">
                          <table className="table table-nowrap mb-0">
                            <thead className="table-light">
                              <tr>
                                {previewColumns.map((c) => (
                                  <th key={c}>{c}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previewRows.map((row: any) => (
                                <tr key={row.key}>
                                  {previewColumns.map((c) => (
                                    <td key={c}>{row[c] ?? "-"}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {viz === "kpi" && (
                        <div className="row g-3">
                          {ReportPreviewKpiTiles.map((k) => (
                            <div className="col-lg-3 col-sm-6" key={k.label}>
                              <div className="border rounded p-3 text-center">
                                <div className="fs-12 text-muted mb-1">{k.label}</div>
                                <div className="fs-22 fw-bold text-dark">{k.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {viz !== "table" && viz !== "kpi" && (
                        <Chart
                          options={chartOptions}
                          series={chartSeries}
                          type={
                            viz === "donut"
                              ? "donut"
                              : viz === "funnel"
                              ? "bar"
                              : viz === "stacked"
                              ? "bar"
                              : (viz as "bar" | "line" | "area")
                          }
                          height={340}
                        />
                      )}
                    </div>
                  </div>
                )}
                {/* End Step 6 */}
                {/* Wizard footer */}
                <div className="d-flex align-items-center justify-content-between gap-2 border-top pt-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-light shadow"
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    <i className="ti ti-arrow-left me-1" />
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep((s) => Math.min(6, s + 1))}
                  >
                    {step === 6 ? "Done" : "Continue"} <i className="ti ti-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
          <p className="mb-md-0 mb-1">
            Copyright ©
            <Link
              href="#"
              className="link-primary text-decoration-underline"
            >
              CRMS
            </Link>
          </p>
          <div className="d-flex align-items-center gap-2 footer-links justify-content-center justify-content-md-end">
            <Link href="#">About</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact Us</Link>
          </div>
        </footer>
        {/* End Footer */}
      </div>
      {/* ========================
				End Page Content
			========================= */}
    </>
  )
}

export default ReportBuilderComponent;
