-- Retirer les fiches seed (Amadou Koffi, Awa Koné et autres chefs de pôle fictifs).

delete from public.conversations
where employee_id in (
  select id from public.employees
  where email = 'amadou.koffi@groupe-kalao.com' and profile_id is null
);

delete from public.employees
where email = 'amadou.koffi@groupe-kalao.com'
  and profile_id is null;

update public.departments
set head_name = null, head_image = null
where head_name is not null
  and head_name not in (
    'Admin Kalao',
    'Amour OKALA',
    'Edith NLEND',
    'Danela Nanda'
  );
