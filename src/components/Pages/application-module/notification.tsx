"use client";

import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { all_routes } from "@/router/all_routes";
import { useI18n } from "@/i18n/I18nProvider";

type ActivityRow = Record<string, unknown> & {
  id?: string;
  type?: string;
  subject?: string;
  Subject?: string;
  Company?: string;
  DueAt?: string;
  notes?: string;
};

const typeLabel: Record<string, string> = {
  call: "Appel",
  email: "E-mail",
  meeting: "Réunion",
  task: "Tâche",
  note: "Note",
};

const NotificationsComponent = () => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<ActivityRow>("activities", []);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="Notifications"
          badgeCount={data.length}
          showModuleTile={true}
          moduleTitle="Application"
          showExport={false}
          onRefresh={reload}
        />
        <div className="card">
          <div className="card-body">
            {data.length === 0 ? (
              <p className="text-muted mb-0">{t("No notifications")}</p>
            ) : (
              <ul className="list-group list-group-flush">
                {data.map((row) => (
                  <li className="list-group-item px-0" key={String(row.id)}>
                    <Link href={all_routes.calendar} className="d-block text-decoration-none">
                      <strong className="text-dark">{String(row.Subject || row.subject || "—")}</strong>
                      <div className="fs-13 text-muted">
                        {t(typeLabel[String(row.type || "")] || String(row.type || ""))}
                        {row.Company ? ` · ${String(row.Company)}` : ""}
                        {row.DueAt ? ` · ${String(row.DueAt)}` : ""}
                      </div>
                      {row.notes ? <div className="fs-13 mt-1">{String(row.notes)}</div> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsComponent;
