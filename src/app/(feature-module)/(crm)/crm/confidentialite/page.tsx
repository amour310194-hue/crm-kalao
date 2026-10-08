import { PrivacyScreen } from "@/components/crm/Prompt3Screens";

export const metadata = { title: "Confidentialité" };

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <PrivacyScreen />
      </div>
    </div>
  );
}
