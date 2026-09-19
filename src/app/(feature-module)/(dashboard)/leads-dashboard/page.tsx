import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function LeadsDashboard() {
  redirect(all_routes.dashboard);
}
