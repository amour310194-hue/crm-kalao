import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Clients | Groupe Kalao",
};

export default function ClientsPage() {
  return (
    <KalaoListPage
      resource="accounts"
      title="Clients"
      moduleTitle="CRM"
      detailBase="/crm/clients"
      columns={[
        { title: "Name", dataIndex: "Name" },
        { title: "Type", dataIndex: "Type" },
        { title: "Email", dataIndex: "Email" },
        { title: "Phone", dataIndex: "Phone" },
        { title: "City", dataIndex: "City" },
        { title: "Tags", dataIndex: "Tags" },
        { title: "Status", dataIndex: "Status" },
      ]}
    />
  );
}
