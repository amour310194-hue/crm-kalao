/*
Author       : Dreamstechnologies
Template Name: CRMS - Bootstrap Admin Template

Mock data + pure helper functions for the AI CRM module, ported from the
static template's `window.AI_DATA` object and the per-page render logic in
html/assets/js/ai-crm.js. This file intentionally contains no DOM
manipulation / JSX / render logic - only plain data and pure functions the
8 AI CRM page components can import to fill in what used to be
`innerHTML`-populated containers (`data-ai-feed`, `data-score-body`,
`data-risk-list`, `data-compose-output`, `data-ask-log`, the `ai_model`
select, etc.).

This is still a static mock dataset - nothing here calls a real API.
*/

// =======================================================================
// Core AI_DATA types (leads / deals / insights / actions)
// =======================================================================

export interface AiScoreFactor {
  label: string;
  weight: number;
  type: "positive" | "negative";
}

export interface AiLeadActivity {
  time: string;
  text: string;
  icon: string;
  tone: string;
}

export interface AiLead {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  email: string;
  phone: string;
  score: number;
  probability: number;
  engagement: number;
  quality: string;
  source: string;
  owner: string;
  value: number;
  created: string;
  lastActivity: string;
  factors: AiScoreFactor[];
  activities: AiLeadActivity[];
  explanation: string;
  nextAction: string;
  nextActionDetail: string;
}

export interface AiDealNote {
  label: string;
}

export interface AiDealRisk {
  label: string;
  weight?: string;
}

export interface AiDealTimelineEvent {
  time: string;
  title: string;
  text: string;
  tone: string;
}

export interface AiDeal {
  id: string;
  name: string;
  company: string;
  owner: string;
  avatar: string;
  value: number;
  health: number;
  probability: number;
  stage: string;
  closeDate: string;
  age: number;
  lastContact: string;
  risks: AiDealRisk[];
  positives: AiDealNote[];
  missing: AiDealNote[];
  engagement: number;
  timeline: AiDealTimelineEvent[];
  recommendations: string[];
  nextAction: string;
  summary: string;
}

export interface AiInsight {
  id: string;
  category: string;
  severity: "critical" | "high" | "opportunity" | "medium" | string;
  title: string;
  body: string;
  why: string;
  action: string;
  link: string;
  metric: string;
  metricLabel: string;
  icon: string;
  tone: string;
  date: string;
}

export interface AiAction {
  title: string;
  meta: string;
  icon: string;
  tone: string;
  link: string;
  cta: string;
}

export interface AiScoreBand {
  key: "hot" | "warm" | "cold";
  label: string;
  tone: string;
  icon: string;
}

export interface AiRiskBand {
  key: "low" | "medium" | "high";
  label: string;
  tone: string;
}

// =======================================================================
// Core helpers (window.AI_DATA.money / moneyShort / band / riskBand / escapeHtml)
// =======================================================================

export function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function moneyShort(n: number): string {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
  return "$" + n;
}

// lead temperature band from a 0-100 score
export function band(score: number): AiScoreBand {
  if (score >= 75) return { key: "hot", label: "Hot", tone: "danger", icon: "ti-flame" };
  if (score >= 45) return { key: "warm", label: "Warm", tone: "warning", icon: "ti-temperature" };
  return { key: "cold", label: "Cold", tone: "info", icon: "ti-snowflake" };
}

// deal risk band from a 0-100 health score (higher health = lower risk)
export function riskBand(health: number): AiRiskBand {
  if (health >= 70) return { key: "low", label: "Low Risk", tone: "success" };
  if (health >= 45) return { key: "medium", label: "Medium Risk", tone: "warning" };
  return { key: "high", label: "High Risk", tone: "danger" };
}

// React escapes text content automatically when it is rendered as JSX
// children/props, so this is rarely needed in the port. Kept as a faithful,
// real implementation (not a no-op) in case a page still needs to sanitise
// text before using dangerouslySetInnerHTML (e.g. before highlighting merge
// fields with parseMergeFields below).
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c]);
}

// =======================================================================
// Small helpers reused across more than one page's render logic
// =======================================================================

// higher-is-better tone modifier for meters (AI Command Center leads/deals
// queues, Deal Risk Analysis engagement meter)
export function meterTone(value: number): "is-success" | "is-warning" | "is-danger" {
  return value >= 70 ? "is-success" : value >= 45 ? "is-warning" : "is-danger";
}

// lead.quality -> badge tone, used on the AI Command Center priority-leads queue
export const QUALITY_TONE: Record<string, string> = {
  Excellent: "success",
  Good: "info",
  Fair: "warning",
  Poor: "secondary",
};

export function qualityTone(quality: string): string {
  return QUALITY_TONE[quality] || "secondary";
}

// insight.severity sort order, used by both the AI Command Center feed
// (top 3) and the AI Insights page's default sort
export const INSIGHT_SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  opportunity: 2,
  medium: 3,
};

/*
  Deliberate divergence from the html reference: ai-crm.js sorts with
  `(order[a.severity] || 9)`, and because `critical` maps to 0 the `||`
  rewrites it to 9 - burying critical insights at the bottom of the feed.
  We use `??` so 0 survives and criticals sort first. Do not "align" this
  with the reference; the difference is intentional.
*/
export function severityRank(severity: string): number {
  return INSIGHT_SEVERITY_RANK[severity] ?? 9;
}

// ai-insights.html pins "today" to a fixed date so the 7/30/90-day period
// filter behaves predictably regardless of when the static demo is viewed.
export const AI_INSIGHTS_TODAY = "2026-08-25T00:00:00";

export function daysAgo(iso: string, today: string = AI_INSIGHTS_TODAY): number {
  return Math.round((new Date(today).getTime() - new Date(iso + "T00:00:00").getTime()) / 86400000);
}

// AI Command Center's "awaiting contact" summary cell flags leads whose
// lastActivity reads like "2 hours ago" / "Yesterday" / "3 days ago"
export function isRecentActivity(lastActivity: string): boolean {
  return /hour|day/.test(lastActivity);
}

// =======================================================================
// Leads - drives AI Lead Scoring and the AI Command Center
// =======================================================================

