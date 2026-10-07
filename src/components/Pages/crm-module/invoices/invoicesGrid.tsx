"use client";
import { useCallback } from "react";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { useLiveRows } from "@/lib/useLiveRows";
import {
  emitInvoice,
  explainRemind,
  fetchInvoices,
  remindInvoiceById,
  toInvoicesListRow,
} from "@/lib/crm";
import InvoiceCreateActions from "./InvoiceCreateActions";
import { explainInvoiceError } from "@/lib/invoicing";
import { t } from "@/lib/i18n";
import { docHref, isLiveId, liveHref } from "@/lib/docs";
import KalaoCashBar from "@/components/docs/KalaoCashBar";
import { InvoicesListData } from "../../../../core/json/invoicesListData";

const InvoicesGrid = () => {
  const loadInvoices = useCallback(async () => {
    const rows = await fetchInvoices();
    return rows ? rows.map(toInvoicesListRow) : null;
  }, []);
  const { rows, live, reload } = useLiveRows(InvoicesListData, loadInvoices);
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content content-two">
          {/* Page Header */}
          <PageHeader
            title="Invoices"
            badgeCount={rows.length}
            showModuleTile={false}
            showExport={true}
            headerExtra={
              live ? (
                <KalaoCashBar
                  onDone={reload}
                  revision={rows
                    .map((row: { key?: string; Key?: string; Paid_Amount?: string; Status?: string }) =>
                      `${row.key || row.Key}:${row.Paid_Amount}:${row.Status}`
                    )
                    .join("|")}
                />
              ) : null
            }
          />
          {/* End Page Header */}
          {/* table header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className={live ? "d-none" : "dropdown"}>
                <Link
                  href="#"
                  className="btn btn-outline-light shadow px-2"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                  <i className="ti ti-chevron-down ms-2" />
                </Link>
                <div className="filter-dropdown-menu dropdown-menu dropdown-menu-lg p-0">
                  <div className="filter-header d-flex align-items-center justify-content-between border-bottom">
                    <h6 className="mb-0">
                      <i className="ti ti-filter me-1" />
                      Filter
                    </h6>
                    <button
                      type="button"
                      className="btn-close close-filter-btn"
                      data-bs-dismiss="dropdown-menu"
                      aria-label="Close"
                    />
                  </div>
                  <div className="filter-set-view p-3">
                    <div className="accordion" id="accordionExample">
                      <div className="filter-set-content">
                        <div className="filter-set-content-head">
                          <Link
                            href="#"
                            className="collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                          >
                            Client
                          </Link>
                        </div>
                        <div
                          className="filter-set-contents accordion-collapse collapse"
                          id="collapseThree"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                            <div className="mb-1">
                              <div className="input-icon-start input-icon position-relative">
                                <span className="input-icon-addon fs-12">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-md"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <ul>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  NovaWave LLC
                                </label>
                              </li>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Redwood Inc
                                </label>
                              </li>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Harborview
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="filter-set-content">
                        <div className="filter-set-content-head">
                          <Link
                            href="#"
                            className="collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#owner"
                            aria-expanded="false"
                            aria-controls="owner"
                          >
                            Project
                          </Link>
                        </div>
                        <div
                          className="filter-set-contents accordion-collapse collapse"
                          id="owner"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                            <div className="mb-1">
                              <div className="input-icon-start input-icon position-relative">
                                <span className="input-icon-addon fs-12">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-md"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <ul className="mb-0">
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Turelysell
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Dreamschat
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  DreamGigs
                                </label>
                              </li>
                              <li className="mb-0">
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  Servbook
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="filter-set-content">
                        <div className="filter-set-content-head">
                          <Link
                            href="#"
                            className="collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#Status"
                            aria-expanded="false"
                            aria-controls="Status"
                          >
                            Amount
                          </Link>
                        </div>
                        <div
                          className="filter-set-contents accordion-collapse collapse"
                          id="Status"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                            <ul>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  FCFA 2,15,000
                                </label>
                              </li>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  FCFA 1,45,000
                                </label>
                              </li>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  FCFA 2,12,000
                                </label>
                              </li>
                              <li>
                                <label className="dropdown-item px-2 d-flex align-items-center">
                                  <input
                                    className="form-check-input m-0 me-1"
                                    type="checkbox"
                                  />
                                  FCFA 4,80,380
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Link href="#" className="btn btn-outline-light w-100">
                        Reset
                      </Link>
                      <Link
                        href={all_routes.InvoiceGrid}
                        className="btn btn-primary w-100"
                      >
                        Filter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <InvoiceCreateActions onDone={() => void reload()} />
              <div className="d-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                <Link
                  href={all_routes.InvoiceList}
                  className="btn btn-sm p-1 border-0 fs-14"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  href={all_routes.InvoiceGrid}
                  className="flex-shrink-0 btn btn-sm p-1 border-0 ms-1 fs-14 active"
                >
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
            </div>
          </div>
          {/* table header */}
          {/* start row */}
          {live ? (
            <div className="row">
              {rows.map((invoice: any) => (
                <div className="col-xxl-3 col-xl-4 col-md-6" key={invoice.key || invoice.Key}>
                  <div className="card border shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                        <div className="users-profile">
                          <span className="badge badge-soft-info">
                            {invoice.Invoice_ID}
                          </span>
                          {invoice.legacyRef ? (
                            <div className="fs-12 text-muted">{invoice.legacyRef}</div>
                          ) : null}
                        </div>
                        <div className="dropdown table-action">
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
                              className="dropdown-item d-inline-flex align-items-center"
                              href={
                                isLiveId(invoice.key || invoice.Key)
                                  ? docHref("invoice", invoice.key || invoice.Key)
                                  : "#"
                              }
                              target={
                                isLiveId(invoice.key || invoice.Key) ? "_blank" : undefined
                              }
                            >
                              <i className="ti ti-clipboard-copy me-1" /> Voir la facture
                            </Link>
                            <Link
                              className="dropdown-item d-inline-flex align-items-center"
                              href={
                                isLiveId(invoice.key || invoice.Key)
                                  ? docHref("invoice", invoice.key || invoice.Key)
                                  : "#"
                              }
                              target={
                                isLiveId(invoice.key || invoice.Key) ? "_blank" : undefined
                              }
                            >
                              <i className="ti ti-printer me-1" /> Imprimer
                            </Link>
                            {invoice.Status === "Brouillon" ? (
                              <button
                                type="button"
                                className="dropdown-item d-inline-flex align-items-center"
                                onClick={async () => {
                                  try {
                                    const number = await emitInvoice(invoice.key || invoice.Key);
                                    alert(`${t("emitInvoice")} : ${number}`);
                                    await reload();
                                  } catch (err) {
                                    alert(explainInvoiceError(err instanceof Error ? err.message : "Erreur"));
                                  }
                                }}
                              >
                                <i className="ti ti-send me-1" /> {t("emitInvoice")}
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="dropdown-item d-inline-flex align-items-center"
                              onClick={async () => {
                                try {
                                  const result = await remindInvoiceById(
                                    invoice.key || invoice.Key
                                  );
                                  alert(explainRemind(result));
                                } catch (err) {
                                  alert(
                                    err instanceof Error ? err.message : "Erreur"
                                  );
                                }
                              }}
                            >
                              <i className="ti ti-mail me-1" /> Relancer
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center overflow-hidden">
                          <span className="avatar avatar-sm rounded-circle me-2 flex-shrink-0">
                            <ImageWithBasePath
                              src={`assets/img/priority/${invoice.Project_Image}`}
                              alt="img"
                            />
                          </span>
                          <div>
                            <h6 className="fs-14 fw-medium mb-0">
                              <Link href={liveHref(all_routes.projectDetails, invoice.dossierId)}>
                                {invoice.Project}
                              </Link>
                            </h6>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`badge ${
                              invoice.Status === "Partially Paid"
                                ? "bg-warning"
                                : invoice.Status === "Paid"
                                  ? "bg-success"
                                  : invoice.Status === "Overdue"
                                    ? "bg-info"
                                    : "bg-danger"
                            }`}
                          >
                            {invoice.Status}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-default d-inline-flex align-items-center mb-1">
                          <i className="ti ti-report-money text-dark fs-16 me-1" />
                          Total Value :{" "}
                          <span className="text-dark ms-1">{invoice.Amount}</span>
                        </p>
                        <p className="text-default d-inline-flex align-items-center mb-1">
                          <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                          Échéance :{" "}
                          <span className="text-dark ms-1">{invoice.Due_Date}</span>
                        </p>
                        <p className="text-default d-inline-flex align-items-center mb-1">
                          <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                          Paid Amount :{" "}
                          <span className="text-dark ms-1">
                            {invoice.Paid_Amount}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Link
                        href={liveHref(all_routes.companiesDetails, invoice.companyId)}
                        className="avatar avatar-rounded border me-2"
                      >
                        <ImageWithBasePath
                          src={`assets/img/company/${invoice.Client_Image}`}
                          className="w-auto h-auto rounded-0"
                          alt="img"
                        />
                      </Link>
                      <div className="d-flex flex-column">
                        <h6 className="fs-14 fw-medium mb-1">
                          <Link href={liveHref(all_routes.companiesDetails, invoice.companyId)}>
                            {invoice.Client}
                          </Link>
                        </h6>
                        <span className="d-block fs-13">Sent to</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
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

export default InvoicesGrid;
