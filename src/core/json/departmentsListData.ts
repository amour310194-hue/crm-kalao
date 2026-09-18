/*
  Departments (html/departments-list.html + html/assets/json/departments-list.js).

  Shared by both the list view and the card-grid view (departments.html), whose
  cards are hardcoded in the reference markup rather than data-driven.

  `Status` is already a readable string in the source; the renderer maps
  "Restructuring" to bg-purple and everything else to bg-success, mirroring the
  source's own branch.
*/

export interface DepartmentData {
  key: string;
  DepartmentId: string;
  DepartmentName: string;
  HeadName: string;
  HeadImage: string;
  MembersCount: string;
  LocationFlag: string;
  Location: string;
  Status: string;
}

export const DepartmentsListData: DepartmentData[] = [
  { key: "1", DepartmentId: "#DEP0040", DepartmentName: "Sales", HeadName: "Robert Johnson", HeadImage: "assets/img/profiles/avatar-14.jpg", MembersCount: "18 Members", LocationFlag: "assets/img/flags/us.svg", Location: "USA", Status: "Active" },
  { key: "2", DepartmentId: "#DEP0039", DepartmentName: "Marketing", HeadName: "Isabella Cooper", HeadImage: "assets/img/profiles/avatar-15.jpg", MembersCount: "20 Members", LocationFlag: "assets/img/flags/canada.svg", Location: "Canada", Status: "Active" },
  { key: "3", DepartmentId: "#DEP0038", DepartmentName: "Development", HeadName: "John Smith", HeadImage: "assets/img/profiles/avatar-16.jpg", MembersCount: "30 Members", LocationFlag: "assets/img/flags/spain.svg", Location: "Spain", Status: "Restructuring" },
  { key: "4", DepartmentId: "#DEP0037", DepartmentName: "Engineering", HeadName: "Sophia Parker", HeadImage: "assets/img/profiles/avatar-17.jpg", MembersCount: "12 Members", LocationFlag: "assets/img/flags/india.svg", Location: "India", Status: "Restructuring" },
  { key: "5", DepartmentId: "#DEP0036", DepartmentName: "Finance", HeadName: "Emma Reynolds", HeadImage: "assets/img/profiles/avatar-01.jpg", MembersCount: "31 Members", LocationFlag: "assets/img/flags/brazil.svg", Location: "Brazil", Status: "Active" },
  { key: "6", DepartmentId: "#DEP0035", DepartmentName: "Customer Support", HeadName: "Liam Carter", HeadImage: "assets/img/profiles/avatar-02.jpg", MembersCount: "44 Members", LocationFlag: "assets/img/flags/de.svg", Location: "Germany", Status: "Restructuring" },
  { key: "7", DepartmentId: "#DEP0034", DepartmentName: "Product Management", HeadName: "Noah Mitchell", HeadImage: "assets/img/profiles/avatar-03.jpg", MembersCount: "22 Members", LocationFlag: "assets/img/flags/mexico.svg", Location: "Mexico", Status: "Active" },
  { key: "8", DepartmentId: "#DEP0033", DepartmentName: "Operations", HeadName: "Mason Hayes", HeadImage: "assets/img/profiles/avatar-04.jpg", MembersCount: "33 Members", LocationFlag: "assets/img/flags/china.svg", Location: "China", Status: "Active" },
  { key: "9", DepartmentId: "#DEP0032", DepartmentName: "Legal", HeadName: "Ron Thompson", HeadImage: "assets/img/profiles/avatar-05.jpg", MembersCount: "22 Members", LocationFlag: "assets/img/flags/russia.svg", Location: "Russia", Status: "Restructuring" },
  { key: "10", DepartmentId: "#DEP0031", DepartmentName: "Data Analytics", HeadName: "Laura Bennett", HeadImage: "assets/img/profiles/avatar-06.jpg", MembersCount: "10 Members", LocationFlag: "assets/img/flags/italy.svg", Location: "Italy", Status: "Success" },
];
