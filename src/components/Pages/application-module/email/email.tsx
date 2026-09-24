"use client";
/* eslint-disable @next/next/no-img-element */
import CommonTagInputs from "@/core/common/common-tagInput/commonTagInputs";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { composeEmail, formatChatTime, remindDueVisaActivities } from "@/lib/inbox";
import {
  EMAIL_FOLDERS,
  countFolder,
  emailParty,
  fetchAllowedMailboxes,
  fetchCrmEmails,
  fetchSessionMail,
  syncInboundEmails,
  filterEmails,
  folderLabel,
  isMailFolder,
  isMailboxKey,
  mailHref,
  mailboxLabel,
  patchCrmEmail,
  trayOf,
  type CrmEmailRow,
  type MailFolder,
  type MailboxKey,
  type SessionMail,
} from "@/lib/mail";
import { liveHref } from "@/lib/docs";
import KalaoMailboxNav from "@/components/docs/KalaoMailboxNav";
import { useLiveRows } from "@/lib/useLiveRows";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useCallback, useEffect, useMemo, useState } from "react";



const EmailComponent = () => {
  const [showMore, setShowMore] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);
  const [show, setShow] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [mailbox, setMailbox] = useState<MailboxKey>("contact");
  const [session, setSession] = useState<SessionMail | null>(null);
  const [allowed, setAllowed] = useState<MailboxKey[]>(["contact", "noreply", "personal"]);
  const [folder, setFolder] = useState<MailFolder>("inbox");
  const loadEmails = useCallback(async () => fetchCrmEmails(), []);
  const { rows: emails, live, reload } = useLiveRows(
    [] as CrmEmailRow[],
    loadEmails
  );
  const visible = useMemo(
    () => filterEmails(emails, mailbox, folder),
    [emails, mailbox, folder]
  );
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  useEffect(() => {
    if (!live) return;
    void remindDueVisaActivities();
    void fetchSessionMail().then(setSession);
    const params = new URLSearchParams(window.location.search);
    const box = params.get("box");
    const tray = params.get("folder");
    if (isMailFolder(tray)) setFolder(tray);
    else if (tray === null && (box === "inbox" || box === "sent")) setFolder(box);
    void fetchAllowedMailboxes().then((boxes) => {
      setAllowed(boxes);
      if (isMailboxKey(box) && boxes.includes(box)) setMailbox(box);
      else setMailbox((current) => (boxes.includes(current) ? current : boxes[0] ?? "personal"));
    });
    void syncInboundEmails().then((count) => {
      if (count > 0) void reload();
    });
  }, [live, reload]);


  const handleToggle = () => {
    setShowMore((prev) => !prev);
  };
  const handleToggle2 = () => {
    setShowMore2((prev) => !prev);
  };
  const handleToggle3 = () => {
    setShowMore3((prev) => !prev);
  };
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content p-0">
          <div className="d-md-flex">
            {/* Email Sidenav Start */}
            <OverlayScrollbarsComponent
              style={{ height: "calc(100vh - 56px)" }}
              className="email-sidebar border-end border-bottom bg-white w-100"
              data-simplebar=""
            >
              <div className="p-3">
                <div className="border bg-white rounded p-2 mb-3">
                  <div className="d-flex align-items-center">
                    <Link
                      href="#"
                      className="avatar avatar-md flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-02.jpg"
                        className="rounded-circle"
                        alt="Img"
                      />
                    </Link>
                    <div>
                      <h6 className="mb-1 fs-16 fw-medium">
                        <Link href="#">{live ? session?.fullName || "Kalao" : "James Hong"}</Link>
                      </h6>
                      <p className="fs-14 mb-0">
                        {live ? session?.workEmail || "yuki.t@example.com" : "james@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="#"
                  className="btn btn-primary w-100"
                  id="compose_mail"
                   onClick={() => setShow(true)}
                >
                  <i className="ti ti-edit me-2" />
                  Compose
                </Link>
                <Link
                  href={all_routes.aiEmailComposer}
                  className="btn btn-outline-light shadow w-100 mt-2"
                >
                  <i className="ti ti-sparkles me-2" />
                  AI Compose
                </Link>
                {live ? (
                  <KalaoMailboxNav
                    emails={emails}
                    mailbox={mailbox}
                    folder={folder}
                    allowed={allowed}
                    workEmail={session?.workEmail}
                    onSelect={(box, tray) => {
                      setMailbox(box);
                      setFolder(tray);
                    }}
                  />
                ) : (
                <div className="mt-3">
                  <h5 className="mb-2">Emails</h5>
                  <div className="d-block mb-3 pb-3 border-bottom">
                    {EMAIL_FOLDERS.filter((item) => !item.extra).map((item) => (
                      <Link
                        key={item.key}
                        href={live ? mailHref(mailbox, item.key) : item.key === "inbox" ? all_routes.email : "#"}
                        className={`d-flex align-items-center justify-content-between p-2 rounded ${
                          (live ? folder === item.key : item.key === "inbox") ? "bg-light active" : ""
                        }`}
                        onClick={() => {
                          if (live) setFolder(item.key);
                        }}
                      >
                        <span className="d-flex align-items-center fw-medium">
                          <i className={item.icon} />
                          {item.label}
                        </span>
                        {item.key === "inbox" ? (
                          <span className="badge bg-danger bg-danger rounded-pill badge-xs">
                            {live ? countFolder(emails, mailbox, "inbox") : item.dummy}
                          </span>
                        ) : item.key === "starred" ? (
                          <span className="fw-semibold fs-12 rounded-pill">
                            {live ? countFolder(emails, mailbox, "starred") : item.dummy}
                          </span>
                        ) : (
                          <span className="rounded-pill">
                            {live ? countFolder(emails, mailbox, item.key) : item.dummy}
                          </span>
                        )}
                      </Link>
                    ))}
                    <div>
                      <div
                        className="more-menu"
                        style={{
                          display: showMore || live ? "block" : "none",
                          marginTop: "10px",
                        }}
                      >
                        {EMAIL_FOLDERS.filter((item) => item.extra).map((item) => (
                          <Link
                            key={item.key}
                            href={live ? mailHref(mailbox, item.key) : "#"}
                            className={`d-flex align-items-center justify-content-between p-2 rounded ${
                              live && folder === item.key ? "bg-light active" : ""
                            }`}
                            onClick={() => {
                              if (live) setFolder(item.key);
                            }}
                          >
                            <span className="d-flex align-items-center fw-medium">
                              <i className={item.icon} />
                              {item.label}
                            </span>
                            <span className="rounded-pill">
                              {live ? countFolder(emails, mailbox, item.key) : item.dummy}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="view-all mt-2">
                        <Link
                          href="#"
                          className="viewall-button fw-medium"
                          onClick={handleToggle}
                        >
                          <span>{`${showMore ? "Less" : "Show More"}`}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                )}
                <div className="border-bottom mb-3 pb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0">Labels</h5>
                    <Link href="#">
                      <i className="ti ti-square-rounded-plus-filled text-primary fs-16" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-square-rounded text-success me-2" />{" "}
                      Team Events
                    </Link>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-square-rounded text-warning me-2" />{" "}
                      Work
                    </Link>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-square-rounded text-danger me-2" />{" "}
                      External
                    </Link>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-square-rounded text-skyblue me-2" />{" "}
                      Projects
                    </Link>
                    <div>
                      <div className="more-menu-2" style={{
                          display: showMore2 ? "block" : "none",
                          marginTop: "10px",
                        }}>
                        <Link
                          href="#"
                          className="fw-medium d-flex align-items-center text-dark py-1"
                        >
                          <i className="ti ti-square-rounded text-purple me-2" />{" "}
                          Applications
                        </Link>
                        <Link
                          href="#"
                          className="fw-medium d-flex align-items-center text-dark py-1"
                        >
                          <i className="ti ti-square-rounded text-info me-2" />{" "}
                          Desgin
                        </Link>
                      </div>
                      <div className="view-all mt-2">
                        <Link href="#" className="viewall-button fw-medium" onClick={handleToggle2}>
                                <span>{`${showMore2 ? 'Less' :"Show More"}`}</span>
                              </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0">Folders</h5>
                    <Link href="#">
                      <i className="ti ti-square-rounded-plus-filled text-primary fs-16" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-folder-filled text-danger me-2" />{" "}
                      Projects
                    </Link>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-folder-filled text-warning me-2" />{" "}
                      Personal
                    </Link>
                    <Link
                      href="#"
                      className="fw-medium d-flex align-items-center text-dark py-1"
                    >
                      <i className="ti ti-folder-filled text-success me-2" />{" "}
                      Finance
                    </Link>
                    <div>
                      <div className="more-menu-3"  style={{
                          display: showMore3 ? "block" : "none",
                          marginTop: "10px",
                        }}>
                        <Link
                          href="#"
                          className="fw-medium d-flex align-items-center text-dark py-1"
                        >
                          <i className="ti ti-folder-filled text-info me-2" />{" "}
                          Projects
                        </Link>
                        <Link
                          href="#"
                          className="fw-medium d-flex align-items-center text-dark py-1"
                        >
                          <i className="ti ti-folder-filled text-primary me-2" />{" "}
                          Personal
                        </Link>
                      </div>
                      <div className="view-all mt-2">
                         <Link href="#" className="viewall-button fw-medium" onClick={handleToggle3}>
                                <span>{`${showMore3 ? 'Less' :"Show More"}`}</span>
                              </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </OverlayScrollbarsComponent>
            {/* Email Sidenav End */}

            <OverlayScrollbarsComponent
              style={{ height: "calc(100vh - 56px)" }}
              className="bg-white flex-fill border-end border-bottom mail-notifications"
              data-simplebar=""
            >
              <div className="active">
                <div>
                  <div className="p-3 border-bottom">
                    <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <div>
                        <h5 className="mb-1">
                          {live ? `${mailboxLabel(mailbox)} · ${folderLabel(folder)}` : "Inbox"}
                        </h5>
                        <div className="d-flex align-items-center">
                          <span>{live ? `${visible.length} courriers` : "2345 Emails"}</span>
                          {live ? null : (
                            <>
                              <i className="ti ti-point-filled text-primary mx-1" />
                              <span>56 Unread</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="input-group input-group-sm input-group-flat me-2">
                          <span className="input-group-text border border-end-0 shadow-none">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            autoComplete="off"
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <Link
                            href="#"
                            className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                          >
                            <i className="ti ti-filter-edit" />
                          </Link>
                          <Link
                            href="#"
                            className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                          >
                            <i className="ti ti-settings" />
                          </Link>
                          <Link
                            href="#"
                            className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                            onClick={() => {
                              if (live) void reload();
                            }}
                          >
                            <i className="ti ti-refresh" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group list-group-flush mails-list">
                    {live
                      ? visible.map((row) => (
                          <div className="list-group-item p-3" key={row.id}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                                <Link
                                  href={liveHref(all_routes.emailReply, row.id)}
                                  className="avatar bg-primary avatar-rounded me-2"
                                >
                                  <span className="avatar-title">
                                    {emailParty(row).slice(0, 2).toUpperCase()}
                                  </span>
                                </Link>
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start justify-content-between">
                                    <div>
                                      <h6 className="fs-16 mb-1">
                                        <Link href={liveHref(all_routes.emailReply, row.id)}>
                                          {emailParty(row)}
                                        </Link>
                                      </h6>
                                      <span className="fw-semibold">{row.subject}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className="d-inline-flex align-items-center">
                                        <i className="ti ti-point-filled text-success" />
                                        {formatChatTime(row.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mb-0">{row.body.slice(0, 120)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge badge-soft-info d-inline-flex align-items-center p-1">
                                <i className="ti ti-square me-1" />
                                {row.direction === "out" ? "Envoyé" : "Reçu"} · {mailboxLabel(row.mailbox)}
                              </span>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  title="Starred"
                                  onClick={() =>
                                    void patchCrmEmail(row.id, { starred: !row.starred }).then(reload)
                                  }
                                >
                                  <i className={`ti ${row.starred ? "ti-star-filled text-warning" : "ti-star"}`} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  title="Important"
                                  onClick={() =>
                                    void patchCrmEmail(row.id, { important: !row.important }).then(reload)
                                  }
                                >
                                  <i className={`ti ti-location-up ${row.important ? "text-danger" : ""}`} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  title={trayOf(row) === "deleted" ? "Restore" : "Deleted"}
                                  onClick={() =>
                                    void patchCrmEmail(row.id, {
                                      folder:
                                        trayOf(row) === "deleted"
                                          ? row.direction === "out"
                                            ? "sent"
                                            : "inbox"
                                          : "deleted",
                                    }).then(reload)
                                  }
                                >
                                  <i className="ti ti-trash" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                    <div className={live ? "d-none" : ""}>
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar bg-primary avatar-rounded me-2"
                          >
                            <span className="avatar-title">CD</span>
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Justin Lapoint
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  Client Dashboard
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-success" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              It seems that recipients are receiving...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark me-2">
                            <i className="ti ti-folder-open me-2" />3
                          </span>
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-photo me-2" />
                            +24
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>
                            <i className="ti ti-star-filled text-warning" />
                          </span>
                          <span className="badge badge-soft-info mx-2 d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            Projects
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Rufana Joe
                                  </Link>
                                </h6>
                                <span className="fw-semibold">UI project</span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              Regardless, you can usually expect an increase
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <Link href="#">
                          <ImageWithBasePath
                            src="assets/img/icons/google-meet.svg"
                            alt="Img"
                          />
                        </Link>
                        <div className="d-flex align-items-center">
                          <span>
                            <i className="ti ti-star-filled text-warning" />
                          </span>
                          <span className="badge badge-soft-primary  d-inline-flex align-items-center p-1 mx-2">
                            <i className="ti ti-square me-1" />
                            Applications
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-03.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Cameron Drake
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  You’re missing
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              Here are a few catchy email subject line
                              examples&nbsp;
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark fs-14">
                            <i className="ti ti-video me-2" />1
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>
                            <i className="ti ti-star-filled text-warning" />
                          </span>
                          <span className="badge badge-soft-danger d-inline-flex align-items-center p-1  mx-2">
                            <i className="ti ti-square me-1" />
                            External
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-04.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Sean Hill
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  How Have You Progressed
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              You can write effective retargeting subject
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-photo me-2" />1
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-soft-success d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            Team Events
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-05.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Kevin Alley
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  Flash. Sale. Alert.
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              You can also use casual language,
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-link me-2" />1
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-soft-danger me-2 d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            External
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-08.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Linda Zimmer
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  Products the celebs are
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              It seems that recipients are receiving...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-link me-2" />1
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-soft-warning me-2 d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            Work
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar bg-success avatar-rounded me-2"
                          >
                            <span className="avatar-title">ER</span>
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Emly Reachel
                                  </Link>
                                </h6>
                                <span className="fw-semibold">No Subject</span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              Announcing Fake Name Generator Premium
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-folder-open me-2" />3
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-soft-info d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            Projects
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    {/* List Item Start */}
                    <div className="list-group-item p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="form-check form-check-md d-flex align-items-center flex-shrink-0 me-2">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 flex-fill">
                          <Link
                            href={all_routes.emailReply}
                            className="avatar avatar-md avatar-rounded me-2"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-07.jpg"
                              alt="Img"
                            />
                          </Link>
                          <div className="flex-fill">
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h6 className="fs-16 mb-1">
                                  <Link href={all_routes.emailReply}>
                                    Sean Hill
                                  </Link>
                                </h6>
                                <span className="fw-semibold">
                                  You’re missing
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-icon btn-sm btn-outline-white border-0 rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href={all_routes.emailReply}
                                      >
                                        Open Email
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Reply All
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Forward As Attachment
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mark As Unread
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move to Junk
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Mute
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Delete
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Archive
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        Move To
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <span className="d-inline-flex align-items-center">
                                  <i className="ti ti-point-filled text-danger" />
                                  3:13 PM
                                </span>
                              </div>
                            </div>
                            <p className="mb-0">
                              Regardless, you can usually expect an increase
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark me-2">
                            <i className="ti ti-folder-open me-2" />3
                          </span>
                          <span className="d-flex align-items-center btn btn-sm bg-soft-dark">
                            <i className="ti ti-photo me-2" />
                            +24
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>
                            <i className="ti ti-star-filled text-warning" />
                          </span>
                          <span className="badge badge-soft-info mx-2 d-inline-flex align-items-center p-1">
                            <i className="ti ti-square me-1" />
                            Applications
                          </span>
                          <Link
                            href="#"
                            className="badge bg-dark rounded-pill p-1"
                          >
                            +1
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* List Item End */}
                    </div>
                  </div>
                </div>
              </div>
            </OverlayScrollbarsComponent>
          </div>
        </div>
        {/* End Content */}
      </div>
      {/* ========================
			End Page Content
		========================= */}

      <div id="compose-view" className={show ? "show" : ""}>
        <div className="bg-white border-0 rounded compose-view">
          <div className="compose-header d-flex align-items-center justify-content-between bg-dark p-3">
            <h5 className="text-white">Compose New Email</h5>
            <div className="d-flex align-items-center">
              <Link href="#" className="d-inline-flex me-2 text-white fs-16">
                <i className="ti ti-minus" />
              </Link>
              <Link href="#" className="d-inline-flex me-2 fs-16 text-white">
                <i className="ti ti-maximize" />
              </Link>
              <button
                type="button"
                className="btn-close custom-btn-close bg-transparent fs-12 text-white position-static"
                id="compose-close"
                onClick={() => setShow(false)}
              >
              </button>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const subject = String(data.get("subject") ?? "");
              const body = String(data.get("body") ?? "");
              await composeEmail({ tags, subject, body, mailbox });
              e.currentTarget.reset();
              setTags([]);
              setShow(false);
              await reload();
            }}
          >
            <div className="p-3 position-relative pb-2 border-bottom chip-with-image">
              <div className="d-flex align-items-center justify-content-between">
                <div className="tag-with-img d-flex align-items-center">
                  <label className="form-label me-2">To</label>
                  <CommonTagInputs
                    initialTags={tags}
                    onTagsChange={handleTagsChange }
                  />

                </div>
                <div className="d-flex align-items-center email-cc">
                  <Link href="#" className="d-inline-flex me-2">
                    Cc
                  </Link>
                  <Link href="#" className="d-inline-flex">
                    Bcc
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-3 border-bottom">
              <div className="mb-3">
                <select
                  className="form-select"
                  value={mailbox}
                  onChange={(e) => setMailbox(e.target.value as MailboxKey)}
                >
                  {allowed.includes("contact") ? (
                    <option value="contact">Depuis Contact (partagée)</option>
                  ) : null}
                  {allowed.includes("noreply") ? (
                    <option value="noreply">Depuis No-reply (partagée)</option>
                  ) : null}
                  {allowed.includes("personal") ? (
                    <option value="personal">
                      Depuis ma boîte{session ? ` (${session.workEmail})` : ""} — privé
                    </option>
                  ) : null}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-0">
                <textarea
                  rows={7}
                  className="form-control"
                  name="body"
                  placeholder="Compose Email"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-paperclip" />
                </Link>
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-photo" />
                </Link>
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-link" />
                </Link>
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-pencil" />
                </Link>
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-mood-smile" />
                </Link>
              </div>
              <div className="d-flex align-items-center compose-footer">
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-calendar-repeat" />
                </Link>
                <Link href="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-trash" />
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary d-inline-flex align-items-center ms-2"
                >
                  Send <i className="ti ti-arrow-right ms-2" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default EmailComponent;
