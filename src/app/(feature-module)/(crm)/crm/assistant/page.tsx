import { AssistantScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Assistant" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <AssistantScreen />
      </div>
    </div>
  );
}
