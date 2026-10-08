import { ReconciliationScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Rapprochement" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <ReconciliationScreen />
      </div>
    </div>
  );
}
