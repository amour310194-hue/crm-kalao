"use client";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import CommonTimePicker from "@/core/common/common-timePickers/CommonTimePicker";

const ModalAttendance = () => {
  return (
    <>
      {/* add modal */}
      <div className="modal fade" id="add-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Attendance</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Employee<span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Robert Johnson</option>
                        <option>Isabella Cooper</option>
                        <option>John Smith</option>
                        <option>Sophia Parker</option>
                        <option>Emma Reynolds</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Check-In</label>
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
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Check-Out</label>
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <select className="form-select">
                    <option>Select</option>
                    <option>USA</option>
                    <option>Canada</option>
                    <option>Spain</option>
                    <option>Brazil</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select">
                    <option>Select</option>
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Remarks</label>
                  <textarea className="form-control" rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <Link href="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button className="btn btn-primary" type="submit">
                  Create New
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /add modal */}
      {/* edit modal */}
      <div className="modal fade" id="edit-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Attendance</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Employee<span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Robert Johnson"
                      >
                        <option>Select</option>
                        <option>Robert Johnson</option>
                        <option>Isabella Cooper</option>
                        <option>John Smith</option>
                        <option>Sophia Parker</option>
                        <option>Emma Reynolds</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Check-In</label>
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
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Check-Out</label>
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <select className="form-select" defaultValue="USA">
                    <option>Select</option>
                    <option>USA</option>
                    <option>Canada</option>
                    <option>Spain</option>
                    <option>Brazil</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" defaultValue="Present">
                    <option>Select</option>
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Remarks</label>
                  <textarea className="form-control" rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <Link href="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /edit modal */}
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
                Are you sure you want to remove Attendance list you selected.
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
                  href={all_routes.attendance}
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

export default ModalAttendance;
