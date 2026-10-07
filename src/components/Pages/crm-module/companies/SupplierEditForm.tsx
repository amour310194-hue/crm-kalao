"use client";

import { useState } from "react";
import { updateCompany, type CompanyRow } from "@/lib/crm";

export default function SupplierEditForm({
  company,
  onSaved,
}: {
  company: CompanyRow;
  onSaved?: (next: CompanyRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="mt-3">
      <button type="button" className="btn btn-outline-primary w-100" onClick={() => setOpen(true)}>
        <i className="ti ti-building me-1" />
        Mettre à jour les informations du fournisseur
      </button>
      {open ? (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  setBusy(true);
                  setMessage(null);
                  try {
                    const patch = {
                      name: String(data.get("name") ?? "").trim(),
                      email: String(data.get("email") ?? "").trim() || null,
                      phone: String(data.get("phone") ?? "").trim() || null,
                      city: String(data.get("city") ?? "").trim() || null,
                      country: String(data.get("country") ?? "").trim() || null,
                      address: String(data.get("address") ?? "").trim() || null,
                      notes: String(data.get("notes") ?? "").trim() || null,
                    };
                    await updateCompany(company.id, patch);
                    onSaved?.({ ...company, ...patch });
                    setOpen(false);
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Enregistrement impossible.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Informations du fournisseur</h5>
                  <button type="button" className="btn-close" onClick={() => setOpen(false)} />
                </div>
                <div className="modal-body">
                  {message ? <div className="alert alert-info py-2">{message}</div> : null}
                  <div className="mb-2">
                    <label className="form-label">Nom</label>
                    <input className="form-control" name="name" defaultValue={company.name} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">E-mail</label>
                    <input className="form-control" name="email" defaultValue={company.email ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Téléphone</label>
                    <input className="form-control" name="phone" defaultValue={company.phone ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Ville</label>
                    <input className="form-control" name="city" defaultValue={company.city ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Pays</label>
                    <input className="form-control" name="country" defaultValue={company.country ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Adresse</label>
                    <input className="form-control" name="address" defaultValue={company.address ?? ""} />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" rows={3} defaultValue={company.notes ?? ""} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>
                    Fermer
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
