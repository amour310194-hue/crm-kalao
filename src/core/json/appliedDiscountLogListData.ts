export interface AppliedDiscountLogData {
  key: string;
  DiscountID: string;
  DealID: string;
  RequestedBy: string;
  Avatar: string;
  RequestedDiscount: string;
  ApprovedDiscount: string;
  FinalDealValue: string;
  ApprovalStatus: string;
}

export const AppliedDiscountLogListData: AppliedDiscountLogData[] = [
  {
    key: "1",
    DiscountID: "#DIR0020",
    DealID: "#DEL0020",
    RequestedBy: "Albert Morgan",
    Avatar: "assets/img/users/user-01.jpg",
    RequestedDiscount: "10%",
    ApprovedDiscount: "08%",
    FinalDealValue: "FCFA 3,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "2",
    DiscountID: "#DIR0019",
    DealID: "#DEL0019",
    RequestedBy: "Katherine Brooks",
    Avatar: "assets/img/users/user-40.jpg",
    RequestedDiscount: "20%",
    ApprovedDiscount: "16%",
    FinalDealValue: "FCFA 10,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "3",
    DiscountID: "#DIR0018",
    DealID: "#DEL0018",
    RequestedBy: "Samantha Reed",
    Avatar: "assets/img/users/user-02.jpg",
    RequestedDiscount: "12%",
    ApprovedDiscount: "12%",
    FinalDealValue: "FCFA 5,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "4",
    DiscountID: "#DIR0017",
    DealID: "#DEL0017",
    RequestedBy: "William Anderson",
    Avatar: "assets/img/users/user-01.jpg",
    RequestedDiscount: "15%",
    ApprovedDiscount: "0%",
    FinalDealValue: "FCFA 25,000",
    ApprovalStatus: "Rejected",
  },
  {
    key: "5",
    DiscountID: "#DIR0016",
    DealID: "#DEL0016",
    RequestedBy: "Jonathan Mitchell",
    Avatar: "assets/img/users/user-04.jpg",
    RequestedDiscount: "05%",
    ApprovedDiscount: "5%",
    FinalDealValue: "FCFA 1,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "6",
    DiscountID: "#DIR0015",
    DealID: "#DEL0015",
    RequestedBy: "Jennifer Adams",
    Avatar: "assets/img/users/user-05.jpg",
    RequestedDiscount: "08%",
    ApprovedDiscount: "8%",
    FinalDealValue: "FCFA 15,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "7",
    DiscountID: "#DIR0014",
    DealID: "#DEL0014",
    RequestedBy: "Alexander Carter",
    Avatar: "assets/img/users/user-06.jpg",
    RequestedDiscount: "10%",
    ApprovedDiscount: "10%",
    FinalDealValue: "FCFA 5000",
    ApprovalStatus: "Rejected",
  },
  {
    key: "8",
    DiscountID: "#DIR0013",
    DealID: "#DEL0013",
    RequestedBy: "Benjamin Harrison",
    Avatar: "assets/img/users/user-07.jpg",
    RequestedDiscount: "15%",
    ApprovedDiscount: "0%",
    FinalDealValue: "FCFA 50,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "9",
    DiscountID: "#DIR0012",
    DealID: "#DEL0012",
    RequestedBy: "Nicholas Wright",
    Avatar: "assets/img/users/user-08.jpg",
    RequestedDiscount: "10%",
    ApprovedDiscount: "08%",
    FinalDealValue: "FCFA 18,000",
    ApprovalStatus: "Approved",
  },
  {
    key: "10",
    DiscountID: "#DIR0011",
    DealID: "#DEL0011",
    RequestedBy: "Alexandra Bennett",
    Avatar: "assets/img/users/user-09.jpg",
    RequestedDiscount: "12%",
    ApprovedDiscount: "12%",
    FinalDealValue: "FCFA 10,000",
    ApprovalStatus: "Approved",
  },
];