export const leads: AiLead[] = [
  {
    id: "L-2841",
    name: "Marcus Whitfield",
    title: "VP Operations",
    company: "Northwind Logistics",
    avatar: "avatar-01.jpg",
    email: "m.whitfield@northwind.io",
    phone: "+1 415 555 0134",
    score: 92,
    probability: 78,
    engagement: 88,
    quality: "Excellent",
    source: "Webinar",
    owner: "Adrian Herrera",
    value: 96000,
    created: "04 Aug 2026",
    lastActivity: "2 hours ago",
    factors: [
      { label: "Opened pricing page 6 times in 5 days", weight: 22, type: "positive" },
      { label: "Job title matches ICP (VP+ Operations)", weight: 18, type: "positive" },
      { label: "Company size 500-1000 employees", weight: 15, type: "positive" },
      { label: "Requested a demo through the website", weight: 20, type: "positive" },
      { label: "Replied to 3 of 4 outbound emails", weight: 17, type: "positive" },
      { label: "No budget confirmed yet", weight: -8, type: "negative" },
    ],
    activities: [
      { time: "2 hours ago", text: "Viewed the Enterprise pricing page", icon: "ti-eye", tone: "primary" },
      { time: "Yesterday", text: "Replied to \"Q3 rollout timeline\"", icon: "ti-mail", tone: "success" },
      { time: "3 days ago", text: "Attended the product webinar", icon: "ti-device-tv", tone: "primary" },
      { time: "5 days ago", text: "Downloaded the ROI calculator", icon: "ti-download", tone: "success" },
    ],
    explanation:
      "This lead scores in the top 4% of your pipeline. The strongest signals are repeat pricing-page visits and a direct demo request within 5 days of first touch - a pattern that closed at 71% across your last 200 leads. Seniority and company size both match your best-fit customer profile.",
    nextAction: "Book a discovery call in the next 24 hours",
    nextActionDetail:
      "Leads matching this pattern convert 3.1x more often when contacted within one day of a pricing-page visit.",
  },
  {
    id: "L-2839",
    name: "Priya Raghunathan",
    title: "Director of IT",
    company: "Meridian Health",
    avatar: "avatar-02.jpg",
    email: "p.raghunathan@meridianhealth.com",
    phone: "+1 617 555 0188",
    score: 84,
    probability: 66,
    engagement: 74,
    quality: "Excellent",
    source: "Referral",
    owner: "Ellis Vandermeer",
    value: 74500,
    created: "07 Aug 2026",
    lastActivity: "1 day ago",
    factors: [
      { label: "Inbound referral from an existing customer", weight: 25, type: "positive" },
      { label: "Healthcare vertical - 68% historical win rate", weight: 19, type: "positive" },
      { label: "Attended two product webinars", weight: 14, type: "positive" },
      { label: "Security questionnaire submitted", weight: 16, type: "positive" },
      { label: "Long procurement cycle in this vertical", weight: -10, type: "negative" },
    ],
    activities: [
      { time: "1 day ago", text: "Submitted the security questionnaire", icon: "ti-shield-check", tone: "success" },
      { time: "4 days ago", text: "Forwarded the proposal internally", icon: "ti-send", tone: "primary" },
      { time: "1 week ago", text: "Referred by Arclight Media", icon: "ti-users", tone: "success" },
    ],
    explanation:
      "Referral leads in your CRM close at 2.4x the rate of cold outbound. The security questionnaire is a strong late-stage buying signal. The main drag on the score is the procurement cycle in healthcare, which historically adds 3-5 weeks.",
    nextAction: "Send the compliance pack and propose a technical review",
    nextActionDetail: "Deals that clear security review inside 10 days close 40% faster in this vertical.",
  },
  {
    id: "L-2836",
    name: "Tomas Lindqvist",
    title: "Head of Procurement",
    company: "Cobalt Studio",
    avatar: "avatar-03.jpg",
    email: "t.lindqvist@cobaltstudio.se",
    phone: "+46 8 555 0142",
    score: 71,
    probability: 54,
    engagement: 62,
    quality: "Good",
    source: "Trade Show",
    owner: "Adrian Herrera",
    value: 48000,
    created: "11 Aug 2026",
    lastActivity: "3 days ago",
    factors: [
      { label: "Met at SaaStock - warm first touch", weight: 15, type: "positive" },
      { label: "Opened the proposal 4 times", weight: 18, type: "positive" },
      { label: "Procurement role - decision influence", weight: 12, type: "positive" },
      { label: "No activity for 3 days", weight: -9, type: "negative" },
      { label: "Competitor mentioned on the last call", weight: -12, type: "negative" },
    ],
    activities: [
      { time: "3 days ago", text: "Opened the proposal (4th view)", icon: "ti-file-text", tone: "primary" },
      { time: "6 days ago", text: "Call - mentioned evaluating two vendors", icon: "ti-phone", tone: "warning" },
      { time: "2 weeks ago", text: "Met at SaaStock Stockholm", icon: "ti-users", tone: "success" },
    ],
    explanation:
      "Repeat proposal views suggest genuine internal review, but a competitor was named on the last call and there has been no contact for three days. This combination historically precedes a stall in 38% of cases.",
    nextAction: "Send the competitive comparison and re-engage this week",
    nextActionDetail: "Leads re-contacted within 5 days of going quiet recover 2.2x more often.",
  },
  {
    id: "L-2833",
    name: "Nadia Okonkwo",
    title: "Operations Manager",
    company: "Ridgeway Manufacturing",
    avatar: "avatar-04.jpg",
    email: "n.okonkwo@ridgeway.co.uk",
    phone: "+44 20 5550 173",
    score: 58,
    probability: 37,
    engagement: 51,
    quality: "Fair",
    source: "Paid Search",
    owner: "Priya Raghunathan",
    value: 38500,
    created: "13 Aug 2026",
    lastActivity: "5 days ago",
    factors: [
      { label: "Downloaded two comparison guides", weight: 12, type: "positive" },
      { label: "Company size fits mid-market segment", weight: 10, type: "positive" },
      { label: "Manager level - limited signing authority", weight: -11, type: "negative" },
      { label: "Has not booked a demo", weight: -14, type: "negative" },
      { label: "Paid search leads convert at 21%", weight: -8, type: "negative" },
    ],
    activities: [
      { time: "5 days ago", text: "Downloaded \"CRM Buyer's Guide\"", icon: "ti-download", tone: "primary" },
      { time: "1 week ago", text: "Visited the features page", icon: "ti-eye", tone: "primary" },
    ],
    explanation:
      "Early-stage research behaviour with no demo booked and no economic buyer identified. Paid-search leads in this segment convert at 21%, well below your 34% average.",
    nextAction: "Nurture sequence - hold outbound until a demo is booked",
    nextActionDetail: "Enrol in the 6-touch education sequence and re-score after the next engagement.",
  },
  {
    id: "L-2830",
    name: "Ellis Vandermeer",
    title: "CFO",
    company: "Halcyon Partners",
    avatar: "avatar-05.jpg",
    email: "e.vandermeer@halcyon.partners",
    phone: "+1 312 555 0119",
    score: 88,
    probability: 71,
    engagement: 81,
    quality: "Excellent",
    source: "Outbound",
    owner: "Tomas Lindqvist",
    value: 128000,
    created: "01 Aug 2026",
    lastActivity: "6 hours ago",
    factors: [
      { label: "C-level economic buyer engaged directly", weight: 24, type: "positive" },
      { label: "Asked for contract terms", weight: 21, type: "positive" },
      { label: "Highest deal value in the segment", weight: 16, type: "positive" },
      { label: "Three stakeholders now on the thread", weight: 18, type: "positive" },
      { label: "Budget cycle closes in 6 weeks", weight: -7, type: "negative" },
    ],
    activities: [
      { time: "6 hours ago", text: "Asked about multi-year contract terms", icon: "ti-file-text", tone: "success" },
      { time: "2 days ago", text: "Added CTO and COO to the thread", icon: "ti-users-plus", tone: "success" },
      { time: "4 days ago", text: "Attended the executive briefing", icon: "ti-presentation", tone: "primary" },
    ],
    explanation:
      "A CFO asking about contract terms is the single strongest late-stage signal in your history - 79% of such leads closed. Multi-stakeholder expansion in the last 48 hours reinforces this.",
    nextAction: "Send the multi-year pricing proposal today",
    nextActionDetail: "Contract-terms requests answered within 24 hours close 1.8x more often.",
  },
  {
    id: "L-2827",
    name: "Sofia Marchetti",
    title: "Marketing Lead",
    company: "Arclight Media",
    avatar: "avatar-06.jpg",
    email: "s.marchetti@arclight.media",
    phone: "+39 02 5550 921",
    score: 41,
    probability: 24,
    engagement: 38,
    quality: "Fair",
    source: "Content Download",
    owner: "Nadia Okonkwo",
    value: 22000,
    created: "15 Aug 2026",
    lastActivity: "9 days ago",
    factors: [
      { label: "Subscribed to the newsletter", weight: 8, type: "positive" },
      { label: "No engagement in 9 days", weight: -16, type: "negative" },
      { label: "Below target deal size", weight: -10, type: "negative" },
      { label: "Role not in the buying committee", weight: -12, type: "negative" },
    ],
    activities: [
      { time: "9 days ago", text: "Downloaded a whitepaper", icon: "ti-download", tone: "primary" },
      { time: "10 days ago", text: "Subscribed to the newsletter", icon: "ti-mail", tone: "primary" },
    ],
    explanation:
      "Single content download with no follow-through and no buying-committee role. Leads inactive beyond 7 days convert at under 9% without re-engagement.",
    nextAction: "Move to long-term nurture",
    nextActionDetail: "Re-score automatically if the lead returns to the pricing or demo page.",
  },
];

