"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { isLiveId } from "@/lib/docs";
import {
  fetchCrmEmail,
  mailboxLabel,
  mailHref,
  patchCrmEmail,
  restoreTray,
  sendCrmEmail,
  trayOf,
  type CrmEmailRow,
} from "@/lib/mail";

export default function KalaoMailReader() {
  const [row, setRow] = useState<CrmEmailRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    if (!id || !isLiveId(id)) return;
    void fetchCrmEmail(id).then(setRow);
  };

  useEffect(() => {
    load();
  }, []);

  if (!row) return null;

  const move = async (folder: CrmEmailRow["folder"]) => {
    await patchCrmEmail(row.id, { folder });
    setMsg(`Déplacé vers ${folder}.`);
    load();
  };

  return (
    <div className="alert alert-light border mb-0 rounded-0">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <p className="mb-1 fw-semibold">{row.subject}</p>
          <p className="mb-0">
            {trayOf(row) === "drafts"
              ? "Brouillon"
              : row.direction === "out"
                ? "Envoyé"
                : "Reçu"}{" "}
            · {mailboxLabel(row.mailbox)} · de {row.from_email} · à {row.to_email} ·{" "}
            {trayOf(row)}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {trayOf(row) === "drafts" ? (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={async () => {
                const result = await sendCrmEmail({
                  mailbox: row.mailbox,
                  to: row.to_email,
                  subject: row.subject,
                  body: row.body,
                  draftId: row.id,
                });
                setMsg(result.dispatched ? `Envoyé vers ${result.to}.` : "Envoi non parti.");
                load();
              }}
            >
              Envoyer
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-sm btn-outline-warning"
            onClick={() =>
              void move(trayOf(row) === "spam" ? restoreTray(row) : "spam")
            }
          >
            {trayOf(row) === "spam" ? "Retirer du spam" : "Spam"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() =>
              void move(trayOf(row) === "deleted" ? restoreTray(row) : "deleted")
            }
          >
            {trayOf(row) === "deleted" ? "Restaurer" : "Supprimer"}
          </button>
          <Link href={mailHref(row.mailbox, trayOf(row))} className="btn btn-sm btn-outline-dark">
            Retour aux boîtes
          </Link>
        </div>
      </div>
      {msg ? <p className="mb-2">{msg}</p> : null}
      <pre className="mb-0 text-wrap" style={{ whiteSpace: "pre-wrap" }}>
        {row.body}
      </pre>
    </div>
  );
}
