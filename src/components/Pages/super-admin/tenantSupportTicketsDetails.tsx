"use client";

import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";

const TenantSupportTicketsDetailsComponent = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          <h4 className="mb-4">Tenant Ticket Details</h4>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="mb-3">
                <Link
                  href={all_routes.tenantSupportTickets}
                  className="d-inline-flex align-items-center fw-medium"
                >
                  <i className="ti ti-arrow-left me-1" />
                  Back to Tenant Tickets
                </Link>
              </div>
              {/* Ticket Details */}
              <div className="card mb-0">
                <div className="card-body">
                  <div className="border br-5 mb-3 rounded">
                    <div className="p-3 bg-light d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h4 className="fs-16 d-flex align-items-center gap-2 flex-wrap">
                        Login Access Error
                        <span className="badge badge-outline-info">
                          #TKT0020
                        </span>
                      </h4>
                      <div className="dropdown">
                        <Link
                          href="javascript:void(0);"
                          className="dropdown-toggle btn bg-white border d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-badge me-1" />
                          Resolved
                        </Link>
                        <ul className="dropdown-menu  dropdown-menu-end p-2">
                          <li>
                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item rounded-1"
                            >
                              Resolved
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item rounded-1"
                            >
                              Inprogress
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item rounded-1"
                            >
                              Open
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item rounded-1"
                            >
                              Closed
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="row row-cols-xl-5 row-cols-md-3 row-cols-sm-2 row-cols-1 row-gap-3">
                        <div className="col">
                          <h4 className="fs-13 fw-medium mb-1 text-body">
                            Created By
                          </h4>
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              href="javascript:void(0);"
                              className="avatar avatar-xs rounded-circle"
                            >
                              <ImageWithBasePath
                                src="assets/img/icons/company-icon-01.svg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </Link>
                            <Link
                              href="javascript:void(0);"
                              className="text-truncate fw-medium"
                            >
                              NovaWave LLC
                            </Link>
                          </div>
                        </div>
                        <div className="col">
                          <h4 className="fs-13 fw-medium mb-1 text-body">
                            Priority
                          </h4>
                          <span className="badge bg-danger d-inline-flex align-items-center badge-sm">
                            High
                          </span>
                        </div>
                        <div className="col">
                          <h4 className="fs-13 fw-medium mb-1 text-body">
                            Assigned To
                          </h4>
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              href="javascript:void(0);"
                              className="avatar avatar-xs rounded-circle"
                            >
                              <ImageWithBasePath
                                src="assets/img/users/user-07.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </Link>
                            <Link
                              href="javascript:void(0);"
                              className="text-truncate fw-medium"
                            >
                              Robert Johnson
                            </Link>
                          </div>
                        </div>
                        <div className="col">
                          <h4 className="fs-13 fw-medium mb-1 text-body">
                            Created at
                          </h4>
                          <p className="fs-14 text-dark">20 Jan 2025</p>
                        </div>
                        <div className="col">
                          <h4 className="fs-13 fw-medium mb-1 text-body">
                            Last Updated
                          </h4>
                          <p className="fs-14 text-dark">18 Feb 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="mb-2 fs-16">Description</h5>
                    <p className="mb-2">
                      After applying the updated CRM theme, I am experiencing
                      significant layout and design problems that affect my
                      workflow. I urgently need assistance to resolve these
                      display issues and compatibility challenges with the
                      existing modules and plugins to ensure smooth operations
                      and a consistent user experience.
                    </p>
                    <p className="mb-0">
                      I’ve made several attempts to adjust theme settings and
                      configurations, but the layout issues persist. The theme
                      appears to conflict with essential CRM modules and custom
                      workflows I heavily depend on.
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-bottom">
                    <h5 className="mb-2 fs-16">Attachments</h5>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <div className="bg-light br-5 p-3 d-flex align-items-center border rounded">
                        <span className="avatar d-flex align-items-center justify-content-center bg-danger me-2">
                          <ImageWithBasePath
                            src="assets/img/icons/pdf-1.svg"
                            alt="img"
                            className="w-auto h-auto"
                          />
                        </span>
                        <div className="me-3">
                          <h6 className="fs-14 fw-medium">Credentials.pdf</h6>
                          <p className="fs-12 mb-0">45 KB</p>
                        </div>
                        <Link
                          href="javascript:void(0);"
                          className="btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center bg-white"
                        >
                          <i className="ti ti-download fs-16" />
                        </Link>
                      </div>
                      <div className="bg-light br-5 p-3 d-flex align-items-center border rounded">
                        <span className="avatar d-flex align-items-center justify-content-center bg-success me-2">
                          <ImageWithBasePath
                            src="assets/img/icons/jpg-1.svg"
                            alt="img"
                            className="w-auto h-auto"
                          />
                        </span>
                        <div className="me-3">
                          <h6 className="fs-14 fw-medium">Image2.jpg</h6>
                          <p className="fs-12 mb-0">38 KB</p>
                        </div>
                        <Link
                          href="javascript:void(0);"
                          className="btn-icon btn-sm rounded-circle d-flex align-items-center justify-content-center bg-white"
                        >
                          <i className="ti ti-download fs-16" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <div>
                        <Link
                          href="javascript:void(0);"
                          className="avatar rounded-circle"
                        >
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-27.jpg"
                            alt="img"
                            className="avatar rounded-circle"
                          />
                        </Link>
                      </div>
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <p className="fw-medium text-dark mb-0">Rely To :</p>
                        <Link
                          href="javascript:void(0);"
                          className="py-1 px-2 bg-light text-body fs-13 fw-normal rounded d-flex align-items-center"
                        >
                          Michael Dawson (michael123@example.com){" "}
                          <i className="ti ti-x ms-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mb-0">
                    <h5 className="mb-2 fs-16">Message</h5>
                    <div className="editor pages-editor">
                      <p>
                        Thank you for bringing this issue to our attention. We
                        apologize for the inconvenience caused to your team. Our
                        technical team is currently investigating the password
                        reset and login issue on priority to restore access for
                        your employees. We will keep you updated with progress
                        and notify you as soon as the issue is resolved.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex align-items-center justify-content-end">
                    <Link
                      href="javascript:void(0);"
                      className="btn btn-light me-3"
                    >
                      Cancel
                    </Link>
                    <Link
                      href="javascript:void(0);"
                      className="btn btn-primary d-flex align-items-center gap-1"
                    >
                      {" "}
                      <i className="ti ti-send" /> Send Reply
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Ticket Details */}
            </div>
          </div>
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
          <p className="mb-md-0 mb-1">
            Copyright ©
            <Link
              href="javascript:void(0);"
              className="link-primary text-decoration-underline"
            >
              CRMS
            </Link>
          </p>
          <div className="d-flex align-items-center gap-2 footer-links justify-content-center justify-content-md-end">
            <Link href="javascript:void(0);">About</Link>
            <Link href="javascript:void(0);">Terms</Link>
            <Link href="javascript:void(0);">Contact Us</Link>
          </div>
        </footer>
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default TenantSupportTicketsDetailsComponent;
