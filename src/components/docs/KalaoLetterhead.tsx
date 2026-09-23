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
    <header className="kalao-letterhead">
      <div className="kalao-letterhead-top">
        <img src={entity.logoSrc} alt={entity.tradeName} className="kalao-logo" />
        <div className="kalao-letterhead-brand">
          <p className="kalao-name">{entity.legalName}</p>
          <p className="kalao-trade">{entity.tradeName}</p>
          <p className="kalao-meta">
            {entity.address}, {entity.city}
          </p>
          <p className="kalao-meta">
            {entity.phones.join(" · ")} · {entity.email}
          </p>
        </div>
      </div>
      <div className="kalao-doc-title">
        <h1>{title}</h1>
        <p>
          Réf. {refNo} · Yaoundé, {issuedAt}
        </p>
      </div>
      <p className="kalao-legal">{entityFooter(entity)}</p>
    </header>
  );
}
