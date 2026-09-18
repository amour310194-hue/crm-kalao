-- Données de test Groupe Kalao
-- À lancer après schema.sql dans Supabase → SQL Editor

insert into public.companies (id, name, industry, website, phone, email, address, city, country, notes)
values
  ('11111111-1111-4111-8111-111111111001', 'Société Ivoirienne de Négoce', 'Commerce', 'https://sin-ci.example', '+225 27 20 30 10 01', 'contact@sin-ci.example', 'Boulevard de la République', 'Abidjan', 'Côte d''Ivoire', 'Client VIP négoce'),
  ('11111111-1111-4111-8111-111111111002', 'Agro Kalao SARL', 'Agroalimentaire', 'https://agrokalao.example', '+225 27 21 44 20 12', 'hello@agrokalao.example', 'Zone industrielle Yopougon', 'Abidjan', 'Côte d''Ivoire', null),
  ('11111111-1111-4111-8111-111111111003', 'Atlantic Services CI', 'Services', 'https://atlantic-ci.example', '+225 07 08 12 34 56', 'info@atlantic-ci.example', 'Cocody Riviera', 'Abidjan', 'Côte d''Ivoire', null),
  ('11111111-1111-4111-8111-111111111004', 'Hôtel Baobab', 'Hôtellerie', 'https://hotelbaobab.example', '+221 33 822 10 20', 'reservation@hotelbaobab.example', 'Corniche Ouest', 'Dakar', 'Sénégal', 'Compte VIP'),
  ('11111111-1111-4111-8111-111111111005', 'TransAfrique Logistique', 'Logistique', 'https://transafrique.example', '+225 27 22 55 40 18', 'ops@transafrique.example', 'Port autonome', 'Abidjan', 'Côte d''Ivoire', null),
  ('11111111-1111-4111-8111-111111111006', 'Clinique des Palmiers', 'Santé', 'https://palmiers-sante.example', '+225 27 22 41 33 09', 'accueil@palmiers-sante.example', 'Marcory Zone 4', 'Abidjan', 'Côte d''Ivoire', null),
  ('11111111-1111-4111-8111-111111111007', 'Énergie Soleil SA', 'Énergie', 'https://energiesoleil.example', '+226 25 30 12 40', 'projets@energiesoleil.example', 'Ouaga 2000', 'Ouagadougou', 'Burkina Faso', 'Compte inactif'),
  ('11111111-1111-4111-8111-111111111008', 'Boutique Niani', 'Retail', 'https://niani.example', '+223 20 22 18 40', 'boutique@niani.example', 'Avenue de l''Indépendance', 'Bamako', 'Mali', null)
on conflict (id) do nothing;

insert into public.contacts (id, company_id, first_name, last_name, email, phone, job_title)
values
  ('22222222-2222-4222-8222-222222222001', '11111111-1111-4111-8111-111111111001', 'Aminata', 'Kouassi', 'a.kouassi@sin-ci.example', '+225 07 01 22 33 44', 'Directrice des achats'),
  ('22222222-2222-4222-8222-222222222002', '11111111-1111-4111-8111-111111111002', 'Koffi', 'Yao', 'k.yao@agrokalao.example', '+225 05 12 44 55 66', 'Responsable exploitation'),
  ('22222222-2222-4222-8222-222222222003', '11111111-1111-4111-8111-111111111003', 'Mariama', 'Sow', 'm.sow@atlantic-ci.example', '+225 01 23 45 67 89', 'Chef de projet'),
  ('22222222-2222-4222-8222-222222222004', '11111111-1111-4111-8111-111111111004', 'Abdoulaye', 'Diop', 'a.diop@hotelbaobab.example', '+221 77 123 45 67', 'Directeur général'),
  ('22222222-2222-4222-8222-222222222005', '11111111-1111-4111-8111-111111111005', 'Sandrine', 'Mensah', 's.mensah@transafrique.example', '+225 07 88 99 00 11', 'Responsable logistique'),
  ('22222222-2222-4222-8222-222222222006', '11111111-1111-4111-8111-111111111006', 'Paul', 'Bamba', 'p.bamba@palmiers-sante.example', '+225 05 44 33 22 11', 'Directeur médical'),
  ('22222222-2222-4222-8222-222222222007', '11111111-1111-4111-8111-111111111007', 'Salimata', 'Ouédraogo', 's.ouedraogo@energiesoleil.example', '+226 70 12 34 56', 'Ingénieure projets'),
  ('22222222-2222-4222-8222-222222222008', '11111111-1111-4111-8111-111111111008', 'Mamadou', 'Keita', 'm.keita@niani.example', '+223 76 54 32 10', 'Gérant')