// =======================================================================
// Deals - drives Deal Risk Analysis and the AI Command Center
// =======================================================================

export const deals: AiDeal[] = [
  {
    id: "D-1094",
    name: "Northwind Logistics - Renewal",
    company: "Northwind Logistics",
    owner: "Adrian Herrera",
    avatar: "avatar-01.jpg",
    value: 96000,
    health: 82,
    probability: 92,
    stage: "Contract Review",
    closeDate: "28 Aug 2026",
    age: 34,
    lastContact: "2 hours ago",
    risks: [{ label: "Single-threaded - only one stakeholder engaged", weight: "Medium" }],
    positives: [
      { label: "Legal review already underway" },
      { label: "Champion responded within 2 hours" },
      { label: "Renewal - existing customer since 2024" },
      { label: "Budget confirmed by the economic buyer" },
    ],
    missing: [{ label: "No executive sponsor call logged" }],
    engagement: 88,
    timeline: [
      { time: "2 hours ago", title: "Email reply received", text: "Champion confirmed the redlines are with legal.", tone: "success" },
      { time: "2 days ago", title: "Contract sent", text: "Multi-year agreement shared for review.", tone: "primary" },
      { time: "6 days ago", title: "Pricing call", text: "45-minute call covering the volume tier.", tone: "primary" },
      { time: "2 weeks ago", title: "Renewal opened", text: "Deal created from the renewal pipeline.", tone: "primary" },
    ],
    recommendations: [
      "Add a second stakeholder before signature to reduce single-thread risk",
      "Confirm the legal turnaround date in writing this week",
    ],
    nextAction: "Request an executive sponsor introduction",
    summary:
      "A healthy renewal in the final stage. Legal review is active and the champion is highly responsive. The only meaningful risk is that the deal remains single-threaded 4 days from the expected close date.",
  },
  {
    id: "D-1091",
    name: "Meridian Health - Expansion",
    company: "Meridian Health",
    owner: "Ellis Vandermeer",
    avatar: "avatar-02.jpg",
    value: 74500,
    health: 54,
    probability: 61,
    stage: "Negotiation",
    closeDate: "04 Sep 2026",
    age: 62,
    lastContact: "8 days ago",
    risks: [
      { label: "No contact logged for 8 days", weight: "High" },
      { label: "Deal age is 62 days vs 41-day average", weight: "Medium" },
      { label: "Security review still open", weight: "Medium" },
    ],
    positives: [
      { label: "Existing customer with a strong support record" },
      { label: "Three stakeholders on the thread" },
    ],
    missing: [
      { label: "No demo scheduled with the clinical team" },
      { label: "Pricing not yet agreed in writing" },
    ],
    engagement: 47,
    timeline: [
      { time: "8 days ago", title: "Last email sent", text: "Follow-up on security questionnaire - no reply.", tone: "warning" },
      { time: "12 days ago", title: "Security questionnaire", text: "Submitted to the customer IT team.", tone: "primary" },
      { time: "3 weeks ago", title: "Expansion scoped", text: "Additional 40 seats discussed.", tone: "primary" },
    ],
    recommendations: [
      "Break the 8-day silence today - engagement drops 31% after 10 days",
      "Escalate the security review to your internal compliance contact",
      "Get pricing agreed in writing before the close date slips again",
    ],
    nextAction: "Call the champion directly - email has gone unanswered twice",
    summary:
      "This deal has stalled. Eight days without contact, an open security review and a deal age 51% above your average all point the same way. Expansions that go quiet at this stage slip past their close date 64% of the time.",
  },
  {
    id: "D-1088",
    name: "Cobalt Studio - New Business",
    company: "Cobalt Studio",
    owner: "Priya Raghunathan",
    avatar: "avatar-03.jpg",
    value: 48000,
    health: 38,
    probability: 34,
    stage: "Proposal Sent",
    closeDate: "12 Sep 2026",
    age: 71,
    lastContact: "14 days ago",
    risks: [
      { label: "Competitor named on the last call", weight: "High" },
      { label: "No contact for 14 days", weight: "High" },
      { label: "Proposal viewed but never discussed", weight: "Medium" },
      { label: "Close date already pushed twice", weight: "Medium" },
    ],
    positives: [{ label: "Proposal opened 4 times" }],
    missing: [
      { label: "No decision-maker identified" },
      { label: "No next meeting booked" },
      { label: "Budget never confirmed" },
    ],
    engagement: 22,
    timeline: [
      { time: "14 days ago", title: "Proposal viewed", text: "Fourth view, no response to follow-up.", tone: "warning" },
      { time: "3 weeks ago", title: "Discovery call", text: "Customer mentioned evaluating another vendor.", tone: "danger" },
      { time: "6 weeks ago", title: "Deal created", text: "Inbound from the trade show list.", tone: "primary" },
    ],
    recommendations: [
      "Run a win-back play or disqualify - this deal is consuming forecast credibility",
      "If re-engaging, lead with the competitive comparison, not a discount",
      "Identify the economic buyer before investing further time",
    ],
    nextAction: "Decide this week: re-engage with a competitive play or mark closed-lost",
    summary:
      "The highest-risk deal in the pipeline. A named competitor, two weeks of silence, no identified decision-maker and two close-date pushes. Deals in this state closed 11% of the time historically.",
  },
  {
    id: "D-1085",
    name: "Halcyon Partners - Pilot",
    company: "Halcyon Partners",
    owner: "Tomas Lindqvist",
    avatar: "avatar-05.jpg",
    value: 128000,
    health: 76,
    probability: 74,
    stage: "Negotiation",
    closeDate: "19 Sep 2026",
    age: 28,
    lastContact: "6 hours ago",
    risks: [{ label: "Budget cycle closes in 6 weeks", weight: "Medium" }],
    positives: [
      { label: "CFO engaged directly as economic buyer" },
      { label: "Contract terms requested" },
      { label: "Three stakeholders active" },
      { label: "Fastest-moving deal in the quarter" },
    ],
    missing: [{ label: "Implementation plan not yet shared" }],
    engagement: 81,
    timeline: [
      { time: "6 hours ago", title: "Terms requested", text: "CFO asked about multi-year pricing.", tone: "success" },
      { time: "2 days ago", title: "Stakeholders added", text: "CTO and COO joined the thread.", tone: "success" },
      { time: "1 week ago", title: "Executive briefing", text: "Full leadership team attended.", tone: "primary" },
    ],
    recommendations: [
      "Send multi-year pricing within 24 hours while intent is high",
      "Attach the implementation plan to pre-empt the next objection",
    ],
    nextAction: "Send the multi-year proposal today",
    summary:
      "Your strongest active deal. A CFO requesting contract terms is the highest-converting signal in your history, and stakeholder count has grown in the last 48 hours.",
  },
  {
    id: "D-1082",
    name: "Arclight Media - Upsell",
    company: "Arclight Media",
    owner: "Nadia Okonkwo",
    avatar: "avatar-06.jpg",
    value: 62000,
    health: 64,
    probability: 58,
    stage: "Proposal Sent",
    closeDate: "26 Sep 2026",
    age: 45,
    lastContact: "4 days ago",
    risks: [
      { label: "Champion changed roles mid-cycle", weight: "Medium" },
      { label: "Usage down 12% quarter on quarter", weight: "Medium" },
    ],
    positives: [
      { label: "Existing customer, renewed twice" },
      { label: "New champion responded within a day" },
    ],
    missing: [{ label: "ROI case not yet presented" }],
    engagement: 59,
    timeline: [
      { time: "4 days ago", title: "New champion intro", text: "Handover call with the incoming owner.", tone: "primary" },
      { time: "2 weeks ago", title: "Champion left", text: "Original contact moved to another team.", tone: "warning" },
      { time: "5 weeks ago", title: "Upsell proposed", text: "Additional module scoped.", tone: "primary" },
    ],
    recommendations: [
      "Re-run discovery with the new champion - do not assume continuity",
      "Address the 12% usage decline before asking for expansion budget",
    ],
    nextAction: "Present the ROI case to the new champion",
    summary:
      "A recoverable deal disrupted by a champion change. The new contact is responsive, but declining usage weakens the expansion argument until it is addressed directly.",
  },
];

