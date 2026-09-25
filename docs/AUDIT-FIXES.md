# Audit-fixes — CRM Groupe Kalao

Statuts : ✅ fait · ⏳ en cours · ❓ en attente de réponse · ⏸ pas commencé

Aucune donnée de production n’a été modifiée (factures, paiements, clients). Le SQL v19 est prêt, **non appliqué**.

Canvas diagnostic : `phase-0-diagnostic-crm-kalao.canvas.tsx`
Guide métier : `docs/GUIDE-DOSSIERS-ECHEANCIER.md`

---

## Phase 0 — Diagnostic et sécurité

| Point | Statut | Note |
|-------|--------|------|
| 0.1 Cartographie routes | ✅ | 305 pages, 30 URLs menu, ~275 template. |
| 0.2 Audit RLS | ✅ constat · ⏳ SQL v19 prêt, **non appliqué** | `supabase/migrations/20260925_v19_refonte_socle.sql` (rôles, revoke anon sur dossiers/audit, paie RH). |
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
| Seed V7 TEST | ⏸ ❓ Q3 — pas supprimé en base |
| Menu : masquer dashboards extra, Chat, Pipeline, contrats | ✅ |
| Grep Denwar / Meridian / Playwright e2e | ⏸ |

## Phase 2 — Facturation

| Point | Statut |
|-------|--------|
| Libellé Échéance (liste / grille) | ✅ UI |
| Date de paiement (paiements) | ✅ UI |
| Statuts calculés, avoirs, échéancier | ⏸ schéma non appliqué |
| Numérotation FAC-2026-0001 | ❓ Q4 |
| Mentions PDF | ✅ Kalao Consulting SARL | RCCM CM-NSI-01-2025-B12-01116, NIU M062517806851C, IGS, IBAN Afriland. Pas de Mobile Money dans les pièces. |
| INV-C14 / INV-C06 / dates SO | ❓ scripts après OK — voir le guide |

## Phase 3 — Clients

| Point | Statut |
|-------|--------|
| Particulier vs entreprise | ⏸ |
| Contact C07 | ❓ Q8 — trou de numérotation, pas créé |

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
