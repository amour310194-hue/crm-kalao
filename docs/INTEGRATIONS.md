# Canaux et clés API (CRM Kalao)

Les secrets se saisissent dans **Paramètres → Canaux et clés API**. Ils sont chiffrés en base. Le navigateur ne reçoit jamais la valeur, seulement un masque `••••xxxx`.

**Aucun canal n’est « connecté »** tant qu’une vérification réelle (webhook, token valide) n’a pas été faite. Enregistrer une clé ≠ connecter le réseau.

Les appels Meta / TikTok / Google / LinkedIn **ne sont pas encore activés**. On attend la vérification du Business Manager.

## Où trouver chaque clé

### Meta (WhatsApp, Messenger, Instagram, Facebook)
1. [developers.facebook.com](https://developers.facebook.com/) → application type **Business**.
2. Produits : WhatsApp, Messenger, Webhooks, Instagram, Marketing API.
3. **App ID** / **App Secret** : Paramètres → Général.
4. **Verify Token** : vous le choisissez (mot de passe du webhook), identique dans Meta et dans le CRM.
5. **Token WhatsApp** : WhatsApp → API Setup → utilisateur système (permanent).
6. **Phone Number ID** et **WABA ID** : même écran WhatsApp.
7. **Page ID** et **token de Page** : Messenger / Page liée (OAuth « Facebook Login for Business » plus tard).

Webhook à déclarer : `https://crm.groupe-kalao.com/api/webhooks/meta`  
(l’endpoint sera branché après l’étape 0, pas avant.)

### TikTok
TikTok for Business → developer app → App Key / Secret / Access Token / Advertiser ID.

### Google Ads
Compte MCC → developer token (souvent en attente de validation Google) + OAuth client ID/secret + refresh token + customer ID.

### LinkedIn
LinkedIn Developers → app Marketing / Lead Sync → Client ID/Secret, token, organization ID.

### SMS et Mobile Money
Fournisseur et agrégateur **à confirmer** (voir questions ci-dessous). En attendant, les champs existent pour coller les clés dès le contrat signé.

### E-mail
Resend reste dans les variables Vercel (`RESEND_API_KEY`), pas dans ce formulaire.

## Chiffrement
Variable optionnelle `INTEGRATION_MASTER_KEY` (Vercel). Sinon le serveur utilise `SUPABASE_SERVICE_ROLE_KEY` comme matière de chiffrement. Préférez une clé dédiée.

## En cas de fuite
1. Révoquer le token chez l’éditeur (Meta, Google…).
2. Enregistrer un nouveau secret dans le CRM.
3. Ne jamais coller un secret dans un ticket, un chat ou un commit.

## Étape 0 — prérequis Groupe Kalao (à cocher)

- [ ] Meta Business Manager au nom de Groupe Kalao (2 administrateurs)
- [ ] Vérification entreprise Meta (RCCM, NIU, justificatif d’adresse)
- [ ] Vérification du domaine groupe-kalao.com (DNS TXT chez N0C)
- [ ] Page Facebook officielle + Instagram professionnel lié
- [ ] Numéro WhatsApp **dédié** au CRM
- [ ] Pages publiques : politique de confidentialité, CGU, suppression des données
- [ ] Compte TikTok Business + accès développeur
- [ ] Google Ads MCC + demande de developer token
- [ ] LinkedIn Page + accès API (optionnel)
- [ ] Agrégateur Mobile Money (phase 2)
- [ ] NIU, RCCM, RIB, n° MTN/Orange pour les factures

## Questions ouvertes (ne pas inventer)

1. Régime de TVA applicable aux visas (19,25 % ou exonéré) ?
2. Format de numérotation des factures (`FAC-2026-0001` ?)
3. Exercice fiscal = année civile ?
4. Raison sociale, NIU, RCCM, adresse à imprimer
5. Agrégateur Mobile Money (Campay, CinetPay, Notch Pay…) ?
6. Fournisseur SMS ?
7. Seuil d’alerte coût par lead
8. Un agent ne voit-il que les conversations de son pôle ?
9. Accès TikTok Business Messaging pour le Cameroun ?
