import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Avancement chantiers | Groupe Kalao",
};

export default function AvancementPage() {
  return (
    <KalaoListPage
      resource="avancement"
      title="Avancement"
      moduleTitle="BTP"
      columns={[
        { title: "Site Name", dataIndex: "siteName" },
        { title: "Phase", dataIndex: "phase" },
        { title: "Progress", dataIndex: "progress" },
        { title: "Recorded At", dataIndex: "recordedAt" },
        { title: "Note", dataIndex: "note" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
