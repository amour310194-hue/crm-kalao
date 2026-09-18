"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import Datatable from "@/core/common/dataTable";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import TableToolbar from "@/core/common/table-toolbar/tableToolbar";
import { UserPreferencesListData } from "../../../../core/json/userPreferencesListData";

/*
  User Preferences (html/user-preferences.html) - a per-user list of language,
  timezone, theme, date format and notification-channel settings.
*/
const UserPreferencesComponent = () => {
  const data = UserPreferencesListData;
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

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
    {
      title: "Language",
      dataIndex: "Language",
      sorter: (a: any, b: any) => a.Language.length - b.Language.length,
    },
    {
      title: "Timezone",
      dataIndex: "Timezone",
      sorter: (a: any, b: any) => a.Timezone.length - b.Timezone.length,
    },
    {
      title: "Theme",
      dataIndex: "Theme",
      sorter: (a: any, b: any) => a.Theme.length - b.Theme.length,
    },
    {
      title: "Date Format",
      dataIndex: "DateFormat",
      sorter: (a: any, b: any) => a.DateFormat.length - b.DateFormat.length,
    },
    {
      title: "Notifications",
      dataIndex: "Notifications",
      sorter: (a: any, b: any) =>
        a.Notifications.length - b.Notifications.length,
    },
  ];

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="User Preferences"
            badgeCount={false}
            showModuleTile={true}
            moduleTitle="Settings"
            showExport={true}
          />
          {/* End Page Header */}
          <div className="card border-0 rounded-0">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="input-icon input-icon-start position-relative">
                <span className="input-icon-addon text-dark">
                  <i className="ti ti-search" />
                </span>
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
            </div>
            <div className="card-body">
              {/* table header */}
              <TableToolbar
                showManageColumns
                manageColumns={[
                  "User",
                  "Language",
                  "Timezone",
                  "Theme",
                  "Date Format",
                  "Notifications",
                ]}
                filters={[
                  {
                    Id: "collapseTwo",
                    Title: "User",
                    Searchable: true,
                    LoadMore: true,
                    Options: [
                      { Label: "Elizabeth Morgan", Avatar: "assets/img/users/user-06.jpg" },
                      { Label: "Katherine Brooks", Avatar: "assets/img/users/user-40.jpg" },
                      { Label: "Sophia Lopez", Avatar: "assets/img/users/user-05.jpg" },
                      { Label: "John Michael", Avatar: "assets/img/users/user-10.jpg" },
                    ],
                  },
                  {
                    Id: "type",
                    Title: "Language",
                    Options: [
                      { Label: "English" },
                      { Label: "Arabic" },
                      { Label: "German" },
                    ],
                  },
                ]}
              />
              {/* table header */}
              <div className="custom-table">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={false}
                  searchText={searchText}
                />
              </div>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="datatable-length" />
                </div>
                <div className="col-md-6">
                  <div className="datatable-paginate" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default UserPreferencesComponent;
