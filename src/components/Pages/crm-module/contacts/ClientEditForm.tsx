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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="mt-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
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
          const next = { ...contact, ...patch };
          onSaved?.(next);
          setMessage("Fiche mise à jour.");
        } catch (err) {
          setMessage(err instanceof Error ? err.message : "Enregistrement impossible.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h6 className="mb-3 fw-semibold">Mettre à jour le client</h6>
      <div className="mb-2">
        <label className="form-label">{company ? "Nom de l’entreprise" : "Prénom"}</label>
        <input
          className="form-control"
          name="first_name"
          defaultValue={contact.first_name}
          required
          key={`${contact.id}-first`}
        />
      </div>
      {company ? null : (
        <div className="mb-2">
          <label className="form-label">Nom</label>
          <input
            className="form-control"
            name="last_name"
            defaultValue={contact.last_name}
            required
            key={`${contact.id}-last`}
          />
        </div>
      )}
      <div className="mb-2">
        <label className="form-label">E-mail</label>
        <input className="form-control" name="email" type="email" defaultValue={contact.email ?? ""} key={`${contact.id}-email`} />
      </div>
      <div className="mb-2">
        <label className="form-label">Téléphone</label>
        <input className="form-control" name="phone" defaultValue={contact.phone ?? ""} key={`${contact.id}-phone`} />
      </div>
      <div className="mb-2">
        <label className="form-label">Fonction</label>
        <input className="form-control" name="job_title" defaultValue={contact.job_title ?? ""} key={`${contact.id}-job`} />
      </div>
      <div className="mb-2">
        <label className="form-label">Nationalité</label>
        <input className="form-control" name="nationality" defaultValue={contact.nationality ?? ""} key={`${contact.id}-nat`} />
      </div>
      <div className="mb-2">
        <label className="form-label">Date de naissance</label>
        <input className="form-control" name="birth_date" type="date" defaultValue={contact.birth_date ?? ""} key={`${contact.id}-bd`} />
      </div>
      <div className="mb-2">
        <label className="form-label">Lieu de naissance</label>
        <input className="form-control" name="birth_place" defaultValue={contact.birth_place ?? ""} key={`${contact.id}-bp`} />
      </div>
      <div className="mb-2">
        <label className="form-label">N° passeport</label>
        <input className="form-control" name="passport_no" defaultValue={contact.passport_no ?? ""} key={`${contact.id}-pp`} />
      </div>
      <div className="mb-3">
        <label className="form-label">Notes</label>
        <textarea className="form-control" name="notes" rows={3} defaultValue={contact.notes ?? ""} key={`${contact.id}-notes`} />
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={busy}>
        {busy ? "Enregistrement…" : `Enregistrer ${clientDisplayName(contact)}`}
      </button>
      {message ? <p className="small mt-2 mb-0">{message}</p> : null}
    </form>
  );
}
