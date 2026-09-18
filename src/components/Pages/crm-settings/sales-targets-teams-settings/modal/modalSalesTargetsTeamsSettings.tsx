"use client";
import Link from "next/link";
import dayjs from "dayjs";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

const ModalSalesTargetsTeamsSettings = () => {
  return (
    <>
      {/* add-modal */}
      <div className="modal fade" id="add-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Target</h5>
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
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Target Type<span className="text-danger ms-1">*</span>
                      </label>
                      <select className="select">
                        <option>Select</option>
                        <option>User</option>
                        <option>Teams</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Target Name<span className="text-danger ms-1">*</span>
                      </label>
                      <select className="select2" data-toggle="select2">
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>Samantha Reed</option>
                        <option>William Anderson</option>
                        <option>Jonathan Mitchell</option>
                        <option>Jennifer Adams</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-end gap-3 period-container">
                    {/* Period Type */}
                    <div className="mb-3 w-100">
                      <label className="form-label">
                        Period Type <span className="text-danger">*</span>
                      </label>
                      <select className="select period-type">
                        <option value="">Select</option>
                        <option value="month">Month</option>
                        <option value="quarter">Quarter</option>
                      </select>
                    </div>
                    {/* Period */}
                    <div className="mb-3 period-wrapper d-none w-100">
                      <label className="form-label">
                        Period <span className="text-danger">*</span>
                      </label>
                      <select className="select period-select">
                        <option value="">Select Period</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Start Date<span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker
                          placeholder="dd/mm/yyyy"
                          format="DD MMM YYYY"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker
                          placeholder="dd/mm/yyyy"
                          format="DD MMM YYYY"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Target Revenue<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div>
                  <label className="form-label">Description</label>
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
      {/* add-modal */}
      {/* edit modal */}
      <div className="modal fade" id="edit-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Sales Target</h5>
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
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Target Type<span className="text-danger ms-1">*</span>
                      </label>
                      <select className="select" defaultValue="User">
                        <option>Select</option>
                        <option>User</option>
                        <option>Teams</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Target Name<span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        className="select2"
                        data-toggle="select2"
                        defaultValue="Albert Morgan"
                      >
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>Samantha Reed</option>
                        <option>William Anderson</option>
                        <option>Jonathan Mitchell</option>
                        <option>Jennifer Adams</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-end gap-3 period-container">
                    {/* Period Type */}
                    <div className="mb-3 w-100">
                      <label className="form-label">
                        Period Type <span className="text-danger">*</span>
                      </label>
                      <select className="select period-type">
                        <option value="">Select</option>
                        <option value="month">Month</option>
                        <option value="quarter">Quarter</option>
                      </select>
                    </div>
                    {/* Period */}
                    <div className="mb-3 period-wrapper w-100">
                      <label className="form-label">
                        Period <span className="text-danger">*</span>
                      </label>
                      <select className="select period-select">
                        <option value="">Select Period</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Start Date<span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker
                          placeholder="dd/mm/yyyy"
                          format="DD MMM YYYY"
                          defaultValue={dayjs("2026-07-01")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker
                          placeholder="dd/mm/yyyy"
                          format="DD MMM YYYY"
                          defaultValue={dayjs("2026-07-31")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Target Revenue<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="$65,000"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
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
      {/* edit modal */}
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
                Are you sure you want to remove sales target you selected.
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
};

export default ModalSalesTargetsTeamsSettings;
