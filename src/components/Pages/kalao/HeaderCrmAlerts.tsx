"use client";

import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { useI18n } from "@/i18n/I18nProvider";

type ActivityRow = Record<string, unknown> & {
  id?: string;
  type?: string;
  subject?: string;
  Subject?: string;
  Company?: string;
  DueAt?: string;
};

const typeLabel: Record<string, string> = {
  call: "Appel",
  email: "E-mail",
  meeting: "Réunion",
  task: "Tâche",
  note: "Note",
};

const HeaderCrmAlerts = () => {
  const { t } = useI18n();
  const route = all_routes;
  const { data } = useCrmCollection<ActivityRow>("activities", []);
  const emails = data.filter((row) => String(row.type || "") === "email").length;
  const recent = data.slice(0, 6);

  return (
    <>
      <div className="header-item">
        <div className="dropdown me-2">
          <Link href={route.email} className="btn topbar-link">
            <i className="ti ti-message-circle-exclamation" />
            {emails > 0 ? <span className="badge rounded-pill">{emails}</span> : null}
          </Link>
        </div>
      </div>
      <div className="header-item">
        <div className="dropdown me-2">
          <button
            className="topbar-link btn topbar-link dropdown-toggle drop-arrow-none"
            data-bs-toggle="dropdown"
            data-bs-offset="0,24"
            type="button"
            aria-haspopup="false"
            aria-expanded="false"
          >
            <i className="ti ti-bell-check fs-16" />
            {data.length > 0 ? <span className="badge rounded-pill">{data.length}</span> : null}
          </button>
          <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style={{ minHeight: 180 }}>
            <div className="p-2 border-bottom">
              <h6 className="m-0 fs-16 fw-semibold">{t("Notifications")}</h6>
            </div>
            <div className="notification-body position-relative z-2 rounded-0">
              {recent.length === 0 ? (
                <p className="text-muted p-3 mb-0">{t("No notifications")}</p>
              ) : (
                recent.map((row) => (
                  <Link
                    key={String(row.id)}
                    href={route.calendar}
                    className="dropdown-item notification-item py-3 text-wrap border-bottom"
                  >
                    <p className="mb-0 fw-medium text-dark">
                      {String(row.Subject || row.subject || "—")}
                    </p>
                    <p className="mb-0 fs-12 text-muted">
                      {t(typeLabel[String(row.type || "")] || String(row.type || ""))}
                      {row.Company ? ` · ${String(row.Company)}` : ""}
                      {row.DueAt ? ` · ${String(row.DueAt)}` : ""}
                    </p>
                  </Link>
                ))
              )}
            </div>
            <div className="p-2 rounded-bottom border-top text-center">
              <Link href={route.notificationbell} className="text-center text-decoration-underline fs-14 mb-0">
                {t("View All Notifications")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderCrmAlerts;
