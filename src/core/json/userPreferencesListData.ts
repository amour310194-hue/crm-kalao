/*
  User Preferences (html/user-preferences.html + html/assets/json/user-preferences.js).

  Only the keys the source `columns` render map reads are kept. The source
  reuses generic schema slots for page-specific values: `name` holds the
  language, `module` the timezone, `start_date` the date format and `ip` the
  notification channels.
*/

export interface UserPreferenceData {
  key: string;
  User: string;
  UserImage: string;
  Language: string;
  Timezone: string;
  Theme: string;
  DateFormat: string;
  Notifications: string;
}

export const UserPreferencesListData: UserPreferenceData[] = [
  { key: "1", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Light", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "2", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-05.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "3", User: "Owen Sterling", UserImage: "assets/img/profiles/avatar-01.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "4", User: "Hazel Davenport", UserImage: "assets/img/profiles/avatar-15.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Light", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "5", User: "Violet Ainsworth", UserImage: "assets/img/profiles/avatar-11.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "6", User: "Milo Rutherford", UserImage: "assets/img/profiles/avatar-09.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "light", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "7", User: "Luna Ashworth", UserImage: "assets/img/profiles/avatar-07.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "8", User: "Scarlett Beaumont", UserImage: "assets/img/profiles/avatar-15.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "9", User: "Jasper Huntington", UserImage: "assets/img/profiles/avatar-12.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Light", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "10", User: "Caleb Worthington", UserImage: "assets/img/profiles/avatar-14.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "11", User: "Elijah Blackwood", UserImage: "assets/img/profiles/avatar-15.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Dark", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
  { key: "12", User: "Aurora Lancaster", UserImage: "assets/img/profiles/avatar-11.jpg", Language: "English", Timezone: "GMT+5:30", Theme: "Light", DateFormat: "DD-MM-YYYY", Notifications: "Email, In App" },
];
