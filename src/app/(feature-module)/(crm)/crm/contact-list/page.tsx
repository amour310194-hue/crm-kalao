import { Suspense } from "react";
import ContactsListComponent from "@/components/Pages/crm-module/contacts/contactsList";

export const metadata = {
  title: "Clients",
};

export default function ContactList(){
    return(
        <Suspense>
          <ContactsListComponent />
        </Suspense>
    )
}