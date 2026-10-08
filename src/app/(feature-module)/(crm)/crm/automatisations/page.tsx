import { AutomationsScreen } from "@/components/crm/TunnelScreens";

export const metadata = {
  title: "Automatisations",
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <AutomationsScreen />
      </div>
    </div>
  );
}
