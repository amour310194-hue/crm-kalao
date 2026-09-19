import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Matériel BTP | Groupe Kalao",
};

export default function MaterielPage() {
  return (
    <KalaoListPage
      resource="materiel"
      title="Matériel"
      moduleTitle="BTP"
      columns={[
        { title: "SKU", dataIndex: "code" },
        { title: "Name", dataIndex: "name" },
        { title: "Kind", dataIndex: "kind" },
        { title: "Site Name", dataIndex: "siteName" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Condition", dataIndex: "condition" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
