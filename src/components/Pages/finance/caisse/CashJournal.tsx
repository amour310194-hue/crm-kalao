"use client";

import { useEffect, useState } from "react";
import { formatDate, formatMoney } from "@/lib/crm";
import {
  fetchCashJournal,
  fetchDayCloses,
  fetchMonthCloses,
  requestDayClose,
  requestMonthClose,
  todayDouala,
  validateDayClose,
  validateMonthClose,
  type JournalEntry,
} from "@/lib/cash";

const JOURNALS = [
  { id: "especes", label: "Caisse espèces" },
  { id: "mtn", label: "MTN MoMo" },
  { id: "orange", label: "Orange Money" },
  { id: "banque", label: "Banque" },
] as const;

export default function CashJournal() {
  const [bucket, setBucket] = useState<(typeof JOURNALS)[number]["id"]>("especes");
  const [rows, setRows] = useState<JournalEntry[]>([]);
  const [days, setDays] = useState<{ id: string; closed_on: string; counted_amount: number; book_amount: number; variance: number; status: string }[]>([]);
  const [months, setMonths] = useState<{ id: string; month_key: string; status: string }[]>([]);
  const [counted, setCounted] = useState("");
  const [day, setDay] = useState(todayDouala());
  const [month, setMonth] = useState(todayDouala().slice(0, 7));
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [journal, dayRows, monthRows] = await Promise.all([
        fetchCashJournal(),
        fetchDayCloses(),
        fetchMonthCloses(),
      ]);
      setRows(journal ?? []);
      setDays(dayRows as typeof days);
      setMonths(monthRows as typeof months);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Journal indisponible tant que la migration caisse n'est pas appliquée.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const visible = rows.filter((row) => row.bucket === bucket);
  const last = visible[visible.length - 1];

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="mb-2">Journal</h6>
        <div className="d-flex gap-2 flex-wrap">
          {JOURNALS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`btn btn-sm ${bucket === item.id ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setBucket(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body">
        {error ? <div className="alert alert-warning">{error}</div> : null}
        <p className="mb-3">
          Solde {JOURNALS.find((item) => item.id === bucket)?.label} : <strong>{formatMoney(last?.balance ?? 0)}</strong>
        </p>
        <div className="table-responsive mb-4">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Libellé</th>
                <th>Mouvement</th>
                <th>Solde</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={`${row.source}-${row.id}`}>
                  <td>{formatDate(row.occurred_on)}</td>
                  <td>{row.label}</td>
                  <td>{formatMoney(row.delta)}</td>
                  <td>{formatMoney(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <h6>Clôture du jour</h6>
            <div className="d-flex gap-2 mb-2">
              <input type="date" className="form-control" value={day} onChange={(e) => setDay(e.target.value)} />
              <input className="form-control" placeholder="Solde compté" value={counted} onChange={(e) => setCounted(e.target.value)} />
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => void requestDayClose(day, Number(counted.replace(",", "."))).then(load).catch((err) => setError(err.message))}
              >
                Demander
              </button>
            </div>
            {days.filter((item) => item.status === "pending").map((item) => (
              <div key={item.id} className="d-flex justify-content-between gap-2 border-bottom py-2">
                <span>
                  {formatDate(item.closed_on)} · compté {formatMoney(item.counted_amount)} · écart {formatMoney(item.variance)}
                </span>
                <button type="button" className="btn btn-sm btn-dark" onClick={() => void validateDayClose(item.id, true).then(load).catch((err) => setError(err.message))}>
                  Valider
                </button>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h6>Clôture du mois</h6>
            <div className="d-flex gap-2 mb-2">
              <input className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="2026-10" />
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => void requestMonthClose(month).then(load).catch((err) => setError(err.message))}
              >
                Demander
              </button>
            </div>
            {months.filter((item) => item.status === "pending").map((item) => (
              <div key={item.id} className="d-flex justify-content-between gap-2 border-bottom py-2">
                <span>{item.month_key}</span>
                <button type="button" className="btn btn-sm btn-dark" onClick={() => void validateMonthClose(item.id, true).then(load).catch((err) => setError(err.message))}>
                  Valider
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
