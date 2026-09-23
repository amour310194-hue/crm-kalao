"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { isLiveId } from "@/lib/docs";
import { fetchCrmEmail, mailboxLabel, type CrmEmailRow } from "@/lib/mail";

export default function KalaoMailReader() {
  const [row, setRow] = useState<CrmEmailRow | null>(null);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    if (!id || !isLiveId(id)) return;
    void fetchCrmEmail(id).then(setRow);
  }, []);

  if (!row) return null;
  return (
    <div className="alert alert-light border mb-0 rounded-0">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <p className="mb-1 fw-semibold">{row.subject}</p>
          <p className="mb-0">
            {row.direction === "out" ? "Envoyé" : "Reçu"} · {mailboxLabel(row.mailbox)} · de{" "}
            {row.from_email} · à {row.to_email}
          </p>
        </div>
        <Link href={all_routes.email} className="btn btn-sm btn-outline-dark">
          Retour aux boîtes
        </Link>
      </div>
      <pre className="mb-0 text-wrap" style={{ whiteSpace: "pre-wrap" }}>
        {row.body}
      </pre>
    </div>
  );
}
