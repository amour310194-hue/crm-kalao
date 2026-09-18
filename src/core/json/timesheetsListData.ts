/*
  Timesheets list (html/timesheets.html + html/assets/json/timesheet.js -> #timesheet DataTable).

  Only the keys consumed by the DataTable "columns" render map are ported here.
  The source `status` flag ("0" / "1") is converted to its readable label:
    "0" -> Approved (bg-success), "1" -> Pending (bg-purple).
*/

export interface TimesheetData {
  key: string;
  TimesheetID: string;
  EmployeeName: string;
  Role: string;
  EmployeeImage: string;
  ProjectName: string;
  ProjectImage: string;
  Task: string;
  CreatedDate: string;
  HoursWorked: string;
  Status: string;
}

export const TimesheetsListData: TimesheetData[] = [
  {
    key: "1",
    TimesheetID: "#TMS0040",
    EmployeeName: "Albert Morgan",
    Role: "Product Manager",
    EmployeeImage: "avatar-14.jpg",
    ProjectName: "Trip Flow",
    ProjectImage: "time-icon-1.svg",
    Task: "Configure travel booking",
    CreatedDate: "25 Apr 2026",
    HoursWorked: "8.50 hours",
    Status: "Approved",
  },
  {
    key: "2",
    TimesheetID: "#TMS0039",
    EmployeeName: "Katherine Brooks",
    Role: "Installer",
    EmployeeImage: "avatar-18.jpg",
    ProjectName: "Connect Hub",
    ProjectImage: "time-icon-2.svg",
    Task: "Build real time chat module",
    CreatedDate: "03 Apr 2025",
    HoursWorked: "6.35 hours",
    Status: "Pending",
  },
  {
    key: "3",
    TimesheetID: "#TMS0038",
    EmployeeName: "Samantha Reed",
    Role: "Human Resources",
    EmployeeImage: "avatar-20.jpg",
    ProjectName: "Gig Market",
    ProjectImage: "time-icon-3.svg",
    Task: "Develop freelancer module",
    CreatedDate: "29 Mar 2026",
    HoursWorked: "7.15 hours",
    Status: "Approved",
  },
  {
    key: "4",
    TimesheetID: "#TMS0037",
    EmployeeName: "William Anderson",
    Role: "Data Analytics",
    EmployeeImage: "avatar-22.jpg",
    ProjectName: "Book Ease",
    ProjectImage: "time-icon-4.svg",
    Task: "Implement service scheduling",
    CreatedDate: "25 Mar 2026",
    HoursWorked: "6.00 hours",
    Status: "Pending",
  },
  {
    key: "5",
    TimesheetID: "#TMS0036",
    EmployeeName: "Jonathan Mitchell",
    Role: "Facility Manager",
    EmployeeImage: "avatar-23.jpg",
    ProjectName: "Retail POS",
    ProjectImage: "time-icon-5.svg",
    Task: "Develop inventory modules",
    CreatedDate: "17 Mar 2026",
    HoursWorked: "6.40 hours",
    Status: "Pending",
  },
  {
    key: "6",
    TimesheetID: "#TMS0035",
    EmployeeName: "Jennifer Adams",
    Role: "Financial Officer",
    EmployeeImage: "avatar-24.jpg",
    ProjectName: "Hire Nest",
    ProjectImage: "time-icon-6.svg",
    Task: "Build job postings",
    CreatedDate: "08 Mar 2026",
    HoursWorked: "6.35 hours",
    Status: "Approved",
  },
  {
    key: "7",
    TimesheetID: "#TMS0035",
    EmployeeName: "Alexander Carter",
    Role: "Project Manager",
    EmployeeImage: "avatar-25.jpg",
    ProjectName: "People Core",
    ProjectImage: "time-icon-7.svg",
    Task: "Configure payroll rules",
    CreatedDate: "20 Feb 2026",
    HoursWorked: "8.35 hours",
    Status: "Approved",
  },
  {
    key: "8",
    TimesheetID: "#TMS0034",
    EmployeeName: "Benjamin Harrison",
    Role: "Team Lead",
    EmployeeImage: "avatar-24.jpg",
    ProjectName: "Care Desk",
    ProjectImage: "time-icon-8.svg",
    Task: "Develop doctor slot",
    CreatedDate: "12 Feb 2026",
    HoursWorked: "9.00 hours",
    Status: "Approved",
  },
  {
    key: "9",
    TimesheetID: "#TMS0033",
    EmployeeName: "Nicholas Wright",
    Role: "Supervisor",
    EmployeeImage: "avatar-25.jpg",
    ProjectName: "Wash Flow",
    ProjectImage: "time-icon-9.svg",
    Task: "Test pickup/delivery flow",
    CreatedDate: "15 Jan 2026",
    HoursWorked: "9.40 hours",
    Status: "Approved",
  },
  {
    key: "10",
    TimesheetID: "#TMS0032",
    EmployeeName: "Alexandra Bennett",
    Role: "Supervisor",
    EmployeeImage: "avatar-26.jpg",
    ProjectName: "Sport Venue",
    ProjectImage: "time-icon-10.svg",
    Task: "Build venue listings",
    CreatedDate: "05 Jan 2026",
    HoursWorked: "7.20 hours",
    Status: "Pending",
  },
];
