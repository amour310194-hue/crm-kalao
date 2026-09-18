/*
  Generated from html/assets/json/lost-deal-analysis.js (DataTable init).
  The source reuses generic slots: `emp-id` holds the deal name, `remarks` the
  competitor and `budget` the deal value. `status` is a "0"-"3" flag that maps
  to the Lost stage label + badge tone.
*/

export interface LostDealAnalysisData {
  key: string;
  DealId: string;
  DealName: string;
  LostReason: string;
  SubReason: string;
  Competitor: string;
  DealValue: string;
  LostStage: string;
  LostStageTone: string;
  LostDate: string;
}

export const LostDealAnalysisReportData: LostDealAnalysisData[] = [
  { key: "1", DealId: "#DEL0020", DealName: "Annual Software Subscription", LostReason: "Price Too High", SubReason: "Budget not approved", Competitor: "Salesforce", DealValue: "$200000", LostStage: "Appointment", LostStageTone: "badge-soft-success", LostDate: "25 Sep 2025" },
  { key: "2", DealId: "#DEL0019", DealName: " CRM Onboarding Package", LostReason: "Lost to Competitor", SubReason: "Budget not approved", Competitor: "HubSpot", DealValue: "$300000", LostStage: "Contact Made", LostStageTone: "badge-soft-info", LostDate: "29 Sep 2025" },
  { key: "3", DealId: "#DEL0018", DealName: "Enterprise Plan Upgrade", LostReason: "Product Limitations", SubReason: "Better features", Competitor: "Zoho CRM", DealValue: "$200000", LostStage: "Proposal Made", LostStageTone: "badge-soft-danger", LostDate: "05 Oct 2025" },
  { key: "4", DealId: "#DEL0017", DealName: "BrightWorks Campaign", LostReason: "Product Limitations", SubReason: "Customization not supported", Competitor: "Freshsales", DealValue: "$300000", LostStage: "Proposal Made", LostStageTone: "badge-soft-danger", LostDate: "14 Oct 2025" },
  { key: "5", DealId: "#DEL0016", DealName: "Sales Pipeline Optimization", LostReason: "Price Too High", SubReason: "Customization not supported", Competitor: "SugarCRM", DealValue: "$120000", LostStage: "Appointment", LostStageTone: "badge-soft-success", LostDate: "15 Nov 2025" },
  { key: "6", DealId: "#DEL0015", DealName: "CRM Migration Project", LostReason: "Price Too High", SubReason: "Incorrect proposal", Competitor: "Bitrix24", DealValue: "$200000", LostStage: "Contact Made", LostStageTone: "badge-soft-info", LostDate: "25 Nov 2025" },
  { key: "7", DealId: "#DEL0014", DealName: "Multi-Store License Renewal", LostReason: "Lost to Competitor", SubReason: "Cost exceeds expected ROI", Competitor: "Bitrix24", DealValue: "$200000", LostStage: "Appointment", LostStageTone: "badge-soft-success", LostDate: "08 Dec 2025" },
  { key: "8", DealId: "#DEL0013", DealName: "SkyHigh Annual Booking", LostReason: "Product Limitations", SubReason: "Better pricing plan", Competitor: "Close CRM", DealValue: "$45,000", LostStage: "Contact Made", LostStageTone: "badge-soft-info", LostDate: "21 Dec 2025" },
  { key: "9", DealId: "#DEL0012", DealName: "SkyHigh Annual Booking", LostReason: "Trial / POC Failed", SubReason: "Better pricing plan", Competitor: "Agile CRM", DealValue: "$200000", LostStage: "Presentation", LostStageTone: "badge-soft-purple", LostDate: "01 Jan 2024" },
  { key: "10", DealId: "#DEL0011", DealName: "Sales Pipeline Optimization", LostReason: "Internal Factors", SubReason: "Better pricing plan", Competitor: "Agile CRM", DealValue: "$80,000", LostStage: "Appointment", LostStageTone: "badge-soft-success", LostDate: "12 Jan 2024" },
  { key: "11", DealId: "#DEL0010", DealName: "Sales Pipeline Optimization", LostReason: "Internal Factors", SubReason: "Performance issues", Competitor: "Zendesk Sell", DealValue: "$780,000", LostStage: "Appointment", LostStageTone: "badge-soft-success", LostDate: "16 Jan 2024" },
  { key: "12", DealId: "#DEL0009", DealName: "Multi-Store License Renewal", LostReason: "Legal Issues", SubReason: "Performance issues", Competitor: "Zendesk Sell", DealValue: "$300000", LostStage: "Presentation", LostStageTone: "badge-soft-purple", LostDate: "12 Jan 2024" },
];
