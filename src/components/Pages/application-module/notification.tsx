"use client";

import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Link from "next/link";
import {
  notificationIcon,
  relativeTimeFr,
  useNotifications,
} from "@/lib/notifications";

const NotificationsComponent = () => {
  const { items, unread, markRead, markAll } = useNotifications();

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader title="Notifications" badgeCount={unread} showModuleTile={false} showExport={false} />
          <div className="card mb-0">
            <div className="card-header d-flex align-items-center flex-wrap gap-2 justify-content-between">
              <h6 className="d-inline-flex align-items-center mb-0">
                Notifications
                <span className="badge bg-danger ms-2">{unread}</span>
              </h6>
              <button type="button" className="btn btn-light" onClick={() => void markAll()} disabled={!unread}>
                <i className="ti ti-checks me-1" />
                Tout marquer comme lu
              </button>
            </div>
            <div className="card-body">
              {items.length === 0 ? (
                <p className="text-muted mb-0">Aucune activité, mail ou rappel à afficher.</p>
              ) : (
                items.map((row) => (
                  <div className="card notication-card mb-2" key={row.id}>
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <Link
                          href={row.href || "#"}
                          className="d-flex align-items-center text-decoration-none"
                          onClick={() => {
                            if (!row.read_at) void markRead([row.id]);
                          }}
                        >
                          <span className="avatar flex-shrink-0 rounded-circle bg-soft-primary text-primary">
                            <i className={notificationIcon(row.kind)} />
                          </span>
                          <div className="ms-2">
                            <p className="mb-1">
                              <span className="fw-medium text-dark">{row.title}</span>
                              {row.body ? <span className="text-muted"> — {row.body}</span> : null}
                            </p>
                            <p className="fs-12 mb-0 d-inline-flex align-items-center text-muted">
                              <i className="ti ti-clock me-1" />
                              {relativeTimeFr(row.created_at)}
                              {!row.read_at ? (
                                <span className="ms-2">
                                  <i className="ti ti-point-filled text-danger fs-16 lh-sm" />
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default NotificationsComponent;
