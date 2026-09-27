-- Lecture publique des formulaires publiés uniquement (page /l/[slug] + iframe vitrine).
-- Aucune écriture anon : les soumissions passent toujours par le service-role serveur.

create policy capture_forms_anon_select_published
  on public.capture_forms
  for select to anon
  using (status = 'published');

grant select on table public.capture_forms to anon;
