"use client";
import { useCallback } from "react";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import ModalInvoice from "./modal/modalInvoice";
import { useLiveRows } from "@/lib/useLiveRows";
import { fetchInvoices, markInvoicePaid, toInvoicesListRow } from "@/lib/crm";
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
          />
          {/* End Page Header */}
          {/* table header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="dropdown">
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
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas_add"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add New Invoice
              </Link>
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
                              href={all_routes.invoice_details}
                            >
                              <i className="ti ti-clipboard-copy me-1" /> View
                              Invoices
                            </Link>
                            <Link
                              className="dropdown-item d-inline-flex align-items-center"
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  await markInvoicePaid({
                                    id: invoice.key,
                                    amount: invoice.amountValue,
                                    paid_amount: invoice.paidValue,
                                  } as never);
                                  await reload();
                                } catch (err) {
                                  alert(
                                    err instanceof Error ? err.message : "Erreur"
                                  );
                                }
                              }}
                            >
                              <i className="ti ti-checks me-1" /> Mark as Paid
                            </Link>
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
                              <Link href={all_routes.projectDetails}>
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
                          Due Date :{" "}
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
                        href={all_routes.companiesDetails}
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
                          <Link href={all_routes.companiesDetails}>
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
          <div className={`row${live ? " d-none" : ""}`}>
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465781</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/truellysel.svg"
                            className="w-auto h-auto rounded-0"
                            alt="Truelysell"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              Truelysell
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-secondary">
                          Partially Paid
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 2,15,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">22 Jun 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 2,15,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-01.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          BlueSky Industries
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465782</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/dreamchat.svg"
                            className="w-auto h-auto rounded-0"
                            alt="Truelysell"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              Dreamschat
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-success">Paid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 1,45,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">20 May 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,45,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-02.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          NovaWave LLC
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465783</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/truellysell.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              DreamGigs
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-warning">Partially Paid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 2,15,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">30 Apr 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,00,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,15,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-03.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          Silver Hawk
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465784</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/servbook.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>Servbook</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-success">Paid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 4,80,380</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">21 Apr 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 4,80,380</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-04.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          Summit Peak
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465785</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/dream-pos.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>DreamPOS</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-danger">Unpaid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 2,12,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">19 Mar 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount : <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 2,12,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-05.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          RiverStone Ltd
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465786</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/kofejob.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>Kofejob</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-secondary">
                          Partially Paid
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 3,50,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">11 Mar 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,50,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 2,00,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-06.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          Bright Bridge Grp
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465787</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/smarthr.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>SmartHR</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-info">Overdue</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 2,46,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">17 Feb 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,23,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,23,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-07.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          CoastalStar Co.
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465788</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/doccure.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>Doccure</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-success">Paid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 3,12,500</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">07 Feb 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 3,12,500</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-09.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>HarborView</Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465789</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/laundry.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              Best@laundry
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-danger">Unpaid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 4,18,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">20 Jan 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount : <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 4,18,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-10.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          Golden Gate Ltd
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465790</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/sports.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              Dreamsports
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-success">Paid</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 5,00,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">18 Jan 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 5,00,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 0</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-08.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          Redwood Inc
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465791</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/gig.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>
                              Dreamsgigs
                            </Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-secondary">
                          Partially Paid
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 5,00,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">19 Jan 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 2,15,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 2,15,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-11.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>Acme Corp.</Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div className="card border shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="users-profile">
                      <span className="badge badge-soft-info">#1465787</span>
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
                          href="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit"
                        >
                          <i className="ti ti-edit me-1" />
                          Edit
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_invoices"
                        >
                          <i className="ti ti-trash me-1" />
                          Delete
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href={all_routes.invoice_details}
                        >
                          <i className="ti ti-clipboard-copy me-1" /> View
                          Invoices
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-checks me-1" /> Mark as Paid
                        </Link>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center"
                          href="#"
                        >
                          <i className="ti ti-file me-1" />
                          Mark as Partially Paid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-sticker me-1" />
                          Mark ad Unpaid
                        </Link>
                        <Link className="dropdown-item" href="#">
                          <i className="ti ti-printer me-1" /> Print
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <Link
                          href={all_routes.projectDetails}
                          className="avatar avatar-rounded border flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/priority/smarthr.svg"
                            className="w-auto h-auto rounded-0"
                            alt="img"
                          />
                        </Link>
                        <div>
                          <h6 className="fs-14 fw-medium mb-0">
                            <Link href={all_routes.projectDetails}>SmartHR</Link>
                          </h6>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-info">Overdue</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-report-money text-dark fs-16 me-1" />
                        Total Value :{" "}
                        <span className="text-dark ms-1">FCFA 2,46,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-event text-dark fs-16 me-1" />
                        Due Date :{" "}
                        <span className="text-dark ms-1">17 Feb 2025</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-1">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Paid Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,23,000</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-0">
                        <i className="ti ti-calendar-stats text-dark fs-16 me-1" />
                        Balance Amount :{" "}
                        <span className="text-dark ms-1">FCFA 1,23,000</span>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      href={all_routes.companiesDetails}
                      className="avatar avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/company/company-07.svg"
                        className="w-auto h-auto rounded-0"
                        alt="img"
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <h6 className="fs-14 fw-medium mb-1">
                        <Link href={all_routes.companiesDetails}>
                          CoastalStar Co.
                        </Link>
                      </h6>
                      <span className="d-block fs-13">Sent to</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          <div className="load-btn text-center">
            <Link href="#" className="btn btn-primary">
              <i className="ti ti-loader me-1" /> Load More
            </Link>
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
      <ModalInvoice onSaved={reload} />
    </>
  );
};

export default InvoicesGrid;
