-- Kalao Consulting : Cameroun + FCFA. Les entreprises sont au Cameroun.

alter table public.companies alter column country set default 'Cameroun';
alter table public.departments alter column location set default 'Douala';

update public.companies
set
  country = 'Cameroun',
  city = case name
    when 'Bâtir Ensemble SARL' then 'Yaoundé'
    when 'Boutique Niani' then 'Yaoundé'
    when 'Foncier Lagune' then 'Yaoundé'
    when 'Hôtel Baobab' then 'Kribi'
    when 'Plantation N''Zi' then 'Bafoussam'
    when 'Énergie Soleil SA' then 'Garoua'
    else 'Douala'
  end,
  address = case name
    when 'Agro Kalao SARL' then 'Zone industrielle Bassa'
    when 'Atlantic Services CI' then 'Bonanjo'
    when 'Bâtir Ensemble SARL' then 'Mvog-Ada'
    when 'Boutique Niani' then 'Avenue Kennedy'
    when 'Clinique des Palmiers' then 'Akwa'
    when 'Énergie Soleil SA' then 'Quartier Plateau'
    when 'Foncier Lagune' then 'Bastos'
    when 'Hôtel Baobab' then 'Corniche'
    when 'Plantation N''Zi' then 'Route de Foumban'
    when 'Société Ivoirienne de Négoce' then 'Boulevard de la République'
    when 'TransAfrique Logistique' then 'Port autonome de Douala'
    else address
  end,
  phone = case name
    when 'Agro Kalao SARL' then '+237 233 44 20 12'
    when 'Atlantic Services CI' then '+237 6 98 12 34 56'
    when 'Bâtir Ensemble SARL' then '+237 222 18 40 10'
    when 'Boutique Niani' then '+237 222 22 18 40'
    when 'Clinique des Palmiers' then '+237 233 41 33 09'
    when 'Énergie Soleil SA' then '+237 222 30 12 40'
    when 'Foncier Lagune' then '+237 6 71 22 33 00'
    when 'Hôtel Baobab' then '+237 233 46 10 20'
    when 'Plantation N''Zi' then '+237 6 76 77 88 99'
    when 'Société Ivoirienne de Négoce' then '+237 233 42 10 01'
    when 'TransAfrique Logistique' then '+237 233 55 40 18'
    else phone
  end;

update public.departments
set location = 'Douala'
where location is distinct from 'Douala';

update public.employees
set phone = '+237 6 70 00 00 00'
where phone like '+225%';
