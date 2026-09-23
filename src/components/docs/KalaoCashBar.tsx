"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  fetchInvoices,
  formatMoney,
  recordPayment,
  type InvoiceRow,
} from "@/lib/crm";
import { isLiveId } from "@/lib/docs";

type Props = {
  onDone?: () => void;
};

function parseFcfa(raw: string): number {
  const n = Number(String(raw).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) throw new Error("Montant invalide");
  return Math.round(n);
}

export default function KalaoCashBar({ onDone }: Props) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const rows = (await fetchInvoices()) ?? [];
    const live = rows.filter((row) => isLiveId(row.id));
    setInvoices(live);
    setInvoiceId((current) => current || live.find((row) => row.status !== "paid")?.id || live[0]?.id || "");
  };

  useEffect(() => {
    void load();
  }, []);

  const selected = useMemo(
    () => invoices.find((row) => row.id === invoiceId) ?? null,
    [invoices, invoiceId]
  );
  const remaining = selected
    ? Math.max(0, Number(selected.amount) - Number(selected.paid_amount))
    : 0;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setMsg(null);
    try {
      const value = parseFcfa(amount || String(remaining));
      await recordPayment({
        invoice_id: selected.id,
        amount: value,
        method,
      });
      setAmount("");
      await load();
      onDone?.();
      const nextPaid = Number(selected.paid_amount) + value;
      const nextRemain = Math.max(0, Number(selected.amount) - nextPaid);
      setMsg(
        `Encaissé ${formatMoney(value)} sur ${selected.number ?? "facture"}. Reste ${formatMoney(nextRemain)}.`
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  if (!invoices.length) return null;

  return (
    <form
      className="d-flex align-items-center flex-wrap gap-2"
      onSubmit={onSubmit}
    >
      <select
        className="form-select form-select-sm"
        style={{ minWidth: 160 }}
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
      >
        {invoices.map((row) => (
          <option key={row.id} value={row.id}>
            {row.number ?? row.id.slice(0, 8)} · {row.companies?.name ?? "Client"}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="form-control form-control-sm"
        style={{ width: 120 }}
        placeholder={remaining ? String(remaining) : "Montant"}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className="form-select form-select-sm"
        style={{ width: 110 }}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="transfer">Virement</option>
        <option value="mobile">Mobile</option>
      </select>
      <button type="submit" className="btn btn-sm btn-dark" disabled={busy || remaining <= 0}>
        Encaisser
      </button>
      {msg ? <span className="fs-13 text-muted">{msg}</span> : null}
    </form>
  );
}
