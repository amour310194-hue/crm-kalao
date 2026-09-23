"use client";

import Link from "next/link";
import { downloadXlsx } from "@/lib/excel";

type Props = {
  filename: string;
  headers: string[];
  rows: string[][];
  printHref?: string | null;
};

export default function KalaoExportBar({ filename, headers, rows, printHref }: Props) {
  if (!rows.length) return null;
  return (
    <div className="d-flex align-items-center flex-wrap gap-2">
      <button
        type="button"
        className="btn btn-sm btn-outline-dark"
        onClick={() => downloadXlsx(filename, headers, rows)}
      >
        <i className="ti ti-file-type-xls me-1" />
        Télécharger Excel Kalao
      </button>
      {printHref ? (
        <Link href={printHref} target="_blank" className="btn btn-sm btn-outline-dark">
          <i className="ti ti-printer me-1" />
          Imprimer / PDF
        </Link>
      ) : null}
    </div>
  );
}
