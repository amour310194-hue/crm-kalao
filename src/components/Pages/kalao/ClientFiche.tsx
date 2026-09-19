"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { fetchCrmRecord } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";
import type { AccountFiche } from "@/lib/backend/views";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function badgeSoft(text: string) {
  const value = String(text ?? "");
  if (value === "Particulier") return "badge-soft-info";
  if (value === "Société") return "badge-soft-primary";
  if (["Won", "Paid", "Active", "Confirmé", "Validé", "Visa obtenu", "Occupé", "Actif"].includes(value)) {
    return "badge-soft-success";
  }
  if (["Open", "Devis", "Préparation", "Pièces", "Dossier ouvert", "Partially Paid"].includes(value)) {
    return "badge-soft-warning";
  }
  if (["Lost", "Unpaid", "Overdue", "Inactive", "Absent"].includes(value)) {
    return "badge-soft-danger";
  }
  return "badge-soft-secondary";
}

const ClientFiche = ({ id }: { id: string }) => {
  const { t } = useI18n();
  const [fiche, setFiche] = useState<AccountFiche | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const row = await fetchCrmRecord<AccountFiche>("accounts", id);
        if (!cancelled) {
          setFiche(row);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Fiche introuvable");
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader title="Client file" showModuleTile moduleTitle="CRM" showExport={false} />
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <div className="mb-3">
          <Link href={all_routes.clients} className="btn btn-outline-light">
            {t("Back")}
          </Link>
        </div>
        {!fiche && !error ? <p className="text-muted">{t("Loading")}</p> : null}
        {fiche ? (
          <>
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                  <div>
                    <h4 className="mb-1">{fiche.Name}</h4>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className={`badge ${badgeSoft(fiche.Type)}`}>{t(fiche.Type)}</span>
                      <span className={`badge ${badgeSoft(fiche.Status)}`}>{t(fiche.Status)}</span>
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="text-muted small">{t("Email")}</div>
                    <strong>{fiche.Email || "—"}</strong>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">{t("Phone")}</div>
                    <strong>{fiche.Phone || "—"}</strong>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">{t("City")}</div>
                    <strong>{fiche.City || "—"}</strong>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">{t("Tags")}</div>
                    <strong>{fiche.Tags || "—"}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-muted small">{t("Deals")}</div>
                    <h5 className="mb-0">
                      {fiche.totals.dealsCount} · {euro.format(fiche.totals.dealsAmount)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-muted small">{t("Invoices")}</div>
                    <h5 className="mb-0">
                      {fiche.totals.invoicesCount} · {t("Outstanding")} {euro.format(fiche.totals.invoicesOutstanding)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-muted small">{t("Business files")}</div>
                    <h5 className="mb-0">{fiche.totals.dossiersCount}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">{t("Related deals")}</h6>
                <Link href={all_routes.dealsList} className="btn btn-sm btn-outline-light">
                  {t("View all")}
                </Link>
              </div>
              <div className="card-body">
                {fiche.deals.length === 0 ? (
                  <p className="text-muted mb-0">{t("No related deals")}</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>{t("Deal Name")}</th>
                          <th>{t("Stage")}</th>
                          <th>{t("Deal Value")}</th>
                          <th>{t("Status")}</th>
                          <th>{t("Expected Close Date")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fiche.deals.map((deal) => (
                          <tr key={String(deal.id ?? deal.key)}>
                            <td>{String(deal.DealName)}</td>
                            <td>{t(String(deal.Stage))}</td>
                            <td>{String(deal.DealValue)}</td>
                            <td>
                              <span className={`badge ${badgeSoft(String(deal.Status))}`}>{t(String(deal.Status))}</span>
                            </td>
                            <td>{String(deal.ExpectedCloseDate || "—")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">{t("Related invoices")}</h6>
                <Link href={all_routes.InvoiceList} className="btn btn-sm btn-outline-light">
                  {t("View all")}
                </Link>
              </div>
              <div className="card-body">
                {fiche.invoices.length === 0 ? (
                  <p className="text-muted mb-0">{t("No related invoices")}</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>{t("Invoice ID")}</th>
                          <th>{t("Project")}</th>
                          <th>{t("Due Date")}</th>
                          <th>{t("Amount")}</th>
                          <th>{t("Paid Amount")}</th>
                          <th>{t("Status")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fiche.invoices.map((invoice) => (
                          <tr key={String(invoice.key)}>
                            <td>{String(invoice.Invoice_ID)}</td>
                            <td>{String(invoice.Project || invoice.project || "—")}</td>
                            <td>{String(invoice.Due_Date || "—")}</td>
                            <td>{String(invoice.Amount)}</td>
                            <td>{String(invoice.Paid_Amount)}</td>
                            <td>
                              <span className={`badge ${badgeSoft(String(invoice.Status))}`}>
                                {t(String(invoice.Status))}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">{t("Related business files")}</h6>
              </div>
              <div className="card-body">
                {fiche.dossiers.length === 0 ? (
                  <p className="text-muted mb-0">{t("No related business files")}</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>{t("Kind")}</th>
                          <th>{t("Quote ID")}</th>
                          <th>{t("Name")}</th>
                          <th>{t("Status")}</th>
                          <th>{t("Amount")}</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {fiche.dossiers.map((dossier) => (
                          <tr key={`${dossier.kind}-${dossier.id}`}>
                            <td>{t(dossier.kind)}</td>
                            <td>{dossier.number || "—"}</td>
                            <td>{dossier.title || "—"}</td>
                            <td>
                              <span className={`badge ${badgeSoft(dossier.status)}`}>{t(dossier.status)}</span>
                            </td>
                            <td>{dossier.amount}</td>
                            <td className="text-end">
                              <Link href={dossier.href} className="btn btn-sm btn-outline-light">
                                {t("Open file")}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ClientFiche;
