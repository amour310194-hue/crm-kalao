import AppUnavailable from "@/components/Pages/kalao/AppUnavailable";
import { all_routes } from "@/router/all_routes";

export const metadata = {
  title: "Chat | CRM Kalao",
};

export default function Chat() {
  return (
    <AppUnavailable
      title="Chat"
      reason="Aucun fournisseur de messagerie n’est branché. Les échanges clients se suivent dans les activités CRM."
      href={all_routes.activities}
      hrefLabel="Ouvrir les activités"
    />
  );
}
