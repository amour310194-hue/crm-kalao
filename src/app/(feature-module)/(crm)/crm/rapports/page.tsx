import { ReportsScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Rapports" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <ReportsScreen />
      </div>
    </div>
  );
}