on conflict (id) do nothing;

insert into public.leads (id, company_id, contact_id, title, source, status, estimated_value)
values
  ('33333333-3333-4333-8333-333333333001', '11111111-1111-4111-8111-111111111001', '22222222-2222-4222-8222-222222222001', 'Renouvellement stock négoce T4', 'Salon professionnel', 'qualified', 185000),
  ('33333333-3333-4333-8333-333333333002', '11111111-1111-4111-8111-111111111002', '22222222-2222-4222-8222-222222222002', 'Ligne de conditionnement riz', 'Site web', 'contacted', 92000),
  ('33333333-3333-4333-8333-333333333003', '11111111-1111-4111-8111-111111111003', '22222222-2222-4222-8222-222222222003', 'Audit organisation commerciale', 'Recommandation', 'new', 24000),
  ('33333333-3333-4333-8333-333333333004', '11111111-1111-4111-8111-111111111004', '22222222-2222-4222-8222-222222222004', 'Équipement hôtelier + maintenance', 'Appel sortant', 'qualified', 156000),
  ('33333333-3333-4333-8333-333333333005', '11111111-1111-4111-8111-111111111005', '22222222-2222-4222-8222-222222222005', 'Prestations logistiques portuaires', 'Partenaire', 'converted', 78000),
  ('33333333-3333-4333-8333-333333333006', '11111111-1111-4111-8111-111111111006', '22222222-2222-4222-8222-222222222006', 'Contrats de service clinique', 'E-mail', 'contacted', 41000),
  ('33333333-3333-4333-8333-333333333007', '11111111-1111-4111-8111-111111111007', '22222222-2222-4222-8222-222222222007', 'Kit solaire 50 kW', 'Salon professionnel', 'unqualified', 210000),
  ('33333333-3333-4333-8333-333333333008', '11111111-1111-4111-8111-111111111008', '22222222-2222-4222-8222-222222222008', 'Uniformes et signalétique boutique', 'Site web', 'new', 12500)
on conflict (id) do nothing;

insert into public.catalog_items (id, kind, name, sku, description, category, unit_price, tax_rate, status, unit, billing_type)
values
  ('44444444-4444-4444-8444-444444444001', 'product', 'Groupe électrogène 10 kVA', 'PRD-GEN-10', 'Groupe électrogène diesel pour sites tertiaires.', 'Équipement', 2850, 18, 'active', 'unité', null),
  ('44444444-4444-4444-8444-444444444002', 'product', 'Palette riz 25 kg (50 sacs)', 'PRD-RIZ-25', 'Palette de riz parfumé pour revente.', 'Négoce', 980, 18, 'active', 'palette', null),
  ('44444444-4444-4444-8444-444444444003', 'product', 'Uniformes entreprise (lot 20)', 'PRD-UNI-20', 'Tenues professionnelles brodées Groupe Kalao.', 'Textile', 420, 18, 'active', 'lot', null),
  ('44444444-4444-4444-8444-444444444004', 'product', 'Imprimante thermique caisse', 'PRD-IMP-TH', 'Imprimante tickets pour points de vente.', 'Matériel', 185, 18, 'active', 'unité', null),
  ('44444444-4444-4444-8444-444444444005', 'product', 'Panneau solaire 550 W', 'PRD-SOL-550', 'Module photovoltaïque monocristallin.', 'Énergie', 145, 18, 'active', 'unité', null),
  ('44444444-4444-4444-8444-444444444006', 'service', 'Installation et mise en service', 'SRV-INST-01', 'Pose, tests et formation utilisateurs.', 'Prestations', 650, 18, 'active', 'forfait', 'one_time'),
  ('44444444-4444-4444-8444-444444444007', 'service', 'Contrat de maintenance annuel', 'SRV-MAINT-12', 'Visites préventives et assistance prioritaire.', 'Prestations', 2400, 18, 'active', 'an', 'yearly'),
  ('44444444-4444-4444-8444-444444444008', 'service', 'Formation équipes commerciales', 'SRV-FORM-COM', 'Atelier de 2 jours sur le process de vente Kalao.', 'Formation', 890, 18, 'active', 'session', 'one_time'),
  ('44444444-4444-4444-8444-444444444009', 'service', 'Audit organisationnel', 'SRV-AUDIT-01', 'Diagnostic commercial et plan d''actions 90 jours.', 'Conseil', 1800, 18, 'active', 'forfait', 'one_time'),
  ('44444444-4444-4444-8444-444444444010', 'service', 'Prestation logistique portuaire', 'SRV-LOG-PORT', 'Manutention, stockage temporaire et acheminement.', 'Logistique', 320, 18, 'active', 'jour', 'daily')
