"use client";

import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { deleteCrmRecord } from "@/lib/api/crmClient";
import { useI18n } from "@/i18n/I18nProvider";
import KalaoFormModal from "@/components/Pages/kalao/KalaoFormModal";
import Link from "next/link";

export type KalaoColumn = {
  title: string;
  dataIndex: string;
};

type KalaoListPageProps = {
  resource: string;
  title: string;
  moduleTitle?: string;
  columns: KalaoColumn[];
  addLabel?: string;
  detailBase?: string;
};

const badgeSoft = (text: string) => {
  const value = String(text ?? "");
  if (value === "Particulier") return "badge-soft-info";
  if (value === "Société") return "badge-soft-primary";
  if (["Confirmé", "Validé", "Payé", "Occupé", "En production", "Active", "Terminé", "En service", "En stock", "Présent", "Affecté", "Visa obtenu", "Actif"].includes(value)) {
    return "badge-soft-success";
  }
  if (["Devis", "Préparation", "À verser", "Libre", "Semis", "Fondations", "Maintenance", "Congé", "Pièces", "Dossier ouvert"].includes(value)) {
    return "badge-soft-warning";
  }
  if (["En cours", "Pièces en cours", "Dépôt prévu", "Entretien", "Finitions", "Disponible", "Dépôt"].includes(value)) {
    return "badge-soft-info";
  }
  if (["Absent"].includes(value)) {
    return "badge-soft-danger";
  }
  return "badge-soft-secondary";
};

const KalaoListPage = ({
  resource,
  title,
  moduleTitle = "Métiers",
  columns,
  addLabel = "Add",
  detailBase,
}: KalaoListPageProps) => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<Record<string, unknown>>(resource, []);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Record<string, unknown> | null>(null);

  const tableColumns = [
    ...columns.map((column) => ({
      title: t(column.title),
      dataIndex: column.dataIndex,
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a[column.dataIndex] ?? "").localeCompare(String(b[column.dataIndex] ?? "")),
      render:
        column.dataIndex === "Type" ||
        column.dataIndex === "status" ||
        column.dataIndex === "Status" ||
        column.dataIndex === "step" ||
        column.dataIndex === "Step"
          ? (text: string) => <span className={`badge ${badgeSoft(text)}`}>{t(text)}</span>
          : column.dataIndex === "Itinerary"
            ? (text: string) => (
                <span className="d-inline-block text-truncate" style={{ maxWidth: 240 }} title={text || ""}>
                  {text || "—"}
                </span>
              )
          : (text: string, row: Record<string, unknown>) =>
              detailBase && (column.dataIndex === "number" || column.dataIndex === "Name" || column.dataIndex === "name") ? (
                <Link href={`${detailBase}/${row.id || row.key}`}>{text ?? "—"}</Link>
              ) : (
                <span>{text ?? "—"}</span>
              ),
    })),
    {
      title: t("Action"),
      dataIndex: "id",
      render: (_text: string, row: Record<string, unknown>) => (
        <div className="d-flex gap-1">
          {detailBase ? (
            <Link className="btn btn-sm btn-outline-light" href={`${detailBase}/${row.id || row.key}`}>
              {t("View Details")}
            </Link>
          ) : null}
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => {
              setCurrent(row);
              setOpen(true);
            }}
          >
            {t("Edit")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={async () => {
              await deleteCrmRecord(resource, String(row.id || row.key));
              reload();
            }}
          >
            {t("Delete")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title={title}
          badgeCount={data.length}
          showModuleTile
          moduleTitle={moduleTitle}
          showExport
          exportPdfResource={resource}
          onRefresh={reload}
        />
        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search" />
              </span>
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCurrent(null);
                setOpen(true);
              }}
            >
              <i className="ti ti-square-rounded-plus-filled me-1" />
              {t(addLabel)}
            </button>
          </div>
          <div className="card-body">
            <div className="custom-table">
              <Datatable
                columns={tableColumns}
                dataSource={data}
                Selection={false}
                searchText={searchText}
              />
            </div>
          </div>
        </div>
      </div>
      <KalaoFormModal
        resource={resource}
        open={open}
        record={current}
        onClose={() => setOpen(false)}
        onSaved={reload}
      />
      <Footer />
    </div>
  );
};

export default KalaoListPage;
