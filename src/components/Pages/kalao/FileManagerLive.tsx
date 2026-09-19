"use client";

import { useEffect, useState } from "react";
import { deleteCrmRecord, fetchCrmFiles, uploadCrmFile } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";

const FileManagerLive = () => {
  const { t } = useI18n();
  const [files, setFiles] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      setFiles(await fetchCrmFiles());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liste fichiers impossible");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (file: Record<string, unknown>) => {
    const id = String(file.id || file.key || "");
    if (!id) return;
    if (!window.confirm("Supprimer ce fichier ?")) return;
    try {
      await deleteCrmRecord("attachments", id);
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h6 className="mb-0">{t("File uploads")}</h6>
          <input
            type="file"
            className="form-control"
            style={{ maxWidth: 360 }}
            disabled={uploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setError("");
              setUploading(true);
              try {
                await uploadCrmFile(file);
                await load();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload impossible");
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        {files.length === 0 ? (
          <p className="text-muted mb-0">{t("No files yet")}</p>
        ) : (
          <ul className="list-group">
            {files.map((file) => (
              <li className="list-group-item d-flex justify-content-between align-items-center gap-2" key={String(file.id)}>
                <a href={String(file.url)} target="_blank" rel="noreferrer">
                  {String(file.name)}
                </a>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void remove(file)}>
                  {t("Delete")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileManagerLive;
