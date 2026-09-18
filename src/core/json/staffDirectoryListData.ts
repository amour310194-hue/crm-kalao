/*
  Staff Directory (html/staff-directory-list.html + html/assets/json/staff-directory-list.js).

  Shared by both the list view and the card-grid view (staff-directory-grid.html),
  whose cards are hardcoded in the reference markup rather than data-driven.

  Two separate flags in the source are converted here:
    `stage`  "0"/"1"/"2"/other -> Department Finance | Marketing | Design | Support,
             with the badge tone the source pairs with each (danger/warning/success/info)
             carried alongside as DepartmentTone.
    `status` "0"/"1"            -> "Active" | "Inactive" (bg-success / bg-danger).
*/

export type StaffStatus = "Active" | "Inactive";

export interface StaffDirectoryData {
  key: string;
  EmployeeId: string;
  EmployeeName: string;
  EmployeeImage: string;
  Role: string;
  Department: string;
  DepartmentTone: string;
  Email: string;
  Phone: string;
  LocationFlag: string;
  LocationName: string;
  Status: StaffStatus;
}

export const StaffDirectoryListData: StaffDirectoryData[] = [
  { key: "1", EmployeeId: "#EM0020", EmployeeName: "Elijah Blackwood", EmployeeImage: "assets/img/profiles/avatar-15.jpg", Role: "Sales Lead", Department: "Support", DepartmentTone: "info", Email: "elijah.blackwood@example.com", Phone: "+1 82940 37284", LocationFlag: "assets/img/flags/us.svg", LocationName: "USA", Status: "Active" },
  { key: "2", EmployeeId: "#EM0019", EmployeeName: "Scarlett Beaumont", EmployeeImage: "assets/img/profiles/avatar-05.jpg", Role: "Content Writer", Department: "Marketing", DepartmentTone: "warning", Email: "scarlett.beaumont@example.com", Phone: "+1 92643 27945", LocationFlag: "assets/img/flags/ae.svg", LocationName: "UAE", Status: "Inactive" },
  { key: "3", EmployeeId: "#EM0018", EmployeeName: "Owen Sterling", EmployeeImage: "assets/img/profiles/avatar-01.jpg", Role: "Accountant", Department: "Finance", DepartmentTone: "danger", Email: "owen.sterling@example.com", Phone: "+1 92643 275445", LocationFlag: "assets/img/flags/de.svg", LocationName: "Germany", Status: "Active" },
  { key: "4", EmployeeId: "#EM0017", EmployeeName: "Hazel Davenport", EmployeeImage: "assets/img/profiles/avatar-15.jpg", Role: "UI Designer", Department: "Design", DepartmentTone: "success", Email: "hazel.davenport@example.com", Phone: "+1 93443 27945", LocationFlag: "assets/img/flags/fr.svg", LocationName: "France", Status: "Active" },
  { key: "5", EmployeeId: "#EM0016", EmployeeName: "Violet Ainsworth", EmployeeImage: "assets/img/profiles/avatar-11.jpg", Role: "Support Lead", Department: "Design", DepartmentTone: "success", Email: "violet.ainsworth@example.com", Phone: "+1 92643 27645", LocationFlag: "assets/img/flags/india.svg", LocationName: "India", Status: "Active" },
  { key: "6", EmployeeId: "#EM0015", EmployeeName: "Milo Rutherford", EmployeeImage: "assets/img/profiles/avatar-09.jpg", Role: "Finance Analyst", Department: "Marketing", DepartmentTone: "warning", Email: "milo.rutherford@example.com", Phone: "+1 92643 27924", LocationFlag: "assets/img/flags/brazil.svg", LocationName: "Brazil", Status: "Active" },
  { key: "7", EmployeeId: "#EM0014", EmployeeName: "Luna Ashworth", EmployeeImage: "assets/img/profiles/avatar-07.jpg", Role: "Sales Rep", Department: "Finance", DepartmentTone: "danger", Email: "luna.ashworth@example.com", Phone: "+1 92643 27945", LocationFlag: "assets/img/flags/mexico.svg", LocationName: "Mexico", Status: "Active" },
  { key: "8", EmployeeId: "#EM0013", EmployeeName: "Scarlett Beaumont", EmployeeImage: "assets/img/profiles/avatar-15.jpg", Role: "Campaign Manager", Department: "Finance", DepartmentTone: "danger", Email: "scarlett.beaumont@example.com", Phone: "+1 92643 27945", LocationFlag: "assets/img/flags/china.svg", LocationName: "China", Status: "Active" },
  { key: "9", EmployeeId: "#EM0012", EmployeeName: "Jasper Huntington", EmployeeImage: "assets/img/profiles/avatar-12.jpg", Role: "Sales Executive", Department: "Support", DepartmentTone: "info", Email: "jasper.huntington@example.com", Phone: "+1 92643 27945", LocationFlag: "assets/img/flags/russia.svg", LocationName: "Russia", Status: "Active" },
  { key: "10", EmployeeId: "#EM0011", EmployeeName: "Caleb Worthington", EmployeeImage: "assets/img/profiles/avatar-14.jpg", Role: "Web Developer", Department: "Marketing", DepartmentTone: "warning", Email: "caleb.worthington@example.com", Phone: "+1 92643 43945", LocationFlag: "assets/img/flags/fr.svg", LocationName: "France", Status: "Active" },
  { key: "11", EmployeeId: "#EM0010", EmployeeName: "Elijah Blackwood", EmployeeImage: "assets/img/profiles/avatar-15.jpg", Role: "Accountant", Department: "Marketing", DepartmentTone: "warning", Email: "elijah.blackwood@example.com", Phone: "+1 92643 75945", LocationFlag: "assets/img/flags/italy.svg", LocationName: "Italy", Status: "Inactive" },
  { key: "12", EmployeeId: "#EM0009", EmployeeName: "Aurora Lancaster", EmployeeImage: "assets/img/profiles/avatar-11.jpg", Role: "Sales Executive", Department: "Marketing", DepartmentTone: "warning", Email: "aurora.lancaster@example.com", Phone: "+1 92863 27945", LocationFlag: "assets/img/flags/canada.svg", LocationName: "Canada", Status: "Active" },
];
