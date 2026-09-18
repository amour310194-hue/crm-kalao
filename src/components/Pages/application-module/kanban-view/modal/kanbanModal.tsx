"use client";

import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import CommonSelect from "@/core/common/common-select/commonSelect";
import { Employee, Priority, StatusActive } from "@/core/json/selectOption";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

const KanbanModal = () => {
  return (
    <>
    {/* Add Task */}
    <div id="add-task" className="modal fade">
      <div className="modal-dialog  modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Add Project</h6>
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
                      Task Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Task Name"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Select Employee <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                            options={Employee}
                            className="select"
                            defaultValue={Employee[0]}
                          />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                            options={StatusActive}
                            className="select"
                            defaultValue={StatusActive[0]}
                          />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                            options={Priority}
                            className="select"
                            defaultValue={Priority[0]}
                          />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />

                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-0">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light btn-sm me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>{" "}
    {/* end modal */}
    {/* Delete Modal */}
    <div className="modal fade" id="delete_modal">
      <div className="modal-dialog modal-dialog-centered  modal-sm">
        <div className="modal-content">
          <div className="modal-body text-center">
            <span className="avatar avatar-xl bg-transparent-danger text-danger mb-3">
              <i className="ti ti-trash-x fs-36" />
            </span>
            <h4 className="mb-1">Confirm Delete</h4>
            <p className="mb-3">
              You want to delete all the marked items, this cant be undone once
              you delete.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                href="javascript:void(0);"
                className="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </Link>
              <Link href={all_routes.kanbanview} className="btn btn-danger">
                Yes, Delete
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>{" "}
    {/* end modal */}
  </>
  
  )
}

export default KanbanModal
