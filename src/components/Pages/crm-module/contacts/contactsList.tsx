"use client";

import { useState } from "react";
import Link from "next/link";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { all_routes } from "@/router/all_routes";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { deleteCrmRecord } from "@/lib/api/crmClient";
import KalaoFormModal from "@/components/Pages/kalao/KalaoFormModal";
import { useI18n } from "@/i18n/I18nProvider";

const contactHref = (record: Record<string, unknown>) =>
  `${all_routes.contactDetails}?id=${encodeURIComponent(String(record.id || record.key || ""))}`;

const ContactsListComponent = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data, reload } = useCrmCollection<Record<string, unknown>>("contacts", []);

  const contactId = (record: Record<string, unknown>) => String(record.id || record.key || "");

  const openCreate = () => {
    setCurrent(null);
    setError("");
    setOpen(true);
  };

  const openEdit = (record: Record<string, unknown>) => {
    setCurrent(record);
    setError("");
    setOpen(true);
  };

  const removeContact = async (record: Record<string, unknown>) => {
    const id = contactId(record);
    if (!id) return;
    if (!window.confirm("Supprimer ce contact ?")) return;
    try {
      await deleteCrmRecord("contacts", id);
      setError("");
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "Name",
      render: (text: string, record: Record<string, unknown>) => (
        <Link href={contactHref(record)} className="fw-medium">
          {text}
          <span className="d-block fs-13 fw-normal text-body">{String(record.Role || record.jobTitle || "")}</span>
        </Link>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Name ?? "").localeCompare(String(b.Name ?? ""), "fr"),
    },
    {
      title: t("Type"),
      dataIndex: "ClientType",
      render: (text: string) => (
        <span className={`badge ${text === "Particulier" ? "badge-soft-info" : "badge-soft-primary"}`}>
          {text || t("Société")}
        </span>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.ClientType ?? "").localeCompare(String(b.ClientType ?? ""), "fr"),
    },
    {
      title: t("Société"),
      dataIndex: "Company",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Company ?? "").localeCompare(String(b.Company ?? ""), "fr"),
    },
    {
      title: t("Phone"),
      dataIndex: "Phone",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Phone ?? "").localeCompare(String(b.Phone ?? ""), "fr"),
    },
    {
      title: t("Email"),
      dataIndex: "Email",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Email ?? "").localeCompare(String(b.Email ?? ""), "fr"),
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      render: (text: string) => (
        <span className={`badge badge-pill badge-status ${text === "Active" ? "bg-success" : "bg-danger"}`}>
          {text}
        </span>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Status ?? "").localeCompare(String(b.Status ?? ""), "fr"),
    },
    {
      title: t("Action"),
      dataIndex: "Action",
      render: (_: unknown, record: Record<string, unknown>) => (
        <div className="d-flex gap-1">
          <Link href={contactHref(record)} className="btn btn-sm btn-outline-light">
            {t("Preview")}
          </Link>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={() => openEdit(record)}>
            {t("Edit")}
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void removeContact(record)}>
            {t("Delete")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader
            title="Contacts"
            badgeCount={data.length}
            showModuleTile={false}
            showExport={true}
            exportPdfResource="contacts"
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
              <div className="d-flex align-items-center gap-2">
                <Link href={all_routes.contactGrid} className="btn btn-outline-light btn-sm" title={t("Grid")}>
                  <i className="ti ti-layout-grid" />
                </Link>
                <button type="button" className="btn btn-primary" onClick={openCreate}>
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  {t("Add Contacts")}
                </button>
              </div>
            </div>
            <div className="card-body">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="custom-table table-nowrap">
                <Datatable columns={columns} dataSource={data} Selection={false} searchText={searchText} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <KalaoFormModal
        resource="contacts"
        open={open}
        record={current}
        onClose={() => setOpen(false)}
        onSaved={reload}
      />
    </>
  );
};

export default ContactsListComponent;
