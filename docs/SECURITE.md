# Sécurité

Le compte démo `admin@example.com` reste banni jusqu'en 2099. Sa fiche profil et sa fiche employé ne sont pas supprimées.

Une session expire après 12 heures sans activité. Cinq échecs rapprochés, ou vingt depuis la même adresse en quinze minutes, bloquent une nouvelle tentative. Une connexion depuis un appareil encore inconnu envoie un e-mail si Resend est configuré sur le déploiement.

La double authentification est exigée pour super admin, admin, direction, finance et RH. La page Sécurité lit le statut réel (mot de passe, TOTP, sessions, trente dernières connexions).

Les salaires, primes et numéro de passeport d'un employé ne sont modifiables que par la direction, la finance ou les RH. La vue `employees_staff` les masque pour les autres rôles. Le passeport d'un client visa reste visible du personnel qui traite le dossier.

Les pièces jointes sont conservées cinq ans. L'écran Confidentialité liste celles qui arrivent à échéance dans trente jours. Aucune suppression automatique n'est lancée.

Les tables de sauvegarde (`_backup_*`, `_bak_*`) ne sont plus lisibles par l'API. Aucune sauvegarde chiffrée hors Supabase n'est en place : l'écran le dit, il n'affiche pas un succès inventé.

Les en-têtes HTTP (CSP, HSTS, frame-ancestors, Referrer-Policy, Permissions-Policy) sont posés par le serveur.

Registre des traitements : clients et dossiers visa (KALAO CONSULTING SARL, Douala), factures et encaissements, pièces d'identité conservées cinq ans, messagerie. Export ou suppression sur demande depuis Confidentialité, après validation direction.
