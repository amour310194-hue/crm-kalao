# Canaux et clés API (CRM Kalao)

Les secrets se saisissent dans **Paramètres → Canaux et clés API**. Ils sont chiffrés en base. Le navigateur ne reçoit jamais la valeur, seulement un masque `••••xxxx`.

**Aucun canal n’est « connecté »** tant qu’une vérification réelle n’a pas réussi. Enregistrer une clé ne connecte pas le réseau.

Les appels Meta, TikTok, Google et LinkedIn ne sont pas activés. On attend la vérification du Business Manager.

## Où trouver chaque clé

### Meta (WhatsApp, Messenger, Instagram, Facebook)

1. [developers.facebook.com](https://developers.facebook.com/) → application type **Business**.
2. Produits : WhatsApp, Messenger, Webhooks, Instagram, Marketing API.
3. **App ID** / **App Secret** : Paramètres → Général.
4. **Verify Token** : vous le choisissez, identique dans Meta et dans le CRM.
5. **Token WhatsApp** : WhatsApp → API Setup → utilisateur système (permanent).
6. **Phone Number ID** et **WABA ID** : même écran WhatsApp.
7. **Page ID** et **token de Page** : Messenger / Page liée.

Webhook : `https://crm.groupe-kalao.com/api/webhooks/meta`

Une requête sans signature `X-Hub-Signature-256` est refusée (401). Fenêtre de réponse : 24 h après le dernier message du client, 72 h si la conversation vient d’une publicité. Au-delà, seuls les modèles approuvés. Les cinq modèles (échéance, paiement reçu, ambassade, document manquant, relance) sont enregistrés et **non soumis** à Meta.

### TikTok

TikTok for Business → developer app → App Key / Secret / Access Token / Advertiser ID. Webhook `/api/webhooks/tiktok`, même contrôle de signature. Pas de messages privés tant que l’éligibilité du compte n’est pas confirmée.

### Google Ads

Compte MCC → developer token + OAuth client ID/secret + refresh token + customer ID. Les dépenses ne sont pas synchronisées.

### LinkedIn

LinkedIn Developers → app Marketing / Lead Sync → Client ID/Secret, token, organization ID. Webhook `/api/webhooks/linkedin`. Pas de messages privés.

### Orange Money et MTN MoMo

Pas d’agrégateur. Mode **test** : aucun débit n’est envoyé aux opérateurs. Un lien ne peut pas dépasser le reste dû. Webhooks `/api/webhooks/orange` et `/api/webhooks/mtn`, signature obligatoire. Un paiement sans facture va dans Rapprochement.

### E-mail

Resend reste dans les variables Vercel (`RESEND_API_KEY`). DMARC en `p=quarantine` seulement après deux semaines de rapports propres. Ce changement DNS n’est pas fait ici.

## Chiffrement

Variable optionnelle `INTEGRATION_MASTER_KEY` (Vercel). Sinon le serveur utilise `SUPABASE_SERVICE_ROLE_KEY` comme matière de chiffrement. Préférez une clé dédiée.

## En cas de panne ou de fuite

1. Si un webhook répond 401, la signature ou le secret manque. Ne pas désactiver la vérification.
2. Si Resend est absent, le lien du portail et l’alerte de nouvel appareil ne partent pas. L’écran le dit.
3. Révoquer le token chez l’éditeur, enregistrer le nouveau secret dans le CRM, ne jamais coller un secret dans un ticket ou un commit.

## Portail client

`/portail` envoie un lien e-mail si l’adresse correspond à une fiche client. Le client ne lit que ses dossiers et ses factures.

## Signature électronique

Non branchée. Le fournisseur prévu plus tard est Yousign.

## Étape 0 — prérequis Groupe Kalao

- [ ] Meta Business Manager au nom de Groupe Kalao (2 administrateurs)
- [ ] Vérification entreprise Meta (RCCM, NIU, justificatif d’adresse)
- [ ] Vérification du domaine groupe-kalao.com (DNS TXT)
- [ ] Page Facebook officielle + Instagram professionnel lié
- [ ] Numéro WhatsApp **dédié** au CRM
- [ ] Pages publiques : politique de confidentialité, CGU, suppression des données
- [ ] Compte TikTok Business + accès développeur
- [ ] Google Ads MCC + demande de developer token
- [ ] LinkedIn Page + accès API
- [ ] Contrats marchands Orange Money et MTN MoMo (le mode test est déjà en place)
