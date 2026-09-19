"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import ModalDepartments from "./modal/modalDepartments";
import { useCrmCollection } from "@/lib/api/useCrmList";
import CrmLiveAdd from "@/components/Pages/kalao/CrmLiveAdd";
import { useI18n } from "@/i18n/I18nProvider";

const route = all_routes;

const DepartmentsComponent = () => {
  const { t } = useI18n();
  const { data, reload } = useCrmCollection<Record<string, unknown>>("departments", []);
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      [row.DepartmentId, row.DepartmentName, row.HeadName, row.Location, row.Status]
        .map((value) => String(value ?? "").toLowerCase())
        .some((value) => value.includes(q)),
    );
  }, [data, searchText]);

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
                <Link href={route.departmentsList} className="btn p-2 border-0 fs-14">
                  <i className="ti ti-list-tree" />
                </Link>
                <Link href={route.departments} className="flex-shrink-0 btn p-2 border-0 ms-1 fs-14 active">
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
              <CrmLiveAdd resource="departments" label="Add Department" onSaved={reload} />
            </div>
          </div>
          <div className="card-body">
            {filtered.length === 0 ? (
              <p className="text-muted mb-0">Aucun département.</p>
            ) : (
              <div className="row row-gap-3">
                {filtered.map((department) => (
                  <div className="col-xl-4 col-lg-6 col-md-6" key={String(department.key || department.id)}>
                    <div className="card mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3 pb-3 border-bottom">
                          <h4 className="fs-14 fw-semibold mb-0">{String(department.DepartmentName ?? "—")}</h4>
                          <span
                            className={`badge badge-soft-${department.Status === "Inactive" ? "secondary" : "success"}`}
                          >
                            {t(String(department.Status ?? ""))}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          {department.HeadImage ? (
                            <span className="avatar flex-shrink-0">
                              <ImageWithBasePath
                                src={String(department.HeadImage)}
                                alt=""
                                className="rounded-circle"
                              />
                            </span>
                          ) : null}
                          <div>
                            <div className="fs-14 fw-medium">{String(department.HeadName ?? "—")}</div>
                            <p className="text-default mb-0">{t("Department Head")}</p>
                          </div>
                        </div>
                        <p className="mb-0">
                          {t("Members Count")} :{" "}
                          <span className="fw-normal text-dark">{String(department.MembersCount ?? "—")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

export default DepartmentsComponent;
