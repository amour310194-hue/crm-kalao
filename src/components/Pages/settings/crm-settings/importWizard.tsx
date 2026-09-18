"use client";
import Link from "next/link";
import { useState } from "react";
import { all_routes } from "@/router/all_routes";

const route = all_routes;

const SAMPLE_COLUMNS = [
  { column: "full_name", sample: "Marcus Whitfield", field: "Lead Name" },
  { column: "company_name", sample: "Northwind Logistics", field: "Company" },
  { column: "email_address", sample: "m.whitfield@northwind.io", field: "Email" },
  { column: "phone", sample: "+1 415 555 0134", field: "Phone" },
  { column: "source", sample: "Webinar", field: "Lead Source" },
  { column: "notes", sample: "Requested pricing follow-up", field: "Do not import" },
];
const CRM_FIELDS = ["Lead Name", "Company", "Email", "Phone", "Lead Source", "Owner", "Do not import"];

const ISSUE_ROWS = [
  { row: 14, column: "email_address", value: "marcus@", issue: "Invalid email format", severity: "error" as const },
  { row: 27, column: "phone", value: "(missing)", issue: "Phone number missing", severity: "warning" as const },
  { row: 41, column: "company_name", value: "Halcyon Partners", issue: "Possible duplicate of existing company", severity: "warning" as const },
  { row: 58, column: "email_address", value: "ellis.vandermeer", issue: "Invalid email format", severity: "error" as const },
  { row: 63, column: "source", value: "trad-show", issue: "Unrecognised value, will import as-is", severity: "warning" as const },
  { row: 79, column: "full_name", value: "(empty)", issue: "Required field missing", severity: "warning" as const },
  { row: 102, column: "email_address", value: "priya@meridianhealth.com", issue: "Duplicate of existing lead", severity: "warning" as const },
];

const STEPS = [
  { num: 1, label: "Upload File", hint: "CSV or Excel" },
  { num: 2, label: "Map Fields", hint: "Match to CRM fields" },
  { num: 3, label: "Review", hint: "Duplicates & errors" },
  { num: 4, label: "Import", hint: "Run & summary" },
];

