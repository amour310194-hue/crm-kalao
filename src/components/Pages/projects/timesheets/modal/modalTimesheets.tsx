"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import CommonTimePicker from "@/core/common/common-timePickers/CommonTimePicker";

const ModalTimesheets = () => {
  return (
    <>
      {/* Add TimeSheet */}
      <div className="modal custom-modal fade" id="add_timesheet" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add New Timesheet</h5>
              <button
                type="button"
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
                        Employee Name <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>Samantha Reed</option>
                        <option>William Anderson</option>
                        <option>Jonathan Mitchell</option>
                      </select>
                    </div>
                  </div>
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
                        Task Name <span className="text-danger">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Configure travel booking</option>
                        <option>Build real time chat module</option>
                        <option>Develop freelancer module</option>
                        <option>Implement service scheduling</option>
                        <option>Develop inventory modules</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        From <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonTimePicker
                          className="form-control"
                          placeholder="-- : --  --"
                          allowClear
                        />
                        <span className="input-group-text">
                          <i className="ti ti-clock" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        To <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonTimePicker
                          className="form-control"
                          placeholder="-- : --  --"
                          allowClear
                        />
                        <span className="input-group-text">
                          <i className="ti ti-clock" />
                        </span>
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
      {/* /Add TimeSheet */}
      {/* Edit TimeSheet */}
      <div className="modal custom-modal fade" id="edit_timesheet" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Timesheet</h5>
              <button
                type="button"
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
                        Employee Name <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Albert Morgan"
                      >
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>Samantha Reed</option>
                        <option>William Anderson</option>
                        <option>Jonathan Mitchell</option>
                      </select>
                    </div>
                  </div>
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
                        Task Name <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Build real time chat module"
                      >
                        <option>Select</option>
                        <option>Configure travel booking</option>
                        <option>Build real time chat module</option>
                        <option>Develop freelancer module</option>
                        <option>Implement service scheduling</option>
                        <option>Develop inventory modules</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        From <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonTimePicker
                          className="form-control"
                          placeholder="-- : --  --"
                          allowClear
                        />
                        <span className="input-group-text">
                          <i className="ti ti-clock" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        To <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonTimePicker
                          className="form-control"
                          placeholder="-- : --  --"
                          allowClear
                        />
                        <span className="input-group-text">
                          <i className="ti ti-clock" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue="Create structured workflows covering seller onboarding, buyer journey, and payments."
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select className="form-select" defaultValue="Approved">
                        <option>Select</option>
                        <option>Approved</option>
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
                    <input className="form-check-input m-0 me-2" type="checkbox" />
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
      {/* /Edit TimeSheet */}
      {/* delete modal */}
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
                Are you sure you want to remove log you selected.
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
      {/* /delete modal */}
    </>
  );
};

export default ModalTimesheets;
