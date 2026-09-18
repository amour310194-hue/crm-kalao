import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Lots événementiel | Groupe Kalao",
};

export default function EvenementsPage() {
  return (
    <KalaoListPage
      resource="events"
      title="Lots événementiel"
      columns={[
        { title: "Quote ID", dataIndex: "number" },
        { title: "Name", dataIndex: "title" },
        { title: "Client", dataIndex: "Client" },
        { title: "Type", dataIndex: "Type" },
        { title: "Event Date", dataIndex: "eventDate" },
        { title: "Services", dataIndex: "services" },
        { title: "Status", dataIndex: "status" },
        { title: "Amount", dataIndex: "Amount" },
      ]}
    />
  );
}
