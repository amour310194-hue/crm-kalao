"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import ModalDepartments from "./modal/modalDepartments";
import { useCrmCollection } from "@/lib/api/useCrmList";
import CrmLiveAdd from "@/components/Pages/kalao/CrmLiveAdd";
import { useI18n } from "@/i18n/I18nProvider";

const route = all_routes;

const DepartmentsListComponent = () => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<Record<string, unknown>>("departments", []);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: t("Department ID"),
      dataIndex: "DepartmentId",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.DepartmentId ?? "").localeCompare(String(b.DepartmentId ?? "")),
    },
    {
      title: t("Department Name"),
      dataIndex: "DepartmentName",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.DepartmentName ?? "").localeCompare(String(b.DepartmentName ?? "")),
    },
    {
      title: t("Department Head"),
      dataIndex: "HeadName",
      render: (text: string, record: Record<string, unknown>) => (
        <span className="d-flex align-items-center fs-14 fw-medium">
          {record.HeadImage ? (
            <span className="avatar avatar-xs me-2">
              <ImageWithBasePath
                className="img-fluid rounded-circle"
                src={String(record.HeadImage)}
                alt=""
              />
            </span>
          ) : null}
          {text || "—"}
        </span>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.HeadName ?? "").localeCompare(String(b.HeadName ?? "")),
    },
    {
      title: t("Members Count"),
      dataIndex: "MembersCount",
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.MembersCount ?? "").localeCompare(String(b.MembersCount ?? ""), "fr", { numeric: true }),
    },
    {
      title: t("Location"),
      dataIndex: "Location",
      render: (text: string, record: Record<string, unknown>) => (
        <div className="d-flex align-items-center">
          {record.LocationFlag ? (
            <ImageWithBasePath src={String(record.LocationFlag)} className="me-2 flag-img" alt="" width={20} />
          ) : null}
          {text || "—"}
        </div>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Location ?? "").localeCompare(String(b.Location ?? "")),
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      render: (text: string) => (
        <span className={`badge badge-soft-${text === "Inactive" ? "secondary" : "success"}`}>{t(text)}</span>
      ),
      sorter: (a: Record<string, unknown>, b: Record<string, unknown>) =>
        String(a.Status ?? "").localeCompare(String(b.Status ?? "")),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="Departments"
          badgeCount={data.length}
          showModuleTile
          moduleTitle="User Management"
          showExport
          exportPdfResource="departments"
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
            <div className="d-inline-flex align-items-center flex-wrap gap-3">
              <div className="d-inline-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                <Link href={route.departmentsList} className="btn p-2 border-0 fs-14 active">
                  <i className="ti ti-list-tree" />
                </Link>
                <Link href={route.departments} className="flex-shrink-0 btn p-2 border-0 ms-1 fs-14">
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
              <CrmLiveAdd resource="departments" label="Add Department" onSaved={reload} />
            </div>
          </div>
          <div className="card-body">
            {data.length === 0 ? (
              <p className="text-muted mb-0">Aucun département.</p>
            ) : (
              <div className="custom-table">
                <Datatable columns={columns} dataSource={data} Selection={false} searchText={searchText} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ModalDepartments />
    </div>
  );
};

export default DepartmentsListComponent;
