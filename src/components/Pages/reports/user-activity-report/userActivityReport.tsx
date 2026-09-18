"use client";
import Link from "next/link";
import { useState } from "react";
import ReportShell from "../components/reportShell";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { UserActivityReportData } from "../../../../core/json/userActivityReportData";

const UserActivityReportComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  const columns = [
    {
      title: "User",
      dataIndex: "User",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 mb-0 fw-medium">
          <Link href="#" className="avatar avatar-sm border rounded-circle me-2">
            <ImageWithBasePath
              className="rounded-circle"
              src={record.UserImage}
              alt="User Image"
            />
          </Link>
          <Link href="#">{text}</Link>
        </h6>
      ),
      sorter: (a: any, b: any) => a.User.length - b.User.length,
    },
    { title: "Calls", dataIndex: "Calls", sorter: (a: any, b: any) => a.Calls.length - b.Calls.length },
    { title: "Emails", dataIndex: "Emails", sorter: (a: any, b: any) => a.Emails.length - b.Emails.length },
    { title: "Meetings", dataIndex: "Meetings", sorter: (a: any, b: any) => a.Meetings.length - b.Meetings.length },
    // The reference binds the same `remarks` value to these four columns.
    { title: "Tasks Completed", dataIndex: "Remarks" },
    { title: "Follow ups", dataIndex: "Remarks" },
    { title: "Avg Response Time (hrs)", dataIndex: "Remarks" },
    { title: "Productivity Score", dataIndex: "Remarks" },
  ];

  return (
    <ReportShell
      title="User Activity Report"
      columns={columns}
      data={UserActivityReportData}
      manageColumns={[
        "User",
        "Calls",
        "Emails",
        "Meetings",
        "Tasks Completed",
        "Follow ups",
        "Avg Response Time (hrs)",
        "Productivity Score",
      ]}
      kpis={[
        { Label: "Total Users", Value: "460", Icon: "ti-users", Tone: "orange", Delta: "+2.5%", DeltaLabel: "From Last Month" },
        { Label: "Total Calls Made", Value: "1200", Icon: "ti-phone-call", Tone: "info", Delta: "+2.5%", DeltaLabel: "From Last Month" },
        { Label: "Total Emails Sent", Value: "1340", Icon: "ti-mail", Tone: "warning", Delta: "+2.5%", DeltaLabel: "From Last Month" },
        { Label: "Total Meetings Conducted", Value: "400", Icon: "ti-headset", Tone: "pink", Delta: "+2.5%", DeltaLabel: "From Last Month" },
        { Label: "Total Tasks Completed", Value: "380", Icon: "ti-subtask", Tone: "cyan", Delta: "+2.5%", DeltaLabel: "From Last Month" },
      ]}
      runFilter={{ Label: "User Name", Icon: "ti-user", Options: ["Robert Johnson","Isabella Cooper","John Smith","Sophia Parker","Ethan Reynolds","Liam Carter","Noah Mitchell"] }}
      searchText={searchText}
      onSearch={setSearchText}
    />
  );
};

export default UserActivityReportComponent;
