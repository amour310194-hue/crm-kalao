import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function KanbanView() {
  redirect(all_routes.pipeline);
}
