"use client";
import Link from "next/link";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";

const ModalSalesOrder = () => {
  return (
    <>
      {/* add modal */}
      <div className="modal fade" id="add-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Sales Order</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Client<span className="text-danger ms-1">*</span>
                  </label>
                  <select className="select2" data-toggle="select2">
                    <option>Select</option>
                    <option>NovaWave LLC</option>
                    <option>BlueSky Industries</option>
                    <option>Silver Hawk</option>
                    <option>Summit Peak</option>
                    <option>RiverStone Ltd</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Order Date<span className="text-danger ms-1">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Order Value<span className="text-danger ms-1">*</span>
                  </label>
                  <input className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Net Amount<span className="text-danger ms-1">*</span>
                  </label>
                  <input className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Payment Status<span className="text-danger ms-1">*</span>
                  </label>
                  <select className="select" data-toggle="select2">
                    <option>Select</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    Order Status<span className="text-danger ms-1">*</span>
                  </label>
                  <select className="select">
                    <option>Select</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                    <option>Inprogress</option>
                  </select>
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
              <h5 className="modal-title">Edit Sales Order</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Client<span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="select2"
                    data-toggle="select2"
                    defaultValue="NovaWave LLC"
                  >
                    <option>Select</option>
                    <option>NovaWave LLC</option>
                    <option>BlueSky Industries</option>
                    <option>Silver Hawk</option>
                    <option>Summit Peak</option>
                    <option>RiverStone Ltd</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Order Date<span className="text-danger ms-1">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Order Value<span className="text-danger ms-1">*</span>
                  </label>
                  <input className="form-control" defaultValue="FCFA 450,000" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Net Amount<span className="text-danger ms-1">*</span>
                  </label>
                  <input className="form-control" defaultValue="FCFA 500,000" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Payment Status<span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="select"
                    data-toggle="select2"
                    defaultValue="Paid"
                  >
                    <option>Select</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    Order Status<span className="text-danger ms-1">*</span>
                  </label>
                  <select className="select" defaultValue="Confirmed">
                    <option>Select</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                    <option>Inprogress</option>
                  </select>
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
                Are you sure you want to remove sales order you selected.
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

export default ModalSalesOrder;
