import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Équipes terrain | Groupe Kalao",
};

export default function EquipesTerrainPage() {
  return (
    <KalaoListPage
      resource="equipes"
      title="Équipes terrain"
      moduleTitle="BTP"
      columns={[
        { title: "Employee", dataIndex: "employee" },
        { title: "Role", dataIndex: "role" },
        { title: "Site Name", dataIndex: "siteName" },
        { title: "Start Date", dataIndex: "startDate" },
        { title: "End Date", dataIndex: "endDate" },
        { title: "Présence terrain", dataIndex: "attendance" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
