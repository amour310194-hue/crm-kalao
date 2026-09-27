"use client";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { all_routes } from "@/router/all_routes";
import { ACCOUNT_ROLES, isCrmAdmin, type AccountRole } from "@/lib/authz";
import { ROLE_LABEL } from "@/lib/org";
import { fetchSessionRole } from "@/lib/roles";
import { MODULES, type ModuleKey } from "@/lib/permissions";
import { fetchModulePermissions, upsertModulePermission } from "@/lib/permissions-admin";

const PermissionComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") ?? "";
  const role = ACCOUNT_ROLES.includes(roleParam as AccountRole)
    ? (roleParam as AccountRole)
    : null;

  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [checks, setChecks] = useState<Record<ModuleKey, boolean>>(() =>
    Object.fromEntries(MODULES.map((entry) => [entry.key, true])) as Record<ModuleKey, boolean>
  );

  useEffect(() => {
    void (async () => {
      const sessionRole = await fetchSessionRole();
      if (!isCrmAdmin(sessionRole)) {
        router.replace(all_routes.error404);
        return;
      }
      setAllowed(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!role || !allowed) return;
    void (async () => {
      const rows = await fetchModulePermissions(role);
      const next = Object.fromEntries(
        MODULES.map((entry) => [entry.key, true])
      ) as Record<ModuleKey, boolean>;
      for (const row of rows) {
        next[row.module_key] = row.allowed;
      }
      setChecks(next);
    })();
  }, [role, allowed]);

  const save = async () => {
    if (!role) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      for (const entry of MODULES) {
        await upsertModulePermission(role, entry.key, checks[entry.key] !== false);
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  if (!allowed) return null;

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="Accès par module"
          badgeCount={MODULES.length}
          showModuleTile={false}
          showExport={false}
        />
        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <h6 className="mb-0">
              Rôle :{" "}
              <span className="text-danger">
                {role ? ROLE_LABEL[role] ?? role : "non précisé"}
              </span>
            </h6>
            <Link href={all_routes.rolesPermissions} className="btn btn-outline-light btn-sm">
              Retour aux rôles
            </Link>
          </div>
          <div className="card-body">
            {!role ? (
              <p className="text-muted mb-0">
                Choisissez un rôle depuis la liste pour configurer ses accès.
              </p>
            ) : (
              <>
                {error ? (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                ) : null}
                {saved ? (
                  <div className="alert alert-success py-2" role="alert">
                    Accès enregistrés.
                  </div>
                ) : null}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th className="text-end">Autorisé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES.map((entry) => (
                        <tr key={entry.key}>
                          <td>{entry.label}</td>
                          <td className="text-end">
                            <div className="form-check d-inline-flex justify-content-end">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`mod-${entry.key}`}
                                checked={checks[entry.key] !== false}
                                onChange={(event) =>
                                  setChecks((current) => ({
                                    ...current,
                                    [entry.key]: event.target.checked,
                                  }))
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void save()}
                  disabled={saving}
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PermissionComponent;
