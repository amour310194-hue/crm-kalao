/*
  User Activity Logs (html/user-activity-logs.html + html/assets/json/user-activity-logs.js).

  The source DataTable init carries a large shared generic schema; only the keys
  its `columns` render map actually reads are kept here:
    id -> LogId, client + mem_image2 -> User/UserImage, name -> Action,
    module -> Module, record-id -> RecordId, start_date -> ActionDate, ip -> IpAddress.
*/

export interface UserActivityLogData {
  key: string;
  LogId: string;
  User: string;
  UserImage: string;
  Action: string;
  Module: string;
  RecordId: string;
  ActionDate: string;
  IpAddress: string;
}

export const UserActivityLogsListData: UserActivityLogData[] = [
  { key: "1", LogId: "#LG0020", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", Action: "Update", Module: "Deal", RecordId: "DL0020", ActionDate: "25 Sep 2025", IpAddress: "192.168.1.12" },
  { key: "2", LogId: "#LG0019", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-05.jpg", Action: "Create", Module: "Lead", RecordId: "LE0016", ActionDate: "29 Sep 2025", IpAddress: "192.168.1.42" },
  { key: "3", LogId: "#LG0018", User: "Owen Sterling", UserImage: "assets/img/profiles/avatar-01.jpg", Action: "Delete", Module: "Contact", RecordId: "CN0027", ActionDate: "05 Oct 2025", IpAddress: "192.168.1.12" },
  { key: "4", LogId: "#LG0017", User: "Hazel Davenport", UserImage: "assets/img/profiles/avatar-15.jpg", Action: "Update", Module: "Project", RecordId: "PR0039", ActionDate: "14 Oct 2025", IpAddress: "192.168.1.48" },
  { key: "5", LogId: "#LG0016", User: "Violet Ainsworth", UserImage: "assets/img/profiles/avatar-11.jpg", Action: "Export", Module: "Report", RecordId: "RE0042", ActionDate: "15 Nov 2025", IpAddress: "192.168.1.45" },
  { key: "6", LogId: "#LG0015", User: "Milo Rutherford", UserImage: "assets/img/profiles/avatar-09.jpg", Action: "Update", Module: "Campaign", RecordId: "CM0051", ActionDate: "25 Nov 2025", IpAddress: "192.168.1.26" },
  { key: "7", LogId: "#LG0014", User: "Luna Ashworth", UserImage: "assets/img/profiles/avatar-07.jpg", Action: "Create", Module: "Task", RecordId: "TS0023", ActionDate: "08 Dec 2025", IpAddress: "192.168.1.50" },
  { key: "8", LogId: "#LG0013", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-15.jpg", Action: "Update", Module: "Deal", RecordId: "DL0017", ActionDate: "21 Dec 2025", IpAddress: "192.168.1.30" },
  { key: "9", LogId: "#LG0012", User: "Jasper Huntington", UserImage: "assets/img/profiles/avatar-12.jpg", Action: "Update", Module: "Deal", RecordId: "IN0010", ActionDate: "01 Jan 2024", IpAddress: "192.168.1.22" },
  { key: "10", LogId: "#LG0011", User: "Caleb Worthington", UserImage: "assets/img/profiles/avatar-14.jpg", Action: "Create", Module: "Invoice", RecordId: "PS0018", ActionDate: "12 Jan 2024", IpAddress: "192.168.1.18" },
  { key: "11", LogId: "#LG0010", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", Action: "Update", Module: "Deal", RecordId: "PS0018", ActionDate: "16 Jan 2024", IpAddress: "192.168.1.15" },
  { key: "12", LogId: "#LG0009", User: "Aurora Lancaster", UserImage: "assets/img/profiles/avatar-11.jpg", Action: "Update", Module: "Proposal", RecordId: "PS0018", ActionDate: "12 Jan 2024", IpAddress: "192.168.1.12" },
];
