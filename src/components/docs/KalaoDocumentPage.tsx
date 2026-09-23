"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import KalaoLetterhead from "@/components/docs/KalaoLetterhead";
import { DOC_KINDS, loadDocView, type DocKind, type DocView } from "@/lib/docs";

function isDocKind(value: string): value is DocKind {
  return (DOC_KINDS as readonly string[]).includes(value);
}

export default function KalaoDocumentPage() {
  const params = useParams<{ kind: string; id: string }>();
  const kind = params.kind;
  const id = params.id;
  const [view, setView] = useState<DocView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDocKind(kind) || !id) {
      setError("Type de document inconnu.");
      return;
    }
    void loadDocView(kind, id)
      .then(setView)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      });
  }, [kind, id]);

  return (
    <AuthGuard>
      <style>{`
        .kalao-doc-shell { background: #f4f1ea; min-height: 100vh; padding: 24px 12px 48px; }
        .kalao-toolbar { max-width: 820px; margin: 0 auto 16px; display: flex; gap: 8px; }
        .kalao-toolbar button, .kalao-toolbar a {
          border: 1px solid #0a2140; background: #0a2140; color: #fff;
          padding: 8px 14px; font-size: 14px; text-decoration: none; cursor: pointer;
        }
        .kalao-toolbar a.secondary, .kalao-toolbar button.secondary { background: #fff; color: #0a2140; }
        .kalao-sheet {
          max-width: 820px; margin: 0 auto; background: #fff; color: #122033;
          padding: 36px 44px 48px; border: 1px solid #d7c9a3;
        }
        .kalao-letterhead { border-bottom: 4px solid #0a2140; padding-bottom: 16px; margin-bottom: 20px; }
        .kalao-letterhead-top { display: flex; gap: 16px; align-items: center; }
        .kalao-logo { width: 72px; height: 72px; object-fit: contain; }
        .kalao-name { margin: 0; font-size: 20px; font-weight: 700; color: #0a2140; letter-spacing: .04em; }
        .kalao-trade { margin: 2px 0 0; font-size: 13px; color: #c48a00; font-weight: 600; }
        .kalao-meta { margin: 2px 0 0; font-size: 12px; color: #445066; }
        .kalao-doc-title h1 { margin: 16px 0 4px; font-size: 22px; color: #0a2140; }
        .kalao-doc-title p { margin: 0; font-size: 13px; }
        .kalao-legal { margin: 12px 0 0; font-size: 11px; color: #5c6573; }
        .kalao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; font-size: 13px; }
        .kalao-box { border: 1px solid #e4d7b5; padding: 10px 12px; }
        .kalao-box strong { display: block; color: #0a2140; margin-bottom: 4px; }
        table.kalao-lines { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
        table.kalao-lines th { text-align: left; background: #0a2140; color: #fff; padding: 8px; }
        table.kalao-lines td { border-bottom: 1px solid #eee2c8; padding: 8px; }
        .kalao-total { text-align: right; font-size: 16px; font-weight: 700; color: #0a2140; }
        .kalao-article { margin: 14px 0; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
        .kalao-article h2 { font-size: 14px; color: #0a2140; margin: 0 0 4px; }
        .kalao-notes { font-size: 12px; color: #445066; }
        .kalao-sign { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 36px; }
        .kalao-sign p { margin: 0 0 48px; font-size: 13px; }
        .kalao-empty { max-width: 820px; margin: 48px auto; }
        @media print {
          .kalao-doc-shell { background: #fff; padding: 0; }
          .kalao-toolbar { display: none !important; }
          .kalao-sheet { border: 0; max-width: none; padding: 12mm 14mm; }
        }
      `}</style>
      <div className="kalao-doc-shell">
        <div className="kalao-toolbar">
          <button type="button" onClick={() => window.print()}>
            Imprimer / PDF
          </button>
          <a className="secondary" href="javascript:history.back()">
            Retour
          </a>
        </div>
        {!view && !error ? <p className="kalao-empty">Préparation du document…</p> : null}
        {error ? <p className="kalao-empty">{error}</p> : null}
        {view ? (
          <article className="kalao-sheet">
            <KalaoLetterhead
              entity={view.entity}
              title={view.title}
              refNo={view.ref}
              issuedAt={view.issuedAt}
            />
            <div className="kalao-grid">
              <div className="kalao-box">
                <strong>Émetteur</strong>
                {view.entity.legalName}
                <br />
                {view.entity.representative}, {view.entity.representativeTitle}
                <br />
                {view.entity.email}
              </div>
              <div className="kalao-box">
                <strong>Destinataire</strong>
                {view.party.name}
                <br />
                {view.party.address}, {view.party.city}
                <br />
                {view.party.phone} · {view.party.email}
              </div>
            </div>
            <p>{view.intro}</p>
            {view.lines.length ? (
              <table className="kalao-lines">
                <thead>
                  <tr>
                    <th>Désignation</th>
                    <th>Qté</th>
                    <th>Prix</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {view.lines.map((line) => (
                    <tr key={`${line.label}-${line.total}`}>
                      <td>{line.label}</td>
                      <td>{line.qty}</td>
                      <td>{line.unit}</td>
                      <td>{line.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
            {view.total ? (
              <p className="kalao-total">
                {view.totalLabel} : {view.total}
              </p>
            ) : null}
            {view.articles.map((article) => (
              <section className="kalao-article" key={article.heading}>
                <h2>{article.heading}</h2>
                <p>{article.body}</p>
              </section>
            ))}
            {view.notes.length ? (
              <ul className="kalao-notes">
                {view.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
            {view.signatures.length ? (
              <div className="kalao-sign">
                {view.signatures.map((sign) => (
                  <p key={sign.role}>
                    <strong>{sign.role}</strong>
                    <br />
                    {sign.name}
                    <br />
                    {sign.title}
                    <br />
                    Lu et approuvé
                  </p>
                ))}
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </AuthGuard>
  );
}
