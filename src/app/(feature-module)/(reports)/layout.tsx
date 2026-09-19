import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function ReportsLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  redirect(all_routes.dashboard);
}
