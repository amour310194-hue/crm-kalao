
import CommonSelect from "@/core/common/common-select/commonSelect"
import Link from "next/link"

const tenantOptions = [
  { value: "", label: "Select" },
  { value: "sunburst-tech", label: "Sunburst Tech" },
  { value: "veridian-systems", label: "Veridian Systems" },
  { value: "apex-solutions", label: "Apex Solutions" },
  { value: "zenith-holdings", label: "Zenith Holdings" },
  { value: "onyx-enterprises", label: "Onyx Enterprises" },
]

const categoryOptions = [
  { value: "", label: "Select" },
  { value: "authentication", label: "Authentication" },
  { value: "billing", label: "Billing" },
  { value: "performance", label: "Performance" },
  { value: "reports", label: "Reports" },
  { value: "notifications", label: "Notifications" },
]

const assigneeOptions = [
  { value: "", label: "Select" },
  { value: "hendry-milner", label: "Hendry Milner" },
  { value: "guilory-berggren", label: "Guilory Berggren" },
  { value: "jami-carlile", label: "Jami Carlile" },
  { value: "theresa-nelson", label: "Theresa Nelson" },
  { value: "smith-cooper", label: "Smith Cooper" },
]

const priorityOptions = [
  { value: "", label: "Select" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const statusOptions = [
  { value: "", label: "Select" },
  { value: "resolved", label: "Resolved" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
]

const TenantSupportModal = () => {
  return (
   <>
  {/* Add Ticktet */}
  <div className="modal custom-modal fade" id="add_ticktet" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title mb-0">Add New Ticket</h5>
          <button
            className="btn-close custom-btn-close border p-1 me-0 text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form>
          <div className="modal-body">
            {/* Start row */}
            <div className="row row-gap-3">
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Tenant Name <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={tenantOptions}
                    className="select"
                    defaultValue={tenantOptions[0]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Category <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={categoryOptions}
                    className="select"
                    defaultValue={categoryOptions[0]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Assignee Name <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={assigneeOptions}
                    className="select"
                    defaultValue={assigneeOptions[0]}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <label className="form-label">
                    Priority<span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={priorityOptions}
                    className="select"
                    defaultValue={priorityOptions[0]}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <label className="form-label">
                    Status <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={statusOptions}
                    className="select"
                    defaultValue={statusOptions[0]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">Description </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={""}
                  />
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
  {/* Add Ticktet */}
  {/* Edit Ticktet */}
  <div className="modal custom-modal fade" id="edit_ticket" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title mb-0">Edit Ticket</h5>
          <button
            className="btn-close custom-btn-close border p-1 me-0 text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form>
          <div className="modal-body">
            {/* Start row */}
            <div className="row row-gap-3">
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Tenant Name <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={tenantOptions}
                    className="select"
                    defaultValue={tenantOptions[1]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Category <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={categoryOptions}
                    className="select"
                    defaultValue={categoryOptions[1]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Unable to Log In"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">
                    Assignee Name <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={assigneeOptions}
                    className="select"
                    defaultValue={assigneeOptions[1]}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <label className="form-label">
                    Priority<span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={priorityOptions}
                    className="select"
                    defaultValue={priorityOptions[1]}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <label className="form-label">
                    Status <span className="text-danger">*</span>{" "}
                  </label>
                  <CommonSelect
                    options={statusOptions}
                    className="select"
                    defaultValue={statusOptions[2]}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="form-label">Description </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={
                      "Employees from our company are unable to log in after a recent system update, request support to resolve access issues."
                    }
                  />
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
                {" "}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* Edit Ticktet */}
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
            Are you sure you want to remove ticket you selected.
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

  )
}

export default TenantSupportModal