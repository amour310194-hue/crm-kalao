import AppUnavailable from "@/components/Pages/kalao/AppUnavailable";
import { all_routes } from "@/router/all_routes";

export const metadata = {
  title: "Social Feed | CRM Kalao",
};

export default function SocialFeed() {
  return (
    <AppUnavailable
      title="Social"
      reason="Aucun réseau social n’est connecté. Cette maquette n’est pas utilisée par Kalao."
      href={all_routes.dashboard}
      hrefLabel="Retour au tableau de bord"
    />
  );
}
