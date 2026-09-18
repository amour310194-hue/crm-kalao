import LoginComponent from "@/components/Authentication/login/login";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: `Connexion | ${SITE_NAME}`,
  description: "Accédez au CRM Groupe Kalao",
};

export default function Home() {
  return <LoginComponent />;
}
