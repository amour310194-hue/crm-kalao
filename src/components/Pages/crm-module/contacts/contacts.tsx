"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { all_routes } from "@/router/all_routes";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { deleteCrmRecord } from "@/lib/api/crmClient";
import KalaoFormModal from "@/components/Pages/kalao/KalaoFormModal";
import { useI18n } from "@/i18n/I18nProvider";

const contactHref = (record: Record<string, unknown>) =>
  `${all_routes.contactDetails}?id=${encodeURIComponent(String(record.id || record.key || ""))}`;

const ContactsComponent = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data, reload } = useCrmCollection<Record<string, unknown>>("contacts", []);

  const rows = data.filter((row) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return [row.Name, row.Company, row.Email, row.Phone, row.Role]
      .map((value) => String(value || "").toLowerCase())
      .some((value) => value.includes(q));
  });

  const removeContact = async (record: Record<string, unknown>) => {
    const id = String(record.id || record.key || "");
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
          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search" />
              </span>
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link href={all_routes.contactList} className="btn btn-outline-light btn-sm" title={t("List")}>
                <i className="ti ti-list" />
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setCurrent(null);
                  setError("");
                  setOpen(true);
                }}
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                {t("Add Contacts")}
              </button>
            </div>
          </div>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="row">
            {rows.map((record) => (
              <div className="col-xl-4 col-md-6" key={String(record.id || record.key)}>
                <div className="card">
                  <div className="card-body">
                    <Link href={contactHref(record)} className="fw-semibold d-block mb-1">
                      {String(record.Name || "—")}
                    </Link>
                    <p className="text-muted mb-2">{String(record.Role || record.jobTitle || "—")}</p>
                    <p className="mb-1">{String(record.Company || t("Particulier"))}</p>
                    <p className="mb-1">{String(record.Email || "—")}</p>
                    <p className="mb-3">{String(record.Phone || "—")}</p>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => {
                          setCurrent(record);
                          setError("");
                          setOpen(true);
                        }}
                      >
                        {t("Edit")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => void removeContact(record)}
                      >
                        {t("Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

export default ContactsComponent;
