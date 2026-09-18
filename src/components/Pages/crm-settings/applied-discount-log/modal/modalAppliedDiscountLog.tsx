"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

const ModalAppliedDiscountLog = () => {
  return (
    <>
      {/* Add Discount Log */}
      <div className="modal custom-modal fade" id="add_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add Discount Log</h5>
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
                        Deal ID <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>#DEL0020</option>
                        <option>#DEL0019</option>
                        <option>#DEL0018</option>
                        <option>#DEL0017</option>
                        <option>#DEL0016</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Requested By <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>John Doe</option>
                        <option>Emma Watson</option>
                        <option>Olivia Roberts</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Requested Discount <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Approved Discount <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Final Deal Value <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Applied Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Approved By <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>John Doe</option>
                        <option>Emma Watson</option>
                        <option>Olivia Roberts</option>
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
      {/* /Add Discount Log */}
      {/* Edit Discount Log */}
      <div className="modal custom-modal fade" id="edit_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Discount Log</h5>
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
                        Deal ID <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select" defaultValue="#DEL0019">
                        <option>Select</option>
                        <option>#DEL0020</option>
                        <option>#DEL0019</option>
                        <option>#DEL0018</option>
                        <option>#DEL0017</option>
                        <option>#DEL0016</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Requested By <span className="text-danger">*</span>{" "}
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Katherine Brooks"
                      >
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>John Doe</option>
                        <option>Emma Watson</option>
                        <option>Olivia Roberts</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Requested Discount <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="10%"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Approved Discount <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="15%"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Final Deal Value <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="$1000"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Applied Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group w-auto input-group-flat">
                        <CommonDatePicker placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Approved By <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select" defaultValue="John Doe">
                        <option>Select</option>
                        <option>Albert Morgan</option>
                        <option>Katherine Brooks</option>
                        <option>John Doe</option>
                        <option>Emma Watson</option>
                        <option>Olivia Roberts</option>
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
      {/* /Edit Discount Log */}
      {/* Delete Discount */}
      <div className="modal fade" id="delete_discount">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove discount log you selected.
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
      {/* /Delete Discount */}
    </>
  );
};

export default ModalAppliedDiscountLog;
