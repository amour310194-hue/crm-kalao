"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageHeader from "@/core/common/page-header/pageHeader";
import Footer from "@/core/common/footer/footer";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { QuotationsListData } from "../../../../core/json/quotationsListData";
import { all_routes } from "@/router/all_routes";
import ModalQuotations, { type QuoteEditorRecord } from "./modal/modalQuotations";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { deleteCrmRecord, fetchCrmRecord } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";

const statusTone: Record<string, string> = {
  draft: "secondary",
  sent: "info",
  accepted: "success",
  rejected: "danger",
};

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  rejected: "Refusé",
};

const QuotationsListComponent = () => {
  const { t } = useI18n();
  const route = all_routes;
  const { data, reload } = useCrmCollection<QuoteEditorRecord>(
    "quotations",
    QuotationsListData as unknown as QuoteEditorRecord[]
  );
  const { data: catalog } = useCrmCollection<Record<string, unknown>>("catalog", []);
  const { data: companies } = useCrmCollection<Record<string, unknown>>("companies", []);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<QuoteEditorRecord | null>(null);
  const [error, setError] = useState("");

  const catalogOptions = useMemo(
    () =>
      catalog.map((item) => ({
        id: String(item.id || item.key || ""),
        name: String(item.name || item.ProductName || ""),
        unitPrice: Number(item.unitPrice) || 0,
        taxRate: Number(item.taxRate ?? item.Tax) || 18,
        status: item.status != null ? String(item.status) : undefined,
        Status: item.Status != null ? String(item.Status) : undefined,
        ProductName: item.ProductName != null ? String(item.ProductName) : undefined,
      })),
    [catalog]
  );

  const companyOptions = useMemo(
    () =>
      companies.map((company) => ({
        id: String(company.id || company.key || ""),
        key: String(company.key || company.id || ""),
        Name: String(company.Name || company.name || ""),
        name: String(company.name || company.Name || ""),
      })),
    [companies]
  );

  const openCreate = () => {
    setCurrent(null);
    setError("");
    setOpen(true);
  };

  const openEdit = async (record: QuoteEditorRecord) => {
    const id = String(record.id || record.key || "");
    setCurrent(record);
    setError("");
    setOpen(true);
    if (!id) return;
    try {
      const detail = await fetchCrmRecord<QuoteEditorRecord>("quotations", id);
      setCurrent({
        ...record,
        ...detail,
        id: detail.id || id,
        lines: Array.isArray(detail.lines) ? detail.lines : record.lines,
      });
    } catch {
      setCurrent(record);
    }
  };

  const removeQuote = async (record: QuoteEditorRecord) => {
    const id = String(record.id || record.key || "");
    if (!id) return;
    if (!window.confirm("Supprimer ce devis et ses lignes ?")) return;
    try {
      await deleteCrmRecord("quotations", id);
      setError("");
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  const columns = [
    {
      title: "Quote ID",
      dataIndex: "quoteId",
      render: (text: string, record: QuoteEditorRecord) => (
        <button type="button" className="btn btn-link p-0 title-name" onClick={() => void openEdit(record)}>
          {text}
        </button>
      ),
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.quoteId ?? "").localeCompare(String(b.quoteId ?? "")),
    },
    {
      title: "Client",
      dataIndex: "client",
      render: (text: string, record: QuoteEditorRecord) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link href={route.companiesDetails} className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="w-auto h-auto"
              src={String(record.clientImage || "assets/img/icons/company-icon-01.svg")}
              alt=""
            />
          </Link>
          <Link href={route.companiesDetails}>{text}</Link>
        </h6>
      ),
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.client ?? "").localeCompare(String(b.client ?? ""), "fr"),
    },
    {
      title: "Quote Date",
      dataIndex: "quoteDate",
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.quoteDate ?? "").localeCompare(String(b.quoteDate ?? "")),
    },
    {
      title: "Valid Till",
      dataIndex: "validTill",
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.validTill ?? "").localeCompare(String(b.validTill ?? "")),
    },
    {
      title: "Lines",
      dataIndex: "lineCount",
      render: (value: number, record: QuoteEditorRecord) => (
        <button type="button" className="btn btn-sm btn-outline-light" onClick={() => openEdit(record)}>
          {Number(value) || 0}
        </button>
      ),
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) => Number(a.lineCount || 0) - Number(b.lineCount || 0),
    },
    {
      title: "HT",
      dataIndex: "totalAmount",
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.totalAmount ?? "").localeCompare(String(b.totalAmount ?? ""), "fr", { numeric: true }),
    },
    {
      title: "TVA",
      dataIndex: "taxAmount",
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.taxAmount ?? "").localeCompare(String(b.taxAmount ?? ""), "fr", { numeric: true }),
    },
    {
      title: "TTC",
      dataIndex: "finalAmount",
      render: (text: string) => <span className="fw-semibold">{text}</span>,
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.finalAmount ?? "").localeCompare(String(b.finalAmount ?? ""), "fr", { numeric: true }),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: string) => (
        <span className={`badge badge-soft-${statusTone[value] || "secondary"}`}>
          {t(statusLabel[value] || value || "—")}
        </span>
      ),
      sorter: (a: QuoteEditorRecord, b: QuoteEditorRecord) =>
        String(a.status ?? "").localeCompare(String(b.status ?? "")),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_: unknown, record: QuoteEditorRecord) => (
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
            <button type="button" className="dropdown-item" onClick={() => openEdit(record)}>
              <i className="ti ti-edit text-blue" /> {t("Edit")}
            </button>
            <button type="button" className="dropdown-item" onClick={() => void removeQuote(record)}>
              <i className="ti ti-trash" /> {t("Delete")}
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader
            title="Quotations"
            badgeCount={data.length}
            showModuleTile={true}
            moduleTitle="Sales CRM"
            showExport={true}
            exportPdfResource="quotes"
            onRefresh={reload}
          />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={setSearchText} />
              </div>
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <i className="ti ti-square-rounded-plus-filled me-1" />
                {t("Add Quotation")}
              </button>
            </div>
            <div className="card-body">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="custom-table table-nowrap">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={false}
                  searchText={searchText}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ModalQuotations
        key={open ? String(current?.id || current?.key || "new") : "closed"}
        open={open}
        record={current}
        catalog={catalogOptions}
        companies={companyOptions}
        onClose={() => {
          setOpen(false);
          setCurrent(null);
        }}
        onSaved={reload}
      />
    </>
  );
};

export default QuotationsListComponent;
