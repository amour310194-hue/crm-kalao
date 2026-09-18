"use client";

import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { useCrmList } from "@/lib/api/useCrmList";
import { useI18n } from "@/i18n/I18nProvider";

export type KalaoColumn = {
  title: string;
  dataIndex: string;
};

type KalaoListPageProps = {
  resource: string;
  title: string;
  moduleTitle?: string;
  columns: KalaoColumn[];
};

const badgeSoft = (text: string) => {
  const value = String(text ?? "");
  if (value === "Particulier") return "badge-soft-info";
  if (value === "Société") return "badge-soft-primary";
  if (["Confirmé", "Validé", "Payé", "Occupé", "En production", "Active"].includes(value)) {
    return "badge-soft-success";
  }
  if (["Devis", "Préparation", "À verser", "Libre", "Semis", "Fondations"].includes(value)) {
    return "badge-soft-warning";
  }
  if (["En cours", "Pièces en cours", "Dépôt prévu", "Entretien", "Finitions"].includes(value)) {
    return "badge-soft-info";
  }
  return "badge-soft-secondary";
};

const KalaoListPage = ({
  resource,
  title,
  moduleTitle = "Métiers",
  columns,
}: KalaoListPageProps) => {
  const { t } = useI18n();
  const data = useCrmList<Record<string, unknown>>(resource, []);
  const [searchText, setSearchText] = useState("");

  const tableColumns = columns.map((column) => ({
    title: t(column.title),
    dataIndex: column.dataIndex,
    sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
      String(a[column.dataIndex] ?? "").localeCompare(String(b[column.dataIndex] ?? "")),
    render:
      column.dataIndex === "Type" ||
      column.dataIndex === "status" ||
      column.dataIndex === "Status"
        ? (text: string) => <span className={`badge ${badgeSoft(text)}`}>{t(text)}</span>
        : (text: string) => <span>{text ?? "—"}</span>,
  }));

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title={title}
          badgeCount={data.length}
          showModuleTile
          moduleTitle={moduleTitle}
          showExport
        />
        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search" />
              </span>
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
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
      <Footer />
    </div>
  );
};

export default KalaoListPage;
