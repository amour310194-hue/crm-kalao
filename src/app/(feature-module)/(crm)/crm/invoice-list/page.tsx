import { Suspense } from "react";
import InvoicesListComponent from "@/components/Pages/crm-module/invoices/invoicesList";

export const metadata = {
  title: "Invoices List",
};

export default function InvoicesList() {
  return (
    <Suspense>
      <InvoicesListComponent />
    </Suspense>
  );
}