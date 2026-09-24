"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import type { MailDnsReport } from "@/lib/mail-deliverability";

export default function KalaoMailDnsBanner() {
  const [dns, setDns] = useState<MailDnsReport | null>(null);

  useEffect(() => {
    void fetch("/api/email/dns")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setDns(json as MailDnsReport);
      })
      .catch(() => undefined);
  }, []);

  if (!dns || (dns.mxOk && dns.spfOk)) return null;

  return (
    <div className="alert alert-danger mb-0 rounded-0 border-0 border-bottom">
      {!dns.mxOk ? (
        <p className="mb-1 fw-semibold">
          Les adresses @groupe-kalao.com ne reçoivent rien : le DNS pointe mail.groupe-kalao.com
          vers Vercel au lieu du serveur N0C.
        </p>
      ) : null}
      {!dns.spfOk ? (
        <p className="mb-1">
          Les envois tombent en spam : le SPF racine n’autorise pas encore Resend
          (include:amazonses.com).
        </p>
      ) : null}
      <p className="mb-0 fs-13">
        Correction dans N0C → DNS. Détail et checklist :{" "}
        <Link href={all_routes.emailSettings} className="alert-link">
          Réglages e-mail
        </Link>
        .
      </p>
    </div>
  );
}
