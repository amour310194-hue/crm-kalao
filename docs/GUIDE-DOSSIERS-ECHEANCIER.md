# Guide — dossiers visa et caisse (Kalao)

## Accueil
Le tableau de bord unique (`/dashboard`) affiche l’encaissé, les impayés, les contacts et les dossiers **réels**. S’il n’y a pas d’affaire, la zone est vide — plus de graphes de démo.

## Dossiers immigration
Menu **Projects → Visas**. Les étapes affichées sont :
Consultation → Collecte des documents → Constitution du dossier → Clôturé / Annulé.

Les autres métiers (chantiers, voyages…) sont masqués tant qu’ils n’ont pas de dossiers.

## Factures et paiements
- Une facture est liée à un **dossier**, pas encore à un devis (0 devis en base).
- La colonne des paiements s’appelle **Date de paiement**.
- C07 n’existe pas : trou de numérotation INV-C01…C14 (sauf C07). Ne pas créer de client fantôme.

## Corrections de caisse encore en attente d’OK
Ces cas sont documentés dans le prompt de refonte, **pas encore exécutés** en base :
1. Réaffecter 900 000 FCFA de INV-C14-SO vers INV-C14-AV
2. Annuler INV-C06-AV, créer un avoir, supprimer le paiement négatif
3. Marquer INV-C14-BA comme échéance conditionnelle (« si tiré du bassin »)
4. Dates des soldes sans échéance (liste C01-SO, C03-SO…)
5. Vérifier les 14 paiements importés (tous en cash, 22 sept. 2026)
6. Supprimer l’activité « Échéance V7 TEST visa seed »
7. Confirmer si Amadou Koffi est un seed

## Connexion
Écran en français. « Se souvenir de moi » est décoché par défaut. Après 5 échecs, attente de 30 s.

## Mail
L’envoi passe par une session authentifiée. Sans token, l’API refuse (401).
