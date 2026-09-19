import ClientFiche from "@/components/Pages/kalao/ClientFiche";

export const metadata = {
  title: "Fiche client | Groupe Kalao",
};

export default async function ClientFichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientFiche id={id} />;
}