on conflict (sku) do nothing;

insert into public.deals (id, title, company_id, contact_id, lead_id, stage, amount, probability, expected_close_date)
values
  ('55555555-5555-4555-8555-555555555001', 'Pack négoce + formation', '11111111-1111-4111-8111-111111111001', '22222222-2222-4222-8222-222222222001', '33333333-3333-4333-8333-333333333001', 'negotiation', 185000, 80, '2026-09-30'),
  ('55555555-5555-4555-8555-555555555002', 'Conditionneuse Agro Kalao', '11111111-1111-4111-8111-111111111002', '22222222-2222-4222-8222-222222222002', '33333333-3333-4333-8333-333333333002', 'proposal', 92000, 55, '2026-10-12'),
  ('55555555-5555-4555-8555-555555555003', 'Audit Atlantic Services', '11111111-1111-4111-8111-111111111003', '22222222-2222-4222-8222-222222222003', '33333333-3333-4333-8333-333333333003', 'qualification', 24000, 40, '2026-10-20'),
  ('55555555-5555-4555-8555-555555555004', 'Hôtel Baobab — équipement', '11111111-1111-4111-8111-111111111004', '22222222-2222-4222-8222-222222222004', '33333333-3333-4333-8333-333333333004', 'negotiation', 156000, 70, '2026-10-05'),
  ('55555555-5555-4555-8555-555555555005', 'Contrat logistique TransAfrique', '11111111-1111-4111-8111-111111111005', '22222222-2222-4222-8222-222222222005', '33333333-3333-4333-8333-333333333005', 'won', 78000, 100, '2026-09-18'),
  ('55555555-5555-4555-8555-555555555006', 'Maintenance Clinique des Palmiers', '11111111-1111-4111-8111-111111111006', '22222222-2222-4222-8222-222222222006', '33333333-3333-4333-8333-333333333006', 'qualification', 41000, 35, '2026-10-28'),
  ('55555555-5555-4555-8555-555555555007', 'Centrale solaire 50 kW', '11111111-1111-4111-8111-111111111007', '22222222-2222-4222-8222-222222222007', '33333333-3333-4333-8333-333333333007', 'lost', 210000, 0, '2026-09-15'),
  ('55555555-5555-4555-8555-555555555008', 'Identité visuelle Boutique Niani', '11111111-1111-4111-8111-111111111008', '22222222-2222-4222-8222-222222222008', '33333333-3333-4333-8333-333333333008', 'qualification', 12500, 60, '2026-10-08')
on conflict (id) do nothing;

insert into public.quotes (id, number, deal_id, company_id, contact_id, status, valid_until)
values
  ('66666666-6666-4666-8666-666666666001', 'DEV-2026-001', '55555555-5555-4555-8555-555555555001', '11111111-1111-4111-8111-111111111001', '22222222-2222-4222-8222-222222222001', 'sent', '2026-10-04'),
  ('66666666-6666-4666-8666-666666666002', 'DEV-2026-002', '55555555-5555-4555-8555-555555555002', '11111111-1111-4111-8111-111111111002', '22222222-2222-4222-8222-222222222002', 'draft', '2026-10-07'),
  ('66666666-6666-4666-8666-666666666003', 'DEV-2026-003', '55555555-5555-4555-8555-555555555004', '11111111-1111-4111-8111-111111111004', '22222222-2222-4222-8222-222222222004', 'sent', '2026-10-11'),
  ('66666666-6666-4666-8666-666666666004', 'DEV-2026-004', '55555555-5555-4555-8555-555555555005', '11111111-1111-4111-8111-111111111005', '22222222-2222-4222-8222-222222222005', 'accepted', '2026-10-12'),
  ('66666666-6666-4666-8666-666666666005', 'DEV-2026-005', '55555555-5555-4555-8555-555555555006', '11111111-1111-4111-8111-111111111006', '22222222-2222-4222-8222-222222222006', 'sent', '2026-10-15'),
  ('66666666-6666-4666-8666-666666666006', 'DEV-2026-006', '55555555-5555-4555-8555-555555555008', '11111111-1111-4111-8111-111111111008', '22222222-2222-4222-8222-222222222008', 'draft', '2026-10-17')
