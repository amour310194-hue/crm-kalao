# Audit-fixes — CRM Groupe Kalao

Statuts : ✅ fait · ⏳ en cours · ❓ en attente de réponse · ⏸ pas commencé

Aucune donnée métier n’a été supprimée. v19 n’a pas été appliquée sous ce nom : le contenu utile est dans v20. v21–v25 appliquées.

Canvas diagnostic : `phase-0-diagnostic-crm-kalao.canvas.tsx`
Guide métier : `docs/GUIDE-DOSSIERS-ECHEANCIER.md`

SQL v20 (`v20_caisse_et_socle`) appliqué en production le 25 sept. 2026 : backup `_backup_20260925_*`, C14 réaffecté, C06 annulé + avoir, C14-BA conditionnel, échéances SO, seed V7 TEST retiré.

## Prompt sécurité 25 sept. 2026

| Point | Statut | Preuve |
|-------|--------|--------|
| 1.1 Reset MDP | ✅ | Vitest : email obligatoire, 5 essais, 15 min, hash timing-safe. 429 testé. `listUsers` retiré. |
| 1.2 Inbound signé | ✅ | POST non signé → 401. Svix + `INBOUND_FORWARD_SECRET`. RPC anon révoqué (v22). |
| 1.3 Envoi mail ACL | ✅ | `authorizeSender` : staff sans ACL / usurpation → 403. Quota 100/h. `mail_send_log`. |
| 1.4 Auth serveur | ✅ | `curl /dashboard` → 307 `/login`. `@supabase/ssr` cookies. `requireUser` unique. |
| 1.5 2FA / sessions | ⏸ ❓ Q2 | Page `/mfa-setup`, idle 12 h + max 7 j. `MFA_ENFORCE` éteint : Amour/Edith non verrouillés. |
| 1.6 CSP | ✅ | `unsafe-eval` retiré en production. Conservé en dev (React Fast Refresh). `unsafe-inline` reste (Bootstrap du template). |
| 2.1 Baseline schéma | ⏸ | `schema.sql` n’est plus un dump exécutable. `db pull` non fait (CLI). Source de vérité = migrations v0–v25. |
| 2.2 Matrice RLS | ✅ | v24 appliquée : 0 `authenticated_all`, anon révoqué, pas de DELETE invoices/payments, `profiles.role` protégé. |
| 2.3 Contrôles client | ✅ | `assertCanDelete` = affichage. Barrière = RLS. |
| 3.1 Paiements | ✅ | v25 : `status` valide/annule. `markInvoiceUnpaid` n’efface plus. Totaux inchangés : 20 850 000 FCFA. |
| 3.2–3.4, 4–7 | ⏸ | Formulaire d’encaissement, FAC ❓ Q4, KPI RPC, ménage template, CI, immigration. |

Q1 n0c_forward : conservé derrière secret (pas d’OK pour le supprimer).

---

## Phase 0 — Diagnostic et sécurité

| Point | Statut | Note |
|-------|--------|------|
| 0.1 Cartographie routes | ✅ | 305 pages, 30 URLs menu, ~275 template. |
| 0.2 Audit RLS | ✅ | `supabase/migrations/20260925_v20_caisse_et_socle.sql` appliqué (rôles, revoke anon, paie RH, cancelled, is_conditional). |
| 0.3 KPI sans pay_runs + fuseau Douala | ✅ | `src/lib/kpi.ts` — mois et « aujourd’hui » en Africa/Douala. |
| 0.4 2FA TOTP obligatoire | ⏸ ❓ Q10 | 5 échecs / 30 s. Remember Me décoché. Pas de 2FA (verrouillerait Amour/Edith). |
| 0.5 En-têtes CSP/HSTS | ✅ | `next.config.ts`. Template → `/error-404`. `/deals-dashboard` → `/dashboard`. |
| 0.6 audit_log triggers | ⏸ | Table trop ouverte ; pas de trigger tant que le schéma n’est pas figé. |
| Maquette interdite | ✅ | `useLiveRows` + graphes sans fallback Inpipeline / 495K. |
| Tableau de bord unique | ✅ | `/dashboard` : encaissé, impayés, dossiers, échéances. |
| Activités : plus d’IA Meridian | ✅ | Compteurs réel retard / jour / 7 j. Colonnes FR. |
| Titres CRMS → Kalao CRM | ✅ | 305 `page.tsx`. |
| Login FR | ✅ | Logo Kalao, bouton loading, redirection `/dashboard`. |
| API mail authentifiée | ✅ | Bearer session. |

