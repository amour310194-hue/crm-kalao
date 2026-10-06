"use client";

import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SettingsTopbar from "../settings-topbar/settingsTopbar";
import WebsiteSettingsNav from "./websiteSettingsNav";
import { CRM_UI_LOCALES, localeStatusLabel } from "@/lib/ui-locale";

export default function LanguageSettingsComponent() {
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader title="Langue" badgeCount={false} showModuleTile={false} showExport={false} />
          <SettingsTopbar />
          <div className="row">
            <div className="col-xl-3 col-lg-12 theiaStickySidebar">
              <WebsiteSettingsNav />
            </div>
            <div className="col-xl-9 col-lg-12">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="border-bottom mb-3 pb-3">
                    <h4 className="fs-17 mb-1">Langue de l’interface</h4>
                    <p className="text-muted mb-0">
                      Le CRM Kalao s’affiche en français. Il n’y a pas de catalogue de traductions, ni de
                      pourcentages, ni de statut « Connected ». L’anglais n’est pas encore une interface
                      disponible.
                    </p>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>Langue</th>
                          <th>Code</th>
                          <th>Écriture</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CRM_UI_LOCALES.map((row) => (
                          <tr key={row.code}>
                            <td>{row.name}</td>
                            <td>
                              <code>{row.code}</code>
                            </td>
                            <td>{row.rtl ? "De droite à gauche" : "De gauche à droite"}</td>
                            <td>
                              <span className="badge badge-soft-primary">{localeStatusLabel(row.status)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
