"use client";

import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import {
  notificationIcon,
  relativeTimeFr,
  useNotifications,
  type NotificationRow,
} from "@/lib/notifications";

function Item({
  row,
  onRead,
}: {
  row: NotificationRow;
  onRead: (id: string) => void;
}) {
  const unread = !row.read_at;
  const href = row.href || all_routes.notificationbell;
  return (
    <Link
      href={href}
      className={`d-flex align-items-start gap-2 px-3 py-2 text-decoration-none border-bottom ${unread ? "bg-light" : ""}`}
      onClick={() => {
        if (unread) onRead(row.id);
      }}
    >
      <span className="avatar avatar-sm rounded-circle bg-soft-primary text-primary flex-shrink-0">
        <i className={notificationIcon(row.kind)} />
      </span>
      <span className="flex-grow-1 min-width-0">
        <span className="d-flex align-items-center justify-content-between gap-2">
          <span className="fw-semibold text-dark fs-13">{row.title}</span>
          {unread ? <i className="ti ti-point-filled text-danger fs-16 lh-1" /> : null}
        </span>
        {row.body ? <span className="d-block text-muted fs-12 text-truncate">{row.body}</span> : null}
        <span className="d-block text-muted fs-11 mt-1">{relativeTimeFr(row.created_at)}</span>
      </span>
    </Link>
  );
}

export default function NotificationBell() {
  const { items, unread, markRead, markAll } = useNotifications();
  const preview = items.slice(0, 8);

  return (
    <div className="dropdown me-2">
      <button
        className="topbar-link btn topbar-link dropdown-toggle drop-arrow-none position-relative"
        data-bs-toggle="dropdown"
        data-bs-offset="0,24"
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
        title="Notifications"
      >
        <i className={`ti ti-bell-check fs-16${unread ? " animate-ring" : ""}`} />
        {unread > 0 ? (
          <span
            className="position-absolute badge rounded-pill bg-danger"
            style={{ top: 2, right: -2, fontSize: 10, padding: "3px 5px" }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>
      <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style={{ minHeight: 240, width: 360 }}>
        <div className="p-2 border-bottom d-flex align-items-center justify-content-between gap-2">
          <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
          {unread > 0 ? (
            <button type="button" className="btn btn-sm btn-link p-0" onClick={() => void markAll()}>
              Tout lu
            </button>
          ) : null}
        </div>
        <div className="notification-body position-relative z-2 rounded-0" style={{ maxHeight: 360, overflowY: "auto" }}>
          {preview.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">Aucune notification pour le moment.</p>
          ) : (
            preview.map((row) => <Item key={row.id} row={row} onRead={(id) => void markRead([id])} />)
          )}
        </div>
        <div className="p-2 border-top text-center">
          <Link href={all_routes.notificationbell} className="btn btn-sm btn-light w-100">
            Voir tout
          </Link>
        </div>
      </div>
    </div>
  );
}
