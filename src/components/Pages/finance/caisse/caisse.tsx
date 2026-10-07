"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { formatDate, formatMoney } from "@/lib/crm";
import { canMutateFinance } from "@/lib/roles";
import { expenseMethodLabel } from "@/lib/expenses";
import {
  CASH_KINDS,
  CASH_METHODS,
  cashDelta,
  cashKindLabel,
  createCashOperation,
  deleteCashOperation,
  fetchCashOperations,
  impliedDirection,
  todayDouala,
  updateCashOperation,
  type CashDirection,
  type CashKind,
  type CashOperationRow,
} from "@/lib/cash";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

function CashModal({
  existing,
  onClose,
  onSaved,
}: {
  existing?: CashOperationRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [kind, setKind] = useState<CashKind>(existing?.kind ?? "recette");
  const [direction, setDirection] = useState<CashDirection>(existing?.direction ?? "entree");
  const [label, setLabel] = useState(existing?.label ?? "");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [occurredAt, setOccurredAt] = useState(existing?.occurred_at ?? todayDouala());
  const [method, setMethod] = useState(existing?.method ?? "cash");
  const [counterparty, setCounterparty] = useState(existing?.counterparty ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { run, modal } = useFinanceUnlock();
  const showDirection = kind === "operation";

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        kind,
        label,
        amount: Number(amount.replace(",", ".")),
        occurred_at: occurredAt,
        method,
        direction: showDirection ? direction : impliedDirection(kind),
        counterparty,
        notes,
      };
      if (existing) {
        await run(async () => {
          await updateCashOperation(existing.id, payload);
          onSaved();
          onClose();
        });
      } else {
        await createCashOperation(payload);
        onSaved();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    {modal}
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{existing ? "Modifier l'opération" : "Nouvelle opération de caisse"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" value={kind} onChange={(e) => setKind(e.target.value as CashKind)}>
                {CASH_KINDS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {showDirection ? (
              <div className="mb-3">
                <label className="form-label">Sens</label>
                <select
                  className="form-select"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as CashDirection)}
                >
                  <option value="entree">Entrée</option>
                  <option value="sortie">Sortie</option>
                </select>
              </div>
            ) : (
              <p className="small text-muted">
                Recette et retrait = entrée de caisse. Dépôt = sortie vers la banque.
              </p>
            )}
            <div className="mb-3">
              <label className="form-label">Libellé</label>
              <input className="form-control" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Montant (FCFA)</label>
              <input className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Mode</label>
              <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
                {CASH_METHODS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tiers</label>
              <input className="form-control" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
            </div>
            <div className="mb-0">
              <label className="form-label">Notes</label>
              <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function CaisseComponent() {
  const [rows, setRows] = useState<CashOperationRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CashOperationRow | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const { run, modal } = useFinanceUnlock();

  const load = () => {
    void fetchCashOperations().then((data) => setRows(data ?? []));
  };

  useEffect(() => {
    load();
    void canMutateFinance().then(setCanEdit);
  }, []);

  const solde = useMemo(() => rows.reduce((sum, row) => sum + cashDelta(row), 0), [rows]);

  const columns = [
    { title: "Date", dataIndex: "occurred_at", render: (value: string) => formatDate(value) },
    { title: "Type", dataIndex: "kind", render: (value: string) => cashKindLabel(value) },
    { title: "Libellé", dataIndex: "label" },
    {
      title: "Montant",
      dataIndex: "amount",
      render: (_: number, row: CashOperationRow) => {
        const delta = cashDelta(row);
        return (
          <span className={delta < 0 ? "text-danger" : "text-success"}>
            {delta < 0 ? "−" : "+"}
            {formatMoney(Math.abs(delta))}
          </span>
        );
      },
    },
    { title: "Mode", dataIndex: "method", render: (value: string) => expenseMethodLabel(value) },
    { title: "Tiers", dataIndex: "counterparty", render: (value: string | null) => value || "—" },
    {
      title: "Action",
      dataIndex: "id",
      render: (_: string, row: CashOperationRow) =>
        canEdit ? (
          <div className="d-flex gap-1">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditing(row)}>
              Modifier
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                if (!confirm("Supprimer cette opération ?")) return;
                try {
                  await run(async () => {
                    await deleteCashOperation(row.id);
                    load();
                  });
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Suppression refusée");
                }
              }}
            >
              <i className="ti ti-trash" />
            </button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
  ];

  return (
    <>
      {modal}
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader title="Caisse" showModuleTile={false} showExport />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div>
                <SearchInput value={searchText} onChange={setSearchText} />
                <p className="small text-muted mb-0 mt-2">
                  Solde des opérations de caisse (hors encaissements facture et dépenses) :{" "}
                  <strong>{formatMoney(solde)}</strong>
                </p>
              </div>
              {canEdit ? (
                <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Nouvelle opération
                </button>
              ) : null}
            </div>
            <div className="card-body">
              <Datatable
                columns={columns}
                dataSource={rows.map((row) => ({ ...row, key: row.id }))}
                Selection={false}
                searchText={searchText}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {creating ? <CashModal onClose={() => setCreating(false)} onSaved={load} /> : null}
      {editing ? <CashModal existing={editing} onClose={() => setEditing(null)} onSaved={load} /> : null}
    </>
  );
}
