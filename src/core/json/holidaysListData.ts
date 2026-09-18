export interface HolidayData {
  key: string;
  HolidayId: string;
  Name: string;
  Date: string;
  Day: string;
  LocationFlag: string;
  LocationName: string;
  Status: string;
}

export const HolidaysListData: HolidayData[] = [
  {
    key: "1",
    HolidayId: "#HD301",
    Name: "Republic Day",
    Date: "15 Dec 2026",
    Day: "Monday",
    LocationFlag: "us.svg",
    LocationName: "USA",
    Status: "Active",
  },
  {
    key: "2",
    HolidayId: "#HD302",
    Name: "Holi",
    Date: "12 Nov 2026",
    Day: "Saturday",
    LocationFlag: "canada.svg",
    LocationName: "Canada",
    Status: "Active",
  },
  {
    key: "3",
    HolidayId: "#HD303",
    Name: "Good Friday",
    Date: "06 Oct 2026",
    Day: "Friday",
    LocationFlag: "spain.svg",
    LocationName: "Spain",
    Status: "Active",
  },
  {
    key: "4",
    HolidayId: "#HD304",
    Name: "Company Foundation Day",
    Date: "14 Sep 2026",
    Day: "Wednesday",
    LocationFlag: "india.svg",
    LocationName: "India",
    Status: "Active",
  },
  {
    key: "5",
    HolidayId: "#HD305",
    Name: "Independence Day",
    Date: "23 Aug 2026",
    Day: "Saturday",
    LocationFlag: "brazil.svg",
    LocationName: "Brazil",
    Status: "Active",
  },
  {
    key: "6",
    HolidayId: "#HD306",
    Name: "Ganesh Chaturthi",
    Date: "16 Jul 2026",
    Day: "Wednesday",
    LocationFlag: "de.svg",
    LocationName: "Germany",
    Status: "Active",
  },
  {
    key: "7",
    HolidayId: "#HD307",
    Name: "Gandhi Jayanti",
    Date: "09 Jun 2026",
    Day: "Friday",
    LocationFlag: "mexico.svg",
    LocationName: "Mexico",
    Status: "Active",
  },
  {
    key: "8",
    HolidayId: "#HD308",
    Name: "Diwali",
    Date: "15 May 2026",
    Day: "Monday",
    LocationFlag: "china.svg",
    LocationName: "China",
    Status: "Active",
  },
  {
    key: "9",
    HolidayId: "#HD309",
    Name: "Christmas",
    Date: "19 Apr 2026",
    Day: "Friday",
    LocationFlag: "russia.svg",
    LocationName: "Russia",
    Status: "Active",
  },
  {
    key: "10",
    HolidayId: "#HD310",
    Name: "New Year Eve",
    Date: "28 Mar 2026",
    Day: "Thursday",
    LocationFlag: "italy.svg",
    LocationName: "Italy",
    Status: "Active",
  },
];
