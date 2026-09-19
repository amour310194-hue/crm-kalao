import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Encaissements | Groupe Kalao",
};

export default function Payment() {
  return (
    <KalaoListPage
      resource="payments"
      title="Payments"
      moduleTitle="CRM"
      addLabel="Add"
      columns={[
        { title: "Invoice ID", dataIndex: "invoiceNumber" },
        { title: "Amount", dataIndex: "Amount" },
        { title: "Method", dataIndex: "method" },
        { title: "Created Date", dataIndex: "paidAt" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
