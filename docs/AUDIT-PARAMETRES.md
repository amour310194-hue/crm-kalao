# Audit des Paramètres CRM (29/09/2026)

Légende : ✅ fait · ⏳ en cours · ❓ attend le propriétaire · ☐ non commencé

| Écran | Statut |
|---|---|
| Canaux et clés API (ex-Connected Apps) | ✅ plus de faux « Connected » ; saisie chiffrée |
| Email Settings | ✅ déjà réel (Resend) — cartes PHP/SMTP factices encore à retirer |
| Profile | ☐ brancher sur profiles/employees |
| Security | ☐ réécrire (2FA réelle, sessions) — urgent |
| Notifications (réglages) | ⏳ cloche réelle existe ; cases du template pas encore branchées |
| Company / Localization / Prefixes / Preference | ☐ |
| Language | ☐ FR/EN réels |
| Invoice / Printer / Custom fields | ☐ Printer à supprimer |
| SMS Gateways | ⏳ champs clés créés, pas d’envoi |
| GDPR | ☐ |
| Payment Gateways / Bank / Tax / Currencies | ☐ |
| Sitemap / Cron / Backups / Cache… | ☐ retirer les faux fichiers |

Les questions ❓ (TVA, NIU, agrégateur, etc.) sont listées dans `docs/INTEGRATIONS.md`.
