"use client";

import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { useI18n } from "@/i18n/I18nProvider";
import type { DashboardKpiData } from "@/lib/backend/kpis";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import { useEffect, useState } from "react";

const EMPTY_KPIS: DashboardKpiData = {
  deals: { openCount: 0, wonCount: 0, lostCount: 0, pipelineAmount: 0, wonAmount: 0 },
  invoices: { count: 0, unpaidCount: 0, totalAmount: 0, paidAmount: 0, outstanding: 0 },
  payments: { count: 0, totalAmount: 0 },
  metiers: { total: 0, items: [] },
};

const METIER_HREF: Record<string, string> = {
  travel: all_routes.travel,
  immigration: all_routes.immigration,
  events: all_routes.events,
  plantations: all_routes.plantations,
  sites: all_routes.sites,
  properties: all_routes.properties,
  payroll: all_routes.payroll,
};

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return money.format(value);
}

type Props = {
  from?: Date;
  to?: Date;
};

export default function DashboardKpis({ from, to }: Props) {
  const { t } = useI18n();
  const [kpis, setKpis] = useState<DashboardKpiData>(EMPTY_KPIS);
  const [loaded, setLoaded] = useState(false);
  const fromIso = from?.toISOString() ?? "";
  const toIso = to?.toISOString() ?? "";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (fromIso && toIso) {
          params.set("from", fromIso);
          params.set("to", toIso);
        }
        const query = params.toString();
        const response = await fetch(query ? `/api/v1/kpis?${query}` : "/api/v1/kpis", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("API kpis");
        }
        const json = (await response.json()) as { data: DashboardKpiData };
        if (!cancelled) {
          setKpis(json.data ?? EMPTY_KPIS);
        }
      } catch {
        if (!cancelled) {
          setKpis(EMPTY_KPIS);
        }
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    };

    setLoaded(false);
    void load();
    return () => {
      cancelled = true;
    };
  }, [fromIso, toIso]);

  const value = (text: string) => (loaded ? text : "…");

  return (
    <div className="row">
      <div className="col-xl-3 col-sm-6 d-flex">
        <Link
          href={all_routes.dealsList}
          className="card flex-fill text-decoration-none"
          data-kpi="deals"
        >
          <div className="card-body position-relative">
            <p className="fw-medium mb-1">{t("Active Deals")}</p>
            <h4 className="mb-1" data-kpi-value="deals">
              {value(formatMoney(kpis.deals.pipelineAmount))}
            </h4>
            <p className="text-dark mb-3">
              {value(
                `${kpis.deals.openCount} ${t("in progress")} · ${kpis.deals.wonCount} ${t("won deals")}`
              )}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="d-inline-flex align-items-center badge rounded-pill badge-soft-info border-0">
                {t("Deals")}
              </span>
              <p className="text-dark mb-0">{t("View all")}</p>
            </div>
            <div className="custom-card-icon">
              <div className="avatar avatar-rounded avatar-lg bg-info-gradient-100 position-absolute top-0 end-0">
                <ImageWithBasePath
                  src="assets/img/icons/deal-icon.svg"
                  alt="icon"
                  className="img-fluid w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xl-3 col-sm-6 d-flex">
        <Link
          href={all_routes.InvoiceList}
          className="card flex-fill text-decoration-none"
          data-kpi="invoices"
        >
          <div className="card-body position-relative">
            <p className="fw-medium mb-1">{t("Invoiced")}</p>
            <h4 className="mb-1" data-kpi-value="invoices">
              {value(formatMoney(kpis.invoices.totalAmount))}
            </h4>
            <p className="text-dark mb-3">
              {value(
                `${formatMoney(kpis.invoices.outstanding)} ${t("remaining due")} · ${kpis.invoices.unpaidCount} ${t("unpaid invoices")}`
              )}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="d-inline-flex align-items-center badge rounded-pill badge-soft-primary border-0">
                {t("Invoices")}
              </span>
              <p className="text-dark mb-0">{t("View all")}</p>
            </div>
            <div className="custom-card-icon">
              <div className="avatar avatar-rounded avatar-lg bg-primary-gradient-100 position-absolute top-0 end-0">
                <ImageWithBasePath
                  src="assets/img/icons/revenue-icon.svg"
                  alt="icon"
                  className="img-fluid w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xl-3 col-sm-6 d-flex">
        <Link
          href={all_routes.payments}
          className="card flex-fill text-decoration-none"
          data-kpi="payments"
        >
          <div className="card-body position-relative">
            <p className="fw-medium mb-1">{t("Collected")}</p>
            <h4 className="mb-1" data-kpi-value="payments">
              {value(formatMoney(kpis.payments.totalAmount))}
            </h4>
            <p className="text-dark mb-3">
              {value(`${kpis.payments.count} ${t("payments recorded")}`)}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="d-inline-flex align-items-center badge rounded-pill badge-soft-success border-0">
                {t("Payments")}
              </span>
              <p className="text-dark mb-0">{t("View all")}</p>
            </div>
            <div className="custom-card-icon">
              <div className="avatar avatar-rounded avatar-lg bg-pink-gradient-100 position-absolute top-0 end-0">
                <ImageWithBasePath
                  src="assets/img/icons/conversion-icon.svg"
                  alt="icon"
                  className="img-fluid w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xl-3 col-sm-6 d-flex">
        <div className="card flex-fill" data-kpi="metiers">
          <div className="card-body position-relative">
            <p className="fw-medium mb-1">{t("Business files")}</p>
            <h4 className="mb-1" data-kpi-value="metiers">
              {value(String(kpis.metiers.total))}
            </h4>
            <p className="text-dark mb-3">{t("open files")}</p>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {kpis.metiers.items.map((item) => (
                <Link
                  key={item.id}
                  href={METIER_HREF[item.id] ?? all_routes.travel}
                  className="badge rounded-pill badge-soft-secondary border-0"
                >
                  {t(item.label)} {item.count}
                </Link>
              ))}
            </div>
            <div className="custom-card-icon">
              <div className="avatar avatar-rounded avatar-lg bg-purple-gradient-100 position-absolute top-0 end-0 d-inline-flex align-items-center justify-content-center">
                <i className="ti ti-stack-2 fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
