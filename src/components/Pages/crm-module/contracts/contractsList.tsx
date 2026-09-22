"use client";
/* eslint-disable @next/next/no-img-element */
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import PredefinedDatePicker from "@/core/common/common-dateRangePicker/PredefinedDatePicker";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { useCallback, useEffect, useState } from "react";
import Datatable from "@/core/common/dataTable";
import { ContractListData } from "../../../../core/json/contractsListData";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import ModalContracts from "./modal/modalContracts";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { useLiveRows } from "@/lib/useLiveRows";
import {
  fetchDossiers,
  formatDate,
  formatMoney,
  readForm,
  showBootstrap,
  toContractsListRow,
  type DossierRow,
} from "@/lib/crm";
import {
  createRentReceipt,
  fetchRentReceipts,
  type RentReceiptRow,
} from "@/lib/dossiers";

const ContractsListComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  /** Les baux bruts servent à la quittance : le mapping table ne garde pas les ids. */
  const [leases, setLeases] = useState<DossierRow[]>([]);
  const [receiptLease, setReceiptLease] = useState<DossierRow | null>(null);
  const [receipts, setReceipts] = useState<RentReceiptRow[]>([]);
  const [printed, setPrinted] = useState<RentReceiptRow | null>(null);
  const loadContracts = useCallback(async () => {
    const rows = await fetchDossiers("bien");
    if (rows) setLeases(rows);
    return rows ? rows.map(toContractsListRow) : null;
  }, []);
  const { rows: data, reload } = useLiveRows(ContractListData, loadContracts);

  /** Bascule le body en mode impression le temps d'un window.print(). */
  useEffect(() => {
    if (!printed) return;
    document.body.classList.add("kalao-printing");
    const timer = window.setTimeout(() => {
      window.print();
      document.body.classList.remove("kalao-printing");
    }, 150);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("kalao-printing");
    };
  }, [printed]);

  const openReceipt = async (key: string) => {
    const lease = leases.find((row) => row.id === key) ?? null;
    setReceiptLease(lease);
    setReceipts([]);
    showBootstrap("kalao_rent_receipt");
    if (!lease) return;
    const rows = await fetchRentReceipts(lease.id);
    if (rows) setReceipts(rows);
  };

  const onCreateReceipt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!receiptLease) return;
    const vals = readForm(e.currentTarget);
    try {
      const created = await createRentReceipt({
        dossier_id: receiptLease.id,
        period: vals.period || new Date().toISOString().slice(0, 7),
        amount: vals.amount,
        paid_at: vals.paid_at || null,
      });
      const rows = await fetchRentReceipts(receiptLease.id);
      if (rows) setReceipts(rows);
      setPrinted(created);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };
  const columns = [
    {
      title: "Contract ID",
      dataIndex: "ContractID",
      render: (text: string) => (
        <Link href="#" className="title-name">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.ContractID.length - b.ContractID.length,
    },
    {
      title: "Subject",
      dataIndex: "Subject",
      render: (text: string) => (
        <Link href="#" className="title-name">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.Subject.length - b.Subject.length,
    },
    {
      title: "Customer",
      dataIndex: "Customer",
      render: (text: any, render: any) => (
        <h6 className="d-flex align-items-center fw-medium fs-14">
          <Link
            href={all_routes.companiesDetails}
            className="avatar border rounded-circle me-2"
          >
            <ImageWithBasePath
              className="w-auto h-auto"
              src={`assets/img/icons/${render.Image}`}
              alt="User Image"
            />
          </Link>
          <Link href={all_routes.companiesDetails}>{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.Customer.length - b.Customer.length,
    },
    {
      title: "Contract Type",
      dataIndex: "ContractType",
      sorter: (a: any, b: any) => a.ContractType.length - b.ContractType.length,
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      sorter: (a: any, b: any) => a.StartDate.length - b.StartDate.length,
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      sorter: (a: any, b: any) => a.EndDate.length - b.EndDate.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_text: any, row: any) => (
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
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_edit"
              href="#"
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contracts"
            >
              <i className="ti ti-trash" /> Delete
            </Link>
            <Link className="dropdown-item" href="#">
              <i className="ti ti-copy text-tertiary" /> Clone
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_view"
            >
              <i className="ti ti-clipboard-copy text-violet" /> View Contract
            </Link>
            <Link className="dropdown-item" href="#">
              <i className="ti ti-checks" /> Mark as Signed
            </Link>
            <Link
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                void openReceipt(row.key);
              }}
            >
              <i className="ti ti-printer" /> Quittance de loyer
            </Link>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.Action.length - b.Action.length,
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
            title="Contracts"
            badgeCount={125}
            showModuleTile={false}
            showExport={true}
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
                data-bs-target="#offcanvas_add"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add New Contract
              </Link>
            </div>
            <div className="card-body">
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="dropdown-toggle btn btn-outline-light px-2 shadow"
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
                  <PredefinedDatePicker/>
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
                                data-bs-target="#project"
                                aria-expanded="false"
                                aria-controls="project"
                              >
                                Contracts Id
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="project"
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
                                      274729
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274730
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274731
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274732
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274733
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274734
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274735
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274736
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274737
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      #274738
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
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Subject
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
                                      SEO Proposal
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Web Design
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Logo &amp; Branding
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Development
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Business Card Design
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Technical SEO
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Social Media Profile Branding
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Portfolio Site
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Logo Design
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Development
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
                                Coustomer
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
                                      NovaWave LLC
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      BlueSky Industries
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Silver Hawk
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Summit Peak
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      RiverStone Ltd
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Bright Bridge Grp
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      CoastalStar Co.
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      HarborView
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
                                data-bs-target="#type"
                                aria-expanded="false"
                                aria-controls="type"
                              >
                                Contract Type
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="type"
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
                                      Contract Under Seal
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Executory Contracts
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Express Contracts
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Implied Contracts
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Unconscionable
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Fixed Price Contract
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Cost-Plus Contract
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Service Level Agreement
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
                            href={all_routes.ContractsList}
                            className="btn btn-primary w-100"
                          >
                            Filter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      href="#"
                      className="btn bg-soft-indigo px-2 border-0"
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
                              <span>Contracts ID</span>
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
                              <span>Subject</span>
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
                              <span>Customer</span>
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
                              <span>Customer Value</span>
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
                              <span>Customer Type</span>
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
                              <span>Start Date</span>
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
                              <span>End Date</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
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
                  <div className="d-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                    <Link
                      href={all_routes.ContractsList}
                      className="btn btn-sm p-1 border-0 fs-14 active"
                    >
                      <i className="ti ti-list-tree" />
                    </Link>
                    <Link
                      href={all_routes.ContractsGrid}
                      className="flex-shrink-0 btn btn-sm p-1 border-0 ms-1 fs-14"
                    >
                      <i className="ti ti-grid-dots" />
                    </Link>
                  </div>
                </div>
              </div>
              {/* table header */}
              {/* contracts List */}
              <div className=" custom-table table-nowrap"></div>
              <Datatable
                columns={columns}
                dataSource={data}
                Selection={true}
                searchText={searchText}
              />
              {/* /contracts List */}
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
        <ModalContracts onSaved={reload} />
      {/* Quittance de loyer */}
      <div className="modal fade" id="kalao_rent_receipt">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Quittance de loyer{receiptLease ? ` — ${receiptLease.title}` : ""}
              </h5>
              <button
                type="button"
                className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {receiptLease ? (
                <>
                  <form className="row gy-2 align-items-end mb-3" onSubmit={onCreateReceipt}>
                    <div className="col-md-4">
                      <label className="form-label">
                        Période <span className="text-danger">*</span>
                      </label>
                      <input
                        type="month"
                        className="form-control"
                        name="period"
                        defaultValue={new Date().toISOString().slice(0, 7)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Montant (FCFA) <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="amount" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Date de paiement</label>
                      <input
                        type="date"
                        className="form-control"
                        name="paid_at"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                    </div>
                    <div className="col-md-12">
                      <button type="submit" className="btn btn-primary">
                        <i className="ti ti-printer me-1" />
                        Enregistrer et imprimer
                      </button>
                    </div>
                  </form>
                  {receipts.length ? (
                    <div className="table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Période</th>
                            <th>Payée le</th>
                            <th className="text-end">Montant</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {receipts.map((row) => (
                            <tr key={row.id}>
                              <td>{row.period}</td>
                              <td>{formatDate(row.paid_at)}</td>
                              <td className="text-end text-dark fw-medium">
                                {formatMoney(row.amount)}
                              </td>
                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-light shadow"
                                  onClick={() => setPrinted(row)}
                                >
                                  <i className="ti ti-printer me-1" />
                                  Imprimer
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mb-0">Aucune quittance émise pour ce bail.</p>
                  )}
                </>
              ) : (
                <p className="mb-0">
                  Les quittances ne sont disponibles que sur les baux enregistrés dans Supabase.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Quittance de loyer */}
      {/* Bloc imprimable : seul visible pendant window.print() */}
      <div className="kalao-receipt">
        {printed && receiptLease ? (
          <>
            <div className="kalao-receipt__head">
              <div>
                <h2>Groupe Kalao</h2>
                <p>Yaoundé — Cameroun</p>
                <p>contact@groupe-kalao.com</p>
              </div>
              <div>
                <h3>Quittance de loyer</h3>
                <p>N° {printed.id.slice(0, 8).toUpperCase()}</p>
                <p>Période : {printed.period}</p>
              </div>
            </div>
            <p>
              Le Groupe Kalao reconnaît avoir reçu de{" "}
              <strong>{receiptLease.companies?.name ?? "—"}</strong> la somme ci-dessous au titre du
              bail <strong>{receiptLease.title}</strong>, et lui en donne quittance.
            </p>
            <table className="kalao-receipt__table">
              <tbody>
                <tr>
                  <th>Bail</th>
                  <td>{receiptLease.title}</td>
                </tr>
                <tr>
                  <th>Locataire</th>
                  <td>{receiptLease.companies?.name ?? "—"}</td>
                </tr>
                <tr>
                  <th>Période quittancée</th>
                  <td>{printed.period}</td>
                </tr>
                <tr>
                  <th>Date de paiement</th>
                  <td>{formatDate(printed.paid_at)}</td>
                </tr>
                <tr>
                  <th>Montant réglé</th>
                  <td className="kalao-receipt__total">{formatMoney(printed.amount)}</td>
                </tr>
              </tbody>
            </table>
            <p>
              Cette quittance annule tout reçu antérieur portant sur la même période. Elle est
              délivrée sous réserve d&apos;encaissement effectif.
            </p>
            <p>Fait à Yaoundé, le {formatDate(new Date().toISOString().slice(0, 10))}</p>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ContractsListComponent;
