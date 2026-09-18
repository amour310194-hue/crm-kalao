
import { all_routes } from "@/router/all_routes";
import {
  Client,
  Currency,
  Estimate_By,
  Proposal_Project,
  Status_Sent,
} from "../../../../../core/json/selectOption";
import CommonSelect from "@/core/common/common-select/commonSelect";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import CommonTagInputs from "@/core/common/common-tagInput/commonTagInputs";
import { useState } from "react";
import Link from "next/link";

const ModalEstimation = () => {
  const [tags, setTags] = useState<string[]>(["Tag 1", "Tag 2", "Tag 3"]);
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  return (
    <>
      {/* Add proposals */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Estimation</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label">Client</label>
                      <Link
                        href="#"
                        className="label-add link-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_client"
                      >
                        <i className="ti ti-plus" />
                        Add New
                      </Link>
                    </div>
                    <CommonSelect
                      options={Client}
                      className="select"
                      defaultValue={Client[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Bill To<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Ship To<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label">
                        Project<span className="text-danger">*</span>
                      </label>
                      <Link
                        href="#"
                        className="label-add link-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_project"
                      >
                        <i className="ti ti-plus me-1" />
                        Add New
                      </Link>
                    </div>
                    <CommonSelect
                      options={Proposal_Project}
                      className="select"
                      defaultValue={Proposal_Project[0]}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Estimate By <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Estimate_By}
                      className="select"
                      defaultValue={Estimate_By[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Amount<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Currency}
                      className="select"
                      defaultValue={Currency[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Estimate Date<span className="text-danger"> *</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Expiry Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Status_Sent}
                      className="select"
                      defaultValue={Status_Sent[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tags </label>
                    <CommonTagInputs
                      initialTags={tags}
                      onTagsChange={handleTagsChange}
                    />
                    <span className="fs-13 mb-0">
                      Enter value separated by comma
                    </span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Attachment <span className="text-danger">*</span>
                    </label>
                    <div className="file-upload drag-file w-100 d-flex bg-light border shadow align-items-center justify-content-center flex-column">
                      <span className="upload-img d-block mb-1">
                        <i className="ti ti-folder-open text-primary fs-16" />
                      </span>
                      <p className="mb-0 fs-14 text-dark">
                        Drop your files here or{" "}
                        <Link
                          href="#"
                          className="text-decoration-underline text-primary"
                        >
                          browse
                        </Link>
                      </p>
                      <input type="file" accept="video/image" />
                      <p className="fs-13 mb-0">Maximum size : 50 MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="editor pages-editor" />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Create New
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add proposals */}
      {/* edit proposals */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_edit"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Edit Estimation</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label">Client</label>
                      <Link
                        href="#"
                        className="label-add link-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_client"
                      >
                        <i className="ti ti-plus" />
                        Add New
                      </Link>
                    </div>
                    <CommonSelect
                      options={Client}
                      className="select"
                      defaultValue={Client[1]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Bill To<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Ship To<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label">
                        Project<span className="text-danger">*</span>
                      </label>
                      <Link
                        href="#"
                        className="label-add link-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_project"
                      >
                        <i className="ti ti-plus me-1" />
                        Add New
                      </Link>
                    </div>
                    <CommonSelect
                      options={Proposal_Project}
                      className="select"
                      defaultValue={Proposal_Project[1]}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Estimate By <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Estimate_By}
                      className="select"
                      defaultValue={Estimate_By[1]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Amount<span className="text-danger"> *</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Currency}
                      className="select"
                      defaultValue={Currency[1]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Estimate Date<span className="text-danger"> *</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Expiry Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <CommonDatePicker placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      options={Status_Sent}
                      className="select"
                      defaultValue={Status_Sent[1]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tags </label>
                    <CommonTagInputs
                      initialTags={tags}
                      onTagsChange={handleTagsChange}
                    />
                    <span className="fs-13 mb-0">
                      Enter value separated by comma
                    </span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Attachment <span className="text-danger">*</span>
                    </label>
                    <div className="file-upload drag-file w-100 d-flex bg-light border shadow align-items-center justify-content-center flex-column">
                      <span className="upload-img d-block mb-1">
                        <i className="ti ti-folder-open text-primary fs-16" />
                      </span>
                      <p className="mb-0 fs-14 text-dark">
                        Drop your files here or{" "}
                        <Link
                          href="#"
                          className="text-decoration-underline text-primary"
                        >
                          browse
                        </Link>
                      </p>
                      <input type="file" accept="video/image" />
                      <p className="fs-13 mb-0">Maximum size : 50 MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="editor pages-editor" />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /edit proposals */}
      {/* Add New View */}
      <div className="modal custom-modal fade" id="add_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add Client</h5>
              <button
                className="btn-close me-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form action="#">
              <div className="modal-body">
                <div className="mb-0">
                  <label className="form-label">Client Name</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="modal-btn text-end border-top p-3">
                <Link
                  href="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-danger">
                  Create New
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add New View */}
      {/* Add New View */}
      <div className="modal custom-modal fade" id="add_project" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add New Project</h5>
              <button
                className="btn-close me-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form action="#">
              <div className="modal-body">
                <div className="mb-0">
                  <label className="form-label">Project Name</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="modal-btn text-end border-top p-3">
                <Link
                  href="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-danger">
                  Create New
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add New View */}
      {/* delete modal */}
      <div className="modal fade" id="delete_estimations">
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
                Are you sure you want to remove Estimations you selected.
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
      <div
  className="offcanvas offcanvas-end offcanvas-large"
  tabIndex={-1}
  id="offcanvas_view"
>
  <div className="offcanvas-header border-bottom justify-content-between">
    <h5 className="mb-0">
      Estimation<span className="badge badge-soft-danger ms-2">#1254057</span>{" "}
    </h5>
    <div className="d-flex align-items-center">
      <div className="toggle-header-popup">
        <div className="dropdown table-action me-2">
          <a
            href="#"
            className="btn btn-dropdowns btn-outline-light dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Download
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item " href="#">
              Download
            </a>
            <a className="dropdown-item " href="#">
              Download PDF
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <i className="ti ti-x" />
      </button>
    </div>
  </div>
  <div className="offcanvas-body">
    <form action={all_routes.estimationList}>
      <div className="card mb-0 shadow">
        <div className="card-body pb-3">
          <div className="border-bottom pb-3 mb-3">
            <h6 className="mb-3">
              Estimation Details{" "}
              <span className="badge bg-success ms-2">Accepted</span>
            </h6>
            <ul className="d-flex align-items-centers justify-content-between gap-2 flex-wrap">
              <li>
                <p className="fs-13 fw-medium mb-1">Estimate Date</p>
                <h6 className="fs-14 fw-normal">13 May 2025</h6>
              </li>
              <li>
                <p className="fs-13 fw-medium mb-1">Expiry Date</p>
                <h6 className="fs-14 fw-normal">30 May 2025</h6>
              </li>
              <li>
                <p className="fs-13 fw-medium mb-1">Client</p>
                <h6 className="fs-14 fw-normal">NovaWave LLC</h6>
              </li>
            </ul>
          </div>
          <div className="details-propsal">
            <div className="row row-gap-2">
              <div className="col-md-4 col-12">
                <div className="proposal-to">
                  <h6 className="mb-2 fw-semibold fs-14">From</h6>
                  <h6 className="mb-2 fw-semibold fs-14">CRMS</h6>
                  <p className="mb-1">
                    3338 Marcus Street Birmingham, AL 35211
                  </p>
                  <p className="mb-1">
                    Phone : <span className="text-dark">+1 98789 78788</span>{" "}
                  </p>
                  <p className="mb-1">
                    Email : <span className="text-dark">info@example.com</span>
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="proposal-to">
                  <h6 className="mb-2 fw-semibold fs-14">Bill To</h6>
                  <h6 className="mb-2 fw-semibold fs-14">NovaWave LLC </h6>
                  <p className="mb-1">
                    994 Martine Ranch Suite 900 Candacefort New Hampshire
                  </p>
                  <p className="mb-1">
                    Phone : <span className="text-dark">+1 58478 74646</span>
                  </p>
                  <p className="mb-1">
                    Email : <span className="text-dark">info@example.net</span>
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="proposal-to">
                  <h6 className="mb-2 fw-semibold fs-14">Ship To</h6>
                  <h6 className="mb-2 fw-semibold fs-14">NovaWave LLC </h6>
                  <p className="mb-1">
                    994 Martine Ranch Suite 900 Candacefort New Hampshire
                  </p>
                  <p className="mb-1">
                    Phone : <span className="text-dark">+1 58478 74646</span>
                  </p>
                  <p className="mb-1">
                    Email : <span className="text-dark">info@example.net</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr className="mb-3" />
          <div className="table-responsive table-nowrap mb-4">
            <table className="table table-nowrap">
              <thead className="table-light">
                <tr>
                  <th>Job Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>UX Strategy</td>
                  <td>1</td>
                  <td>$500</td>
                  <td>$100</td>
                  <td>$500</td>
                </tr>
                <tr>
                  <td>Design System</td>
                  <td>1</td>
                  <td>$5000</td>
                  <td>$100</td>
                  <td>$5000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-light p-3 rounded mb-4">
            <h6 className="fs-14 fw-medium border-bottom pb-2 mb-2">
              Sub Total <span className="float-end">$5500.00</span>
            </h6>
            <h6 className="fs-14 fw-medium border-bottom pb-2 mb-2">
              Discount(0%) <span className="float-end">$400.00</span>
            </h6>
            <h6 className="fs-14 fw-medium border-bottom pb-2 mb-2">
              Extra Discount(0%) <span className="float-end">$0.00</span>
            </h6>
            <h6 className="fs-14 fw-medium pb-2 mb-2">
              Tax <span className="float-end">$54.00</span>
            </h6>
            <h6 className="mb-2">
              Total Amount <span className="float-end">$5775.00</span>
            </h6>
            <p className="mb-0">
              Amount in Words : Dollar Five thousand Seven Seventy Five
            </p>
          </div>
          <hr className="mb-4" />
          <h6 className="fw-semibold fs-14 mb-1">Terms and Conditions</h6>
          <p className="mb-0">
            The products/services listed in this invoice will be
            delivered/provided as per the specifications and schedule detailed
            in the invoice or as agreed upon by both parties in previous
            communications.
          </p>
        </div>
      </div>
    </form>
  </div>
</div>

    </>
  );
};

export default ModalEstimation;
