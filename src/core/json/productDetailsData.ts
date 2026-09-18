export interface ProductActivityInterface {
  key: string;
  Label: string;
  From: string;
  To: string;
  DateTime: string;
}

export interface ProductNoteInterface {
  key: string;
  Description: string;
  DateTime: string;
}

export const ProductActivitiesData: ProductActivityInterface[] = [
  {
    key: "1",
    Label: "Updated Price :",
    From: "$10500",
    To: "$10200",
    DateTime: "05 Jun 2026, 1:45 PM, By Admin",
  },
  {
    key: "2",
    Label: "Updated Price :",
    From: "$9400",
    To: "$9200",
    DateTime: "30 May 2026, 2:00 PM, By User",
  },
  {
    key: "3",
    Label: "Updated Price :",
    From: "$11000",
    To: "$10800",
    DateTime: "25 Apr 2026, 10:15 AM, By Admin",
  },
  {
    key: "4",
    Label: "Updated Price :",
    From: "$8700",
    To: "$8500",
    DateTime: "20 Mar 2026, 11:00 AM, By User",
  },
  {
    key: "5",
    Label: "Updated Price :",
    From: "$10250",
    To: "$9800",
    DateTime: "15 Feb 2026, 3:30 PM, By Admin",
  },
  {
    key: "6",
    Label: "Updated Price :",
    From: "$8956",
    To: "$7500",
    DateTime: "17 Jan 2026, 6:32 AM, By Admin",
  },
  {
    key: "7",
    Label: "Updated Category :",
    From: "Server",
    To: "Hardware",
    DateTime: "12 Jan 2026, 4:45 PM, By Admin",
  },
];

export const ProductNotesData: ProductNoteInterface[] = [
  {
    key: "1",
    Description: "Includes USB cable & 1-year warranty",
    DateTime: "15 Feb 2026, 3:30 PM, By Admin",
  },
  {
    key: "2",
    Description: "Includes firewall & malware protection",
    DateTime: "15 Feb 2026, 3:30 PM, By Admin",
  },
];
