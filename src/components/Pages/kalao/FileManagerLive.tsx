"use client";

import { useEffect, useState } from "react";
import { fetchCrmFiles, uploadCrmFile } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";

const FileManagerLive = () => {
  const { t } = useI18n();
  const [files, setFiles] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState("");

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

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h6 className="mb-0">{t("File uploads")}</h6>
          <input
            type="file"
            className="form-control"
            style={{ maxWidth: 360 }}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setError("");
              try {
                await uploadCrmFile(file);
                await load();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload impossible");
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
              <li className="list-group-item d-flex justify-content-between" key={String(file.id)}>
                <a href={String(file.url)} target="_blank" rel="noreferrer">
                  {String(file.name)}
                </a>
                <span className="text-muted">{String(file.parentType)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileManagerLive;
