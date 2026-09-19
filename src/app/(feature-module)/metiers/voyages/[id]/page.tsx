import KalaoFiche from "@/components/Pages/kalao/KalaoFiche";

export const metadata = {
  title: "Fiche voyage | Groupe Kalao",
};

export default async function VoyageFichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <KalaoFiche
      resource="travel"
      id={id}
      title="Voyages"
      backHref="/metiers/voyages"
      kind="travel"
    />
  );
}