// =======================================================================
// Insights - drives AI Insights and the AI Command Center feed
// =======================================================================

export const insights: AiInsight[] = [
  {
    id: "I-01",
    category: "risk",
    severity: "critical",
    title: "3 deals worth FCFA 184K have gone quiet",
    body:
      "Meridian Health, Cobalt Studio and two smaller deals have had no logged contact for 8+ days. Combined, they represent 22% of your committed forecast this quarter.",
    why: "Deals with no contact for 8+ days at Negotiation or later slipped past their close date 64% of the time across your last 4 quarters.",
    action: "Review stalled deals",
    link: "deal-risk-analysis.html",
    metric: "FCFA 184K",
    metricLabel: "at risk",
    icon: "ti-alert-hexagon",
    tone: "danger",
    date: "2026-08-25",
  },
  {
    id: "I-02",
    category: "revenue",
    severity: "opportunity",
    title: "Q3 forecast is tracking 8.4% ahead of last quarter",
    body:
      "Weighted forecast now stands at FCFA 845K against a FCFA 920K quota. Commit-category deals have grown FCFA 62K week over week, Partners and Northwind Logistics.",
    why: "Based on weighted pipeline across 53 open deals using stage-level historical win rates.",
    action: "Open forecast",
    link: "sales-forecasting.html",
    metric: "FCFA 845K",
    metricLabel: "weighted forecast",
    icon: "ti-trending-up",
    tone: "success",
    date: "2026-08-25",
  },
  {
    id: "I-03",
    category: "lead",
    severity: "high",
    title: "5 high-intent leads have not been contacted in 24 hours",
    body:
      "Marcus Whitfield and four others scored above 80 and showed pricing-page intent, but no outreach has been logged since the signal fired.",
    why: "Leads contacted within 24 hours of a pricing-page visit convert 3.1x more often than those contacted after 48 hours.",
    action: "Review scored leads",
    link: "ai-lead-scoring.html",
    metric: "5",
    metricLabel: "leads waiting",
    icon: "ti-target-arrow",
    tone: "warning",
    date: "2026-08-25",
  },
  {
    id: "I-04",
    category: "customer",
    severity: "critical",
    title: "Arclight Media usage dropped 12% this quarter",
    body: "Login frequency and active seats have both declined while an upsell is in flight. The account renews in 74 days.",
    why: "Accounts with a 10%+ usage decline in the quarter before renewal churned at 3.4x the baseline rate.",
    action: "View account",
    link: "companies.html",
    metric: "-12%",
    metricLabel: "usage change",
    icon: "ti-heart-broken",
    tone: "danger",
    date: "2026-08-24",
  },
  {
    id: "I-05",
    category: "performance",
    severity: "medium",
    title: "Tomas Lindqvist is 24% behind quota with 5 weeks left",
    body:
      "Closed-won sits at FCFA 96K against a FCFA 220K quota. Weighted forecast adds FCFA 71K, leaving a FCFA 53K gap. Activity volume is 31% below team average.",
    why: "Reps below 80% attainment at this point in the quarter finished below quota in 71% of prior quarters without an intervention.",
    action: "Open team report",
    link: "team-performance-report.html",
    metric: "76%",
    metricLabel: "projected attainment",
    icon: "ti-user-exclamation",
    tone: "warning",
    date: "2026-08-24",
  },
  {
    id: "I-06",
    category: "revenue",
    severity: "opportunity",
    title: "FCFA 240K of expansion revenue is available in 6 accounts",
    body:
      "Six existing customers are at or above 85% seat utilisation with no open expansion deal. Median expansion size in this cohort is FCFA 40K.",
    why: "Accounts crossing 85% utilisation accepted an expansion offer 47% of the time within two quarters.",
    action: "View accounts",
    link: "companies.html",
    metric: "FCFA 240K",
    metricLabel: "expansion potential",
    icon: "ti-coin",
    tone: "success",
    date: "2026-08-23",
  },
  {
    id: "I-07",
    category: "deal",
    severity: "high",
    title: "Proposal-to-close time has grown from 12 to 19 days",
    body:
      "Average time in the Proposal Sent stage increased 58% over the last two quarters. Eleven deals are currently sitting in this stage beyond 15 days.",
    why: "Correlated with a drop in follow-up activity within 48 hours of proposal delivery, down from 82% to 54% of proposals.",
    action: "View pipeline report",
    link: "pipeline-stage-report.html",
    metric: "19 days",
    metricLabel: "avg. time in stage",
    icon: "ti-clock-exclamation",
    tone: "warning",
    date: "2026-08-22",
  },
  {
    id: "I-08",
    category: "lead",
    severity: "opportunity",
    title: "Referral leads convert 2.4x better than paid search",
    body: "Referrals closed at 51% this quarter against 21% for paid search, yet referrals make up only 9% of new lead volume.",
    why: "Based on 340 leads across six sources over the last two quarters.",
    action: "View lead report",
    link: "lead-reports.html",
    metric: "2.4x",
    metricLabel: "conversion advantage",
    icon: "ti-users-plus",
    tone: "success",
    date: "2026-08-21",
  },
  {
    id: "I-09",
    category: "customer",
    severity: "medium",
    title: "Support ticket volume up 34% for Meridian Health",
    body:
      "Fourteen tickets opened in the last 30 days against a 30-day average of 10.4, while an expansion deal is in negotiation.",
    why: "Elevated ticket volume during an open expansion reduced win rate by 28% historically.",
    action: "View tickets",
    link: "tickets.html",
    metric: "+34%",
    metricLabel: "ticket volume",
    icon: "ti-lifebuoy",
    tone: "warning",
    date: "2026-08-20",
  },
];

