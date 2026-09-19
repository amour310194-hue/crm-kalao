"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { all_routes } from "@/router/all_routes";
import { fetchCrmRecord } from "@/lib/api/crmClient";
import KalaoFormModal from "@/components/Pages/kalao/KalaoFormModal";
import { useI18n } from "@/i18n/I18nProvider";

type ContactFiche = Record<string, unknown> & {
  id?: string;
  Name?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  Role?: string;
  email?: string;
  Email?: string;
  phone?: string;
  Phone?: string;
  location?: string;
  Location?: string;
  ClientType?: string;
  Company?: string;
  companyId?: string;
  Status?: string;
  company?: { id?: string; name?: string; email?: string; phone?: string; city?: string } | null;
  deals?: Array<Record<string, unknown>>;
  activities?: Array<Record<string, unknown>>;
};

const ContactsDetailsComponent = () => {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [fiche, setFiche] = useState<ContactFiche | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!id) {
      setError("Contact introuvable.");
      setFiche(null);
      return;
    }
    try {
      setFiche(await fetchCrmRecord<ContactFiche>("contacts", id));
      setError("");
    } catch (err) {
      setFiche(null);
      setError(err instanceof Error ? err.message : "Fiche impossible");
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const name = String(fiche?.Name || `${fiche?.firstName ?? ""} ${fiche?.lastName ?? ""}`.trim() || "—");
  const company = fiche?.company;

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader title="Contacts" showModuleTile={false} showExport={false} onRefresh={() => void load()} />
          <div className="mb-3">
            <Link href={all_routes.contactList}>
              <i className="ti ti-arrow-narrow-left me-1" />
              {t("Contacts")}
            </Link>
          </div>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {fiche ? (
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="mb-1">{name}</h4>
                    <p className="text-muted mb-2">{String(fiche.Role || fiche.jobTitle || "—")}</p>
                    <span className={`badge mb-3 ${fiche.ClientType === "Particulier" ? "badge-soft-info" : "badge-soft-primary"}`}>
                      {String(fiche.ClientType || t("Société"))}
                    </span>
                    <p className="mb-1">{String(fiche.Email || fiche.email || "—")}</p>
                    <p className="mb-1">{String(fiche.Phone || fiche.phone || "—")}</p>
                    <p className="mb-3">{String(fiche.Location || fiche.location || "—")}</p>
                    <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
                      {t("Edit")}
                    </button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">{t("Société")}</h6>
                  </div>
                  <div className="card-body">
                    {company ? (
                      <>
                        <p className="fw-medium mb-1">{company.name}</p>
                        <p className="mb-1">{company.email || "—"}</p>
                        <p className="mb-1">{company.phone || "—"}</p>
                        <p className="mb-0">{company.city || "—"}</p>
                      </>
                    ) : (
                      <p className="text-muted mb-0">{t("Particulier")}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">{t("Affaires")}</h6>
                  </div>
                  <div className="card-body">
                    {(fiche.deals || []).length === 0 ? (
                      <p className="text-muted mb-0">{t("No records found")}</p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {(fiche.deals || []).map((deal) => (
                          <li className="list-group-item px-0 d-flex justify-content-between" key={String(deal.id || deal.key)}>
                            <Link href={all_routes.dealsList}>{String(deal.DealName || deal.title || "—")}</Link>
                            <span>{String(deal.Stage || deal.stage || "")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">{t("Activités")}</h6>
                  </div>
                  <div className="card-body">
                    {(fiche.activities || []).length === 0 ? (
                      <p className="text-muted mb-0">{t("No records found")}</p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {(fiche.activities || []).map((activity) => (
                          <li className="list-group-item px-0" key={String(activity.id || activity.key)}>
                            <Link href={all_routes.calendar} className="fw-medium">
                              {String(activity.Subject || activity.subject || "—")}
                            </Link>
                            <div className="fs-13 text-muted">
                              {t(String(activity.type || ""))} · {String(activity.DueAt || activity.dueAt || "")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Footer />
      </div>
      <KalaoFormModal
        resource="contacts"
        open={open}
        record={fiche}
        onClose={() => setOpen(false)}
        onSaved={() => void load()}
      />
    </>
  );
};

export default ContactsDetailsComponent;
