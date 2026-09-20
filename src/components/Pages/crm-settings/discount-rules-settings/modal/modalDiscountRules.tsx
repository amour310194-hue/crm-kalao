"use client";
import Link from "next/link";

const ModalDiscountRules = () => {
  return (
    <>
      {/* Add Discount Rule */}
      <div className="modal custom-modal fade" id="add_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add Discount Rule</h5>
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
                        Rule Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows={4} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Discount Type <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Percentage</option>
                        <option>Flat</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Discount Value <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Min Deal Value <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Max Discount Value <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Applicable Product <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>All Products</option>
                        <option>Enterprise Deals</option>
                        <option>SaaS Basic</option>
                        <option>Subscriptions</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Role Allowed <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Sales Representative</option>
                        <option>Sales Manager</option>
                        <option>Accountant</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-check form-switch w-100 ps-0">
                      <label className="form-check-label d-flex align-items-center justify-content-start gap-2 w-100">
                        <input
                          className="form-check-input switchCheckDefault ms-0"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                        <span>Approval Required</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-check form-switch w-100 ps-0">
                      <label className="form-check-label d-flex align-items-center justify-content-start gap-2 w-100">
                        <input
                          className="form-check-input switchCheckDefault ms-0"
                          type="checkbox"
                          role="switch"
                        />
                        <span>Auto Approval</span>
                      </label>
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
      {/* /Add Discount Rule */}
      {/* Edit Discount Rule */}
      <div className="modal custom-modal fade" id="edit_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Discount Rule</h5>
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
                        Rule Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Standard Sales Discount"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue="A default percentage discount automatically available to sales users for regular deals without special approval."
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Discount Type <span className="text-danger">*</span>{" "}
                      </label>
                      <select className="form-select" defaultValue="Percentage">
                        <option>Select</option>
                        <option>Percentage</option>
                        <option>Flat</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Discount Value <span className="text-danger">*</span>
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
                        Min Deal Value <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="FCFA 3,000"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Max Discount Value <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="10%"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Applicable Product <span className="text-danger">*</span>{" "}
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Enterprise Deals"
                      >
                        <option>Select</option>
                        <option>All Products</option>
                        <option>Enterprise Deals</option>
                        <option>SaaS Basic</option>
                        <option>Subscriptions</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Role Allowed <span className="text-danger">*</span>{" "}
                      </label>
                      <select
                        className="form-select"
                        defaultValue="Sales Representative"
                      >
                        <option>Select</option>
                        <option>Sales Representative</option>
                        <option>Sales Manager</option>
                        <option>Accountant</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-check form-switch w-100 ps-0">
                      <label className="form-check-label d-flex align-items-center justify-content-start gap-2 w-100">
                        <input
                          className="form-check-input switchCheckDefault ms-0"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                        <span>Approval Required</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-check form-switch w-100 ps-0">
                      <label className="form-check-label d-flex align-items-center justify-content-start gap-2 w-100">
                        <input
                          className="form-check-input switchCheckDefault ms-0"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                        <span>Auto Approval</span>
                      </label>
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
      {/* /Edit Discount Rule */}
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
                Are you sure you want to remove discount rule you selected.
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

export default ModalDiscountRules;
