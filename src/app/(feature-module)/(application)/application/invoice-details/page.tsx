import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function InvoiceDetails() {
  redirect(all_routes.InvoiceList);
}
