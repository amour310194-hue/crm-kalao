export type IntegrationField = {
  key: string;
  label: string;
  secret: boolean;
  hint?: string;
  placeholder?: string;
};

export type IntegrationProvider = {
  id: string;
  label: string;
  summary: string;
  webhookPath?: string;
  fields: IntegrationField[];
};

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: "meta",
    label: "Meta — WhatsApp, Messenger, Instagram, Facebook",
    summary: "Une seule application Business pour WhatsApp, la Page, Instagram et les publicités Lead Ads.",
    webhookPath: "/api/webhooks/meta",
    fields: [
      { key: "app_id", label: "App ID", secret: false, hint: "Identifiant de l'application Meta (Business)." },
      { key: "app_secret", label: "App Secret", secret: true, hint: "Sert à vérifier la signature des webhooks (X-Hub-Signature-256)." },
      {
        key: "verify_token",
        label: "Verify Token (webhook)",
        secret: true,
        hint: "Chaîne que vous choisissez, à recopier dans la config webhook Meta.",
      },
      { key: "whatsapp_token", label: "Token WhatsApp (utilisateur système)", secret: true },
      { key: "phone_number_id", label: "Phone Number ID", secret: false },
      { key: "waba_id", label: "WABA ID", secret: false, hint: "WhatsApp Business Account ID." },
      { key: "page_id", label: "ID de la Page Facebook", secret: false },
      { key: "page_token", label: "Token de Page", secret: true },
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    summary: "Leads publicitaires et commentaires. Les messages privés dépendent de l'éligibilité du compte.",
    webhookPath: "/api/webhooks/tiktok",
    fields: [
      { key: "app_key", label: "App Key", secret: false },
      { key: "app_secret", label: "App Secret", secret: true },
      { key: "access_token", label: "Access Token", secret: true },
      { key: "advertiser_id", label: "Advertiser ID", secret: false },
    ],
  },
  {
    id: "google_ads",
    label: "Google Ads",
    summary: "Dépense, conversions et leads. Le developer token se demande depuis un compte gestionnaire (MCC).",
    fields: [
      { key: "developer_token", label: "Developer token", secret: true },
      { key: "client_id", label: "Client ID (OAuth)", secret: false },
      { key: "client_secret", label: "Client Secret", secret: true },
      { key: "refresh_token", label: "Refresh token", secret: true },
      { key: "customer_id", label: "Customer ID", secret: false, placeholder: "123-456-7890" },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    summary: "Leads des formulaires Lead Gen et commentaires de Page. Pas de messages privés.",
    webhookPath: "/api/webhooks/linkedin",
    fields: [
      { key: "client_id", label: "Client ID", secret: false },
      { key: "client_secret", label: "Client Secret", secret: true },
      { key: "access_token", label: "Access token", secret: true },
      { key: "organization_id", label: "Organization / Page ID", secret: false },
    ],
  },
  {
    id: "sms",
    label: "SMS",
    summary: "Repli pour les rappels si WhatsApp est hors fenêtre. Fournisseur à confirmer.",
    fields: [
      { key: "provider", label: "Fournisseur", secret: false, placeholder: "ex. Twilio, Orange, Nexah" },
      { key: "api_key", label: "Clé API", secret: true },
      { key: "api_secret", label: "Secret / Auth token", secret: true },
      { key: "sender", label: "Expéditeur (Sender ID)", secret: false },
    ],
  },
  {
    id: "momo",
    label: "Mobile Money",
    summary: "Numéros marchands affichés sur les factures. L'agrégateur (CinetPay, Campay…) est une phase 2.",
    fields: [
      { key: "aggregator", label: "Agrégateur", secret: false, placeholder: "ex. Campay, CinetPay, Notch Pay" },
      { key: "api_key", label: "Clé API", secret: true },
      { key: "api_secret", label: "Secret / token", secret: true },
      { key: "mtn_merchant", label: "N° marchand MTN MoMo", secret: false },
      { key: "orange_merchant", label: "N° marchand Orange Money", secret: false },
    ],
  },
];

export type FieldStatus = {
  key: string;
  secret: boolean;
  configured: boolean;
  last4: string | null;
  publicValue: string | null;
};

export type ProviderStatus = {
  id: string;
  label: string;
  status: "non_configure" | "cles_enregistrees";
  fields: FieldStatus[];
};

export function providerStatusLabel(status: ProviderStatus["status"]): string {
  return status === "cles_enregistrees" ? "Clés enregistrées" : "Non configuré";
}

export function buildProviderStatus(
  provider: IntegrationProvider,
  rows: { field_key: string; last4: string | null; public_value: string | null; ciphertext: string | null }[]
): ProviderStatus {
  const byKey = new Map(rows.map((row) => [row.field_key, row]));
  const fields: FieldStatus[] = provider.fields.map((field) => {
    const row = byKey.get(field.key);
    const configured = field.secret ? Boolean(row?.ciphertext || row?.last4) : Boolean(row?.public_value);
    return {
      key: field.key,
      secret: field.secret,
      configured,
      last4: field.secret ? row?.last4 ?? null : null,
      publicValue: field.secret ? null : row?.public_value ?? null,
    };
  });
  const any = fields.some((field) => field.configured);
  return {
    id: provider.id,
    label: provider.label,
    status: any ? "cles_enregistrees" : "non_configure",
    fields,
  };
}

export function findProvider(id: string): IntegrationProvider | undefined {
  return INTEGRATION_PROVIDERS.find((item) => item.id === id);
}

export function findField(provider: IntegrationProvider, key: string): IntegrationField | undefined {
  return provider.fields.find((field) => field.key === key);
}
