"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

const ModalMilestones = () => {
  return (
    <>
      {/* Add Milestone */}
      <div className="modal custom-modal fade" id="add_milestone" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add New Milestone</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                {/* Start row */}
                <div className="row row-gap-3">
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Project Name <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Trip Flow</option>
                        <option>Connect Hub</option>
                        <option>Gig Market</option>
                        <option>Book Ease</option>
                        <option>Retail POS</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Milestone Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Assignee <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Priority <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Notes</label>
                      <textarea className="form-control" rows={4} />
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center gap-2 felx-grow-1 w-100 justify-content-end">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-light"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary">
                    Create New
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Milestone */}
      {/* Edit Milestone */}
      <div className="modal custom-modal fade" id="edit_milestone" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Milestone</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                {/* Start row */}
                <div className="row row-gap-3">
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Project Name <span className="text-danger">*</span>
                      </label>
                      <select className="form-select" defaultValue="Trip Flow">
                        <option>Select</option>
                        <option>Trip Flow</option>
                        <option>Connect Hub</option>
                        <option>Gig Market</option>
                        <option>Book Ease</option>
                        <option>Retail POS</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Milestone Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Phase 2 - Integrations"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Assignee <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Priority <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="23 Nov 2026" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="23 Nov 2026" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue="Connecting third party services & APIs to enable seamless data flow, automation, and enhanced functionality"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select className="form-select" defaultValue="Completed">
                        <option>Select</option>
                        <option>Completed</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <label className="dropdown-item d-flex align-items-center">
                    <input
                      className="form-check-input m-0 me-2"
                      type="checkbox"
                    />
                    Billable
                  </label>
                  <div className="d-flex align-items-center gap-2 felx-grow-1 w-100 justify-content-end">
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-light"
                    >
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Milestone */}
      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove milestone you selected.
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
      {/* /Delete Modal */}
    </>
  );
};

export default ModalMilestones;
