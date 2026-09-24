"use client";

import Link from "next/link";
import {
  EMAIL_FOLDERS,
  MAILBOXES,
  countFolder,
  mailHref,
  type CrmEmailRow,
  type MailFolder,
  type MailboxKey,
} from "@/lib/mail";
import { inboundResendAlias } from "@/lib/org";

type Props = {
  emails: CrmEmailRow[];
  mailbox: MailboxKey;
  folder: MailFolder;
  allowed: MailboxKey[];
  workEmail?: string | null;
  onSelect: (box: MailboxKey, tray: MailFolder) => void;
};

export default function KalaoMailboxNav({
  emails,
  mailbox,
  folder,
  allowed,
  workEmail,
  onSelect,
}: Props) {
  const boxes = MAILBOXES.filter((item) => allowed.includes(item.key));

  return (
    <div className="mt-3">
      <h5 className="mb-2">Boîtes Kalao</h5>
      {boxes.map((box) => (
        <div key={box.key} className="mb-3 pb-3 border-bottom">
          <p className="fw-semibold mb-1">{box.label}</p>
          {box.key === "personal" && workEmail ? (
            <p className="fs-12 text-muted mb-2">
              Réception : <code>{inboundResendAlias(workEmail)}</code>
            </p>
          ) : null}
          <h6 className="fs-13 text-muted mb-1">Emails</h6>
          <div className="d-block">
            {EMAIL_FOLDERS.map((item) => {
              const active = mailbox === box.key && folder === item.key;
              const count = countFolder(emails, box.key, item.key);
              return (
                <Link
                  key={`${box.key}-${item.key}`}
                  href={mailHref(box.key, item.key)}
                  className={`d-flex align-items-center justify-content-between p-2 rounded ${
                    active ? "bg-light active" : ""
                  }`}
                  onClick={() => onSelect(box.key, item.key)}
                >
                  <span className="d-flex align-items-center fw-medium">
                    <i className={item.icon} />
                    {item.label}
                  </span>
                  {item.key === "inbox" ? (
                    <span className="badge bg-danger rounded-pill badge-xs">{count}</span>
                  ) : item.key === "starred" ? (
                    <span className="fw-semibold fs-12 rounded-pill">{count}</span>
                  ) : (
                    <span className="rounded-pill">{count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
