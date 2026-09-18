/*
  Generated from html/assets/json/pipeline-stage.js (DataTable init).
  Only the keys the source `columns` render map reads are kept.
  The source reuses generic slots: `emp-id` holds the stage name, `remarks` the deal count and `budget` the pipeline value.
*/

export interface PipelineStageData {
  key: string;
  Stage: string;
  TotalDeals: string;
  PipelineValue: string;
  AvgDealSize: string;
  WinRate: string;
  AvgDaysInStage: string;
}

export const PipelineStageReportData: PipelineStageData[] = [
  { key: "1", Stage: "Appointment", TotalDeals: "12", PipelineValue: "$200000", AvgDealSize: "$5,000", WinRate: "80%", AvgDaysInStage: "12" },
  { key: "2", Stage: "Proposal Made", TotalDeals: "05", PipelineValue: "$300000", AvgDealSize: "$8,000", WinRate: "70%", AvgDaysInStage: "08" },
  { key: "3", Stage: "Presentation", TotalDeals: "20", PipelineValue: "$200000", AvgDealSize: "$10,000", WinRate: "65%", AvgDaysInStage: "15" },
  { key: "4", Stage: "Contact Made", TotalDeals: "13", PipelineValue: "$300000", AvgDealSize: "$12,000", WinRate: "85%", AvgDaysInStage: "10" },
  { key: "5", Stage: "Quality to Buy", TotalDeals: "20", PipelineValue: "$120000", AvgDealSize: "$80,000", WinRate: "72%", AvgDaysInStage: "05" },
];
