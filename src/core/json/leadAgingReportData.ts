/*
  Generated from html/assets/json/lead-aging-report.js (DataTable init).
  Only the keys the source `columns` render map reads are kept.
  `rating` 0-3 maps to the Risk Level label + tone (note the source lowercases "low").
*/

export interface LeadAgingData {
  key: string;
  LeadId: string;
  LeadName: string;
  LeadImage: string;
  Status: string;
  StatusTone: string;
  DaysInStatus: string;
  AgingBucket: string;
  LastActivity: string;
  OwnerName: string;
  OwnerImage: string;
  RiskLevel: string;
  RiskTone: string;
}

export const LeadAgingReportData: LeadAgingData[] = [
  { key: "1", LeadId: "#LED0020", LeadName: "Elizabeth Morgan", LeadImage: "assets/img/profiles/avatar-20.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "12", AgingBucket: "08-14 Days", LastActivity: "25 Apr 2026", OwnerName: "Robert Johnson", OwnerImage: "assets/img/profiles/avatar-14.jpg", RiskLevel: "High", RiskTone: "badge-soft-danger" },
  { key: "2", LeadId: "#LED0019", LeadName: "Katherine Brooks", LeadImage: "assets/img/profiles/avatar-19.jpg", Status: "Not Closed", StatusTone: "bg-info", DaysInStatus: "05", AgingBucket: "03-07 Days", LastActivity: "03 Apr 2025", OwnerName: "Isabella Cooper", OwnerImage: "assets/img/profiles/avatar-15.jpg", RiskLevel: "Medium", RiskTone: "badge-soft-warning" },
  { key: "3", LeadId: "#LED0018", LeadName: "Samantha Reed", LeadImage: "assets/img/profiles/avatar-18.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "20", AgingBucket: "15+ Days", LastActivity: "29 Mar 2026", OwnerName: "John Smith", OwnerImage: "assets/img/profiles/avatar-16.jpg", RiskLevel: "Critical", RiskTone: "badge-soft-purple" },
  { key: "4", LeadId: "#LED0017", LeadName: "William Anderson", LeadImage: "assets/img/profiles/avatar-17.jpg", Status: "Contacted", StatusTone: "bg-warning", DaysInStatus: "13", AgingBucket: "8-14 Days", LastActivity: "25 Mar 2026", OwnerName: "Sophia Parker", OwnerImage: "assets/img/profiles/avatar-17.jpg", RiskLevel: "High", RiskTone: "badge-soft-danger" },
  { key: "5", LeadId: "#LED0016", LeadName: "Jonathan Mitchell", LeadImage: "assets/img/profiles/avatar-16.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "04", AgingBucket: "3-7 Days", LastActivity: "17 Mar 2026", OwnerName: "Ethan Reynolds", OwnerImage: "assets/img/profiles/avatar-01.jpg", RiskLevel: "Medium", RiskTone: "badge-soft-warning" },
  { key: "6", LeadId: "#LED0015", LeadName: "Jennifer Adams", LeadImage: "assets/img/profiles/avatar-15.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "17", AgingBucket: "15+ Days", LastActivity: "08 Mar 2026", OwnerName: "Liam Carter", OwnerImage: "assets/img/profiles/avatar-02.jpg", RiskLevel: "Critical", RiskTone: "badge-soft-purple" },
  { key: "7", LeadId: "#LED0014", LeadName: "Alexander Carter", LeadImage: "assets/img/profiles/avatar-14.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "04", AgingBucket: "3-7 Days", LastActivity: "20 Feb 2026", OwnerName: "Noah Mitchell", OwnerImage: "assets/img/profiles/avatar-03.jpg", RiskLevel: "Medium", RiskTone: "badge-soft-warning" },
  { key: "8", LeadId: "#LED0013", LeadName: "Benjamin Harrison", LeadImage: "assets/img/profiles/avatar-13.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "21", AgingBucket: "15+ Days", LastActivity: "12 Feb 2026", OwnerName: "Mason Hayes", OwnerImage: "assets/img/profiles/avatar-04.jpg", RiskLevel: "Critical", RiskTone: "badge-soft-purple" },
  { key: "9", LeadId: "#LED0012", LeadName: "Nicholas Wright", LeadImage: "assets/img/profiles/avatar-12.jpg", Status: "Closed", StatusTone: "bg-success", DaysInStatus: "01", AgingBucket: "0-2 Days", LastActivity: "15 Jan 2026", OwnerName: "Ron Thompson", OwnerImage: "assets/img/profiles/avatar-05.jpg", RiskLevel: "low", RiskTone: "badge-soft-success" },
  { key: "10", LeadId: "#LED0011", LeadName: "Alexandra Bennett", LeadImage: "assets/img/profiles/avatar-11.jpg", Status: "Lost", StatusTone: "bg-danger", DaysInStatus: "25", AgingBucket: "15+ Days", LastActivity: "05 Jan 2026", OwnerName: "Leslie Schweiger", OwnerImage: "assets/img/profiles/avatar-10.jpg", RiskLevel: "Critical", RiskTone: "badge-soft-purple" },
];