const ImportWizardComponent = () => {
  const [step, setStep] = useState(1);
  const [maxReachable, setMaxReachable] = useState(1);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [mapping, setMapping] = useState<string[]>(SAMPLE_COLUMNS.map((c) => c.field));
  const [dupeStrategy, setDupeStrategy] = useState<"skip" | "update" | "create">("skip");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const goTo = (n: number) => {
    if (n <= maxReachable) setStep(n);
  };

  const handleFileSelect = (f: File | null) => {
    if (!f) return;
    setFile({ name: f.name, size: f.size });
  };

  const startImport = () => {
    setStep(4);
    setImporting(true);
    setDone(false);
    setProgress(0);
    const tick = () => {
      setProgress((p) => {
        const next = Math.min(100, p + 20);
        if (next >= 100) {
          window.setTimeout(() => {
            setImporting(false);
            setDone(true);
          }, 300);
        } else {
          window.setTimeout(tick, 250);
        }
        return next;
      });
    };
    window.setTimeout(tick, 250);
  };

  const restart = () => {
    setStep(1);
    setMaxReachable(1);
    setFile(null);
    setImporting(false);
    setDone(false);
    setProgress(0);
    setDupeStrategy("skip");
  };

  const next = () => {
    if (step === 1 && !file) return;
    if (step === 3) {
      startImport();
      setMaxReachable(4);
      return;
    }
    const n = Math.min(4, step + 1);
    setStep(n);
    setMaxReachable((m) => Math.max(m, n));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

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
              <h4 className="mb-1">Import Wizard</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">CRM Settings</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Import Wizard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <Link
                href="#"
                className="btn btn-outline-light shadow"
              >
                <i className="ti ti-download me-1" />
                Download Sample CSV
              </Link>
              <Link
                href="#"
                className="btn btn-outline-light shadow"
              >
                <i className="ti ti-history me-1" />
                Import History
              </Link>
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
          {/* start row */}
          <div className="row">
            <div className="col-12">
              <div className="card mb-0">
                <div className="card-body import-wizard">
                  {/* Step Header */}
                  <ol className="import-steps">
                    {STEPS.map((s) => {
                      const locked = s.num > maxReachable && s.num !== step;
                      const cls = [
                        "import-step",
                        step === s.num ? "is-active" : "",
                        step > s.num ? "is-complete" : "",
                        locked ? "is-locked" : "",
                      ].filter(Boolean).join(" ");
                      return (
                        <li key={s.num}>
                          <button
                            type="button"
                            className={cls}
                            aria-current={step === s.num ? "step" : undefined}
                            disabled={locked}
                            onClick={() => goTo(s.num)}
                          >
                            <span className="import-step-num">{s.num}</span>
                            <span>
                              <span className="import-step-label">{s.label}</span>
                              <span className="import-step-hint">{s.hint}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  {/* End Step Header */}
                  {/* Step 1 : Upload */}
                  <div className={`import-pane${step === 1 ? " is-active" : ""}`}>
                    <div className="row g-4">
                      <div className="col-lg-7">
                        <h6 className="mb-1">Choose what you are importing</h6>
                        <p className="text-muted fs-13 mb-3">
                          Each record type has its own set of required fields.
                        </p>
                        <div className="row g-3 mb-4">
                          <div className="col-sm-6">
                            <label
                              className="form-label"
                              htmlFor="import_record_type"
                            >
                              Record type
                            </label>
                            <select
                              className="form-select"
                              id="import_record_type"
                             defaultValue="Leads">
                              <option>Leads</option>
                              <option>Contacts</option>
                              <option>Companies</option>
                              <option>Deals</option>
                              <option>Products</option>
                            </select>
                          </div>
                          <div className="col-sm-6">
                            <label
                              className="form-label"
                              htmlFor="import_owner"
                            >
                              Assign records to
                            </label>
                            <select className="form-select" id="import_owner" defaultValue="Keep owner from file">
                              <option>Keep owner from file</option>
                              <option>Me (Adrian Herrera)</option>
                              <option>Round robin - Sales team</option>
                              <option>Unassigned</option>
                            </select>
                          </div>
                        </div>
                        <h6 className="mb-1">Upload your file</h6>
                        <p className="text-muted fs-13 mb-3">
                          CSV, XLS or XLSX up to 20 MB.
                        </p>
                        {!file && (
                          <div className="import-dropzone">
                            <input
                              type="file"
                              id="import_file"
                              accept=".csv,.xls,.xlsx"
                              aria-label="Choose a file to import"
                              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                            />
                            <span className="import-dropzone-icon">
                              <i className="ti ti-upload" />
                            </span>
                            <h6 className="mb-1">
                              Drag &amp; drop your file here
                            </h6>
                            <p className="text-muted fs-13 mb-0">
                              or{" "}
                              <span className="link-primary text-decoration-underline">
                                browse
                              </span>
                              from your computer
                            </p>
                          </div>
                        )}
                        {file && (
                          <div className="import-file">
                            <span className="import-file-icon">
                              <i className="ti ti-file-spreadsheet" />
                            </span>
                            <div className="flex-grow-1">
                              <p className="mb-0 fw-medium text-dark">{file.name}</p>
                              <span className="fs-12 text-muted">
                                {(file.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm btn-outline-light"
                              onClick={() => setFile(null)}
                              aria-label="Remove selected file"
                            >
                              <i className="ti ti-trash" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="col-lg-5">
                        <div className="border rounded p-3 h-100">
                          <h6 className="mb-3">File options</h6>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="import_delimiter"
                            >
                              Delimiter
                            </label>
                            <select
                              className="form-select"
                              id="import_delimiter"
                             defaultValue="Comma ( , )">
                              <option>Comma ( , )</option>
                              <option>Semicolon ( ; )</option>
                              <option>Tab</option>
                              <option>Pipe ( | )</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="import_encoding"
                            >
                              Encoding
                            </label>
                            <select
                              className="form-select"
                              id="import_encoding"
                             defaultValue="UTF-8">
                              <option>UTF-8</option>
                              <option>ISO-8859-1</option>
                              <option>Windows-1252</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="import_dateformat"
                            >
                              Date format
                            </label>
                            <select
                              className="form-select"
                              id="import_dateformat"
                             defaultValue="DD/MM/YYYY">
                              <option>DD/MM/YYYY</option>
                              <option>MM/DD/YYYY</option>
                              <option>YYYY-MM-DD</option>
                            </select>
                          </div>
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="import_has_header"
                              defaultChecked
                            />
                            <label
                              className="form-check-label fs-13"
                              htmlFor="import_has_header"
                            >
                              First row contains column names
                            </label>
                          </div>
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="import_trim_space"
                              defaultChecked
                            />
                            <label
                              className="form-check-label fs-13"
                              htmlFor="import_trim_space"
                            >
                              Trim leading &amp; trailing spaces
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Step 1 */}
                  {/* Step 2 : Map Fields */}
                  <div className={`import-pane${step === 2 ? " is-active" : ""}`}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <div>
                        <h6 className="mb-1">
                          Match your columns to CRM fields
                        </h6>
                        <p className="text-muted fs-13 mb-0">
                          Fields marked * are required. Columns set to{" "}
                          <em>Do not import</em> are ignored.
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light shadow"
                          onClick={() => setMapping(SAMPLE_COLUMNS.map(() => "Do not import"))}
                        >
                          Clear all
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary flex-wrap"
                          onClick={() => setMapping(SAMPLE_COLUMNS.map((c) => c.field))}
                        >
                          <i className="ti ti-bolt me-1" />
                          Auto-map
                        </button>
                      </div>
                    </div>
                    <div className="alert alert-light border d-flex align-items-center gap-2 fs-13" role="status">
                      {mapping.filter((m) => m !== "Do not import").length} of {SAMPLE_COLUMNS.length} columns mapped
                    </div>
                    <div className="table-responsive">
                      <table className="table table-nowrap import-map-table">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Column in file</th>
                            <th scope="col">Sample value</th>
                            <th scope="col">
                              <span className="visually-hidden">Maps to</span>
                            </th>
                            <th scope="col" style={{ width: 280 }}>
                              CRM field
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_COLUMNS.map((c, i) => (
                            <tr key={c.column}>
                              <td className="fw-medium text-dark">{c.column}</td>
                              <td className="text-muted">{c.sample}</td>
                              <td>
                                <i className="ti ti-arrow-right text-muted" />
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={mapping[i]}
                                  onChange={(e) =>
                                    setMapping((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                                  }
                                >
                                  {CRM_FIELDS.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* End Step 2 */}
                  {/* Step 3 : Review */}
                  <div className={`import-pane${step === 3 ? " is-active" : ""}`}>
                    <h6 className="mb-1">Review before importing</h6>
                    <p className="text-muted fs-13 mb-3">
                      128 rows were read from your file.
                    </p>
                    <div className="row g-3 mb-4">
                      <div className="col-sm-6 col-xl-3">
                        <div className="import-stat">
                          <span className="import-stat-icon bg-soft-success text-success">
                            <i className="ti ti-circle-check" />
                          </span>
                          <div>
                            <div className="import-stat-value">121</div>
                            <div className="import-stat-label">
                              Rows ready to import
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3">
                        <div className="import-stat">
                          <span className="import-stat-icon bg-soft-warning text-warning">
                            <i className="ti ti-alert-triangle" />
                          </span>
                          <div>
                            <div className="import-stat-value">5</div>
                            <div className="import-stat-label">
                              Rows with warnings
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3">
                        <div className="import-stat">
                          <span className="import-stat-icon bg-soft-danger text-danger">
                            <i className="ti ti-alert-circle" />
                          </span>
                          <div>
                            <div className="import-stat-value">2</div>
                            <div className="import-stat-label">
                              Rows with errors
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3">
                        <div className="import-stat">
                          <span className="import-stat-icon bg-soft-info text-info">
                            <i className="ti ti-users" />
                          </span>
                          <div>
                            <div className="import-stat-value">9</div>
                            <div className="import-stat-label">
                              Possible duplicates
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h6 className="mb-2">How should duplicates be handled?</h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className={`import-strategy${dupeStrategy === "skip" ? " is-selected" : ""}`}>
                          <div className="form-check mb-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="import_dupe_strategy"
                              id="import_dupe_skip"
                              checked={dupeStrategy === "skip"}
                              onChange={() => setDupeStrategy("skip")}
                            />
                            <span className="fw-medium text-dark">
                              Skip duplicates
                            </span>
                          </div>
                          <span className="fs-12 text-muted d-block">
                            Keep the existing record untouched and ignore the
                            incoming row.
                          </span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`import-strategy${dupeStrategy === "update" ? " is-selected" : ""}`}>
                          <div className="form-check mb-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="import_dupe_strategy"
                              id="import_dupe_update"
                              checked={dupeStrategy === "update"}
                              onChange={() => setDupeStrategy("update")}
                            />
                            <span className="fw-medium text-dark">
                              Update existing
                            </span>
                          </div>
                          <span className="fs-12 text-muted d-block">
                            Overwrite mapped fields on the matching record with
                            the new values.
                          </span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`import-strategy${dupeStrategy === "create" ? " is-selected" : ""}`}>
                          <div className="form-check mb-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="import_dupe_strategy"
                              id="import_dupe_create"
                              checked={dupeStrategy === "create"}
                              onChange={() => setDupeStrategy("create")}
                            />
                            <span className="fw-medium text-dark">
                              Create anyway
                            </span>
                          </div>
                          <span className="fs-12 text-muted d-block">
                            Import as a new record even when a match is found.
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label
                          className="form-label"
                          htmlFor="import_match_field"
                        >
                          Match duplicates on
                        </label>
                        <select className="form-select" id="import_match_field" defaultValue="Email address">
                          <option>Email address</option>
                          <option>Email + Company</option>
                          <option>Phone number</option>
                          <option>Company name</option>
                        </select>
                      </div>
                      <div className="col-md-6 d-flex align-items-end">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="import_skip_errors"
                            defaultChecked
                          />
                          <label
                            className="form-check-label fs-13"
                            htmlFor="import_skip_errors"
                          >
                            Skip rows with errors and continue
                          </label>
                        </div>
                      </div>
                    </div>
                    <h6 className="mb-2">Rows that need attention</h6>
                    <div className="table-responsive">
                      <table className="table table-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Row</th>
                            <th scope="col">Column</th>
                            <th scope="col">Value</th>
                            <th scope="col">Issue</th>
                            <th scope="col">Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ISSUE_ROWS.map((r) => (
                            <tr key={r.row + r.column}>
                              <td>{r.row}</td>
                              <td>{r.column}</td>
                              <td className="text-muted">{r.value}</td>
                              <td>{r.issue}</td>
                              <td>
                                <span className={`badge bg-soft-${r.severity === "error" ? "danger" : "warning"} text-${r.severity === "error" ? "danger" : "warning"} text-capitalize`}>
                                  {r.severity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* End Step 3 */}
                  {/* Step 4 : Result */}
                  <div className={`import-pane${step === 4 ? " is-active" : ""}`}>
                    {importing && (
                    <div className="text-center py-4">
                      <h6 className="mb-3">Importing your records</h6>
                      <div
                        className="progress mx-auto mb-2"
                        style={{ maxWidth: 420, height: 8 }}
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ width: `${progress}%` }}
                          aria-valuenow={progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="text-muted fs-13 mb-0" aria-live="polite">
                        {progress}% complete
                      </p>
                    </div>
                    )}
                    {done && (
                    <div className="text-center py-4 pb-0">
                      <span className="import-result-icon">
                        <i className="ti ti-circle-check" />
                      </span>
                      <h5 className="mb-1">Import complete</h5>
                      <p className="text-muted fs-13 mb-4">
                        121 of 128 rows were imported into
                        <strong>Leads</strong>.
                      </p>
                      <div className="row g-3 justify-content-center mb-4">
                        <div className="col-sm-6 col-lg-3">
                          <div className="import-stat">
                            <span className="import-stat-icon bg-soft-success text-success">
                              <i className="ti ti-user-plus" />
                            </span>
                            <div>
                              <div className="import-stat-value">112</div>
                              <div className="import-stat-label">Created</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                          <div className="import-stat">
                            <span className="import-stat-icon bg-soft-info text-info">
                              <i className="ti ti-refresh" />
                            </span>
                            <div>
                              <div className="import-stat-value">9</div>
                              <div className="import-stat-label">Updated</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                          <div className="import-stat">
                            <span className="import-stat-icon bg-soft-warning text-warning">
                              <i className="ti ti-player-skip-forward" />
                            </span>
                            <div>
                              <div className="import-stat-value">5</div>
                              <div className="import-stat-label">Skipped</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                          <div className="import-stat">
                            <span className="import-stat-icon bg-soft-danger text-danger">
                              <i className="ti ti-alert-circle" />
                            </span>
                            <div>
                              <div className="import-stat-value">2</div>
                              <div className="import-stat-label">Failed</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                        <Link href={route.leads} className="btn btn-primary">
                          <i className="ti ti-eye me-1" />
                          View imported leads
                        </Link>
                        <Link
                          href="#"
                          className="btn btn-outline-light shadow"
                        >
                          <i className="ti ti-download me-1" />
                          Download error log
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline-light shadow"
                          onClick={restart}
                        >
                          <i className="ti ti-refresh me-1" />
                          Import another file
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                  {/* End Step 4 */}
                  {/* Wizard Footer */}
                  {step < 4 && (
                  <div className="d-flex align-items-center justify-content-between gap-2 border-top pt-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-light shadow"
                      disabled={step === 1}
                      onClick={back}
                    >
                      <i className="ti ti-arrow-left me-1" />
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={step === 1 && !file}
                      onClick={next}
                    >
                      {step === 3 ? "Start Import" : "Continue"} <i className="ti ti-arrow-right ms-1" />
                    </button>
                  </div>
                  )}
                  {/* End Wizard Footer */}
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
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
  );
};

export default ImportWizardComponent;
