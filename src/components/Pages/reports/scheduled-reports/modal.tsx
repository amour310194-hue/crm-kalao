"use client";
import Link from "next/link";
import { useState } from 'react'
import { all_routes } from "@/router/all_routes";
import {
  ScheduledReportHistoryData,
  type ScheduledReportRow,
} from "../../../../core/json/scheduledReportsListData";

const route = all_routes;

interface ModalProps {
  editing: ScheduledReportRow | null;
  historyTarget: ScheduledReportRow | null;
}

const Modal = ({ editing, historyTarget }: ModalProps) => {
  const [freq, setFreq] = useState("Weekly");

  return (
    <>
  {/* Schedule Detail Modal */}
  <div
    className="modal fade"
    id="schedule_modal"
    tabIndex={-1}
    aria-labelledby="schedule_modal_label"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="schedule_modal_label">
            {editing ? `Edit schedule - ${editing.Name}` : "Create schedule"}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="sd_name">
                Schedule name
              </label>
              <input
                type="text"
                className="form-control"
                id="sd_name"
                key={editing?.Id ?? "new"}
                defaultValue={editing?.Name ?? ""}
                placeholder="e.g. Weekly Pipeline Review"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="sd_report">
                Report
              </label>
              <select className="form-select" id="sd_report" data-sd-report="">
                <option>Deals</option>
                <option>Leads</option>
                <option>Contacts</option>
                <option>Companies</option>
                <option>Invoices</option>
                <option>Payments</option>
                <option>Forecast</option>
                <option>Tickets</option>
                <option>Projects</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="sd_freq">
                Frequency
              </label>
              <select
                className="form-select"
                id="sd_freq"
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className={`col-md-4${freq === "Weekly" ? "" : " d-none"}`}>
              <label className="form-label" htmlFor="sd_day">
                Day
              </label>
              <select className="form-select" id="sd_day" defaultValue="Monday">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="sd_time">
                Time
              </label>
              <input
                type="time"
                className="form-control"
                id="sd_time"
                defaultValue="08:00"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="sd_recipients">
                Recipients
              </label>
              <input
                type="text"
                className="form-control"
                id="sd_recipients"
                defaultValue="Sales Leadership, finance@company.com"
              />
              <span className="fs-12 text-muted">
                Comma separated. Teams and individual addresses both work.
              </span>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="sd_format">
                File format
              </label>
              <select className="form-select" id="sd_format" data-sd-format="">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="sd_delivery">
                Delivery
              </label>
              <select className="form-select" id="sd_delivery" defaultValue="Email attachment">
                <option>Email attachment</option>
                <option>Email link</option>
                <option>Both</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="sd_subject">
                Email subject
              </label>
              <input
                type="text"
                className="form-control"
                id="sd_subject"
                data-sd-subject=""
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="sd_message">
                Email message
              </label>
              <textarea
                className="form-control"
                id="sd_message"
                rows={3}
                defaultValue={
                  "Hi team,\n\nPlease find this period's report attached."
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="sd_filters">
                Filters applied
              </label>
              <div className="border rounded p-3" id="sd_filters">
                <div className="d-flex flex-wrap gap-1 mb-2">
                  <span className="rb-chip">Stage is not Closed Lost</span>
                  <span className="rb-chip">Date range = This Quarter</span>
                  <span className="rb-chip">Owner is any</span>
                </div>
                <Link href={route.reportBuilder} className="fs-12 link-primary">
                  Edit filters in Report Builder
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sd_skip"
                  defaultChecked
                />
                <label className="form-check-label fs-13" htmlFor="sd_skip">
                  Skip delivery when the report has no rows
                </label>
              </div>
            </div>
            <div className="col-12">
              <span className="fs-12 text-muted d-block mb-2">Preview</span>
              <div className="border rounded p-3 bg-light">
                <p className="fw-medium text-dark mb-1">
                  <i className="ti ti-mail me-1" />
                  <span className="fs-13">Your CRM report - Q3 2026</span>
                </p>
                <p className="fs-12 text-muted mb-2">
                  To: Sales Leadership, finance@company.com · Attachment:
                  report.pdf (248 KB)
                </p>
                <div className="ai-skeleton">
                  <span style={{ width: "92%" }} />
                  <span style={{ width: "78%" }} />
                  <span style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
            <i className="ti ti-device-floppy me-1" />
            Save schedule
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* End Schedule Detail Modal */}
  {/* Schedule History Modal */}
  <div
    className="modal fade"
    id="schedule_history_modal"
    tabIndex={-1}
    aria-labelledby="schedule_history_modal_label"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h5 className="modal-title" id="schedule_history_modal_label">
              Delivery history
            </h5>
            <span className="fs-13 text-muted">{historyTarget?.Name}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="table-responsive">
            <table className="table table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Run at</th>
                  <th scope="col">Status</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {ScheduledReportHistoryData.map((row) => (
                  <tr key={row.key}>
                    <td>{row.When}</td>
                    <td>
                      <span className={`badge bg-soft-${row.Tone} text-${row.Tone}`}>{row.Status}</span>
                    </td>
                    <td>{row.Note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light shadow"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* End Schedule History Modal */}
</>

  )
}

export default Modal