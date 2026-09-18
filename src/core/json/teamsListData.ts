/*
  Teams (html/teams-list.html + html/assets/json/teams-list.js).
  `status` "0"/"1" converted to a readable "Active" | "Inactive".
*/

export type TeamStatus = "Active" | "Inactive";

export interface TeamData {
  key: string;
  TeamId: string;
  TeamName: string;
  TeamLead: string;
  TeamLeadImage: string;
  MembersCount: string;
  TargetRevenue: string;
  Status: TeamStatus;
}

export const TeamsListData: TeamData[] = [
  { key: "1", TeamId: "#TEA601", TeamName: "Business Development", TeamLead: "Elijah Blackwood", TeamLeadImage: "assets/img/profiles/avatar-15.jpg", MembersCount: "18 Members", TargetRevenue: "$250,000", Status: "Active" },
  { key: "2", TeamId: "#TEA602", TeamName: "Brand & Communications", TeamLead: "Scarlett Beaumont", TeamLeadImage: "assets/img/profiles/avatar-05.jpg", MembersCount: "20 Members", TargetRevenue: "$50,000", Status: "Inactive" },
  { key: "3", TeamId: "#TEA603", TeamName: "Brand & Communications", TeamLead: "Owen Sterling", TeamLeadImage: "assets/img/profiles/avatar-01.jpg", MembersCount: "32 Members", TargetRevenue: "$45,000", Status: "Inactive" },
  { key: "4", TeamId: "#TEA604", TeamName: "Business Intelligence", TeamLead: "Hazel Davenport", TeamLeadImage: "assets/img/profiles/avatar-15.jpg", MembersCount: "40 Members", TargetRevenue: "$780,000", Status: "Inactive" },
  { key: "5", TeamId: "#TEA605", TeamName: "Legal & Compliance", TeamLead: "Violet Ainsworth", TeamLeadImage: "assets/img/profiles/avatar-11.jpg", MembersCount: "58 Members", TargetRevenue: "$80,000", Status: "Active" },
  { key: "6", TeamId: "#TEA606", TeamName: "Business Operations", TeamLead: "Milo Rutherford", TeamLeadImage: "assets/img/profiles/avatar-09.jpg", MembersCount: "27 Members", TargetRevenue: "$40,000", Status: "Inactive" },
  { key: "7", TeamId: "#TEA607", TeamName: "Brand & Communications", TeamLead: "Luna Ashworth", TeamLeadImage: "assets/img/profiles/avatar-07.jpg", MembersCount: "40 Members", TargetRevenue: "$7,000", Status: "Active" },
  { key: "8", TeamId: "#TEA608", TeamName: "Product Management", TeamLead: "Scarlett Beaumont", TeamLeadImage: "assets/img/profiles/avatar-15.jpg", MembersCount: "18 Members", TargetRevenue: "$01,23,000", Status: "Inactive" },
  { key: "9", TeamId: "#TEA609", TeamName: "Accounting & Finance", TeamLead: "Jasper Huntington", TeamLeadImage: "assets/img/profiles/avatar-12.jpg", MembersCount: "60 Members", TargetRevenue: "$780,000", Status: "Active" },
  { key: "10", TeamId: "#TEA610", TeamName: "Brand & Communications", TeamLead: "Caleb Worthington", TeamLeadImage: "assets/img/profiles/avatar-14.jpg", MembersCount: "18 Members", TargetRevenue: " $04,10,000", Status: "Active" },
  { key: "11", TeamId: "#TEA611", TeamName: "Brand & Communications", TeamLead: "Elijah Blackwood", TeamLeadImage: "assets/img/profiles/avatar-15.jpg", MembersCount: "28 Members", TargetRevenue: "$02,19,000", Status: "Active" },
  { key: "12", TeamId: "#TEA612", TeamName: "Application Development", TeamLead: "Aurora Lancaster", TeamLeadImage: "assets/img/profiles/avatar-11.jpg", MembersCount: "58 Members", TargetRevenue: "$60,000", Status: "Active" },
];
