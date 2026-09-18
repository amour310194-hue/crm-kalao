"use client";
import Link from "next/link";

const ModalLoginHistory = () => (
  <>
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
              Are you sure you want to remove Login History you selected.
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

export default ModalLoginHistory;
