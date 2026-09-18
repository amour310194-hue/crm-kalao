/*
  Device Management (html/device-management.html + html/assets/json/device-management.js).

  Only the keys the source `columns` render map reads are kept. The source reuses
  generic schema slots for page-specific values: `device` holds the OS & version,
  `module` holds the browser/app, and `logout-time` holds "Last Active".
  `status` is a "0"/"1" flag, converted here to "Active" | "Blocked" and mapped to
  bg-success / bg-danger by the column renderer.
*/

export type DeviceStatus = "Active" | "Blocked";

export interface DeviceManagementData {
  key: string;
  DeviceId: string;
  User: string;
  UserImage: string;
  DeviceType: string;
  OsVersion: string;
  Browser: string;
  IpAddress: string;
  LastActive: string;
  LocationFlag: string;
  LocationName: string;
  Status: DeviceStatus;
}

export const DeviceManagementListData: DeviceManagementData[] = [
  { key: "1", DeviceId: "#DV0020", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", DeviceType: "Desktop", OsVersion: "Windows 11", Browser: "Chrome", IpAddress: "192.168.1.12", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/us.svg", LocationName: "USA", Status: "Active" },
  { key: "2", DeviceId: "#DV0019", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-05.jpg", DeviceType: "Desktop", OsVersion: "macOS 26", Browser: "Safari", IpAddress: "192.168.1.42", LastActive: "29 Jan 2026, 09:15 PM", LocationFlag: "assets/img/flags/ae.svg", LocationName: "UAE", Status: "Blocked" },
  { key: "3", DeviceId: "#DV0018", User: "Owen Sterling", UserImage: "assets/img/profiles/avatar-01.jpg", DeviceType: "Mobile", OsVersion: "Android 16", Browser: "CRM App", IpAddress: "192.168.1.12", LastActive: "29 Jan 2026, 08:30 PM", LocationFlag: "assets/img/flags/de.svg", LocationName: "Germany", Status: "Blocked" },
  { key: "4", DeviceId: "#DV0017", User: "Hazel Davenport", UserImage: "assets/img/profiles/avatar-15.jpg", DeviceType: "Mobile", OsVersion: "Windows 11", Browser: "Edge", IpAddress: "192.168.1.48", LastActive: "29 Jan 2026, 09:00 PM", LocationFlag: "assets/img/flags/fr.svg", LocationName: "France", Status: "Blocked" },
  { key: "5", DeviceId: "#DV0016", User: "Violet Ainsworth", UserImage: "assets/img/profiles/avatar-11.jpg", DeviceType: "Mobile", OsVersion: "iOS 26", Browser: "Edge", IpAddress: "192.168.1.45", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/india.svg", LocationName: "India", Status: "Active" },
  { key: "6", DeviceId: "#DV0015", User: "Milo Rutherford", UserImage: "assets/img/profiles/avatar-09.jpg", DeviceType: "Desktop", OsVersion: "Windows 11", Browser: "Firefox", IpAddress: "192.168.1.26", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/brazil.svg", LocationName: "Brazil", Status: "Blocked" },
  { key: "7", DeviceId: "#DV0014", User: "Luna Ashworth", UserImage: "assets/img/profiles/avatar-07.jpg", DeviceType: "Desktop", OsVersion: "Android 16", Browser: "Firefox", IpAddress: "192.168.1.50", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/mexico.svg", LocationName: "Mexico", Status: "Active" },
  { key: "8", DeviceId: "#DV0013", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-15.jpg", DeviceType: "Desktop", OsVersion: "macOS 26", Browser: "Safari", IpAddress: "192.168.1.30", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/china.svg", LocationName: "China", Status: "Blocked" },
  { key: "9", DeviceId: "#DV0012", User: "Jasper Huntington", UserImage: "assets/img/profiles/avatar-12.jpg", DeviceType: "Mobile", OsVersion: "iOS 26", Browser: "Safari", IpAddress: "192.168.1.22", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/russia.svg", LocationName: "Russia", Status: "Active" },
  { key: "10", DeviceId: "#DV0011", User: "Caleb Worthington", UserImage: "assets/img/profiles/avatar-14.jpg", DeviceType: "Mobile", OsVersion: "iOS 26", Browser: "Safari", IpAddress: "192.168.1.18", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/fr.svg", LocationName: "France", Status: "Active" },
  { key: "11", DeviceId: "#DV0010", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", DeviceType: "Mobile", OsVersion: "Windows 11", Browser: "Firefox", IpAddress: "192.168.1.15", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/italy.svg", LocationName: "Italy", Status: "Active" },
  { key: "12", DeviceId: "#DV0009", User: "Aurora Lancaster", UserImage: "assets/img/profiles/avatar-11.jpg", DeviceType: "Mobile", OsVersion: "Windows 11", Browser: "Firefox", IpAddress: "192.168.1.12", LastActive: "29 Jan 2026, 08:00 PM", LocationFlag: "assets/img/flags/canada.svg", LocationName: "Canada", Status: "Active" },
];
