/*
  Invitations (html/invitations-list.html + html/assets/json/invitations-list.js).
  `status` "0"/"1"/other converted to "Accepted" | "Pending" | "Expired",
  mapped by the renderer to bg-success / bg-warning / bg-danger.
*/

export type InvitationStatus = "Accepted" | "Pending" | "Expired";

export interface InvitationData {
  key: string;
  Name: string;
  NameImage: string;
  InviteEmail: string;
  Date: string;
  Status: InvitationStatus;
}

export const InvitationsListData: InvitationData[] = [
  { key: "1", Name: "Elijah Blackwood", NameImage: "assets/img/profiles/avatar-15.jpg", InviteEmail: "elijah.blackwood@example.com", Date: "15 Dec 2026", Status: "Accepted" },
  { key: "2", Name: "Scarlett Beaumont", NameImage: "assets/img/profiles/avatar-05.jpg", InviteEmail: "scarlett.beaumont@example.com", Date: "12 Nov 2026", Status: "Expired" },
  { key: "3", Name: "Owen Sterling", NameImage: "assets/img/profiles/avatar-01.jpg", InviteEmail: "owen.sterling@example.com", Date: "06 Oct 2026", Status: "Accepted" },
  { key: "4", Name: "Hazel Davenport", NameImage: "assets/img/profiles/avatar-15.jpg", InviteEmail: "hazel.davenport@example.com", Date: "14 Sep 2026", Status: "Accepted" },
  { key: "5", Name: "Violet Ainsworth", NameImage: "assets/img/profiles/avatar-11.jpg", InviteEmail: "violet.ainsworth@example.com", Date: "23 Aug 2026", Status: "Accepted" },
  { key: "6", Name: "Milo Rutherford", NameImage: "assets/img/profiles/avatar-09.jpg", InviteEmail: "milo.rutherford@example.com", Date: "16 Jul 2026", Status: "Accepted" },
  { key: "7", Name: "Luna Ashworth", NameImage: "assets/img/profiles/avatar-07.jpg", InviteEmail: "luna.ashworth@example.com", Date: "09 Jun 2026", Status: "Accepted" },
  { key: "8", Name: "Scarlett Beaumont", NameImage: "assets/img/profiles/avatar-15.jpg", InviteEmail: "scarlett.beaumont@example.com", Date: "15 May 2026", Status: "Accepted" },
  { key: "9", Name: "Jasper Huntington", NameImage: "assets/img/profiles/avatar-12.jpg", InviteEmail: "jasper.huntington@example.com", Date: "19 Apr 2026", Status: "Pending" },
  { key: "10", Name: "Caleb Worthington", NameImage: "assets/img/profiles/avatar-14.jpg", InviteEmail: "caleb.worthington@example.com", Date: "28 Mar 2026", Status: "Accepted" },
  { key: "11", Name: "Elijah Blackwood", NameImage: "assets/img/profiles/avatar-15.jpg", InviteEmail: "elijah.blackwood@example.com", Date: "25 Jan 2026", Status: "Pending" },
  { key: "12", Name: "Aurora Lancaster", NameImage: "assets/img/profiles/avatar-11.jpg", InviteEmail: "aurora.lancaster@example.com", Date: "29 Jan 2026", Status: "Pending" },
];
