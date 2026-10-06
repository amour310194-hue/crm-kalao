import { redirect } from "next/navigation";
import { all_routes } from "@/router/all_routes";

export const metadata = {
  title: "Langue",
};

export default function LanguageWebEdit() {
  redirect(all_routes.languageWeb);
}
