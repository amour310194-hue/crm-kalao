import Link from "next/link";
import { companyDocLinks, docHref, isLiveId } from "@/lib/docs";
import type { DossierRow, InvoiceRow, PaymentRow, QuoteRow } from "@/lib/crm";

type Props = {
  companyId?: string | null;
  invoices?: InvoiceRow[];
  dossiers?: DossierRow[];
  quotes?: QuoteRow[];
  payments?: PaymentRow[];
  employeeId?: string | null;
  payRunId?: string | null;
};

export default function KalaoDocsBar({
  companyId,
  invoices = [],
  dossiers = [],
  quotes = [],
  payments = [],
  employeeId,
  payRunId,
}: Props) {
  const links = companyId
    ? companyDocLinks({ companyId, invoices, dossiers, quotes, payments })
    : [];
  if (employeeId && isLiveId(employeeId)) {
    links.push(
      { href: docHref("employment", employeeId), label: "Contrat de travail" },
      { href: docHref("certificate", employeeId), label: "Attestation" }
    );
  }
  if (payRunId && isLiveId(payRunId)) {
    links.push({ href: docHref("payslip", payRunId), label: "Bulletin de paie" });
  }
  if (!links.length) return null;
  return (
    <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          className="btn btn-sm btn-outline-dark"
        >
          <i className="ti ti-file-text me-1" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
