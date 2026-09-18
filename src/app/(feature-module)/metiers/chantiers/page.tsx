import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Chantiers BTP | Groupe Kalao",
};

export default function ChantiersPage() {
  return (
    <KalaoListPage
      resource="sites"
      title="Chantiers BTP"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Client", dataIndex: "Client" },
        { title: "Type", dataIndex: "Type" },
        { title: "Location", dataIndex: "location" },
        { title: "Progress", dataIndex: "progress" },
        { title: "Status", dataIndex: "status" },
        { title: "Amount", dataIndex: "Amount" },
      ]}
    />
  );
}
