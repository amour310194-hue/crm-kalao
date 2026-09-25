"use client";

import Footer from "../../../../core/common/footer/footer";
import CollapseIcons from "../../../../core/common/collapse-icons/collapseIcons";
import Link from "next/link";
import DealsChart from "./chats/dealsChart";
import LastChart from "./chats/lastChart";
import WonChart from "./chats/wonChart";
import DealsYearChart from "./chats/dealsYearChart";
import { all_routes } from "@/router/all_routes";
import { kpisChartMonths, useKalaoKpis } from "@/lib/kpi";
import { fr } from "@/lib/i18n";

const DelasDashboardComponent = () => {
  const { kpis, live } = useKalaoKpis();
  const chartMonths = kpisChartMonths(kpis);
  const recent = live && kpis ? kpis.recentDeals : [];
  const pipeline = live && kpis ? kpis.pipeline : [];
  const lost = pipeline.filter((s) => s.key === "lost");
  const won = pipeline.filter((s) => s.key === "won");

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <h4 className="mb-0">Affaires</h4>
          <CollapseIcons />
        </div>
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Affaires récentes</h6>
              </div>
              <div className="card-body">
                {recent.length ? (
                  <div className="table-responsive custom-table">
                    <table className="table table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Affaire</th>
                          <th>Étape</th>
                          <th>Montant</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((deal) => (
                          <tr key={deal.key}>
                            <td>
                              <Link
                                href={`${all_routes.dealsDetails}?id=${deal.key}`}
                                className="fw-medium"
                              >
                                {deal.title}
                              </Link>
                            </td>
                            <td>{deal.stage}</td>
                            <td>{deal.amount}</td>
                            <td>
                              <span
                                className={`badge badge-pill ${
                                  deal.stage === "Gagné"
                                    ? "bg-success"
                                    : deal.stage === "Perdu"
                                    ? "bg-danger"
                                    : "bg-indigo"
                                }`}
                              >
                                {deal.stage === "Gagné"
                                  ? "Gagnée"
                                  : deal.stage === "Perdu"
                                  ? "Perdue"
                                  : "Ouverte"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">{fr.noDeals}</p>
                    <Link href={all_routes.dealsGrid} className="btn btn-primary">
                      {fr.createDeal}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Affaires par étape</h6>
              </div>
              <div className="card-body py-0">
                <DealsChart
                  categories={pipeline.map((stage) => stage.label)}
                  data={pipeline.map((stage) => stage.count)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Affaires perdues</h6>
              </div>
              <div className="card-body py-0">
                <LastChart
                  categories={lost.map((row) => row.label)}
                  data={lost.map((row) => row.count)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h6 className="mb-0">Affaires gagnées</h6>
              </div>
              <div className="card-body py-0">
                <WonChart
                  categories={won.map((row) => row.label)}
                  data={won.map((row) => row.count)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 d-flex">
            <div className="card w-100">
              <div className="card-header">
                <h6 className="mb-0">Encaissé (6 mois)</h6>
              </div>
              <div className="card-body py-0">
                <DealsYearChart
                  categories={chartMonths?.categories}
                  data={chartMonths?.collectedK}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DelasDashboardComponent;
