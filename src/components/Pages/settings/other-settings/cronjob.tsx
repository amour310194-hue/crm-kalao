"use client";
/* eslint-disable @next/next/no-img-element */
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";

const CronjobComponent = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Settings"
            badgeCount={false}
            showModuleTile={false}
            showExport={false}
          />
          {/* End Page Header */}
          {/* Settings Menu */}
          <SettingsTopbar />
          {/* end card */}
          {/* /Settings Menu */}
          <div className="row row-gap-3">
            <div className="col-xl-3 col-lg-12 theiaStickySidebar">
              {/* Settings Sidebar */}
              <div className="card mb-0 filemanager-left-sidebar">
                <div className="card-body">
                  <div className="settings-sidebar">
                    <h4 className="fs-17 mb-3">Other Settings</h4>
                    <div className="list-group list-group-flush settings-sidebar">
                      <Link
                        href={all_routes.sitemap}
                        className="d-block p-2 fw-medium "
                      >
                        Sitemap
                      </Link>
                      <Link
                        href={all_routes.clearCache}
                        className="d-block p-2 fw-medium "
                      >
                        Clear Cache{" "}
                      </Link>
                      <Link
                        href={all_routes.storage}
                        className="d-block p-2 fw-medium "
                      >
                        Storage
                      </Link>
                      <Link
                        href={all_routes.cronjob}
                        className="d-block p-2 fw-medium active"
                      >
                        Cronjob
                      </Link>
                      <Link
                        href={all_routes.banIpAddrress}
                        className="d-block p-2 fw-medium"
                      >
                        Ban IP Address
                      </Link>
                      <Link
                        href={all_routes.systemBackup}
                        className="d-block p-2 fw-medium"
                      >
                        System Backup
                      </Link>
                      <Link
                        href={all_routes.databaseBackup}
                        className="d-block p-2 fw-medium"
                      >
                        Database Backup
                      </Link>
                      <Link
                        href={all_routes.systemUpdate}
                        className="d-block p-2 fw-medium"
                      >
                        System Update
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Settings Sidebar */}
            </div>
            <div className="col-xl-9 col-lg-12">
              {/* Settings Info */}
              <div className="card mb-0">
                <div className="card-body">
                  <div className="border-bottom mb-3 pb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h4 className="fs-17 mb-0">Cronjob</h4>
                    <Link
                      href="#"
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#add_sitemap"
                    >
                      <i className="ti ti-square-rounded-plus-filled me-1" />
                      Generate Sitemap
                    </Link>
                  </div>
                  {/* start row */}
                  <div className="row row-gap-2 mb-3 align-items-center">
                    <div className="col-lg-6">
                      <h6 className="mb-1 fs-14">Cronjob Link</h6>
                      <p className="fs-13 mb-0">You can configure the Link</p>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-0">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="https://example.com/cronjob"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end row */}
                  {/* start row */}
                  <div className="row row-gap-2 mb-3 pb-4 border-bottom align-items-center">
                    <div className="col-lg-6">
                      <h6 className="mb-1 fs-14">Execution Interval</h6>
                      <p className="fs-13 mb-0">
                        You can configure the intervals
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-0">
                        <input
                          className="input-tags form-control border-0 h-100"
                          data-choices=""
                          data-choices-limit="infinite"
                          data-choices-removeitem=""
                          type="text"
                          defaultValue="1 day, 1 hour"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end row */}
                  <div className="d-flex align-items-center justify-content-end gap-2">
                    <Link
                      href="#;"
                      className=" btn btn-sm btn-light"
                    >
                      Cancel
                    </Link>
                    <Link
                      href="#;"
                      className=" btn btn-sm btn-primary"
                    >
                      Save Changes
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Settings Info */}
            </div>
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
    </>
  );
};

export default CronjobComponent;
