"use client";
import Link from "next/link";

const DEPARTMENTS = ["Sales", "Marketing", "Finance", "Design", "Support"];
const ROLES = [
  "Sales Lead",
  "Content Writer",
  "Accountant",
  "UI Designer",
  "Support Lead",
];
const COUNTRIES = ["USA", "Canada", "Germany", "France"];
const STATES = ["California", "New York", "Texas", "Florida"];
const CITIES = ["Los Angeles", "San Diego", "Fresno", "San Francisco"];

const Select = ({ options }: { options: string[] }) => (
  <select className="form-select" defaultValue="Select">
    <option>Select</option>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

/*
  The reference uses `select2` / `select` plugin widgets here; neither has a bare
  CSS rule in this app, so plain `form-select` is used - matching how the other
  ported modals in this codebase handle select2 fields.
*/
const StaffForm = ({ submitLabel }: { submitLabel: string }) => (
  <>
    <div className="modal-body">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Profile Image</label>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2">
                <i className="ti ti-file-broken me-1" />
                Upload file
                <input type="file" className="form-control image-sign" multiple />
              </div>
              <span>JPG, GIF or PNG. Max size of 800K</span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              First Name<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Last Name<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Email<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Phone<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Department<span className="text-danger ms-1">*</span>
            </label>
            <Select options={DEPARTMENTS} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Role<span className="text-danger ms-1">*</span>
            </label>
            <Select options={ROLES} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">
              Address Line 1<span className="text-danger ms-1">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Address Line 1</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Country<span className="text-danger ms-1">*</span>
            </label>
            <Select options={COUNTRIES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              State<span className="text-danger ms-1">*</span>
            </label>
            <Select options={STATES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3 mb-md-0">
            <label className="form-label">
              City<span className="text-danger ms-1">*</span>
            </label>
            <Select options={CITIES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-0">
            <label className="form-label">
              Pincode<span className="text-danger ms-1">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
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

const ModalStaffDirectory = () => (
  <>
    {/* Add Staff */}
    <div className="modal fade" id="add-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Staff</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <StaffForm submitLabel="Create New" />
          </form>
        </div>
      </div>
    </div>
    {/* Add Staff */}
    {/* Edit Staff */}
    <div className="modal fade" id="edit-modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Staff</h5>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <StaffForm submitLabel="Save Changes" />
          </form>
        </div>
      </div>
    </div>
    {/* Edit Staff */}
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
              Are you sure you want to remove Employee you selected.
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

export default ModalStaffDirectory;