// =======================================================================
// Recommended next actions - AI Command Center
// =======================================================================

export const actions: AiAction[] = [
  {
    title: "Call Meridian Health before the day ends",
    meta: "Deal stalled 8 days · FCFA 74.5K at risk",
    icon: "ti-phone",
    tone: "danger",
    link: "deal-risk-analysis.html",
    cta: "Open deal",
  },
  {
    title: "Send multi-year pricing to Halcyon Partners",
    meta: "CFO requested terms 6 hours ago · FCFA 128K",
    icon: "ti-file-dollar",
    tone: "success",
    link: "ai-email-composer.html",
    cta: "Draft email",
  },
  {
    title: "Contact Marcus Whitfield - score 92",
    meta: "Viewed pricing 6x · no outreach logged",
    icon: "ti-target-arrow",
    tone: "warning",
    link: "ai-lead-scoring.html",
    cta: "View lead",
  },
  {
    title: "Review the Arclight Media usage decline",
    meta: "Renews in 74 days · usage down 12%",
    icon: "ti-heart-broken",
    tone: "danger",
    link: "ai-insights.html",
    cta: "View insight",
  },
  {
    title: "Coach Tomas Lindqvist on pipeline generation",
    meta: "76% projected attainment · 5 weeks left",
    icon: "ti-user-exclamation",
    tone: "warning",
    link: "team-performance-report.html",
    cta: "Open report",
  },
];

// AI Command Center's actions-queue summary strip ("Revenue impact"). Not
// derived from `actions` (which carries no dollar field) - a standalone
// figure in the original template.
export const AI_COMMAND_ACTIONS_REVENUE_IMPACT = "FCFA 372K";

// =======================================================================
// AI Email Composer - canned copy keyed by purpose, tone and length
// =======================================================================

export interface AiEmailBodyTemplate {
  subject: string;
  body: string;
}

export type AiEmailPurpose = "followup" | "proposal" | "reengage" | "intro" | "renewal" | "thanks";
export type AiEmailTone = "formal" | "friendly" | "direct" | "consultative";
export type AiEmailLength = "short" | "medium" | "long";

