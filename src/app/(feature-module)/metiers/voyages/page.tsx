import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Voyages | Groupe Kalao",
};

export default function VoyagesPage() {
  return (
    <KalaoListPage
      resource="travel"
      title="Voyages"
      addLabel="Add"
      detailBase="/metiers/voyages"
      columns={[
        { title: "Quote ID", dataIndex: "number" },
        { title: "Client", dataIndex: "Client" },
        { title: "Type", dataIndex: "Type" },
        { title: "Destination", dataIndex: "destination" },
        { title: "Pax", dataIndex: "Pax" },
        { title: "Departure Date", dataIndex: "departureDate" },
        { title: "Return Date", dataIndex: "returnDate" },
        { title: "Status", dataIndex: "status" },
        { title: "Amount", dataIndex: "Amount" },
      ]}
    />
  );
}
