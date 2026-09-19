import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Immigration | Groupe Kalao",
};

export default function ImmigrationPage() {
  return (
    <KalaoListPage
      resource="immigration"
      title="Immigration"
      addLabel="Add"
      detailBase="/metiers/immigration"
      columns={[
        { title: "Quote ID", dataIndex: "number" },
        { title: "Client", dataIndex: "Client" },
        { title: "Type", dataIndex: "Type" },
        { title: "Procedure", dataIndex: "procedure" },
        { title: "Country", dataIndex: "country" },
        { title: "Visa step", dataIndex: "Step" },
        { title: "Status", dataIndex: "status" },
        { title: "Due Date", dataIndex: "dueDate" },
      ]}
    />
  );
}
