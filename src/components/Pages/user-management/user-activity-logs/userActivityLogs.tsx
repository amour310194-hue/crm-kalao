"use client";

import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import { useCrmCollection } from "@/lib/api/useCrmList";
import { useI18n } from "@/i18n/I18nProvider";

const badgeFor = (action: string) => {
  if (action === "Création") return "badge-soft-success";
  if (action === "Modification") return "badge-soft-info";
  if (action === "Suppression") return "badge-soft-danger";
  return "badge-soft-secondary";
};

const UserActivityLogsComponent = () => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<Record<string, unknown>>("audit-logs", []);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: t("Log ID"),
      dataIndex: "LogId",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.LogId ?? "").localeCompare(String(b.LogId ?? "")),
    },
    {
      title: t("User"),
      dataIndex: "User",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.User ?? "").localeCompare(String(b.User ?? "")),
    },
    {
      title: t("Action"),
      dataIndex: "Action",
      render: (text: string) => <span className={`badge ${badgeFor(text)}`}>{t(text)}</span>,
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Action ?? "").localeCompare(String(b.Action ?? "")),
    },
    {
      title: t("Module"),
      dataIndex: "Module",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Module ?? "").localeCompare(String(b.Module ?? "")),
    },
    {
      title: t("Record ID"),
      dataIndex: "RecordId",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.RecordId ?? "").localeCompare(String(b.RecordId ?? "")),
    },
    {
      title: t("Action Date"),
      dataIndex: "ActionDate",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.ActionDate ?? "").localeCompare(String(b.ActionDate ?? "")),
    },
    {
      title: t("IP Address"),
      dataIndex: "IpAddress",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.IpAddress ?? "").localeCompare(String(b.IpAddress ?? "")),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="User Activity Logs"
          badgeCount={data.length}
          showModuleTile
          moduleTitle="User Management"
          showExport
          exportPdfResource="audit-logs"
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
          </div>
          <div className="card-body">
            {data.length === 0 ? (
              <p className="text-muted mb-0">
                Aucune écriture pour l’instant. Créer, modifier ou supprimer un dossier l’enregistre ici.
              </p>
            ) : (
              <div className="custom-table">
                <Datatable columns={columns} dataSource={data} Selection={false} searchText={searchText} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserActivityLogsComponent;
