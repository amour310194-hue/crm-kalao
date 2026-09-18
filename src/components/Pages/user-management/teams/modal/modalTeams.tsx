"use client";
import Link from "next/link";

const LEADS = [
  "Robert Johnson",
  "Isabella Cooper",
  "John Smith",
  "Sophia Parker",
  "Emma Reynolds",
];

const EMPLOYEES = [
  "Darlee Robertson",
  "Sharon Roy",
  "Vaughan Lewis",
  "Jessica Louise",
  "Carol Thomas",
];

/*
  The reference uses `select2` / `multiple-img` plugin selects here. Neither has a
  bare CSS rule in this app (only the plugin-generated `.select2-container`
  styles), so they are rendered as plain `form-select` / multi-select, matching
  how the other ported modals in this codebase handle select2 fields.
*/
const TeamForm = ({ submitLabel }: { submitLabel: string }) => (
  <>
    <div className="modal-body">
      <div className="mb-3">
        <label className="form-label">
          Team Name<span className="text-danger ms-1">*</span>
        </label>
        <input className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Team Lead<span className="text-danger ms-1">*</span>
        </label>
        <select className="form-select" defaultValue="Select">
          <option>Select</option>
          {LEADS.map((lead) => (
            <option key={lead}>{lead}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label">
          Employees <span className="text-danger">*</span>
        </label>
        <select className="form-select" multiple defaultValue={[]}>
          {EMPLOYEES.map((employee) => (
            <option key={employee}>{employee}</option>
          ))}
        </select>
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

const ModalTeams = () => (
  <>
    {/* Add Team */}
    <div className="modal fade" id="add-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Team</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <TeamForm submitLabel="Create New" />
          </form>
        </div>
      </div>
    </div>
    {/* Add Team */}
    {/* Edit Team */}
    <div className="modal fade" id="edit-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Team</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <TeamForm submitLabel="Save Changes" />
          </form>
        </div>
      </div>
    </div>
    {/* Edit Team */}
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
              Are you sure you want to remove Team you selected.
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

export default ModalTeams;
