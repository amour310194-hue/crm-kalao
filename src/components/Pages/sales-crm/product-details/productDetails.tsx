"use client";
import Link from "next/link";
import PageHeader from "@/core/common/page-header/pageHeader";
import Footer from "@/core/common/footer/footer";
import {
  ProductActivitiesData,
  ProductNotesData,
} from "../../../../core/json/productDetailsData";
import { all_routes } from "@/router/all_routes";
import ModalProductDetails from "./modal/modalProductDetails";

const ProductDetailsComponent = () => {
  const route = all_routes;
  const activities = ProductActivitiesData;
  const notes = ProductNotesData;

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="Product Details"
            showModuleTile={true}
            moduleTitle="Sales CRM"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <Link href={route.products}>
                  <i className="ti ti-arrow-narrow-left me-1" />
                  Back to Products
                </Link>
              </div>
            </div>
            {/* Contact Sidebar */}
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold fs-14">Product Information</h6>
                  <div className="d-flex align-items-center gap-1 border-bottom pb-3 mb-3">
                    <span className="avatar avatar-lg bg-light p-0 flex-shrink-0 rounded-circle text-dark me-2">
                      <i className="ti ti-box fs-24" />
                    </span>
                    <div>
                      <h6 className="mb-1 d-flex align-items-center gap-2">
                        Barcode Scanner{" "}
                        <span className="badge bg-success">Active</span>
                      </h6>
                      <span>Hardware</span>
                    </div>
                  </div>
                  <h6 className="mb-3 fw-semibold fs-14">Other Information</h6>
                  <ul className="mb-3">
                    <li className="row mb-2">
                      <span className="col-6">Product ID</span>
                      <span className="col-6 text-dark">PRD114</span>
                    </li>
                    <li className="row mb-2">
                      <span className="col-6">SKU</span>
                      <span className="col-6 text-dark">BARHARD</span>
                    </li>
                    <li className="row mb-2">
                      <span className="col-6">Cost Price ($)</span>
                      <span className="col-6 text-dark">8965</span>
                    </li>
                    <li className="row mb-2">
                      <span className="col-6">Selling Price ($)</span>
                      <span className="col-6 text-dark">7500</span>
                    </li>
                    <li className="row mb-2">
                      <span className="col-6">Tax (%)</span>
                      <span className="col-6 text-dark">18</span>
                    </li>
                    <li className="row">
                      <span className="col-6">Created On</span>
                      <span className="col-6 text-dark">
                        15 Feb 2025, 02:02 PM
                      </span>
                    </li>
                  </ul>
                  <Link
                    href="#"
                    className="btn btn-primary w-100"
                    data-bs-target="#add_notes"
                    data-bs-toggle="modal"
                  >
                    Add Notes
                  </Link>
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <div className="col-xl-8">
              <div className="card mb-3">
                <div className="card-body pb-0 pt-2">
                  <ul className="nav nav-tabs nav-bordered" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_1"
                        data-bs-toggle="tab"
                        className="nav-link active border-3"
                        aria-controls="tab_1"
                        aria-selected="true"
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-alarm-minus me-1" />
                          Activities
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_2"
                        data-bs-toggle="tab"
                        aria-controls="tab_2"
                        className="nav-link border-3"
                        aria-selected="false"
                        role="tab"
                        tabIndex={-1}
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-notes me-1" />
                          Notes
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Tab Content */}
              <div className="tab-content pt-0">
                {/* Activities */}
                <div
                  className="tab-pane active show"
                  id="tab_1"
                  role="tabpanel"
                  aria-labelledby="tab_1"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-bold mb-0">Activities</h5>
                      </div>
                      {activities.map((activity, index) => (
                        <div
                          className={`card border ${
                            index === activities.length - 1 ? "mb-0" : "mb-3"
                          }`}
                          key={activity.key}
                        >
                          <div className="card-body">
                            <div className="d-flex flex-wrap row-gap-2">
                              <span className="avatar avatar-lg bg-light p-0 flex-shrink-0 rounded-circle text-dark me-2">
                                <i className="ti ti-refresh-dot fs-24" />
                              </span>
                              <div>
                                <div className="text-dark fw-medium mb-1 d-flex align-items-center">
                                  {activity.Label} {activity.From}
                                  <i className="ti ti-arrow-right fs-16 mx-1" />
                                  {activity.To}
                                </div>
                                <span className="text-muted">
                                  {activity.DateTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* /Activities */}
                {/* Notes */}
                <div
                  className="tab-pane fade"
                  id="tab_2"
                  role="tabpanel"
                  aria-labelledby="tab_2"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-bold mb-0">Notes</h5>
                      </div>
                      {notes.map((note, index) => (
                        <div
                          className={`card border ${
                            index === notes.length - 1 ? "mb-0" : "mb-3"
                          }`}
                          key={note.key}
                        >
                          <div className="card-body d-flex align-items-center justify-content-between">
                            <div className="d-flex flex-wrap row-gap-2">
                              <span className="avatar avatar-lg bg-light p-0 flex-shrink-0 rounded-circle text-dark me-2">
                                <i className="ti ti-file-settings fs-24" />
                              </span>
                              <div>
                                <div className="text-dark mb-1 d-flex align-items-center">
                                  {note.Description}
                                </div>
                                <span>{note.DateTime}</span>
                              </div>
                            </div>
                            <div className="dropdown">
                              <Link
                                href="#"
                                className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ti ti-dots-vertical" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_notes"
                                >
                                  <i className="ti ti-edit me-1" />
                                  Edit
                                </Link>
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_note"
                                >
                                  <i className="ti ti-trash me-1" />
                                  Delete
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* /Notes */}
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Contact Details */}
          </div>
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <ModalProductDetails />
    </>
  );
};

export default ProductDetailsComponent;
