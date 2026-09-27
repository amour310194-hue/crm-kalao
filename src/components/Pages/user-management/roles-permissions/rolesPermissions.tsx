"use client";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import { useEffect, useMemo, useState } from "react";
import Datatable from "@/core/common/dataTable";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { all_routes } from "@/router/all_routes";
import { ACCOUNT_ROLES, isCrmAdmin } from "@/lib/authz";
import { ROLE_LABEL } from "@/lib/org";
import { fetchSessionRole } from "@/lib/roles";

const RolesPermissionsComponent = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    void (async () => {
      const role = await fetchSessionRole();
      if (!isCrmAdmin(role)) {
        router.replace(all_routes.error404);
        return;
      }
      setAllowed(true);
    })();
  }, [router]);

  const data = useMemo(
    () =>
      ACCOUNT_ROLES.map((role) => ({
        key: role,
        RoleName: ROLE_LABEL[role] ?? role,
        Code: role,
      })),
    []
  );

  const columns = [
    {
      title: "Rôle",
      dataIndex: "RoleName",
      sorter: (a: { RoleName: string }, b: { RoleName: string }) =>
        a.RoleName.localeCompare(b.RoleName, "fr"),
    },
    {
      title: "Code",
      dataIndex: "Code",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_: unknown, row: { Code: string }) => (
        <Link
          className="btn btn-sm btn-outline-light"
          href={`${all_routes.permissions}?role=${row.Code}`}
        >
          <i className="ti ti-shield me-1" />
          Configurer les accès
        </Link>
      ),
    },
  ];

  if (!allowed) return null;

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="Rôles et accès"
          badgeCount={data.length}
          showModuleTile={false}
          showExport={false}
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
            <div className="table-responsive custom-table">
              <Datatable
                columns={columns}
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

export default RolesPermissionsComponent;
