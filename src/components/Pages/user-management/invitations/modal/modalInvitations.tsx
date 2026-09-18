"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

/*
  The reference uses a Choices.js tag input for "Invite Email" and a flatpickr
  for "Expire Date". This app has no Choices.js binding, so the email field is a
  plain text input with the reference's own helper text kept; the date field uses
  the app's shared CommonDatePicker.
*/
const InviteForm = ({ submitLabel }: { submitLabel: string }) => (
  <>
    <div className="modal-body">
      <div className="mb-3">
        <label className="form-label">
          Invite Link<span className="text-danger ms-1">*</span>
        </label>
        <div className="input-group w-auto input-group-flat">
          <input
            type="text"
            disabled
            className="form-control"
            defaultValue="https://careers.crms.com/apply/IT0021"
          />
          <span className="input-group-text bg-light copy-text cursor-pointer">
            <i className="ti ti-copy" />
          </span>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Invite Email<span className="text-danger ms-1">*</span>
        </label>
        <input type="text" className="form-control" />
        <span className="fs-13 text-gray-5">
          Enter value separated by comma
        </span>
      </div>
      <div>
        <label className="form-label">
          Expire Date<span className="text-danger ms-1">*</span>
        </label>
        <CommonDatePicker placeholder="dd/mm/yyyy" />
      </div>
    </div>
    <div className="modal-footer">
      <Link href="#" className="btn btn-light" data-bs-dismiss="modal">
        Cancel
      </Link>
      <button className="btn btn-primary" type="button">
        {submitLabel}
      </button>
    </div>
  </>
);

const ModalInvitations = () => (
  <>
    {/* Add Invite */}
    <div className="modal fade" id="add-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Invite</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <InviteForm submitLabel="Create New" />
          </form>
        </div>
      </div>
    </div>
    {/* Add Invite */}
    {/* Edit Invite */}
    <div className="modal fade" id="edit-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Invite</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <InviteForm submitLabel="Save Changes" />
          </form>
        </div>
      </div>
    </div>
    {/* Edit Invite */}
    {/* delete modal */}
    <div className="modal fade" id="delete_modal">
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
              Are you sure you want to remove Invitation you selected.
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

export default ModalInvitations;
