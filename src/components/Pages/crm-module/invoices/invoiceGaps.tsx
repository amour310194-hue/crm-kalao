"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import { all_routes } from "@/router/all_routes";
import {
  clientDisplayName,
  completeInvoiceGap,
  fetchContacts,
  fetchDossiers,
  fetchInvoices,
  formatMoney,
  type ContactRow,
  type DossierRow,
  type InvoiceRow,
} from "@/lib/crm";
import { t } from "@/lib/i18n";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

function isGap(row: InvoiceRow): boolean {
  if (row.status === "cancelled") return false;
  if (!row.dossier_id) return true;
  return !row.due_date && !row.is_conditional;
}

export default function InvoiceGaps() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [dossiers, setDossiers] = useState<DossierRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { dossierId: string; dueDate: string; conditional: boolean; condition: string }>>({});
  const [error, setError] = useState<string | null>(null);
  const { run, modal } = useFinanceUnlock();

  const load = useCallback(async () => {
    const [rows, people, files] = await Promise.all([fetchInvoices(), fetchContacts(), fetchDossiers()]);
    const gaps = (rows ?? []).filter(isGap);
    setInvoices(gaps);
    setContacts(people ?? []);
    setDossiers(files ?? []);
    setDrafts(
      Object.fromEntries(
        gaps.map((row) => [
          row.id,
          {
            dossierId: "",
            dueDate: "",
            conditional: false,
            condition: "",
          },
        ])
      )
    );
  }, []);

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : t("loadFailed")));
  }, [load]);

  const save = async (row: InvoiceRow) => {
    const form = drafts[row.id];
    if (!form) return;
    setError(null);
    try {
      await run(async () => {
        await completeInvoiceGap(row.id, {
          dossier_id: form.dossierId,
          due_date: form.dueDate || null,
          is_conditional: form.conditional,
          condition_text: form.condition,
        });
        await load();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    }
  };

  return (
    <div className="page-wrapper">
      {modal}
      <div className="content">
        <PageHeader title={t("invoicesToComplete")} badgeCount={invoices.length} showModuleTile={false} showExport={false} />
        <p className="mb-3">
          <Link href={all_routes.InvoiceList}>Retour aux factures</Link>
        </p>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        {!invoices.length ? <p>Aucune facture sans dossier ou sans échéance.</p> : null}
        {invoices.map((row) => {
          const form = drafts[row.id] ?? { dossierId: "", dueDate: "", conditional: false, condition: "" };
          const contact = contacts.find((item) => item.id === row.contact_id) ?? null;
          const options = dossiers.filter((item) => {
            if (!row.contact_id) return true;
            if (item.contact_id === row.contact_id) return true;
            return Boolean(contact?.company_id && item.company_id === contact.company_id);
          });
          return (
            <div className="card mb-3" key={row.id}>
              <div className="card-body">
                <h6 className="mb-1">{row.number ?? row.legacy_ref ?? "Brouillon"}</h6>
                <p className="mb-3 text-muted">
                  {row.contacts ? clientDisplayName(row.contacts) : row.companies?.name ?? "Client non renseigné"} ·{" "}
                  {formatMoney(row.amount)}
                  {row.legacy_ref ? ` · ancien n° ${row.legacy_ref}` : ""}
                </p>
                <div className="row g-2 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">{t("dossier")}</label>
                    <select
                      className="form-select"
                      value={form.dossierId}
                      onChange={(e) =>
                        setDrafts((current) => ({ ...current, [row.id]: { ...form, dossierId: e.target.value } }))
                      }
                    >
                      <option value="">{t("choose")}</option>
                      {options.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">{t("dueDate")}</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.dueDate}
                      disabled={form.conditional}
                      onChange={(e) =>
                        setDrafts((current) => ({ ...current, [row.id]: { ...form, dueDate: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.conditional}
                        onChange={(e) =>
                          setDrafts((current) => ({
                            ...current,
                            [row.id]: { ...form, conditional: e.target.checked },
                          }))
                        }
                      />
                      <span className="form-check-label">{t("conditional")}</span>
                    </label>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">{t("condition")}</label>
                    <input
                      className="form-control"
                      value={form.condition}
                      disabled={!form.conditional}
                      onChange={(e) =>
                        setDrafts((current) => ({ ...current, [row.id]: { ...form, condition: e.target.value } }))
                      }
                    />
                  </div>
                </div>
                <button type="button" className="btn btn-primary mt-3" onClick={() => void save(row)}>
                  Enregistrer
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
