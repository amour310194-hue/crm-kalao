"use client";

import { useEffect, useState } from "react";
import {
  decideDossierCancel,
  fetchApprovalRequests,
  fetchAutomationRules,
  simulateAutomations,
  type ApprovalRequestRow,
  type AutomationRuleRow,
} from "@/lib/dossiers";

export function AutomationsScreen() {
  const [rules, setRules] = useState<AutomationRuleRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    void fetchAutomationRules()
      .then((rows) => setRules(rows ?? []))
      .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Règles indisponibles"));
  }, []);
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Automatisations</h5>
        <button
          type="button"
          className="btn btn-outline-dark btn-sm"
          onClick={() => {
            void simulateAutomations()
              .then((count) => setMessage(`${count} règle(s) simulée(s). Aucun e-mail n'est parti.`))
              .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Simulation refusée"));
          }}
        >
          Simuler
        </button>
      </div>
      <div className="card-body">
        <p className="text-muted">Les six règles sont livrées désactivées. La simulation n&apos;envoie rien.</p>
        {message ? <p>{message}</p> : null}
        <ul className="mb-0">
          {rules.map((rule) => (
            <li key={rule.id}>
              {rule.name} — {rule.trigger_key} — {rule.active ? "active" : "inactive"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ApprovalsQueue() {
  const [rows, setRows] = useState<ApprovalRequestRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const load = () => {
    void fetchApprovalRequests()
      .then((data) => setRows(data ?? []))
      .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "File indisponible"));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">À valider</h5></div>
      <div className="card-body">
        <p className="text-muted">Annulation de dossier. Les factures ne sont pas annulées ici : l&apos;avoir passe par le circuit finance.</p>
        {message ? <p>{message}</p> : null}
        {!rows.length ? <p>Aucune demande en attente.</p> : null}
        {rows.map((row) => (
          <div className="border-bottom py-2" key={row.id}>
            <div>{row.action} — {row.comment || "Sans motif"}</div>
            <div className="d-flex gap-2 mt-2">
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => {
                  void decideDossierCancel(row.id, true, "")
                    .then(load)
                    .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Validation refusée"));
                }}
              >
                Approuver
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  void decideDossierCancel(row.id, false, "")
                    .then(load)
                    .catch((err: unknown) => setMessage(err instanceof Error ? err.message : "Refus impossible"));
                }}
              >
                Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
