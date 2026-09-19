import AppUnavailable from "@/components/Pages/kalao/AppUnavailable";
import { all_routes } from "@/router/all_routes";

export const metadata = {
  title: "Appel audio | CRM Kalao",
};

export default function AudioCall() {
  return (
    <AppUnavailable
      title="Appels"
      reason="Aucun opérateur téléphonique n’est branché. Les appels se journalisent dans les activités CRM."
      href={all_routes.activities}
      hrefLabel="Ouvrir les activités"
    />
  );
}
