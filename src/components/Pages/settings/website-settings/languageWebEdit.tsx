"use client";
import Link from "next/link";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import {
  LanguageTranslationsData,
  LanguageOptionsData,
} from "../../../../core/json/languageTranslationsData";

/*
  Language edit view (html/language-web-edit.html) - the drill-down from the
  Language row of Website Settings, showing the English/Arabic string pairs for
  the selected language.
*/
const LanguageWebEditComponent = () => (
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
        <SettingsTopbar />
        {/* start row */}
        <div className="row">
          <div className="col-xl-3 col-lg-12 theiaStickySidebar">
            <div className="card filemanager-left-sidebar">
              <div className="card-body">
                <div className="settings-sidebar">
                  <h5 className="mb-3 fs-17">Website Settings</h5>
                  <div className="list-group list-group-flush settings-sidebar">
                    <Link
                      href={all_routes.companySettings}
                      className="d-block p-2 fw-medium "
                    >
                      Company Settings
                    </Link>
                    <Link
                      href={all_routes.localization}
                      className="d-block p-2 fw-medium "
                    >
                      Localization
                    </Link>
                    <Link
                      href={all_routes.prefixes}
                      className="d-block p-2 fw-medium "
                    >
                      Prefixes
                    </Link>
                    <Link
                      href={all_routes.preference}
                      className="d-block p-2 fw-medium "
                    >
                      Preference
                    </Link>
                    <Link
                      href={all_routes.appearance}
                      className="d-block p-2 fw-medium "
                    >
                      Appearance
                    </Link>
                    <Link
                      href={all_routes.languageWeb}
                      className="d-block p-2 fw-medium active"
                    >
                      Language
                    </Link>
                  </div>
                </div>
              </div>
              {/* end card body */}
            </div>
            {/* end card */}
          </div>
          {/* end col */}
          <div className="col-xl-9 col-lg-12">
            {/* Custom Fields */}
            <div className="card mb-0">
              <div className="card-body">
                <div className="row border-bottom mb-3 pb-3 align-items-center row-gap-3">
                  <div className="col-md-3">
                    <h4 className="fs-17 mb-0">Language</h4>
                  </div>
                  <div className="col-md-9">
                    <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-2">
                      <Link
                        href={all_routes.languageWeb}
                        className="btn btn-primary d-flex align-items-center"
                      >
                        <i className="ti ti-circle-arrow-left me-1" />
                        Back to Translations
                      </Link>
                      <div className="dropdown">
                        <Link
                          href="#"
                          className="dropdown-toggle btn btn-outline-light px-2 shadow"
                          data-bs-toggle="dropdown"
                        >
                          <ImageWithBasePath
                            src="assets/img/flags/us.svg"
                            alt="Img"
                            className="me-2"
                            height={16}
                          />
                          English
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <ul>
                            {LanguageOptionsData.map((language) => (
                              <li key={language.Label}>
                                <Link
                                  href="#"
                                  className="dropdown-item d-flex align-items-center gap-2"
                                >
                                  <ImageWithBasePath
                                    src={language.Flag}
                                    alt="Img"
                                    height={16}
                                  />
                                  {language.Label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="w-lg-25 w-md-25 w-100">
                        <p className="fs-14 text-dark mb-1">Progress</p>
                        <div className="d-flex align-items-center">
                          <div
                            className="progress w-100 bg-light"
                            style={{ height: 5, borderRadius: 10 }}
                          >
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              style={{ width: "80%", borderRadius: 10 }}
                              aria-valuenow={80}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                          <span className="ms-2">80%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Start Table */}
                <div className="table-responsive table-nowrap custom-table">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th className="no-sort">English</th>
                        <th className="no-sort">Arabic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LanguageTranslationsData.map((row) => (
                        <tr key={row.key}>
                          <td>{row.English}</td>
                          <td>
                            <div className="py-1 px-2 text-end bg-light border rounded text-dark">
                              {row.Arabic}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* End Table */}
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* End Content */}
    </div>
    {/* ========================
			End Page Content
		========================= */}
  </>
);

export default LanguageWebEditComponent;
