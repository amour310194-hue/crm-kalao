import KalaoFiche from "@/components/Pages/kalao/KalaoFiche";

export const metadata = {
  title: "Fiche immigration | Groupe Kalao",
};

export default async function ImmigrationFichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <KalaoFiche
      resource="immigration"
      id={id}
      title="Immigration"
      backHref="/metiers/immigration"
      kind="immigration"
    />
  );
}
