import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Agriculture | Groupe Kalao",
};

export default function AgriculturePage() {
  return (
    <KalaoListPage
      resource="plantations"
      title="Agriculture"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Crop", dataIndex: "crop" },
        { title: "Location", dataIndex: "location" },
        { title: "Hectares", dataIndex: "hectares" },
        { title: "Season", dataIndex: "season" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
