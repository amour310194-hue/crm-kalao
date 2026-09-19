export type FieldType = "text" | "number" | "select" | "textarea" | "date";

export type FormField = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  wide?: boolean;
};

const accountType = { name: "accountType", label: "Type client", type: "select" as const, options: ["individual", "company"] };

export const resourceFields: Record<string, FormField[]> = {
  accounts: [
    { name: "Type", label: "Type", type: "select", options: ["Particulier", "Société"], required: true },
    { name: "Name", label: "Nom", required: true },
    { name: "Email", label: "Email" },
    { name: "Phone", label: "Téléphone" },
    { name: "City", label: "Ville" },
    { name: "Tags", label: "Tags" },
  ],
  companies: [
    { name: "name", label: "Nom", required: true },
    { name: "email", label: "Email" },
    { name: "phone", label: "Téléphone" },
    { name: "city", label: "Ville" },
    { name: "industry", label: "Secteur" },
    { name: "tags", label: "Tags" },
  ],
  contacts: [
    { name: "firstName", label: "Prénom", required: true },
    { name: "lastName", label: "Nom", required: true },
    { name: "email", label: "Email" },
    { name: "phone", label: "Téléphone" },
    { name: "jobTitle", label: "Fonction" },
    { name: "location", label: "Ville" },
    { name: "companyId", label: "ID société (vide = particulier)" },
  ],
  leads: [
    { name: "title", label: "Intitulé", required: true },
    { name: "companyId", label: "ID société" },
    { name: "contactId", label: "ID contact" },
    { name: "status", label: "Statut", type: "select", options: ["new", "contacted", "qualified", "unqualified", "converted"] },
    { name: "estimatedValue", label: "Valeur estimée", type: "number" },
  ],
  deals: [
    { name: "title", label: "Intitulé", required: true },
    { name: "companyId", label: "ID société" },
    {
      name: "stage",
      label: "Étape",
      type: "select",
      options: ["Contact Made", "Qualify To Buy", "Proposal Made", "Negotiation", "Closed Won", "Closed Lost"],
    },
    { name: "amount", label: "Montant", type: "number", required: true },
    { name: "probability", label: "Probabilité %", type: "number" },
    { name: "status", label: "Étape (pipeline / gagnée / perdue)", type: "select", options: ["Open", "Won", "Lost"] },
    { name: "expectedCloseDate", label: "Clôture prévue", type: "date" },
    { name: "tags", label: "Tags" },
  ],
  catalog: [
    { name: "name", label: "Désignation", required: true },
    { name: "sku", label: "SKU" },
    { name: "kind", label: "Nature", type: "select", options: ["product", "service"] },
    { name: "category", label: "Catégorie" },
    { name: "unitPrice", label: "Prix unitaire", type: "number" },
    { name: "taxRate", label: "TVA %", type: "number" },
  ],
  quotes: [
    { name: "companyId", label: "ID société" },
    { name: "quoteDate", label: "Date du devis" },
    { name: "validTill", label: "Valable jusqu’au" },
    { name: "totalAmount", label: "Montant total", type: "number" },
    { name: "finalAmount", label: "Montant final", type: "number" },
  ],
  invoices: [
    { name: "companyId", label: "ID société" },
    { name: "project", label: "Projet" },
    { name: "dueDate", label: "Échéance" },
    { name: "amount", label: "Montant", type: "number", required: true },
  ],
  departments: [
    { name: "code", label: "Code" },
    { name: "name", label: "Nom", required: true },
    { name: "headName", label: "Responsable" },
    { name: "membersCount", label: "Effectif" },
    { name: "location", label: "Ville" },
  ],
  travel: [
    { name: "accountName", label: "Client", required: true },
    accountType,
    { name: "destination", label: "Destination", required: true },
    { name: "departureDate", label: "Départ", type: "date", required: true },
    { name: "returnDate", label: "Retour", type: "date", required: true },
    { name: "pax", label: "Passagers", type: "number" },
    { name: "itinerary", label: "Itinéraire", type: "textarea", wide: true },
    { name: "status", label: "Statut", type: "select", options: ["Devis", "Confirmé", "En cours"] },
    { name: "amount", label: "Montant", type: "number" },
  ],
  immigration: [
    { name: "accountName", label: "Client", required: true },
    accountType,
    { name: "procedure", label: "Procédure", required: true },
    { name: "country", label: "Pays" },
    { name: "step", label: "Étape visa", type: "select", options: ["Dossier ouvert", "Pièces", "Dépôt", "Entretien", "Décision", "Visa obtenu"] },
    { name: "status", label: "Statut" },
    { name: "dueDate", label: "Échéance" },
  ],
  events: [
    { name: "title", label: "Intitulé", required: true },
    { name: "accountName", label: "Client", required: true },
    accountType,
    { name: "eventDate", label: "Date événement" },
    { name: "services", label: "Prestations" },
    { name: "lineLabel", label: "Ligne — libellé" },
    { name: "lineQuantity", label: "Ligne — quantité", type: "number" },
    { name: "lineUnitPrice", label: "Ligne — prix", type: "number" },
    { name: "status", label: "Statut", type: "select", options: ["Devis", "Préparation", "Confirmé"] },
    { name: "amount", label: "Montant", type: "number" },
  ],
  eventLines: [
    { name: "eventNumber", label: "N° prestation", required: true },
    { name: "label", label: "Libellé", required: true },
    { name: "quantity", label: "Quantité", type: "number" },
    { name: "unitPrice", label: "Prix unitaire", type: "number" },
  ],
  plantations: [
    { name: "name", label: "Nom", required: true },
    { name: "crop", label: "Culture" },
    { name: "location", label: "Lieu" },
    { name: "hectares", label: "Hectares" },
    { name: "season", label: "Saison" },
    { name: "status", label: "Statut" },
  ],
  sites: [
    { name: "name", label: "Chantier", required: true },
    { name: "accountName", label: "Client" },
    accountType,
    { name: "location", label: "Lieu" },
    { name: "phase", label: "Phase" },
    { name: "manager", label: "Chef de chantier" },
    { name: "amount", label: "Montant", type: "number" },
    { name: "status", label: "Statut" },
  ],
  siteEquipment: [
    { name: "code", label: "Code" },
    { name: "name", label: "Désignation", required: true },
    { name: "kind", label: "Nature", type: "select", options: ["Engin", "Outil", "Stock"] },
    { name: "siteName", label: "Chantier" },
    { name: "quantity", label: "Quantité" },
    { name: "status", label: "Statut" },
  ],
  siteAssignments: [
    { name: "employee", label: "Salarié", required: true },
    { name: "role", label: "Fonction" },
    { name: "siteName", label: "Chantier" },
    { name: "attendance", label: "Présence" },
    { name: "status", label: "Statut" },
  ],
  siteMilestones: [
    { name: "siteName", label: "Chantier", required: true },
    { name: "phase", label: "Phase" },
    { name: "progress", label: "Avancement" },
    { name: "note", label: "Note", type: "textarea" },
    { name: "status", label: "Statut" },
  ],
  properties: [
    { name: "name", label: "Bien", required: true },
    { name: "kind", label: "Type" },
    { name: "location", label: "Lieu" },
    { name: "accountName", label: "Client" },
    accountType,
    { name: "rent", label: "Loyer", type: "number" },
    { name: "status", label: "Statut" },
  ],
  leases: [
    { name: "propertyName", label: "Bien", required: true },
    { name: "tenant", label: "Locataire", required: true },
    { name: "startDate", label: "Début" },
    { name: "endDate", label: "Fin" },
    { name: "rent", label: "Loyer", type: "number" },
    { name: "status", label: "Statut", type: "select", options: ["Actif", "Libre", "Résilié"] },
  ],
  payroll: [
    { name: "employee", label: "Salarié", required: true },
    { name: "department", label: "Département" },
    { name: "period", label: "Période" },
    { name: "salary", label: "Salaire", type: "number" },
    { name: "bonus", label: "Prime", type: "number" },
    { name: "status", label: "Statut", type: "select", options: ["À verser", "Payé"] },
  ],
  payments: [
    { name: "invoiceNumber", label: "N° facture", required: true },
    { name: "amount", label: "Montant", type: "number", required: true },
    { name: "method", label: "Mode", type: "select", options: ["Espèces", "Virement", "Chèque", "Mobile money"] },
    { name: "paidAt", label: "Date" },
  ],
};

const aliases: Record<string, string> = {
  clients: "accounts",
  products: "catalog",
  quotations: "quotes",
  voyages: "travel",
  evenements: "events",
  lignes: "eventLines",
  agriculture: "plantations",
  chantiers: "sites",
  materiel: "siteEquipment",
  equipes: "siteAssignments",
  avancement: "siteMilestones",
  immobilier: "properties",
  baux: "leases",
  paie: "payroll",
  paiements: "payments",
};

export function fieldsFor(resource: string) {
  return resourceFields[aliases[resource] ?? resource] ?? resourceFields.accounts;
}
