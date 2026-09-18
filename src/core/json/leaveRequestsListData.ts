export interface LeaveRequestData {
  key: string;
  LeaveId: string;
  EmployeeName: string;
  EmployeeImage: string;
  LeaveType: string;
  Duration: string;
  Days: string;
  Status: "Approved" | "Rejected" | "Pending";
}

export const LeaveRequestsListData: LeaveRequestData[] = [
  {
    key: "1",
    LeaveId: "#LR301",
    EmployeeName: "Elijah Blackwood",
    EmployeeImage: "assets/img/profiles/avatar-15.jpg",
    LeaveType: "Annual leave",
    Duration: "15 Dec 2026 to 20 Dec 2026",
    Days: "1",
    Status: "Approved",
  },
  {
    key: "2",
    LeaveId: "#LR302",
    EmployeeName: "Scarlett Beaumont",
    EmployeeImage: "assets/img/profiles/avatar-05.jpg",
    LeaveType: "Sick Leave",
    Duration: "12 Nov 2026 to 18 Nov 2026",
    Days: "5",
    Status: "Pending",
  },
  {
    key: "3",
    LeaveId: "#LR303",
    EmployeeName: "Owen Sterling",
    EmployeeImage: "assets/img/profiles/avatar-01.jpg",
    LeaveType: "Casual Leave",
    Duration: "12 Nov 2026 to 18 Nov 2026",
    Days: "6",
    Status: "Rejected",
  },
  {
    key: "4",
    LeaveId: "#LR304",
    EmployeeName: "Hazel Davenport",
    EmployeeImage: "assets/img/profiles/avatar-15.jpg",
    LeaveType: "Annual Leave",
    Duration: "06 Oct 2026 to 12 Oct 2026",
    Days: "7",
    Status: "Rejected",
  },
  {
    key: "5",
    LeaveId: "#LR305",
    EmployeeName: "Violet Ainsworth",
    EmployeeImage: "assets/img/profiles/avatar-11.jpg",
    LeaveType: "Annual Leave",
    Duration: "14 Sep 2026 to 20 Sep 2026",
    Days: "2",
    Status: "Approved",
  },
  {
    key: "6",
    LeaveId: "#LR306",
    EmployeeName: "Milo Rutherford",
    EmployeeImage: "assets/img/profiles/avatar-09.jpg",
    LeaveType: "Maternity Leave",
    Duration: "14 Sep 2026 to 20 Sep 2026",
    Days: "3",
    Status: "Pending",
  },
  {
    key: "7",
    LeaveId: "#LR307",
    EmployeeName: "Luna Ashworth",
    EmployeeImage: "assets/img/profiles/avatar-07.jpg",
    LeaveType: "Maternity Leave",
    Duration: "23 Aug 2026 to 25 Aug 2026",
    Days: "4",
    Status: "Approved",
  },
  {
    key: "8",
    LeaveId: "#LR308",
    EmployeeName: "Scarlett Beaumont",
    EmployeeImage: "assets/img/profiles/avatar-15.jpg",
    LeaveType: "Sick Leave",
    Duration: "23 Aug 2026 to 25 Aug 2026",
    Days: "6",
    Status: "Pending",
  },
  {
    key: "9",
    LeaveId: "#LR309",
    EmployeeName: "Jasper Huntington",
    EmployeeImage: "assets/img/profiles/avatar-12.jpg",
    LeaveType: "Sick Leave",
    Duration: "23 Aug 2026 to 25 Aug 2026",
    Days: "1",
    Status: "Approved",
  },
  {
    key: "10",
    LeaveId: "#LR310",
    EmployeeName: "Caleb Worthington",
    EmployeeImage: "assets/img/profiles/avatar-14.jpg",
    LeaveType: "Annual Leave",
    Duration: "23 Aug 2026 to 25 Aug 2026",
    Days: "2",
    Status: "Approved",
  },
  {
    key: "11",
    LeaveId: "#LR311",
    EmployeeName: "Elijah Blackwood",
    EmployeeImage: "assets/img/profiles/avatar-15.jpg",
    LeaveType: "Annual Leave",
    Duration: "19 Apr 2026 to 29 Apr 2026",
    Days: "5",
    Status: "Approved",
  },
  {
    key: "12",
    LeaveId: "#LR312",
    EmployeeName: "Aurora Lancaster",
    EmployeeImage: "assets/img/profiles/avatar-11.jpg",
    LeaveType: "Sick Leave",
    Duration: "19 Apr 2026 to 29 Apr 2026",
    Days: "1",
    Status: "Approved",
  },
];

// Attendance Status donut chart values: Approved, Pending, Declined, Request
export const LeaveStatusChartSeries: number[] = [45, 3, 5, 23];
