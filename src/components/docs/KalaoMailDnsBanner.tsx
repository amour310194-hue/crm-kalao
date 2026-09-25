"use client";

import { useEffect, useState } from "react";
import type { MailDnsReport } from "@/lib/mail-deliverability";
import { authJsonHeaders } from "@/lib/auth-headers";

/** Diagnostic DNS des mails (MX, SPF, DKIM, DMARC) avec la correction à faire chez N0C. */
export default function KalaoMailDnsBanner({ detailed = false }: { detailed?: boolean }) {
  const [dns, setDns] = useState<MailDnsReport | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    void authJsonHeaders()
      .then((headers) => fetch("/api/email/dns", { headers }))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setDns(json as MailDnsReport);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed && detailed) return <p className="text-muted small mb-0">Diagnostic DNS indisponible.</p>;
  if (!dns) return detailed ? <p className="text-muted small mb-0">Vérification des DNS…</p> : null;
  const allOk = dns.mxOk && dns.spfOk && dns.dkimOk && dns.dmarcOk;
  if (!detailed && allOk) return null;

  if (!detailed) {
    return (
      <div className="km-banner error">
        <i className="ti ti-alert-triangle" />
        {!dns.mxOk
          ? "Les adresses @groupe-kalao.com ne reçoivent pas correctement : le MX est à corriger."
          : "Configuration DNS incomplète : vos mails risquent d'arriver en spam."}{" "}
        Détail dans Réglages → Diagnostic.
      </div>
    );
  }

  return (
    <div>
      <table className="table table-sm align-middle">
        <tbody>
          {dns.checks.map((c) => (
            <tr key={c.label}>
              <td style={{ width: 28 }}>
                <i className={c.ok ? "ti ti-circle-check text-success" : "ti ti-circle-x text-danger"} />
              </td>
              <td className="fw-semibold">{c.label}</td>
              <td className="small">
                <div>{c.current}</div>
                {!c.ok ? <div className="text-muted">Attendu : {c.expected}</div> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {dns.fix.length ? (
        <ol className="small mb-0">
          {dns.fix.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
