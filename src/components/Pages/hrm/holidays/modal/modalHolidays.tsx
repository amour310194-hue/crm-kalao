"use client";
import Link from "next/link";
import dayjs from "dayjs";
import { all_routes } from "@/router/all_routes";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

const ModalHolidays = () => {
  return (
    <>
      {/* Add Holidays */}
      <div className="modal custom-modal fade" id="add_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add Holidays</h5>
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
                        Name <span className="text-danger">*</span>{" "}
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">
                      Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Applicable Location{" "}
                        <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>USA</option>
                        <option>Canada</option>
                        <option>Spain</option>
                        <option>India</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end gap-2">
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
      {/* /Add Holidays */}
      {/* Edit Holidays */}
      <div className="modal custom-modal fade" id="edit_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Holidays</h5>
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
                        Name <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="New Year"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">
                      Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker
                        placeholder="dd/mm/yyyy"
                        format="DD/MM/YYYY"
                        defaultValue={dayjs("2026-12-25")}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Applicable Location{" "}
                        <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select" defaultValue="USA">
                        <option>Select</option>
                        <option>USA</option>
                        <option>Canada</option>
                        <option>Spain</option>
                        <option>India</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Status <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select" defaultValue="Active">
                        <option>Select</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end gap-2">
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
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Holidays */}
      {/* delete modal */}
      <div className="modal fade" id="delete_holiday">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded">
          <div className="modal-content rounded">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove holiday you selected.
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
                  href={all_routes.holidays}
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

export default ModalHolidays;
