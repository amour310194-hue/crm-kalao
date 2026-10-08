import { ApprovalsQueue } from "@/components/crm/TunnelScreens";

export const metadata = {
  title: "À valider",
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <ApprovalsQueue />
      </div>
    </div>
  );
}