on conflict (number) do nothing;

insert into public.invoices (id, number, company_id, project, due_date, amount, paid_amount, status)
values
  ('77777777-7777-4777-8777-777777777001', 'FAC-2026-001', '11111111-1111-4111-8111-111111111005', 'Contrat logistique', '2026-09-30', 78000, 78000, 'paid'),
  ('77777777-7777-4777-8777-777777777002', 'FAC-2026-002', '11111111-1111-4111-8111-111111111001', 'Acompte négoce', '2026-10-10', 91080, 45000, 'partially_paid'),
  ('77777777-7777-4777-8777-777777777003', 'FAC-2026-003', '11111111-1111-4111-8111-111111111003', 'Audit commercial', '2026-10-05', 24000, 0, 'unpaid'),
  ('77777777-7777-4777-8777-777777777004', 'FAC-2026-004', '11111111-1111-4111-8111-111111111004', 'Équipement hôtel', '2026-09-01', 52000, 0, 'overdue'),
  ('77777777-7777-4777-8777-777777777005', 'FAC-2026-005', '11111111-1111-4111-8111-111111111006', 'Maintenance clinique', '2026-10-20', 2400, 2400, 'paid'),
  ('77777777-7777-4777-8777-777777777006', 'FAC-2026-006', '11111111-1111-4111-8111-111111111002', 'Conditionnement', '2026-10-18', 46550, 20000, 'partially_paid')
on conflict (number) do nothing;

insert into public.activities (id, type, subject, company_id, contact_id, deal_id, due_at, notes)
values
  ('88888888-8888-4888-8888-888888888001', 'call', 'Appel de qualification — SIN', '11111111-1111-4111-8111-111111111001', '22222222-2222-4222-8222-222222222001', '55555555-5555-4555-8555-555555555001', '2026-09-18 09:30+00', 'Confirmer volumes T4 et délai de livraison.'),
  ('88888888-8888-4888-8888-888888888002', 'meeting', 'Visite site Agro Kalao', '11111111-1111-4111-8111-111111111002', '22222222-2222-4222-8222-222222222002', '55555555-5555-4555-8555-555555555002', '2026-09-19 14:00+00', 'Présenter la conditionneuse et le contrat de maintenance.'),
  ('88888888-8888-4888-8888-888888888003', 'email', 'Envoi devis Hôtel Baobab', '11111111-1111-4111-8111-111111111004', '22222222-2222-4222-8222-222222222004', '55555555-5555-4555-8555-555555555004', '2026-09-18 16:00+00', 'Joindre fiche produits et planning d''installation.'),
  ('88888888-8888-4888-8888-888888888004', 'task', 'Relance facture Hôtel Baobab', '11111111-1111-4111-8111-111111111004', '22222222-2222-4222-8222-222222222004', '55555555-5555-4555-8555-555555555004', '2026-09-20 11:00+00', 'Facture FAC-2026-004 en retard.'),
  ('88888888-8888-4888-8888-888888888005', 'note', 'Contrat TransAfrique signé', '11111111-1111-4111-8111-111111111005', '22222222-2222-4222-8222-222222222005', '55555555-5555-4555-8555-555555555005', '2026-09-18 08:00+00', 'Affaire gagnée, lancement opérationnel semaine 39.'),
  ('88888888-8888-4888-8888-888888888006', 'call', 'Premier contact Boutique Niani', '11111111-1111-4111-8111-111111111008', '22222222-2222-4222-8222-222222222008', '55555555-5555-4555-8555-555555555008', '2026-09-19 10:15+00', 'Besoin uniformes + signalétique vitrine.')
on conflict (id) do nothing;
