# Facturation Kalao

Émetteur unique : KALAO CONSULTING SARL. Régime IGS, pas de TVA. Fuseau Africa/Douala. Montants en FCFA, dates du type `24 sept. 2026`.

## Création

Une facture naît en brouillon, depuis la liste, la grille ou la fiche dossier. Le client et le dossier sont obligatoires. Les lignes viennent du catalogue ou sont libres. Le total est calculé. L'échéancier produit une facture par échéance ; une échéance conditionnelle prend le statut Conditionnelle. La somme des échéances égale le total.

**Émettre** attribue `FAC-KALAO-AAAA-xxxx` dans la même transaction, sans trou. Les anciens numéros restent dans `legacy_ref`.

## Statuts

Calculés, le retard prime sur le paiement partiel :

Brouillon, Émise, Partiellement payée, Payée, En retard (avec le nombre de jours), Conditionnelle, Annulée.

Le tableau de bord, la fiche dossier, la fiche client et l'export Excel lisent la vue `invoice_figures`. Les brouillons et les annulées ne comptent pas dans le facturé. Les conditionnelles ne comptent pas dans le reste exigible. L'encaissé est la somme des montants déjà payés de cette vue.

## Modification

- Brouillon : lignes, libellé, échéance et dossier se modifient tout de suite. Suppression possible s'il n'a aucun encaissement valide. Le montant vient des lignes.
- Émise : libellé, échéance et dossier seulement, avec motif. La demande attend un autre compte `direction`, `admin` ou `super_admin`.
- Le montant, les lignes et le client d'une facture émise sont verrouillés.
- Un enregistrement sans changement n'écrit rien. L'échéance de la modale est la date réelle, pas le libellé formaté.

## Annulation et avoir

Seuls `finance`, `direction`, `admin` et `super_admin` demandent une annulation. Elle est refusée tant qu'un encaissement valide existe. Une fois validée, elle crée un avoir `AVOIR-KALAO-AAAA-xxxx` lié à la facture. La facture de remplacement se crée avec Nouvelle facture.

Toute annulation et toute modification passent par une validation. Il n'y a pas de seuil de montant.

## Encaissements

Modes : Espèces, Mobile Money MTN, Mobile Money Orange, Virement, Chèque, Carte. La référence est obligatoire hors espèces. La date est la date réelle. « Encaissé par » est l'utilisateur connecté.

Le montant ne se modifie pas. Date, mode, référence et notes se modifient avec motif, après validation. Un trop-perçu est refusé. L'auteur d'un encaissement ne peut pas demander son annulation.

Le bouton **Encaisser** est sur chaque facture. La barre qui présélectionnait une facture n'est plus là.

Un remboursement part d'un avoir, puis une sortie de caisse liée, après validation.

## Historique

`audit_log` enregistre auteur, date, action, valeurs avant et après, motif, sur les factures, encaissements et avoirs. L'onglet Historique de chaque modale l'affiche. Si le paiement du 23 septembre 2026 de `INV-C14-AV` existe encore, la modification volontaire depuis le 24 septembre est reprise dans ce journal.

## Relances

Le cron du matin prépare J-3, J0, J+3 et J+7. Le bouton Relancer envoie le même modèle et inscrit l'envoi. Sans e-mail client, le bouton est inactif. L'envoi automatique reste une simulation tant que `MAIL_REMINDERS_ENABLED` n'est pas à `1` et que la clé Resend n'est pas confirmée en production.

## Documents

- Facture : Montant total, Reste dû, titre d'onglet = numéro, bandeau ANNULÉE ou BROUILLON, sans « Lu et approuvé ».
- Reçu : `/docs/receipt/[id]`, avec envoi par e-mail si le client en a un. L'envoi est inscrit dans l'historique.
- Avoir : `/docs/credit_note/[id]`. Le bouton « Rembourser en caisse » crée une demande de sortie, validée par un autre compte direction.
- Relevé : `/docs/statement/[id]` (identifiant du contact). Les dates « Du » et « Au » limitent les factures et les encaissements. Sans date, le relevé reprend tout l'historique.

## Caisse

Le journal réunit les encaissements, les dépenses et les opérations diverses, avec un solde progressif par moyen : espèces, MTN MoMo, Orange Money, banque.

La clôture du jour compare le solde compté au solde théorique. Un second compte la valide. Une journée validée n'accepte plus d'écriture à cette date. Une clôture de mois validée fige factures, encaissements et dépenses de ce mois.

## Corriger une erreur de saisie

1. Si la facture est encore un brouillon : la modifier, ou la supprimer.
2. Si un encaissement a un mauvais montant : l'auteur ne l'annule pas lui-même. Une autre personne de la finance demande l'annulation, un compte direction la valide, puis un nouvel encaissement est saisi.
3. Si le montant d'une facture déjà émise est faux : annuler d'abord ses encaissements, faire valider l'annulation de la facture (l'avoir est créé), puis émettre une nouvelle facture.
4. Un remboursement d'argent suit l'avoir, puis une sortie de caisse validée.

## Migrations

À appliquer dans l'ordre, après sauvegarde :

- `20261007_v39_forbid_invoice_payment_delete.sql`
- `20261007_v40_invoice_drafts.sql` (renumérote les factures déjà émises, copie les anciens numéros)
- `20261007_v41_finance_controls.sql`
- `20261007_v42_invoice_figures.sql`
- `20261007_v43_cash_journal.sql`
- `20261008_v44_cash_journal_view.sql` (vue `cash_journal` et fonctions de clôture, si v43 s'est arrêtée avant elles)

Le rollback de chaque fichier est commenté en bas. Il ne retire pas les colonnes déjà remplies.