export const AI_EMAIL_BODIES: Record<AiEmailPurpose, AiEmailBodyTemplate> = {
  followup: {
    subject: "Following up on our conversation, {{first_name}}",
    body:
      "Hi {{first_name}},\n\nThanks for taking the time to walk me through how {{company}} is handling operations ahead of the Q3 rollout. The point about reporting overhead across your regional teams stuck with me.\n\nBased on what you described, the piece most likely to move the needle is consolidated reporting - teams your size typically recover 6-8 hours a week once that is in place.\n\nWould a 20-minute session with your operations lead next week be useful? I can walk through exactly how that would map to your current setup.\n\nBest,\n{{sender_name}}",
  },
  proposal: {
    subject: "Proposal for {{company}} - {{deal_name}}",
    body:
      "Hi {{first_name}},\n\nAttached is the proposal we discussed, covering the scope your team outlined and the volume tier that fits {{company}}'s current headcount.\n\nThree things worth flagging:\n\n- Pricing holds through the end of the quarter\n- Implementation runs 3-4 weeks with your team needing roughly 2 hours a week\n- The multi-year option reduces the annual figure by 14%\n\nHappy to walk through it live if that is easier than reading it cold.\n\nBest,\n{{sender_name}}",
  },
  reengage: {
    subject: "Still the right time, {{first_name}}?",
    body:
      "Hi {{first_name}},\n\nI have not heard back since we shared the proposal, which usually means one of three things - priorities shifted, the timing moved, or it simply fell down the list.\n\nAny of those is completely fine. If {{company}} has paused this for now, just say the word and I will stop chasing.\n\nIf it is still live, I am happy to jump on a short call and answer whatever is outstanding.\n\nBest,\n{{sender_name}}",
  },
  intro: {
    subject: "Quick question about {{company}}'s pipeline reporting",
    body:
      "Hi {{first_name}},\n\nI noticed {{company}} has been scaling the operations team quickly this year. Teams hitting that stage usually run into the same wall - reporting that worked at 20 people stops working at 60.\n\nWe help operations leads consolidate that into one view without adding tooling overhead.\n\nWorth a short conversation, or is this already solved on your side?\n\nBest,\n{{sender_name}}",
  },
  renewal: {
    subject: "Your {{company}} renewal - a few options",
    body:
      "Hi {{first_name}},\n\nYour agreement renews on {{renewal_date}}, so I wanted to get ahead of it.\n\nUsage has been strong this year - your team is at 88% seat utilisation, which is above where most accounts sit. That usually means it is worth reviewing tiers rather than renewing like for like.\n\nI have put together two options. Shall I send them over, or would a quick call be easier?\n\nBest,\n{{sender_name}}",
  },
  thanks: {
    subject: "Thanks for your time today, {{first_name}}",
    body:
      "Hi {{first_name}},\n\nThanks for the conversation today - genuinely useful context on how {{company}} is structured across regions.\n\nTo recap what we agreed:\n\n- I will send the security documentation by Thursday\n- You will loop in your IT lead for the technical review\n- We will reconvene the week after next\n\nAnything I have missed, just let me know.\n\nBest,\n{{sender_name}}",
  },
};

export const AI_EMAIL_TONE_OPENERS: Record<AiEmailTone, string> = {
  formal: "Dear {{first_name}},",
  friendly: "Hi {{first_name}},",
  direct: "{{first_name}} -",
  consultative: "Hi {{first_name}},",
};

export const AI_EMAIL_TONE_NOTES: Record<AiEmailTone, string> = {
  formal: "Formal tone applied - contractions removed, closing made more traditional.",
  friendly: "Friendly tone applied - conversational phrasing, lighter closing.",
  direct: "Direct tone applied - shorter sentences, the ask moved up.",
  consultative: "Consultative tone applied - leads with the customer problem before the ask.",
};

export interface AiEmailDraft {
  subject: string;
  body: string;
}

// Ports BODIES[purpose].body through the same tone/length transforms as the
// original compose() so a purpose+tone+length combination always yields the
// same draft the static template produced.
export function applyEmailTone(text: string, tone: string): string {
  let out = text;
  if (tone === "formal") {
    out = out
      .replace(/^Hi \{\{first_name\}\},/m, AI_EMAIL_TONE_OPENERS.formal)
      // these two replacements are no-ops against the current copy (nothing
      // in the templates is contracted) - preserved verbatim from the
      // source template for behavioural parity
      .replace(/\bI have not\b/g, "I have not")
      .replace(/\bdo not\b/g, "do not")
      .replace(/Best,/, "Kind regards,");
  } else if (tone === "direct") {
    out = out
      .replace(/^Hi \{\{first_name\}\},/m, AI_EMAIL_TONE_OPENERS.direct)
      // this pattern looks for a literal newline between "walk" and
      // "through" that the templates never contain (they use a plain
      // space), so - as in the source - it never actually matches
      .replace(
        /Would a 20-minute session with your operations lead next week be useful\? I can walk\nthrough exactly how that would map to your current setup\./,
        "Can we book 20 minutes next week?"
      );
  }
  return out;
}

export function applyEmailLength(text: string, length: string): string {
  if (length === "short") {
    // keep greeting, first paragraph and sign-off
    const blocks = text.split("\n\n");
    return [blocks[0], blocks[1], blocks[blocks.length - 1]].join("\n\n");
  }
  if (length === "long") {
    const parts = text.split("\n\n");
    parts.splice(
      parts.length - 1,
      0,
      "For context, teams in your sector typically see the first measurable change within the first month, and we can share benchmarks from comparable rollouts if that would help build the internal case."
    );
    return parts.join("\n\n");
  }
  return text;
}

export function composeEmail(purpose: string, tone: string, length: string): AiEmailDraft {
  const pack = AI_EMAIL_BODIES[purpose as AiEmailPurpose] || AI_EMAIL_BODIES.followup;
  const body = applyEmailLength(applyEmailTone(pack.body, tone), length);
  return { subject: pack.subject, body };
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTimeMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

export interface AiMergeFieldSegment {
  text: string;
  isMergeField: boolean;
}

// ai-crm.js's highlightVars() wrapped {{merge_field}} tokens in
// <span class="ai-var">...</span> and set them via innerHTML. Returning
// segments instead lets a component style each token in JSX without this
// data file building HTML strings.
export function parseMergeFields(text: string): AiMergeFieldSegment[] {
  const segments: AiMergeFieldSegment[] = [];
  const re = /\{\{([a-z_]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isMergeField: false });
    }
    segments.push({ text: match[0], isMergeField: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isMergeField: false });
  }
  return segments;
}

