"use client";

import { useEffect, useState } from "react";
import copy from "clipboard-copy";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Datatable from "@/core/common/dataTable";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import { captureFormEmbedCode, captureFormUrl } from "@/lib/org";
import {
  createCaptureForm,
  deleteCaptureForm,
  fetchCaptureForms,
  updateCaptureForm,
  type CaptureFormRow,
} from "@/lib/capture-forms";
import type { CaptureField } from "@/lib/capture-submit";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY_FIELD: CaptureField = { key: "", label: "", type: "text", required: false };

function FormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: CaptureFormRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [successMessage, setSuccessMessage] = useState(initial?.success_message ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [fields, setFields] = useState<CaptureField[]>(
    initial?.fields?.length ? initial.fields : [{ ...EMPTY_FIELD, key: "name", label: "Nom", required: true }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedForm, setSavedForm] = useState<CaptureFormRow | null>(initial);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const updateField = (index: number, patch: Partial<CaptureField>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim() || !slug.trim() || !fields.length) {
      setError("Titre, lien et au moins un champ sont requis.");
      return;
    }
    setSaving(true);
    try {
      if (savedForm) {
        await updateCaptureForm(savedForm.id, {
          title,
          slug,
          description,
          success_message: successMessage,
          status,
          fields,
        });
        setSavedForm({ ...savedForm, title, slug, description, success_message: successMessage, status, fields });
      } else {
        const created = await createCaptureForm({
          title,
          slug,
          description,
          success_message: successMessage,
          status,
          fields,
        });
        setSavedForm(created);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{savedForm ? "Modifier le formulaire" : "Nouveau formulaire"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <div className="mb-3">
              <label className="form-label">Titre</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Lien (slug)</label>
              <input
                className="form-control"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message de succès</label>
              <input
                className="form-control"
                value={successMessage ?? ""}
                onChange={(e) => setSuccessMessage(e.target.value)}
              />
            </div>

            <label className="form-label">Champs du formulaire</label>
            {fields.map((field, index) => (
              <div className="row g-2 mb-2 align-items-center" key={index}>
                <div className="col-4">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Libellé"
                    value={field.label}
                    onChange={(e) =>
                      updateField(index, {
                        label: e.target.value,
                        key: field.key || slugify(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-3">
                  <select
                    className="form-select form-select-sm"
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as CaptureField["type"] })}
                  >
                    <option value="text">Texte</option>
                    <option value="email">Email</option>
                    <option value="phone">Téléphone</option>
                    <option value="textarea">Message</option>
                    <option value="select">Liste</option>
                  </select>
                </div>
                <div className="col-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={Boolean(field.required)}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                    />
                    <label className="form-check-label">Obligatoire</label>
                  </div>
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}
                    disabled={fields.length <= 1}
                  >
                    <i className="ti ti-trash" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mb-3"
              onClick={() => setFields((prev) => [...prev, { ...EMPTY_FIELD }])}
            >
              <i className="ti ti-plus me-1" /> Ajouter un champ
            </button>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={status === "published"}
                onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
              />
              <label className="form-check-label">Publié (accessible publiquement)</label>
            </div>

            {savedForm ? (
              <div className="border rounded p-3 bg-light">
                <div className="mb-2">
                  <div className="small text-muted">Lien à partager sur les réseaux</div>
                  <div className="d-flex gap-2">
                    <input className="form-control form-control-sm" readOnly value={captureFormUrl(savedForm.slug)} />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => copy(captureFormUrl(savedForm.slug))}
                    >
                      Copier
                    </button>
                  </div>
                </div>
                <div>
                  <div className="small text-muted">Code à coller sur le site</div>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control form-control-sm"
                      readOnly
                      value={captureFormEmbedCode(savedForm.slug)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => copy(captureFormEmbedCode(savedForm.slug))}
                    >
                      Copier
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
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

export default function CaptureFormsComponent() {
  const [rows, setRows] = useState<CaptureFormRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [editing, setEditing] = useState<CaptureFormRow | null | undefined>(undefined);

  const load = () => {
    void fetchCaptureForms().then((data) => setRows(data ?? []));
  };

  useEffect(load, []);

  const columns = [
    { title: "Titre", dataIndex: "title" },
    {
      title: "Statut",
      dataIndex: "status",
      render: (value: string) => (
        <span className={`badge ${value === "published" ? "bg-success" : "bg-secondary"}`}>
          {value === "published" ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (_: string, row: CaptureFormRow) => (
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditing(row)}>
            <i className="ti ti-edit" />
          </button>
          <Link href={all_routes.leadsList} className="btn btn-sm btn-outline-secondary">
            Voir les leads
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={async () => {
              if (!confirm("Supprimer ce formulaire ?")) return;
              await deleteCaptureForm(row.id);
              load();
            }}
          >
            <i className="ti ti-trash" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          <PageHeader title="Formulaires de capture" showModuleTile={false} showExport={false} />
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <SearchInput value={searchText} onChange={setSearchText} />
              <button type="button" className="btn btn-primary" onClick={() => setEditing(null)}>
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Nouveau formulaire
              </button>
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
      {editing !== undefined ? (
        <FormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            load();
          }}
        />
      ) : null}
    </>
  );
}
