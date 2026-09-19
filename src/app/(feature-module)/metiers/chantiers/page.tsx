import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Chantiers BTP | Groupe Kalao",
};

export default function ChantiersPage() {
  return (
    <KalaoListPage
      resource="sites"
      title="Chantiers"
      moduleTitle="BTP"
      columns={[
        { title: "Quote ID", dataIndex: "number" },
        { title: "Name", dataIndex: "name" },
        { title: "Client", dataIndex: "Client" },
        { title: "Type", dataIndex: "Type" },
        { title: "Location", dataIndex: "location" },
        { title: "Phase", dataIndex: "phase" },
        { title: "Progress", dataIndex: "progress" },
        { title: "Manager", dataIndex: "manager" },
        { title: "Team Size", dataIndex: "teamSize" },
        { title: "Start Date", dataIndex: "startDate" },
        { title: "End Date", dataIndex: "endDate" },
        { title: "Status", dataIndex: "status" },
        { title: "Amount", dataIndex: "Amount" },
      ]}
    />
  );
}