// =======================================================================
// AI Settings - provider -> model list for the ai_model select
// =======================================================================

export const AI_MODEL_PROVIDERS: Record<string, string[]> = {
  anthropic: ["Claude Opus 4.5", "Claude Sonnet 4.5", "Claude Haiku 4.5"],
  openai: ["GPT-5", "GPT-5 mini", "GPT-4.1"],
  google: ["Gemini 2.5 Pro", "Gemini 2.5 Flash"],
  azure: ["Azure GPT-5", "Azure GPT-4.1"],
  selfhosted: ["Llama 4 70B", "Mistral Large", "Custom endpoint"],
};

// =======================================================================
// Ask Your Data - canned Q&A library keyed by trigger phrases
// =======================================================================

export interface AiAskKpi {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}

export interface AiAskTable {
  columns: string[];
  rows: string[][];
  // tone per cell (aligned to rows/columns) for cells the original template
  // rendered as a colored badge/pill, e.g. a risk band or attainment %
  cellTones?: (string | null)[][];
}

export interface AiAskChartSeries {
  name: string;
  data: number[];
}

export interface AiAskChart {
  type: "bar" | "donut";
  categories?: string[];
  series: AiAskChartSeries[];
  colors?: string[];
  horizontal?: boolean;
  stacked?: boolean;
  distributed?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

export interface AiAskAnswer {
  // may contain inline <strong> tags, verbatim from the source template
  text: string;
  kpis: AiAskKpi[];
  table?: AiAskTable;
  chart?: AiAskChart;
  followups: string[];
}

export interface AiAskLibraryEntry {
  id: string;
  keys: string[];
  answer: AiAskAnswer;
}

export const AI_ASK_LIBRARY: AiAskLibraryEntry[] = [
  {
    id: "closing",
    keys: ["close this month", "likely to close", "closing", "close soon"],
    answer: {
      text:
        "Four deals have a closing probability above 55% with an expected close date inside this quarter. Together they represent <strong>FCFA 361K</strong> in weighted pipeline. Halcyon Partners and Northwind Logistics are the two most likely to land - both have active buying signals in the last 48 hours.",
      kpis: [
        { label: "Deals likely to close", value: "4" },
        { label: "Combined value", value: "FCFA 360.5K" },
        { label: "Weighted value", value: "FCFA 252K" },
        { label: "Avg. probability", value: "71%", sub: "+6% vs last month", tone: "success" },
      ],
      table: {
        columns: ["Deal", "Value", "Stage", "Close date", "Probability", "Risk"],
        rows: [
          ["Northwind Logistics - Renewal", "FCFA 96,000", "Contract Review", "28 Aug 2026", "92%", "Low Risk"],
          ["Halcyon Partners - Pilot", "FCFA 128,000", "Negotiation", "19 Sep 2026", "74%", "Low Risk"],
          ["Meridian Health - Expansion", "FCFA 74,500", "Negotiation", "04 Sep 2026", "61%", "Medium Risk"],
          ["Arclight Media - Upsell", "FCFA 62,000", "Proposal Sent", "26 Sep 2026", "58%", "Medium Risk"],
        ],
        cellTones: [
          [null, null, null, null, null, "success"],
          [null, null, null, null, null, "success"],
          [null, null, null, null, null, "warning"],
          [null, null, null, null, null, "warning"],
        ],
      },
      chart: {
        type: "bar",
        horizontal: true,
        categories: ["Northwind Renewal", "Halcyon Pilot", "Meridian Expansion", "Arclight Upsell"],
        series: [{ name: "Probability", data: [92, 74, 61, 58] }],
        colors: ["#3B44F6"],
        valueSuffix: "%",
      },
      followups: ["Which of these have no meeting booked?", "What is our current pipeline value?"],
    },
  },
  {
    id: "leads",
    keys: ["conversion probability", "highest conversion", "best leads", "top leads", "lead"],
    answer: {
      text:
        "Five leads currently score above 55 with a conversion probability worth acting on. <strong>Marcus Whitfield</strong> is the strongest at 92 - six pricing-page views and a demo request inside five days. Referral-sourced leads again dominate the top of this list.",
      kpis: [
        { label: "Hot leads", value: "3" },
        { label: "Avg. score (top 5)", value: "78.8" },
        { label: "Avg. probability", value: "61%" },
        { label: "Uncontacted 24h+", value: "5", sub: "needs attention", tone: "danger" },
      ],
      table: {
        columns: ["Lead", "Company", "Score", "Probability", "Source", "Band"],
        rows: [
          ["Marcus Whitfield", "Northwind Logistics", "92", "78%", "Webinar", "Hot"],
          ["Ellis Vandermeer", "Halcyon Partners", "88", "71%", "Outbound", "Hot"],
          ["Priya Raghunathan", "Meridian Health", "84", "66%", "Referral", "Hot"],
          ["Tomas Lindqvist", "Cobalt Studio", "71", "54%", "Trade Show", "Warm"],
          ["Nadia Okonkwo", "Ridgeway Manufacturing", "58", "37%", "Paid Search", "Warm"],
        ],
        cellTones: [
          [null, null, null, null, null, "danger"],
          [null, null, null, null, null, "danger"],
          [null, null, null, null, null, "danger"],
          [null, null, null, null, null, "warning"],
          [null, null, null, null, null, "warning"],
        ],
      },
      followups: ["Which leads have not been contacted?", "Which source converts best?"],
    },
  },
  {
    id: "reps",
    keys: ["sales representative", "sales rep", "top-performing", "top performing", "rep", "quota", "team"],
    answer: {
      text:
        "Ellis Vandermeer leads the team at <strong>118% quota attainment</strong>, followed by Adrian Herrera at 101%. Two reps are tracking below 80% with five weeks left in the quarter - Tomas Lindqvist at 76% and Nadia Okonkwo at 61%.",
      kpis: [
        { label: "Above quota", value: "2 of 5" },
        { label: "Team attainment", value: "91.8%" },
        { label: "Top performer", value: "E. Vandermeer" },
        { label: "Needs coaching", value: "2", tone: "warning", sub: "below 80%" },
      ],
      table: {
        columns: ["Sales rep", "Quota", "Closed won", "Attainment"],
        rows: [
          ["Ellis Vandermeer", "FCFA 150K", "FCFA 139K", "118%"],
          ["Adrian Herrera", "FCFA 220K", "FCFA 168K", "101%"],
          ["Priya Raghunathan", "FCFA 180K", "FCFA 121K", "93%"],
          ["Tomas Lindqvist", "FCFA 220K", "FCFA 96K", "76%"],
          ["Nadia Okonkwo", "FCFA 150K", "FCFA 58K", "61%"],
        ],
        cellTones: [
          [null, null, null, "success"],
          [null, null, null, "success"],
          [null, null, null, "warning"],
          [null, null, null, "danger"],
          [null, null, null, "danger"],
        ],
      },
      chart: {
        type: "bar",
        distributed: true,
        categories: ["Vandermeer", "Herrera", "Raghunathan", "Lindqvist", "Okonkwo"],
        series: [{ name: "Attainment", data: [118, 101, 93, 76, 61] }],
        colors: ["#22C55E", "#22C55E", "#FFA800", "#FF6B6B", "#FF6B6B"],
        valueSuffix: "%",
      },
      followups: ["Why is Tomas behind quota?", "Show my top-performing sales representatives."],
    },
  },
  {
    id: "atRisk",
    keys: ["at risk", "churn", "customers at risk", "risk"],
    answer: {
      text:
        "Three accounts show churn or slip risk this quarter. <strong>Arclight Media</strong> is the most urgent - usage down 12% with a renewal in 74 days and an open upsell. <strong>Meridian Health</strong> has elevated support volume during an active expansion.",
      kpis: [
        { label: "Accounts at risk", value: "3" },
        { label: "Revenue exposed", value: "FCFA 248K", tone: "danger", sub: "ARR at risk" },
        { label: "Avg. health score", value: "52" },
        { label: "Renewals < 90 days", value: "2" },
      ],
      table: {
        columns: ["Account", "Health", "Signal", "Renewal", "ARR"],
        rows: [
          ["Arclight Media", "38", "Usage down 12%", "74 days", "FCFA 96K"],
          ["Meridian Health", "54", "Support tickets +34%", "112 days", "FCFA 88K"],
          ["Cobalt Studio", "61", "Champion left", "156 days", "FCFA 64K"],
        ],
        cellTones: [
          [null, "danger", null, null, null],
          [null, "warning", null, null, null],
          [null, "warning", null, null, null],
        ],
      },
      followups: ["What is driving the Arclight usage decline?", "Which deals are most likely to close this month?"],
    },
  },
  {
    id: "pipeline",
    keys: ["pipeline value", "pipeline", "forecast"],
    answer: {
      text:
        "Total open pipeline is <strong>FCFA 1.84M</strong> across 53 deals. Weighted by stage probability that comes to <strong>FCFA 845K</strong> against a FCFA 920K quota - a coverage ratio of 2.0x, below the 3.0x you typically need at this point in the quarter.",
      kpis: [
        { label: "Open pipeline", value: "FCFA 1.84M" },
        { label: "Weighted forecast", value: "FCFA 845K", sub: "+8.4% vs last quarter", tone: "success" },
        { label: "Quota", value: "FCFA 920K" },
        { label: "Coverage ratio", value: "2.0x", sub: "below 3.0x target", tone: "warning" },
      ],
      chart: {
        type: "bar",
        stacked: true,
        categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        series: [
          { name: "Commit", data: [310, 340, 365, 355, 395, 410] },
          { name: "Best Case", data: [120, 145, 130, 160, 175, 190] },
          { name: "Pipeline", data: [180, 165, 195, 210, 230, 245] },
        ],
        colors: ["#22C55E", "#0DCAF0", "#FFA800"],
        valuePrefix: "$",
        valueSuffix: "K",
      },
      followups: ["Which deals have been inactive for more than 30 days?", "Which customers are at risk?"],
    },
  },
  {
    id: "inactive",
    keys: ["inactive", "30 days", "stalled", "quiet"],
    answer: {
      text:
        "Two deals worth <strong>FCFA 122.5K</strong> have had no logged activity for more than 30 days, and a further six have been quiet for 8-29 days. Cobalt Studio is the most exposed - 71 days old, no decision-maker identified and a competitor already named.",
      kpis: [
        { label: "Inactive 30+ days", value: "2" },
        { label: "Value stalled", value: "FCFA 122.5K", tone: "danger" },
        { label: "Inactive 8-29 days", value: "6" },
        { label: "Avg. days quiet", value: "19" },
      ],
      table: {
        columns: ["Deal", "Value", "Days inactive", "Stage", "Owner"],
        rows: [
          ["Cobalt Studio - New Business", "FCFA 48,000", "14 days", "Proposal Sent", "Priya Raghunathan"],
          ["Meridian Health - Expansion", "FCFA 74,500", "8 days", "Negotiation", "Ellis Vandermeer"],
        ],
        cellTones: [
          [null, null, "danger", null, null],
          [null, null, "warning", null, null],
        ],
      },
      followups: ["Which customers are at risk?", "Draft a re-engagement email"],
    },
  },
];

// Default prompt suggestions shown before the visitor has asked anything
export const AI_ASK_SUGGESTIONS: string[] = [
  "Which deals are most likely to close this month?",
  "Which leads have the highest conversion probability?",
  "Show my top-performing sales representatives.",
  "Which customers are at risk?",
  "What is our current pipeline value?",
  "Which deals have been inactive for more than 30 days?",
];

export const AI_ASK_NO_MATCH_TEXT = "I could not match that to the demo dataset in this template.";
export const AI_ASK_NO_MATCH_HINT =
  "This is a static template, so answers come from a fixed library of example questions. Try one of these:";

// Chip shown in the AI message toolbar, e.g. "53 deals · 6 leads"
export const AI_ASK_DATA_SCOPE_LABEL = `53 deals · ${leads.length} leads`;

// Finds the first library entry whose trigger phrase appears in the
// question, matching ai-crm.js's answerFor() keyword search order.
export function findAskAnswer(question: string): AiAskLibraryEntry | undefined {
  const q = question.toLowerCase();
  return AI_ASK_LIBRARY.find((entry) => entry.keys.some((key) => q.indexOf(key) > -1));
}
