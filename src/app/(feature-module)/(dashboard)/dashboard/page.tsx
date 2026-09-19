import MainDashboardComponent from "@/components/Pages/dashboard/dashboard";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: `Tableau de bord | ${SITE_NAME}`,
};

export default function Dashboard() {
  return (
    <>
    <MainDashboardComponent />
    </>
  );
}