## Phase 1 — Contenu factice

| Point | Statut |
|-------|--------|
| Dashboard graphes démo | ✅ plus de 495K / 147 affaires / Organic Search |
| Activities panneau IA | ✅ remplacé par compteurs |
| Seed V7 TEST | ✅ activité test retirée (v20) |
| Menu : masquer dashboards extra, Chat, Pipeline, contrats | ✅ |
| Grep Denwar / Meridian / Playwright e2e | ⏸ |

## Phase 2 — Facturation

| Point | Statut |
|-------|--------|
| Libellé Échéance (liste / grille) | ✅ UI |
| Date de paiement (paiements) | ✅ UI |
| Statuts calculés, avoirs, échéancier | ✅ cancelled + is_conditional + credit_notes (v20) |
| Numérotation FAC-2026-0001 | ❓ Q4 |
| Mentions PDF | ✅ Kalao Consulting SARL | RCCM CM-NSI-01-2025-B12-01116, NIU M062517806851C, IGS, IBAN Afriland. Pas de Mobile Money dans les pièces. |
| INV-C14 / INV-C06 / dates SO | ✅ C14-AV partiel 900k, C14-SO impayée, C06 annulée, SO due_date = fin dossier |

## Phase 3 — Clients

| Point | Statut |
|-------|--------|
| Particulier vs entreprise | ⏸ |
| Contact C07 | ❓ Q8 — trou de numérotation, pas créé |

## Messagerie (26 sept. 2026) — voir `docs/MESSAGERIE.md`

| Point de l'audit mail | Statut |
|---|---|
| Ouvrir la boîte envoyait un vrai mail client (`remindDueVisaActivities`) | ✅ supprimé ; remplacé par des relances serveur J-3 / J+7, une fois par facture, en simulation par défaut |
| Historique écrit par le navigateur, falsifiable | ✅ INSERT/UPDATE/DELETE révoqués pour `authenticated` ; écriture uniquement par l'API (v26) |
| Mail parti sans trace si l'onglet se ferme | ✅ ligne créée côté serveur avant l'appel Resend |
| `x-vercel-cron` accepté seul sur la synchronisation | ✅ `CRON_SECRET` ou session, 1 synchronisation par minute |
| Adresse inconnue rangée dans Contact | ✅ file « À trier » réservée aux admins |
| Chargement de toute la boîte, 1000 lignes max, recherche locale | ✅ `mail_threads` / `mail_counts` : pagination et recherche plein texte côté base |
| Pièces jointes reçues ignorées, envoyées limitées à ~3 Mo | ✅ stockage privé, 25 Mo, URL signées |
| Pas de fils, un seul destinataire, texte brut | ✅ In-Reply-To/References, À/Cc/Cci, éditeur riche, HTML nettoyé |
| Lu / supprimé partagé pour tous, pas d'attribution | ✅ état lu/suivi/important/en attente par personne ; attribution |
| « Envoyé » ≠ « reçu » | ✅ événements Resend de livraison, adresses rejetées bloquées |
| Pied de mail « Répondez » sur no-reply, List-Unsubscribe-Post invalide | ✅ gabarit selon le type d'envoi, en-tête retiré |
| DMARC absent du diagnostic | ✅ DMARC + SPF du sous-domaine `send` |
| Contenu de démo, dossiers en anglais, page `email-reply` | ✅ ancien écran supprimé (-3 000 lignes), tout en français, redirection |
| Build Vercel cassé par les routes reset (PR #2) | ✅ logique déplacée dans `src/lib/reset-*-handler.ts` |

## Phases 4–7

⏸ pipeline visa 10 étapes en base, tunnel lead→devis, 2FA, SMS/WhatsApp ❓ Q9, e2e.

---

## Comptes auth observés (ne pas confondre avec les rôles du prompt)

| Nom | Rôle actuel |
|-----|-------------|
| Amour OKALA | super_admin |
| Edith NLEND | admin |
| Admin Kalao | admin |
| Danela Nanda | staff |
