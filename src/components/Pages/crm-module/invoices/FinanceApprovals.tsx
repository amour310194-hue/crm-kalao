"use client";

import { useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import { decideFinanceChange, fetchFinanceApprovals, formatDate } from "@/lib/crm";

type Approval = {
  id: string;
  entity: string;
  action: string;
  reason: string;
  created_at: string;
  payload: Record<string, unknown>;
};

export default function FinanceApprovals() {
  const [rows, setRows] = useState<Approval[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await fetchFinanceApprovals();
      setRows((data ?? []) as Approval[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const decide = async (id: string, approve: boolean) => {
    setInfo(null);
    try {
      const result = await decideFinanceChange(id, approve);
      if (result?.credit_note) {
        setInfo(`Avoir ${result.credit_note} créé. Émettez la facture de remplacement depuis Nouvelle facture.`);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="mb-3">Validations finance</h4>
        <p className="text-muted">Chaque modification ou annulation est appliquée par un autre compte direction, admin ou super admin.</p>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        {info ? <div className="alert alert-success">{info}</div> : null}
        {rows.length ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pièce</th>
                  <th>Action</th>
                  <th>Motif</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(row.created_at)}</td>
                    <td>{row.entity}</td>
                    <td>{row.action}</td>
                    <td>{row.reason}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-dark me-2" onClick={() => void decide(row.id, true)}>
                        Valider
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => void decide(row.id, false)}>
                        Refuser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucune demande en attente.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
