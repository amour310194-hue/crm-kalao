-- Clients = contacts (personne ou entreprise). Fournisseurs = companies.party_role = supplier.
-- Les fiches companies deja utilisees comme clients (particuliers) restent party_role = client
-- pour ne pas apparaitre dans l'onglet Fournisseurs.

alter table public.companies
  add column if not exists party_role text;

update public.companies
set party_role = 'client'
where party_role is null;

alter table public.companies
  alter column party_role set default 'supplier';

alter table public.companies
  alter column party_role set not null;

alter table public.companies
  drop constraint if exists companies_party_role_check;

alter table public.companies
  add constraint companies_party_role_check
  check (party_role in ('supplier', 'client'));

update public.contacts
set account_type = 'person'
where account_type is null
   or lower(account_type) in ('particulier', 'person', 'personne');

update public.contacts
set account_type = 'company'
where lower(coalesce(account_type, '')) in ('company', 'entreprise', 'societe', 'société');

alter table public.contacts
  alter column account_type set default 'person';

alter table public.contacts
  drop constraint if exists contacts_account_type_check;

alter table public.contacts
  add constraint contacts_account_type_check
  check (account_type in ('person', 'company'));
