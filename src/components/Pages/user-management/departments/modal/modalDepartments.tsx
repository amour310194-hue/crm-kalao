"use client";
import Link from "next/link";

const HEADS = [
  "Robert Johnson",
  "Isabella Cooper",
  "John Smith",
  "Sophia Parker",
  "Emily Carter",
];

const TEAMS = [
  "Development Team",
  "Marketing Team",
  "Finance Team",
  "Data Analytics Team",
  "Product Management Team",
];

const LOCATIONS = ["USA", "Canada", "Spain", "India", "Brazil"];

/*
  The reference renders `select2` widgets here; this app has no bare `.select2`
  rule (only the plugin-generated `.select2-container` styles), so a select2
  would render unstyled. Plain `form-select` is used instead, matching how the
  other ported modals in this codebase handle select2 fields.
*/
const DepartmentForm = ({ submitLabel }: { submitLabel: string }) => (
  <>
    <div className="modal-body">
      {/* Start row */}
      <div className="row row-gap-3">
        <div className="col-lg-12">
          <div>
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-lg-12">
          <div>
            <label className="form-label">
              Department Head <span className="text-danger">*</span>
            </label>
            <select className="form-select" defaultValue="Select">
              <option>Select</option>
              {HEADS.map((head) => (
                <option key={head}>{head}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-12">
          <div>
            <label className="form-label">
              Associated Teams <span className="text-danger">*</span>
            </label>
            <select className="form-select" defaultValue="Select">
              <option>Select</option>
              {TEAMS.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-12">
          <div>
            <label className="form-label">
              Location <span className="text-danger">*</span>
            </label>
            <select className="form-select" defaultValue="Select">
              <option>Select</option>
              {LOCATIONS.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* End row */}
    </div>
    <div className="modal-footer">
      <div className="d-flex align-items-center justify-content-end gap-2">
        <button type="button" data-bs-dismiss="modal" className="btn btn-light">
          Cancel
        </button>
        <button type="button" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </div>
  </>
);

const ModalDepartments = () => (
  <>
    {/* Add Department */}
    <div className="modal custom-modal fade" id="add_department" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title mb-0">Add Department</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <DepartmentForm submitLabel="Create New" />
          </form>
        </div>
      </div>
    </div>
    {/* Add Department */}
    {/* Edit Department */}
    <div className="modal custom-modal fade" id="edit_department" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title mb-0">Edit Department</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <DepartmentForm submitLabel="Save Changes" />
          </form>
        </div>
      </div>
    </div>
    {/* Edit Department */}
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
              Are you sure you want to remove Department you selected.
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

export default ModalDepartments;
