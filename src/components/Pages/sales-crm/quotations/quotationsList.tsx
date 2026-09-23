"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import PageHeader from "@/core/common/page-header/pageHeader";
import Footer from "@/core/common/footer/footer";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import {
  QuotationsListData,
  QuotationFilterClientList,
} from "../../../../core/json/quotationsListData";
import { all_routes } from "@/router/all_routes";
import ModalQuotations from "./modal/modalQuotations";
import { useLiveRows } from "@/lib/useLiveRows";
import { acceptQuote, fetchQuotes, toQuotationsListRow } from "@/lib/crm";
import { docHref, isLiveId } from "@/lib/docs";
import KalaoExportBar from "@/components/docs/KalaoExportBar";

const QuotationsListComponent = () => {
  const route = all_routes;
  const loadQuotes = useCallback(async () => {
    const rows = await fetchQuotes();
    return rows ? rows.map(toQuotationsListRow) : null;
  }, []);
  const { rows: data, live, reload } = useLiveRows(QuotationsListData, loadQuotes);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Quote ID",
      dataIndex: "quoteId",
      render: (text: string, record: { key?: string }) => (
        <Link
          href={isLiveId(record.key) ? docHref("quote", record.key) : "#"}
          data-bs-toggle={isLiveId(record.key) ? undefined : "offcanvas"}
          data-bs-target={isLiveId(record.key) ? undefined : "#edit-offcanvas"}
          target={isLiveId(record.key) ? "_blank" : undefined}
        >
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.quoteId.length - b.quoteId.length,
    },
    {
      title: "Client",
      dataIndex: "client",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium">
          <Link
            href={route.companiesDetails}
            className="avatar avatar-sm border rounded-circle me-2"
          >
            <ImageWithBasePath
              className="w-auto h-auto"
              src={record.clientImage}
              alt="User Image"
            />
          </Link>
          <Link href={route.companiesDetails}>{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.client.length - b.client.length,
    },
    {
      title: "Quote Date",
      dataIndex: "quoteDate",
      sorter: (a: any, b: any) => a.quoteDate.length - b.quoteDate.length,
    },
    {
      title: "Valid Till",
      dataIndex: "validTill",
      sorter: (a: any, b: any) => a.validTill.length - b.validTill.length,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      sorter: (a: any, b: any) => a.totalAmount.length - b.totalAmount.length,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      sorter: (a: any, b: any) => a.discount.length - b.discount.length,
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      sorter: (a: any, b: any) => a.finalAmount.length - b.finalAmount.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_: any, record: any) => (
        <div className="dropdown table-action">
          <Link
            href="#"
            className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="ti ti-dots-vertical" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#edit-offcanvas"
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await acceptQuote(record.key);
                  await reload();
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Erreur");
                }
              }}
            >
              <i className="ti ti-checks text-blue" /> Accept
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <i className="ti ti-trash" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

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
            title="Quotations"
            badgeCount={data.length}
            showModuleTile={true}
            moduleTitle="Sales CRM"
            showExport={true}
            headerExtra={
              live ? (
                <KalaoExportBar
                  filename="devis-kalao"
                  headers={["Devis", "Client", "Date", "Valide", "Montant"]}
                  rows={data
                    .filter((row: { key?: string }) => isLiveId(row.key))
                    .map((row: any) => [
                      row.quoteId,
                      row.client,
                      row.quoteDate,
                      row.validTill,
                      row.finalAmount,
                    ])}
                  printHref={
                    isLiveId(data[0]?.key) ? docHref("quote", data[0].key) : null
                  }
                />
              ) : null
            }
          />
          {/* End Page Header */}
          {/* card start */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
              <Link
                href="#"
                className="btn btn-primary"
                data-bs-toggle="offcanvas"
                data-bs-target="#add-offcanvas"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add Quotation
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort By
                    </Link>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <Link href="#" className="dropdown-item">
                            Newest
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="dropdown-item">
                            Oldest
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <PredefinedDatePicker />
                </div>
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
                        <h4 className="mb-0 fs-16">
                          <i className="ti ti-filter me-1" />
                          Filter
                        </h4>
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
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Client
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-2">
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
                                  {QuotationFilterClientList.map((client) => (
                                    <li className="mb-1" key={client.key}>
                                      <label className="dropdown-item px-2 d-flex align-items-center">
                                        <input
                                          className="form-check-input m-0 me-1"
                                          type="checkbox"
                                        />
                                        <span className="avatar avatar-xs rounded-circle me-2 border rounded-circle me-2 p-1">
                                          <ImageWithBasePath
                                            src={client.image}
                                            className="flex-shrink-0 rounded-circle"
                                            alt="img"
                                          />
                                        </span>
                                        {client.name}
                                      </label>
                                    </li>
                                  ))}
                                  <li>
                                    <Link
                                      href="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
                                    >
                                      View More
                                    </Link>
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
                                Quote Date
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="input-group w-auto input-group-flat">
                                  <CommonDatePicker placeholder="dd/mm/yyyy" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                href="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#validity"
                                aria-expanded="false"
                                aria-controls="validity"
                              >
                                Valid Till
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="validity"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="input-group w-auto input-group-flat">
                                  <CommonDatePicker placeholder="dd/mm/yyyy" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Link href="#" className="btn btn-outline-light w-100">
                            Reset
                          </Link>
                          <Link href="#" className="btn btn-primary w-100">
                            Filter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="btn bg-soft-indigo border-0"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-columns-3 me-2" />
                      Manage Columns
                    </Link>
                    <div className="dropdown-menu dropdown-menu-md dropdown-md p-3">
                      <ul>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Quote ID</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Client</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Quote Date</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Valid Till</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Total Amount</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Discount</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Final Amount</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-0">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Action</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* table header */}
              {/* Quotations List */}
              <div className="custom-table table-nowrap">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={false}
                  searchText={searchText}
                />
              </div>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="datatable-length" />
                </div>
                <div className="col-md-6">
                  <div className="datatable-paginate" />
                </div>
              </div>
              {/* /Quotations List */}
            </div>
          </div>
          {/* card end */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
      <ModalQuotations onSaved={reload} />
    </>
  );
};

export default QuotationsListComponent;
