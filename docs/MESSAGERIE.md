# Messagerie du CRM Kalao

Module type Gmail / Outlook, sur `/application/email`. Il remplace l'ancien écran du template.

## Ce qu'il fait

| Domaine | Fonctions |
|---|---|
| Boîtes | Contact et No-reply (partagées selon l'ACL), Ma boîte (privée), **À trier** : les adresses inconnues, visibles par les admins seulement |
| Dossiers | Réception, Suivis, En attente, Importants, Envoyés, Programmés, Brouillons, Attribués à moi, Non lus, Tous les messages, Archives, Spam, Corbeille, avec des compteurs de non-lus |
| Liste | Conversations regroupées, « Edith, moi (3) », extrait, libellés, attribution, pièce jointe, alerte « Non délivré », sélection multiple (y compris Maj+clic), actions groupées, pagination côté serveur |
| Lecture | Volet à droite (Outlook) ou plein écran (Gmail). Messages repliés sauf le dernier et les non-lus. HTML affiché dans un cadre isolé et nettoyé (DOMPurify), images distantes bloquées jusqu'à « Afficher les images ». Pièces jointes à ouvrir ou télécharger. Détails (De, À, Cc, Cci, SPF/DKIM/DMARC). Liens vers la fiche contact et le dossier |
| Rédaction | Fenêtres flottantes (réduire, plein écran, jusqu'à 3), À/Cc/Cci en pastilles avec autocomplétion (contacts, entreprises, collègues), éditeur riche, signature, modèles avec variables, glisser-déposer des fichiers jusqu'à 25 Mo, brouillon enregistré automatiquement, alerte « pièce jointe mentionnée mais absente », Ctrl+Entrée |
| Envoi | Délai « Annuler » (0 à 30 s), envoi programmé (annulable), en-têtes In-Reply-To et References (le client voit une réponse, pas un nouveau fil), suivi réel de la livraison (délivré, rejeté, signalé comme spam) et blocage des adresses rejetées |
| Organisation | Libellés personnels ou partagés, mise en attente jusqu'à une date, attribution à un collègue, déplacement, archivage, spam, corbeille avec restauration |
| Recherche | Plein texte dans la base et opérateurs `de:` `à:` `objet:` `has:attachment` `is:unread` `après:` `avant:` `newer_than:7d` `label:` `in:`, plus un panneau de recherche avancée |
| Temps réel | Nouveau mail affiché sans recharger, notification, compteur dans l'onglet et dans l'en-tête du CRM, notifications du bureau en option |
| Clavier | `c` `/` `j` `k` `o` `u` `e` `#` `!` `r` `a` `f` `s` `x` `Maj+i` `Maj+u` `g i` `g s` `g t` `g d` `?` |
| Fiche client | Onglet E-mail : même rédaction, historique des conversations avec ce contact ou cette entreprise |
| Relances | J-3 avant échéance et J+7 après, une seule fois par facture, en simulation tant que `MAIL_REMINDERS_ENABLED` ≠ 1 |

## Sécurité

- **Le navigateur n'écrit plus rien dans `crm_emails`.** Envois, brouillons et actions passent par l'API serveur. Un mail ne peut plus être inventé ni retouché depuis la console. Ce point est vérifié par des tests dans un Postgres embarqué (PGlite).
- L'expéditeur est contrôlé côté serveur : sa propre adresse, ou une boîte partagée autorisée par l'ACL. Limite de 100 envois par heure.
- Pièces jointes : stockage privé (`mail-attachments`), URL signées de 5 minutes, fichiers envoyés directement vers le stockage. Un utilisateur ne peut joindre que ses propres fichiers ou ceux d'un mail qu'il peut lire.
- La synchronisation n'accepte plus l'en-tête `x-vercel-cron` seul : elle exige `CRON_SECRET` ou une session, avec un maximum d'une synchronisation par minute.
- Un mail entrant dont SPF et DKIM échouent, ou dont DMARC échoue, va en Spam.
- Un mail pour une adresse inconnue arrive dans « À trier », et non dans Contact.

## Mise en production (dans l'ordre)

1. **Sauvegarder la base** (snapshot Supabase).
2. Appliquer `supabase/migrations/20260926_v26_messagerie.sql`. Elle ne modifie ni ne supprime aucune ligne existante. On peut la rejouer sans risque.
3. Vérifier dans Supabase → Database → Replication que `crm_emails` fait partie de `supabase_realtime`. La migration l'ajoute si la publication existe.
4. Variables Vercel : `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `CRON_SECRET`. Plus tard, si vous voulez des relances réelles : `MAIL_REMINDERS_ENABLED=1`.
5. Dans la messagerie, aller dans Paramètres → Diagnostic → réception Resend, et relancer la configuration du webhook. Il s'abonne alors aussi aux événements de livraison.
6. DNS (N0C) : suivre le diagnostic (MX, SPF du sous-domaine `send`, DKIM, **DMARC**).

## Limites connues

- Le `Message-ID` est proposé à Resend. S'il le remplace, les réponses des clients sont quand même rattachées au bon fil grâce à l'objet et au correspondant (60 jours).
- La conversation reste le seul mode d'affichage : on ne peut pas afficher les messages un par un.
- Pas d'onglets Promotions / Réseaux sociaux ni de règles de filtrage automatiques.
- L'annulation d'envoi se fait dans le navigateur. Si l'onglet est fermé pendant le délai, le mail n'est pas envoyé et reste dans les brouillons.
- Les pièces jointes des brouillons supprimés sont effacées du stockage. Pour les autres, pas de purge automatique.
