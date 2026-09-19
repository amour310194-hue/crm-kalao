import { Suspense } from "react";
import ContactsDetailsComponent from "@/components/Pages/crm-module/contacts/contactsDetails";

export const metadata = {
  title: "Contact Details | CRM Kalao",
};

export default function ContactDetails() {
  return (
    <Suspense fallback={null}>
      <ContactsDetailsComponent />
    </Suspense>
  );
}
