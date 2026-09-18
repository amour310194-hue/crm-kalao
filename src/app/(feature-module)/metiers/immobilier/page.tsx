import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Immobilier | Groupe Kalao",
};

export default function ImmobilierPage() {
  return (
    <KalaoListPage
      resource="properties"
      title="Immobilier"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Type", dataIndex: "kind" },
        { title: "Location", dataIndex: "location" },
        { title: "Client", dataIndex: "Client" },
        { title: "Client Type", dataIndex: "Type" },
        { title: "Rent", dataIndex: "Rent" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
