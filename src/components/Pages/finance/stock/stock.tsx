"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { fetchCatalogItems, type CatalogItem } from "@/lib/catalog";
import { formatDate } from "@/lib/crm";
import {
  createStockMovement,
  deleteStockMovement,
  fetchStockLocations,
  fetchStockMovements,
  qtyForItemAtLocation,
  updateStockMovement,
  type StockLocation,
  type StockMovement,
} from "@/lib/stock";
import { canMutateFinance } from "@/lib/roles";

function MovementModal({
  catalog,
  locations,
  existing,
  onClose,
  onSaved,
}: {
  catalog: CatalogItem[];
  locations: StockLocation[];
  existing?: StockMovement | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [catalogItemId, setCatalogItemId] = useState(existing?.catalog_item_id ?? "");
  const [locationId, setLocationId] = useState(existing?.location_id ?? "");
  const [qty, setQty] = useState(existing ? String(existing.qty) : "");
  const [reason, setReason] = useState(existing?.reason ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const products = catalog.filter((item) => item.kind === "product" || item.track_stock);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        catalog_item_id: catalogItemId,
        location_id: locationId || null,
        qty: Number(qty.replace(",", ".")),
        reason,
      };
      if (existing) await updateStockMovement(existing.id, payload);
      else await createStockMovement(payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{existing ? "Modifier le mouvement" : "Nouveau mouvement"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <p className="small text-muted">
              Quantité positive = entrée. Quantité négative = sortie, casse ou transfert sortant.
            </p>
            <div className="mb-3">
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
            <div className="mb-3">
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
            <div className="mb-3">
              <label className="form-label">Quantité (signée)</label>
              <input className="form-control" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="10 ou -2" />
            </div>
            <div className="mb-0">
              <label className="form-label">Motif</label>
              <input
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Transfert, casse, correction…"
              />
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
  );
}

export default function StockComponent() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [locationId, setLocationId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<StockMovement | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  const load = () => {
    void fetchCatalogItems().then((data) => setCatalog(data ?? []));
    void fetchStockMovements().then((data) => setMovements(data ?? []));
  };

  useEffect(() => {
    load();
    void fetchStockLocations().then((data) => setLocations(data ?? []));
    void canMutateFinance().then(setCanEdit);
  }, []);

  const rows = useMemo(() => {
    return catalog
      .filter((item) => item.kind === "product" || item.track_stock)
      .map((item) => ({
        ...item,
        key: item.id,
        qty: locationId ? qtyForItemAtLocation(movements, item.id, locationId) : Number(item.stock_qty ?? 0),
      }));
  }, [catalog, movements, locationId]);

  const history = historyId ? movements.filter((row) => row.catalog_item_id === historyId) : [];
  const historyName = catalog.find((item) => item.id === historyId)?.name ?? "";

  const columns = [
    { title: "Article", dataIndex: "name" },
    { title: "SKU", dataIndex: "sku", render: (value: string | null) => value || "—" },
    {
      title: "Stock",
      dataIndex: "qty",
      render: (value: number) => <span className="fw-semibold">{value}</span>,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (_: string, row: { id: string }) => (
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setHistoryId(row.id)}>
          Historique
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader title="Stock" showModuleTile={false} showExport={false} />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="d-flex gap-2 flex-wrap">
                <SearchInput value={searchText} onChange={setSearchText} />
                <select
                  className="form-select"
                  style={{ maxWidth: 220 }}
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  <option value="">Tous les sites</option>
                  {locations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {canEdit ? (
                <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                  <i className="ti ti-square-rounded-plus-filled me-1" />
                  Nouveau mouvement
                </button>
              ) : null}
            </div>
            <div className="card-body">
              <Datatable columns={columns} dataSource={rows} Selection={false} searchText={searchText} />
              {historyId ? (
                <div className="mt-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">Mouvements — {historyName}</h6>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setHistoryId(null)}>
                      Fermer
                    </button>
                  </div>
                  {history.length ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Site</th>
                            <th>Quantité</th>
                            <th>Motif</th>
                            {canEdit ? <th>Action</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((row) => (
                            <tr key={row.id}>
                              <td>{formatDate(row.created_at)}</td>
                              <td>{locations.find((item) => item.id === row.location_id)?.name ?? "—"}</td>
                              <td>{row.qty}</td>
                              <td>{row.reason || "—"}</td>
                              {canEdit ? (
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => setEditing(row)}
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={async () => {
                                      if (!confirm("Supprimer ce mouvement ?")) return;
                                      try {
                                        await deleteStockMovement(row.id);
                                        load();
                                      } catch (err) {
                                        alert(err instanceof Error ? err.message : "Suppression refusée");
                                      }
                                    }}
                                  >
                                    Supprimer
                                  </button>
                                </td>
                              ) : null}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">Aucun mouvement.</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {creating ? (
        <MovementModal catalog={catalog} locations={locations} onClose={() => setCreating(false)} onSaved={load} />
      ) : null}
      {editing ? (
        <MovementModal
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
