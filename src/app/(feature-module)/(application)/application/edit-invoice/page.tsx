import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export default function EditInvoice() {
  redirect(all_routes.InvoiceList);
}
