"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

/*
  Shared Add/Edit offcanvas + delete modal for the Marketing campaign families.

  All four reference families (email / sms / social / whatsapp) use the same
  offcanvas skeleton and differ only in which selects appear. Each family passes
  its own `fields`; the Name / Period / Start Date / End Date / Description /
  Attachment block is common to all of them.

  The reference renders the selects as `select2` widgets and the description as a
  summernote editor. Neither has a bare CSS rule in this app, so plain
  `form-select` / `textarea` are used - matching the other ported forms here.
*/

export interface CampaignSelectField {
  Label: string;
  Options: string[];
}

interface CampaignOffcanvasProps {
  /** Extra selects rendered between Name and Period, in order. */
  fields?: CampaignSelectField[];
  /** Noun used in the delete confirmation copy, e.g. "Campaign". */
  deleteLabel?: string;
  addTitle?: string;
  editTitle?: string;
}

const SelectField = ({ Label, Options }: CampaignSelectField) => (
  <div className="col-md-12">
    <div className="mb-3">
      <label className="form-label">
        {Label} <span className="text-danger">*</span>
      </label>
      <select className="form-select" defaultValue={Options[0]}>
        {Options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

const PERIODS = ["Choose", "Days", "Weekly", "Monthly"];

const CampaignForm = ({
  fields,
  submitLabel,
}: {
  fields: CampaignSelectField[];
  submitLabel: string;
}) => (
  <>
    <div className="offcanvas-body">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        {fields.map((field) => (
          <SelectField key={field.Label} {...field} />
        ))}
        <SelectField Label="Period" Options={PERIODS} />
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <CommonDatePicker placeholder="dd/mm/yyyy" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              End Date <span className="text-danger">*</span>
            </label>
            <CommonDatePicker placeholder="dd/mm/yyyy" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea className="form-control" rows={4} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">
              Attachment <span className="text-danger">*</span>
            </label>
            <div className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2">
              <i className="ti ti-file-broken me-1" />
              Upload file
              <input type="file" className="form-control image-sign" multiple />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="d-flex align-items-center justify-content-end gap-2 p-3 border-top">
      <Link href="#" className="btn btn-light" data-bs-dismiss="offcanvas">
        Cancel
      </Link>
      <button type="button" className="btn btn-primary">
        {submitLabel}
      </button>
    </div>
  </>
);

const CampaignOffcanvas = ({
  fields = [],
  deleteLabel = "Campaign",
  addTitle = "Add New Campaign",
  editTitle = "Edit Campaign",
}: CampaignOffcanvasProps) => (
  <>
    {/* Add Campaign */}
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">{addTitle}</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 text-dark"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <form>
        <CampaignForm fields={fields} submitLabel="Create" />
      </form>
    </div>
    {/* Add Campaign */}
    {/* Edit Campaign */}
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_edit"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">{editTitle}</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 text-dark"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <form>
        <CampaignForm fields={fields} submitLabel="Save Changes" />
      </form>
    </div>
    {/* Edit Campaign */}
    {/* delete modal */}
    <div className="modal fade" id="delete_campaign">
      <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
        <div className="modal-content rounded-0">
          <div className="modal-body p-4 text-center position-relative">
            <div className="mb-3 position-relative z-1">
              <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                <i className="ti ti-trash fs-24" />
              </span>
            </div>
            <h5 className="mb-1">Delete Confirmation</h5>
            <p className="mb-3">
              Are you sure you want to remove {deleteLabel} you selected.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                href="#"
                className="btn btn-light position-relative z-1 me-2 w-100"
                data-bs-dismiss="modal"
              >
                Cancel
              </Link>
              <Link
                href="#"
                className="btn btn-primary position-relative z-1 w-100"
                data-bs-dismiss="modal"
              >
                Yes, Delete
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* delete modal */}
  </>
);

export default CampaignOffcanvas;
