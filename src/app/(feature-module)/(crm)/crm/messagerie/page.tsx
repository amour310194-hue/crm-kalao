import { InboxScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Messagerie" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <InboxScreen />
      </div>
    </div>
  );
}
