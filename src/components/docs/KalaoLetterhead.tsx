/* eslint-disable @next/next/no-img-element */
import { entityFooter, type KalaoEntity } from "@/lib/org";

type Props = {
  entity: KalaoEntity;
  title: string;
  refNo: string;
  issuedAt: string;
};

export default function KalaoLetterhead({ entity, title, refNo, issuedAt }: Props) {
  return (
    <>
      <header className="kalao-letterhead">
        <div className="kalao-banner">
          <img src={entity.logoSrc} alt={entity.tradeName} className="kalao-logo" />
          <div className="kalao-banner-meta">
            <p className="kalao-name">{entity.legalName}</p>
            <p className="kalao-trade">{entity.tradeName}</p>
            <p className="kalao-meta">
              {entity.address}, {entity.city}
            </p>
            {entity.rccm || entity.niu ? (
              <p className="kalao-meta">
                {[
                  entity.rccm ? `RCCM ${entity.rccm}` : null,
                  entity.niu ? `NIU ${entity.niu}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            <p className="kalao-meta">
              {entity.phones[0]} · {entity.email}
            </p>
          </div>
        </div>
        <div className="kalao-goldbar" />
        <div className="kalao-doc-title">
          <h1>{title}</h1>
          <p>
            Réf. {refNo} · Yaoundé, {issuedAt}
          </p>
        </div>
      </header>
    </>
  );
}

export function KalaoDocFooter({ entity }: { entity: KalaoEntity }) {
  return <footer className="kalao-doc-foot">{entityFooter(entity)}</footer>;
}
