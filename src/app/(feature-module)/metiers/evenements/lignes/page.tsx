import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Lignes événementiel | Groupe Kalao",
};

export default function EventLinesPage() {
  return (
    <KalaoListPage
      resource="eventLines"
      title="Lignes"
      addLabel="Add"
      columns={[
        { title: "Quote ID", dataIndex: "eventNumber" },
        { title: "Name", dataIndex: "label" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Unit Price", dataIndex: "unitPrice" },
        { title: "Amount", dataIndex: "Amount" },
      ]}
    />
  );
}
