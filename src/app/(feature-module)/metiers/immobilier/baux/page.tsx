import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Baux / Loyers | Groupe Kalao",
};

export default function BauxPage() {
  return (
    <KalaoListPage
      resource="leases"
      title="Baux / Loyers"
      addLabel="Add"
      columns={[
        { title: "Name", dataIndex: "propertyName" },
        { title: "Client", dataIndex: "tenant" },
        { title: "Start Date", dataIndex: "startDate" },
        { title: "End Date", dataIndex: "endDate" },
        { title: "Rent", dataIndex: "Rent" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
