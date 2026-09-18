import KalaoListPage from "@/components/Pages/kalao/KalaoListPage";

export const metadata = {
  title: "Paie | Groupe Kalao",
};

export default function PaiePage() {
  return (
    <KalaoListPage
      resource="payroll"
      title="Paie"
      columns={[
        { title: "Employee", dataIndex: "employee" },
        { title: "Departments", dataIndex: "department" },
        { title: "Period", dataIndex: "period" },
        { title: "Salary", dataIndex: "Salary" },
        { title: "Bonus", dataIndex: "Bonus" },
        { title: "Total", dataIndex: "Total" },
        { title: "Status", dataIndex: "status" },
      ]}
    />
  );
}
