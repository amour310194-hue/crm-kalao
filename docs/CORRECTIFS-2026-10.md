# Correctifs audit 6 octobre 2026

Décisions validées le 6 oct. 2026 : bannir le compte démo ; étapes visa 1–10 ; leads = Qualification / Proposition / Négociation / Gagné / Perdu ; écran 2.3 au lot 2 ; masquer « Paie simple » (lot 4) ; **paiements clients hors taxe, aucune taxe applicable**.

## Questions ❓

| # | Décision |
| --- | --- |
| 1.1 bannir `yuki.t@example.com` | ✅ validé, appliqué (`banned_until` 2099, sessions coupées, employé inactive). Sauvegarde `_backup_20261006_demo_admin`. Pas de suppression. |
| 2.3 écran correction des 12 paiements | ✅ au lot 2, après lot 1 en prod |
| 3.1 étapes visa | ✅ les 10 étapes proposées |
| 4.1 étapes leads | ✅ alignées sur les affaires |
| 4.3 Paie simple / timesheets | ✅ masquer l’entrée (lot 4) |
| Taxes | ✅ aucune taxe ; encaissements hors taxe |

## Lot 1 — Sécurité

| Point | Statut | Notes | PR |
| --- | --- | --- | --- |
| 1.1 Compte démo | ✅ fait | Bannissement Auth + backup. | à ouvrir |
| 1.2 Page Sécurité | ✅ fait | Page réelle (mdp, TOTP via `listFactors`, sessions, historique). `mustEnrollMfa` dans `proxy.ts` (aal2). Playwright : `e2e/mfa-direction.spec.ts`. | |
| 1.3 Canaux / JSON | ✅ fait (sauf mail test prod) | JSON toujours renvoyé ; titre page sans double suffixe. Statut Resend = présence de la variable **sur le déploiement qui sert l’API**, jamais la valeur. Mail de test production : ❓ adresse destinataire. | |

### 1.1 après bannissement

- `auth.users.banned_until` = 2099-12-31 23:59:59+00
- `employees.status` = inactive
- Rollback dans l’en-tête de `supabase/migrations/20261006_v37_security_ban_demo.sql`

### Rapport 1.1 — `yuki.t@example.com` (lecture seule)

**Auth** (`auth.users`)

| Champ | Valeur |
| --- | --- |
| id | `0126c15d-f34c-4ed9-9d15-6e3dda178e99` |
| email | `yuki.t@example.com` |
| nom metadata | Admin Kalao |
| créé | 19 sept. 2026, 23:25 UTC (20 sept. 00:25 Africa/Douala) |
| email confirmé | même instant |
| dernière connexion (`last_sign_in_at`) | **23 sept. 2026, 21:19 UTC** (23 sept. 22:19 Africa/Douala) |
| banned_until | null (peut encore se connecter) |
| sessions actives (`auth.sessions`) | **0** |
| identité | `auth.identities` email, id `0417e742-71fd-4feb-a24e-ce4901426b9a` |

**Profil** : `profiles.id` = même UUID, `full_name` = Admin Kalao, **rôle `admin`**, créé 19 sept. 2026 23:25 UTC.

**Employé** : `employees.id` = `394e0ba4-7d98-4fda-afad-dc146cd47432`, `profile_id` lié, email `yuki.t@example.com`, job_title Admin, status **active**, pôle **Direction** (`employee_assignments.is_primary`).

**Journaux**

- `auth.audit_log_entries` : **table vide** (0 ligne). Aucun historique de connexion GoTrue consultable en SQL.
- Journaux ClickHouse Supabase : requête sur la fenêtre du 23 sept. **en échec** (API logs).
- `public.audit_logs` : lignes « Super Admin Kalao » du **19 sept. avant 16:00 UTC**, donc **avant** la création de ce compte (23:25 UTC). Ce n’est **pas** ce user (seed / tests locaux `::1`).

**Références métier** (dossiers, factures, activités, pôles en `head_name`) : **aucune**. Seulement :

