"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { fetchCatalogItems, type CatalogItem } from "@/lib/catalog";
import { formatMoney, formatDate, uploadAttachment } from "@/lib/crm";
import { canMutateFinance } from "@/lib/roles";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_METHODS,
  createExpense,
  deleteExpense,
  expenseCategoryLabel,
  expenseMethodLabel,
  fetchExpenses,
  todayDouala,
  updateExpense,
  type ExpenseCategory,
  type ExpenseMethod,
  type ExpenseRow,
} from "@/lib/expenses";
import { fetchStockLocations, type StockLocation } from "@/lib/stock";
import { useFinanceUnlock } from "@/lib/use-finance-unlock";

function ExpenseModal({
  catalog,
  locations,
  existing,
  onClose,
  onSaved,
}: {
  catalog: CatalogItem[];
  locations: StockLocation[];
  existing?: ExpenseRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [category, setCategory] = useState<ExpenseCategory>(existing?.category ?? "carburant");
  const [label, setLabel] = useState(existing?.label ?? "");
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [spentAt, setSpentAt] = useState(existing?.spent_at ?? todayDouala());
  const [method, setMethod] = useState<ExpenseMethod>(existing?.method ?? "cash");
  const [supplier, setSupplier] = useState(existing?.supplier ?? "");
  const [catalogItemId, setCatalogItemId] = useState(existing?.catalog_item_id ?? "");
  const [locationId, setLocationId] = useState(existing?.stock_location_id ?? "");
  const [qty, setQty] = useState(existing?.qty != null ? String(existing.qty) : "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { run, modal } = useFinanceUnlock();
  const isStock = category === "achat_stock";
  const products = catalog.filter((item) => item.kind === "product" || item.track_stock);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      let attachmentId: string | null = existing?.attachment_id ?? null;
      if (file) {
        const attached = await uploadAttachment({
          file,
          entity_type: "misc",
        });
        attachmentId = attached.id;
      }
      const payload = {
        category,
        label,
        amount: Number(amount.replace(",", ".")),
        spent_at: spentAt,
        method,
        supplier,
        catalog_item_id: catalogItemId || null,
        stock_location_id: locationId || null,
        qty: qty ? Number(qty.replace(",", ".")) : null,
        notes,
        attachment_id: attachmentId,
      };
      if (existing) {
        await run(async () => {
          await updateExpense(existing.id, payload);
          onSaved();
          onClose();
        });
      } else {
        await createExpense(payload);
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
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{existing ? "Modifier la dépense" : "Enregistrer une dépense"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Catégorie</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  {EXPENSE_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Montant (FCFA)</label>
                <input className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="col-md-8 mb-3">
                <label className="form-label">Libellé</label>
                <input className="form-control" value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={spentAt} onChange={(e) => setSpentAt(e.target.value)} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Mode de paiement</label>
                <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value as ExpenseMethod)}>
                  {EXPENSE_METHODS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Fournisseur</label>
                <input className="form-control" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
              {isStock ? (
                <>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Article</label>
                    <select className="form-select" value={catalogItemId} onChange={(e) => setCatalogItemId(e.target.value)}>
                      <option value="">Choisir…</option>
                      {products.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Site</label>
                    <select className="form-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                      <option value="">Choisir…</option>
                      {locations.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Quantité</label>
                    <input className="form-control" value={qty} onChange={(e) => setQty(e.target.value)} />
                  </div>
                </>
              ) : null}
              <div className="col-md-6 mb-3">
                <label className="form-label">Justificatif</label>
                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Notes</label>
                <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
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

export default function DepensesComponent() {
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [searchText, setSearchText] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const { run, modal } = useFinanceUnlock();

  const load = () => {
    void fetchExpenses().then((data) => setRows(data ?? []));
  };

  useEffect(() => {
    load();
    void fetchCatalogItems().then((data) => setCatalog(data ?? []));
    void fetchStockLocations().then((data) => setLocations(data ?? []));
    void canMutateFinance().then(setCanEdit);
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "spent_at",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Catégorie",
      dataIndex: "category",
      render: (value: string) => expenseCategoryLabel(value),
    },
    { title: "Libellé", dataIndex: "label" },
    {
      title: "Montant",
      dataIndex: "amount",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Paiement",
      dataIndex: "method",
      render: (value: string) => expenseMethodLabel(value),
    },
    {
      title: "Fournisseur",
      dataIndex: "supplier",
      render: (value: string | null) => value || "—",
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (_: string, row: ExpenseRow) =>
        canEdit ? (
          <div className="d-flex gap-1">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditing(row)}>
              Modifier
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                if (!confirm("Supprimer cette dépense ?")) return;
                try {
                  await run(async () => {
                    await deleteExpense(row.id);
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
          <PageHeader title="Dépenses" showModuleTile={false} showExport />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <SearchInput value={searchText} onChange={setSearchText} />
              {canEdit ? (
                <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Enregistrer une dépense
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
      {creating ? (
        <ExpenseModal catalog={catalog} locations={locations} onClose={() => setCreating(false)} onSaved={load} />
      ) : null}
      {editing ? (
        <ExpenseModal
          catalog={catalog}
          locations={locations}
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      ) : null}
    </>
  );
}
