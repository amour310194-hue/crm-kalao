"use client";

import { useState } from "react";
import {
  clientDisplayName,
  isCompanyClient,
  updateContact,
  type ContactRow,
} from "@/lib/crm";

export default function ClientEditForm({
  contact,
  onSaved,
}: {
  contact: ContactRow;
  onSaved?: (next: ContactRow) => void;
}) {
  const company = isCompanyClient(contact);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (form: HTMLFormElement) => {
    const data = new FormData(form);
    setBusy(true);
    setMessage(null);
    try {
      const patch: Partial<ContactRow> = {
        first_name: String(data.get("first_name") ?? "").trim(),
        last_name: company ? "—" : String(data.get("last_name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim() || null,
        phone: String(data.get("phone") ?? "").trim() || null,
        job_title: String(data.get("job_title") ?? "").trim() || null,
        nationality: String(data.get("nationality") ?? "").trim() || null,
        birth_date: String(data.get("birth_date") ?? "").trim() || null,
        birth_place: String(data.get("birth_place") ?? "").trim() || null,
        passport_no: String(data.get("passport_no") ?? "").trim() || null,
        notes: String(data.get("notes") ?? "").trim() || null,
      };
      await updateContact(contact.id, patch);
      onSaved?.({ ...contact, ...patch });
      setMessage("Fiche mise à jour.");
      setOpen(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3">
      <button type="button" className="btn btn-outline-primary w-100" onClick={() => setOpen(true)}>
        <i className="ti ti-user-edit me-1" />
        Mettre à jour les informations du client
      </button>
      {open ? (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void save(e.currentTarget);
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Informations du client</h5>
                  <button type="button" className="btn-close" onClick={() => setOpen(false)} />
                </div>
                <div className="modal-body">
                  <p className="text-muted small">{clientDisplayName(contact)}</p>
                  {message ? <div className="alert alert-info py-2">{message}</div> : null}
                  <div className="mb-2">
                    <label className="form-label">{company ? "Nom de l’entreprise" : "Prénom"}</label>
                    <input className="form-control" name="first_name" defaultValue={contact.first_name} required />
                  </div>
                  {company ? null : (
                    <div className="mb-2">
                      <label className="form-label">Nom</label>
                      <input className="form-control" name="last_name" defaultValue={contact.last_name} required />
                    </div>
                  )}
                  <div className="mb-2">
                    <label className="form-label">E-mail</label>
                    <input className="form-control" name="email" type="email" defaultValue={contact.email ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Téléphone</label>
                    <input className="form-control" name="phone" defaultValue={contact.phone ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fonction</label>
                    <input className="form-control" name="job_title" defaultValue={contact.job_title ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Nationalité</label>
                    <input className="form-control" name="nationality" defaultValue={contact.nationality ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date de naissance</label>
                    <input className="form-control" name="birth_date" type="date" defaultValue={contact.birth_date ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Lieu de naissance</label>
                    <input className="form-control" name="birth_place" defaultValue={contact.birth_place ?? ""} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">N° passeport</label>
                    <input className="form-control" name="passport_no" defaultValue={contact.passport_no ?? ""} />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" rows={3} defaultValue={contact.notes ?? ""} />
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
