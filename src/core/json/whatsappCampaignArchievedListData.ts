/*
  Generated from html/assets/json/whatsapp-campaign-archieved.js (DataTable init).
  Only the keys the source `columns` render map reads are kept; the numeric
  status flag becomes a readable label plus the badge tone the source pairs with it.
*/

import type { WhatsappCampaignData } from "./whatsappCampaignListData";

export const WhatsappCampaignArchievedListData: WhatsappCampaignData[] = [
  { key: "1", CampaignId: "WHA001", Name: "Renewal Reminder", AudienceSegment: "Active Customers", MessageTemplate: "Renewal-SMS", SentCount: "1524", ReadRate: "40.5%", ReplyRate: "60.5%", Status: "Running", StatusTone: "teal" },
  { key: "2", CampaignId: "WHA002", Name: "Payment Due Alert", AudienceSegment: "Overdue Accounts", MessageTemplate: "Payment-SMS-01", SentCount: "1421", ReadRate: "30.5%", ReplyRate: "40.5%", Status: "Pending", StatusTone: "warning" },
  { key: "3", CampaignId: "WHA004", Name: "Subscription Expiry", AudienceSegment: "Trial Users", MessageTemplate: "Expiry-Notify", SentCount: "1212", ReadRate: "41.5%", ReplyRate: "20.5%", Status: "Bounced", StatusTone: "danger" },
  { key: "4", CampaignId: "WHA005", Name: "Limited Offer Promo", AudienceSegment: "Inactive Customers", MessageTemplate: "Promo-SMS-Flash", SentCount: "1111", ReadRate: "88.5%", ReplyRate: "11.5%", Status: "Running", StatusTone: "teal" },
  { key: "5", CampaignId: "WHA006", Name: "Account Verification", AudienceSegment: "New Signups", MessageTemplate: "Verify-SMS", SentCount: "987", ReadRate: "90.5%", ReplyRate: "10.5%", Status: "Paused", StatusTone: "cyan" },
  { key: "6", CampaignId: "WHA008", Name: "Service Downtime Alert", AudienceSegment: "Feedback-SMS", MessageTemplate: "Feedback-SMS", SentCount: "765", ReadRate: "48.5%", ReplyRate: "75.5%", Status: "Paused", StatusTone: "cyan" },
  { key: "7", CampaignId: "WHA009", Name: "Wallet Balance Low", AudienceSegment: "Balance-SMS", MessageTemplate: "Balance-SMS", SentCount: "654", ReadRate: "65.5%", ReplyRate: "20.5%", Status: "Bounced", StatusTone: "danger" },
];
