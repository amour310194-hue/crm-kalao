import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function RevenueSummaryDashboard() {
  redirect(all_routes.dashboard);
}
