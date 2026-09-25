"use client";

import Link from "next/link";
import CollapseIcons from "@/core/common/collapse-icons/collapseIcons";
import CommonFooter from "@/core/common/common-footer/commonFooter";
import { all_routes } from "@/router/all_routes";
import { formatMoney, kpisChartMonths, useKalaoKpis } from "@/lib/kpi";
import { liveHref } from "@/lib/docs";
import DealsYearChart from "../deals-dashboard/chats/dealsYearChart";

const MainDashboardComponent = () => {
  const { kpis } = useKalaoKpis();
  const chartMonths = kpisChartMonths(kpis);
  const dossiers = kpis?.recentDossiers ?? [];
  const deadlines = kpis?.deadlines ?? [];
  const collected = kpis?.collected ?? 0;
  const outstanding = kpis?.outstanding ?? 0;

  const cards = [
    {
      label: "Encaissé",
      value: formatMoney(collected),
      hint: kpis ? `dont ${formatMoney(kpis.collectedMtd)} ce mois` : "—",
      href: all_routes.payments,
    },
    {
      label: "Reste à encaisser",
      value: formatMoney(outstanding),
      hint: `${kpis?.unpaidCount ?? 0} facture${(kpis?.unpaidCount ?? 0) > 1 ? "s" : ""} ouverte${(kpis?.unpaidCount ?? 0) > 1 ? "s" : ""}`,
      href: all_routes.InvoiceList,
    },
    {
      label: "Dossiers ouverts",
      value: String(kpis?.dossiersOpen ?? 0),
      hint: "Procédures en cours",
      href: `${all_routes.projectsGrid}?kind=visa`,
    },
    {
      label: "Clients",
      value: String(kpis?.companies ?? 0),
      hint: `${kpis?.contacts ?? 0} contact${(kpis?.contacts ?? 0) > 1 ? "s" : ""}`,
      href: all_routes.companiesList,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <h4 className="mb-1">Tableau de bord</h4>
            <p className="text-muted mb-0">Caisse, dossiers et échéances — données réelles uniquement.</p>
          </div>
          <CollapseIcons />
        </div>

        <div className="row">
          {cards.map((card) => (
            <div className="col-xl-3 col-sm-6 d-flex" key={card.label}>
              <div className="card flex-fill">
                <div className="card-body">
                  <p className="fw-medium mb-1">{card.label}</p>
                  <h4 className="mb-2">{card.value}</h4>
                  <p className="mb-2 text-muted">{card.hint}</p>
                  <Link href={card.href} className="fs-13">
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-xl-8 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Encaissé (6 mois)</h6>
              </div>
              <div className="card-body py-0">
                {chartMonths ? (
                  <DealsYearChart
                    categories={chartMonths.categories}
                    data={chartMonths.collectedK}
                  />
                ) : (
                  <p className="text-muted py-5 text-center">
                    Pas encore de données à afficher
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">Échéances</h6>
                <Link href={all_routes.activities} className="fs-13">
                  Activités
                </Link>
              </div>
              <div className="card-body">
                {deadlines.length ? (
                  <ul className="list-unstyled mb-0">
                    {deadlines.slice(0, 6).map((row) => (
                      <li
                        key={row.key}
                        className="d-flex justify-content-between gap-2 py-2 border-bottom"
                      >
                        <span>{row.title}</span>
                        <span className="text-muted text-nowrap">{row.dateLabel}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">Aucune échéance à venir.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-8 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">Dossiers récents</h6>
                <Link href={`${all_routes.projectsGrid}?kind=visa`} className="fs-13">
                  Tous les visas
                </Link>
              </div>
              <div className="card-body">
                {dossiers.length ? (
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Dossier</th>
                          <th>Client</th>
                          <th>Métier</th>
                          <th>Échéance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dossiers.map((row) => (
                          <tr key={row.key}>
                            <td>
                              <Link href={liveHref(all_routes.projectDetails, row.key)}>
                                {row.title}
                              </Link>
                            </td>
                            <td>{row.company}</td>
                            <td>{row.kindLabel}</td>
                            <td>{row.endLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted mb-0">Aucun dossier pour l’instant.</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Affaires</h6>
              </div>
              <div className="card-body">
                {kpis?.dealsTotal ? (
                  <p className="mb-0">
                    {kpis.dealsActive} ouvertes · {kpis.dealsWon} gagnées ·{" "}
                    {kpis.dealsLost} perdues
                  </p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">Aucune affaire pour l’instant</p>
                    <Link href={all_routes.dealsGrid} className="btn btn-primary">
                      Créer une affaire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default MainDashboardComponent;
