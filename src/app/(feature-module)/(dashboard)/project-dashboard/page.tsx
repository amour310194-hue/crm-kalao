import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function ProjectDashboard() {
  redirect(all_routes.dashboard);
}
