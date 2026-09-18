/*
  Login History (html/login-history.html + html/assets/json/login-history.js).

  Only the keys the source `columns` render map reads are kept. Note the source
  reuses generic schema slots for page-specific values: `module` holds the
  session duration and `status` is a "0"/"1" flag, converted here to a readable
  "Success" | "Failed" that the column renderer maps to bg-success / bg-danger.
*/

export type LoginHistoryStatus = "Success" | "Failed";

export interface LoginHistoryData {
  key: string;
  User: string;
  UserImage: string;
  LoginTime: string;
  LogoutTime: string;
  SessionDuration: string;
  IpAddress: string;
  Device: string;
  Status: LoginHistoryStatus;
}

export const LoginHistoryListData: LoginHistoryData[] = [
  { key: "1", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", LoginTime: "29 Jan 2026, 08:00 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "08 hrs 40 min", IpAddress: "192.168.1.12", Device: "Chrome/Windows", Status: "Success" },
  { key: "2", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-05.jpg", LoginTime: "29 Jan 2026, 09:15 AM", LogoutTime: "29 Jan 2026, 09:15 PM", SessionDuration: "09 hrs 30 min", IpAddress: "192.168.1.42", Device: "Edge/Windows", Status: "Failed" },
  { key: "3", User: "Owen Sterling", UserImage: "assets/img/profiles/avatar-01.jpg", LoginTime: "29 Jan 2026, 08:30 AM", LogoutTime: "29 Jan 2026, 08:30 PM", SessionDuration: "09 hrs 00 min", IpAddress: "192.168.1.12", Device: "Safari/macOS", Status: "Failed" },
  { key: "4", User: "Hazel Davenport", UserImage: "assets/img/profiles/avatar-15.jpg", LoginTime: "29 Jan 2026, 09:00 AM", LogoutTime: "29 Jan 2026, 09:00 PM", SessionDuration: "09 hrs 00 min", IpAddress: "192.168.1.48", Device: "Firefox/Windows", Status: "Failed" },
  { key: "5", User: "Violet Ainsworth", UserImage: "assets/img/profiles/avatar-11.jpg", LoginTime: "29 Jan 2026, 09:20 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 00 min", IpAddress: "192.168.1.45", Device: "Chrome/Windows", Status: "Success" },
  { key: "6", User: "Milo Rutherford", UserImage: "assets/img/profiles/avatar-09.jpg", LoginTime: "29 Jan 2026, 09:30 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 00 min", IpAddress: "192.168.1.26", Device: "Edge/Windows", Status: "Failed" },
  { key: "7", User: "Luna Ashworth", UserImage: "assets/img/profiles/avatar-07.jpg", LoginTime: "29 Jan 2026, 08:50 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 05 min", IpAddress: "192.168.1.50", Device: "Firefox/Windows", Status: "Success" },
  { key: "8", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-15.jpg", LoginTime: "29 Jan 2026, 09:12 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 05 min", IpAddress: "192.168.1.30", Device: "Chrome/Windows", Status: "Failed" },
  { key: "9", User: "Jasper Huntington", UserImage: "assets/img/profiles/avatar-12.jpg", LoginTime: "29 Jan 2026, 08:55 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 05 min", IpAddress: "192.168.1.22", Device: "Safari/iOS", Status: "Success" },
  { key: "10", User: "Caleb Worthington", UserImage: "assets/img/profiles/avatar-14.jpg", LoginTime: "29 Jan 2026, 09:05 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 40 min", IpAddress: "192.168.1.18", Device: "Edge/Windows", Status: "Success" },
  { key: "11", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", LoginTime: "29 Jan 2026, 08:00 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 40 min", IpAddress: "192.168.1.15", Device: "Edge/Windows", Status: "Success" },
  { key: "12", User: "Aurora Lancaster", UserImage: "assets/img/profiles/avatar-11.jpg", LoginTime: "29 Jan 2026, 09:05 AM", LogoutTime: "29 Jan 2026, 08:00 PM", SessionDuration: "09 hrs 40 min", IpAddress: "192.168.1.12", Device: "Edge/Windows", Status: "Success" },
];