| Référence | Lignes |
| --- | --- |
| `employees.profile_id` / email | 1 (fiche Admin Kalao) |
| `employee_assignments` → Direction | 1 |

Pas de `created_by` / `owner_id` sur dépenses, caisse, mails, formulaires, notifications, org_settings, paiements.

**Après OK** : bannir Auth (`banned_until` loin dans le futur) + `signOut` global. Suppression définitive seulement après décision sur la fiche employé Direction.

### Autres comptes Auth (❓ 1.1.6)

| Email | Rôle | Dernière connexion (UTC) |
| --- | --- | --- |
| `amour.okala@groupe-kalao.com` | super_admin | 6 oct. 2026 19:33 |
| `edith.nlend@groupe-kalao.com` | admin | 23 sept. 2026 13:01 |
| `danela.nanda@groupe-kalao.com` | staff | 23 sept. 2026 13:02 |
| `yuki.t@example.com` | admin | 23 sept. 2026 21:19 |

**Seul compte hors `@groupe-kalao.com` : `yuki.t@example.com`.** Aucun autre employé hors ce domaine.

### Seeds `@example.com`

Aucune migration / seed SQL ne recrée `yuki.t@example.com`. Le nom « Admin Kalao » est **protégé** dans `20260929_v33_remove_dummy_staff.sql`. Les `@example.com` restants sont des **maquettes UI** (JSON DreamsCRM, page Sécurité, filtres Utilisateurs, etc.), pas des comptes Auth.

---

## Lot 2 — Factures / montants

⏳ après lot 1 en production. **Aucune taxe** : hors taxe partout ; les écrans GST/CGST ne seront pas branchés, ils seront masqués ou retirés. 2.3 : écran de correction date/mode des 12 paiements importés + MTN / Orange Money.

## Lot 3 — Dossiers visa / clients

⏳ étapes visa validées (10). Migration des 13 dossiers : correspondance à proposer avant écriture.

Non commencé. 3.1 ❓ étapes visa.

## Lot 4 — Tunnel / modules

⏳ leads FR validés. Paie simple : masquer.

Non commencé. 4.1 et 4.3 ❓.

### Tableau modules (aperçu, lot 4.4)

| Module | Branché sur la base ? | Utilisé ? |
| --- | --- | --- |
| Stock | Oui (`stock_locations`, `stock_movements`, trigger dépenses) | Oui si mouvements / achats stock |
| Catalogue | Oui (`catalog_items`) | Oui (devis / affaires / stock) |
| Devis | Oui (`quotes`, `quote_lines`) | Oui |
| Dépenses | Oui (`expenses`) | Oui |
| Fournisseurs | Oui (`companies`, onglet fournisseurs) | Oui (fiche société) |
| Caisse | Oui (`cash_operations`) | Nouveau (oct. 2026) |
| Paie simple / Timesheets | Non (maquette) | Non |

## Lot 5 — Finitions

Non commencé. Titre double Canaux : `layout` template `%s \| Kalao CRM` + title page déjà suffixé.

## À vérifier (écrans non revus le 6 oct.)

État **avant** modification (constat code, 6 oct. 2026) :

| Écran | État réel |
| --- | --- |
| Comptes bancaires | Maquette. Banques indiennes (HDFC, etc.), pas de table CRM. |
| Taxes | Maquette GST / CGST / SGST. |
| Devises | Maquette. Taux type 0,96 (pas 655,957 FCFA). |
| Passerelles de paiement | Maquette. Dizaines de passerelles « Connected » en dur. |
| Sauvegardes | Maquette (fichiers `.sql` fictifs). |
| Sitemap | Maquette. Lien `https://localhost/crms`. |
| Imprimantes | Maquette template. |
| Champs personnalisés | Maquette template. |
| Langues | Maquette template. |
| Stock | Branché (voir lot 4). |
| Catalogue | Branché. |
| Fournisseurs | Branché (`companies`). |
