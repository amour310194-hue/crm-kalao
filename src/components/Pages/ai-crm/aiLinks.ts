"use client";
import { all_routes } from "@/router/all_routes";

/*
  The AI CRM datasets carry their destinations as the html reference's own file
  names (e.g. "deal-risk-analysis.html"). Map those onto app routes so the
  insight/action buttons land where the reference sends them.
*/
const AI_LINK_ROUTES: Record<string, string> = {
  "ai-command-center.html": all_routes.aiCommandCenter,
  "ai-insights.html": all_routes.aiInsights,
  "ai-lead-scoring.html": all_routes.aiLeadScoring,
  "ai-email-composer.html": all_routes.aiEmailComposer,
  "ai-settings.html": all_routes.aiSettings,
  "deal-risk-analysis.html": all_routes.dealRiskAnalysis,
  "companies.html": all_routes.companiesGrid,
  "lead-reports.html": all_routes.leadReports,
  "pipeline-stage-report.html": all_routes.pipelineStageReport,
  "sales-forecasting.html": all_routes.salesForecasting,
  "team-performance-report.html": all_routes.teamPerformanceReport,
  "tickets.html": all_routes.tickets,
};

export function aiLink(link: string): string {
  return AI_LINK_ROUTES[link] ?? all_routes.aiCommandCenter;
}
