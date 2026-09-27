"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PageHeader from "@/core/common/page-header/pageHeader";
import CommonSelect from "@/core/common/common-select/commonSelect";
import {
  Assigned_To,
  Priority,
  Reminder,
  Task_Priority,
} from "../../../../core/json/selectOption";
import Footer from "@/core/common/footer/footer";
import ModalLeadsDetails from "./modal/modalLeadsDetails";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import {
  convertLead,
  fetchLeads,
  formatMoney,
  LEAD_STATUS_LABEL,
  type LeadRow,
} from "@/lib/crm";

const LeadsDetailsComponent = () => {
  const [lead, setLead] = useState<LeadRow | null>(null);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    void fetchLeads().then((rows) => {
      const row = id ? rows?.find((item) => item.id === id) : null;
      if (row) setLead(row);
    });
  }, []);

  const onConvert = async () => {
    if (!lead) return;
    try {
      await convertLead(lead.id);
      const rows = await fetchLeads();
      const row = rows?.find((item) => item.id === lead.id);
      if (row) setLead(row);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

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
            title="Leads"
            badgeCount={null}
            showModuleTile={false}
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <Link href={all_routes.leads}>
                  <i className="ti ti-arrow-narrow-left me-1" />
                  Back to Leads
                </Link>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <div className="avatar avatar-xxl avatar-rounded border border-warning bg-soft-warning me-3 flex-shrink-0">
                        <h6 className="mb-0 text-warning">HT</h6>
                      </div>
                      <div>
                        <h5 className="mb-1">{lead?.title ?? "Prospect"}</h5>
                        {lead ? (
                          <p className="mb-1">
                            <i className="ti ti-building-skyscraper me-1" />
                            {lead.companies?.name ?? "—"} ·{" "}
                            {LEAD_STATUS_LABEL[lead.status] ?? lead.status} ·{" "}
                            {formatMoney(lead.estimated_value)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="py-1 px-2 fs-12 bg-soft-danger rounded text-danger fw-medium">
                        <i className="ti ti-lock me-1" />
                        Private
                      </span>
                      <div className="dropdown">
                        <Link
                          href="#"
                          className="btn btn-xs btn-success fs-12 py-1 px-2 fw-medium d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {" "}
                          <i className="ti ti-thumb-up me-1" />
                          Closed
                          <i className="ti ti-chevron-down ms-1" />{" "}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (lead) void onConvert();
                            }}
                          >
                            <span>Closed</span>
                          </Link>
                          <Link className="dropdown-item" href="#">
                            <span>Lost</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Contact User */}
            </div>
            {/* Contact Sidebar */}
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Lead Information</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Date Created</p>
                      <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Deal Value</p>
                      <p className="mb-0 text-dark">FCFA 25,11,145</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Due Date </p>
                      <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Follow Up</p>
                      <p className="mb-0 text-dark">27 Sep 2025</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Source</p>
                      <p className="mb-0 text-dark">Google</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Owner</h6>
                  </div>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-3.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Steve Vaughan</p>
                      </div>
                    </div>
                  </div>
                  <h6 className="mb-3 fw-semibold">Tags</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <Link
                      href="#"
                      className="badge badge-soft-success fw-medium me-2"
                    >
                      Collab
                    </Link>
                    <Link
                      href="#"
                      className="badge badge-soft-warning fw-medium mb-0"
                    >
                      VIP
                    </Link>
                  </div>
                  <h6 className="mb-3 fw-semibold">Priority</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <CommonSelect
                      options={Priority}
                      className="select"
                      defaultValue={Priority[0]}
                    />
                  </div>
                  <h6 className="mb-3 fw-semibold">Projects</h6>
                  <div className="d-flex align-items-center border-bottom mb-3 pb-3">
                    <span className="badge bg-white text-body fw-medium border me-2">
                      Devops Design
                    </span>
                    <span className="badge bg-white text-body fw-medium border me-2">
                      Margrate Design
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Conracts</h6>
                    <Link
                      href="#"
                      className="link-primary mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#add_contact"
                    >
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-4.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Jessica Sen</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="mb-0">Last Modified </p>
                    <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <p className="mb-0">Modified By</p>
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-2.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Darlee Robertson</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <div className="col-xl-8">
              <div className="mb-3 pb-3 border-bottom">
                <h5 className="mb-3">Lead Pipeline Status</h5>
                <div className="step-progress d-flex flex-wrap gap-2">
                  <div className="step bg-indigo">Not Contacted</div>
                  <div className="step bg-cyan">Contacted</div>
                  <div className="step bg-success">Closed</div>
                  <div className="step bg-orange">Lost</div>
                  <div className="step bg-transparent" />
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-body pb-0 pt-2 px-2">
                  <ul
                    className="nav nav-tabs nav-bordered border-0 mb-0"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_1"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link active border-3"
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
                        aria-expanded="true"
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
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_3"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-phone me-1" />
                          Calls
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_4"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-file me-1" />
                          Files
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_5"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-mail-check me-1" />
                          Email
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
                        {/* Tab Content */}
          <div className="tab-content pt-0">
            <div className="tab-pane active show" id="tab_1">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucune activité.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_2">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucune note.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_3">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun appel.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_4">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun fichier.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_5">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun e-mail.</p></div></div>
            </div>
          </div>
          {/* /Tab Content */}
            </div>
            {/* /Contact Details */}
          </div>
          {/* Start Footer */}
        </div>
        {/* End Content */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
        <ModalLeadsDetails/>
    </>
  );
};

export default LeadsDetailsComponent;
