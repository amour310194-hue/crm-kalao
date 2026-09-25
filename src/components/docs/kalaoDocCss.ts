import { KALAO_GOLD, KALAO_TEAL } from "@/lib/org";

/** Feuille de style isolée des documents imprimables Kalao. */
export const KALAO_DOC_CSS = `
  .kalao-doc-shell { background: #efece4; min-height: 100vh; padding: 24px 12px 48px; }
  .kalao-toolbar { max-width: 860px; margin: 0 auto 16px; display: flex; gap: 8px; }
  .kalao-toolbar button, .kalao-toolbar a {
    border: 1px solid ${KALAO_TEAL}; background: ${KALAO_TEAL}; color: #fff;
    padding: 8px 14px; font-size: 14px; text-decoration: none; cursor: pointer; border-radius: 4px;
  }
  .kalao-toolbar a.secondary, .kalao-toolbar button.secondary { background: #fff; color: ${KALAO_TEAL}; }
  .kalao-sheet {
    max-width: 860px; margin: 0 auto; background: #fff; color: #1a2a32;
    overflow: hidden; box-shadow: 0 8px 28px rgba(22,75,90,.12); border: 1px solid #d9d2c3;
  }
  .kalao-sheet-inner { padding: 18px 44px 40px; }
  .kalao-banner {
    background: ${KALAO_TEAL}; color: #fff;
    display: flex; gap: 20px; align-items: center; justify-content: space-between;
    padding: 18px 44px;
  }
  .kalao-logo { height: 44px; width: auto; max-width: 220px; object-fit: contain; display: block; }
  .kalao-banner-meta { text-align: right; }
  .kalao-name { margin: 0; font-size: 15px; font-weight: 700; letter-spacing: .04em; color: #fff; }
  .kalao-trade { margin: 2px 0 0; font-size: 12px; color: ${KALAO_GOLD}; font-weight: 600; }
  .kalao-meta { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,.82); }
  .kalao-goldbar { height: 4px; background: ${KALAO_GOLD}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .kalao-doc-title { padding: 22px 44px 8px; border-bottom: 1px solid #eadfca; margin-bottom: 0; }
  .kalao-doc-title h1 { margin: 0 0 4px; font-size: 22px; color: ${KALAO_TEAL}; letter-spacing: .02em; }
  .kalao-doc-title p { margin: 0; font-size: 13px; color: #5c6573; }
  .kalao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; font-size: 13px; }
  .kalao-box { border: 1px solid #eadfca; padding: 12px 14px; background: #fbf9f4; }
  .kalao-box strong { display: block; color: ${KALAO_TEAL}; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
  table.kalao-lines { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
  table.kalao-lines th { text-align: left; background: ${KALAO_TEAL}; color: #fff; padding: 9px 10px; font-weight: 600; }
  table.kalao-lines td { border-bottom: 1px solid #eee6d4; padding: 9px 10px; }
  .kalao-total { text-align: right; font-size: 16px; font-weight: 700; color: ${KALAO_TEAL}; margin: 8px 0 18px; }
  .kalao-article { margin: 14px 0; font-size: 13px; line-height: 1.55; white-space: pre-wrap; }
  .kalao-article h2 { font-size: 13px; color: ${KALAO_TEAL}; margin: 0 0 4px; text-transform: uppercase; letter-spacing: .04em; }
  .kalao-notes { font-size: 12px; color: #445066; padding-left: 18px; }
  .kalao-sign { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; }
  .kalao-sign p { margin: 0 0 52px; font-size: 13px; }
  .kalao-doc-foot {
    margin-top: 28px; padding: 14px 44px; background: ${KALAO_TEAL}; color: rgba(255,255,255,.88);
    font-size: 10px; line-height: 1.45;
  }
  .kalao-empty { max-width: 860px; margin: 48px auto; }
  @media print {
    .kalao-doc-shell { background: #fff; padding: 0; }
    .kalao-toolbar { display: none !important; }
    .kalao-sheet { border: 0; max-width: none; box-shadow: none; }
    .kalao-sheet-inner { padding: 6mm 14mm 10mm; }
    .kalao-doc-title { padding: 8mm 14mm 4mm; }
    .kalao-banner { padding: 8mm 14mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .kalao-doc-foot { padding: 8px 14mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;
