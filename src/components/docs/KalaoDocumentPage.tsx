"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import KalaoLetterhead, { KalaoDocFooter } from "@/components/docs/KalaoLetterhead";
import { KALAO_DOC_CSS } from "@/components/docs/kalaoDocCss";
import { DOC_KINDS, loadDocView, type DocKind, type DocView } from "@/lib/docs";
import { assertCanSeePayroll, isPayDocKind } from "@/lib/roles";

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
    void (async () => {
      try {
        if (isPayDocKind(kind)) await assertCanSeePayroll();
        setView(await loadDocView(kind, id));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    })();
  }, [kind, id]);

  return (
    <AuthGuard>
      <style>{KALAO_DOC_CSS}</style>
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
            <div className="kalao-sheet-inner">
              <div className="kalao-grid">
                <div className="kalao-box">
                  <strong>Émetteur</strong>
                  {view.entity.legalName}
                  {view.entity.sigle ? ` (${view.entity.sigle})` : ""}
                  <br />
                  {view.entity.representative}, {view.entity.representativeTitle}
                  <br />
                  {view.entity.rccm ? (
                    <>
                      RCCM {view.entity.rccm}
                      <br />
                    </>
                  ) : null}
                  {view.entity.niu ? (
                    <>
                      NIU {view.entity.niu}
                      <br />
                    </>
                  ) : null}
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
            </div>
            <KalaoDocFooter entity={view.entity} />
          </article>
        ) : null}
      </div>
    </AuthGuard>
  );
}
