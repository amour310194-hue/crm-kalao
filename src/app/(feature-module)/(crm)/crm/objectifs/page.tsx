import { TargetsScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Objectifs" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <TargetsScreen />
      </div>
    </div>
  );
}
