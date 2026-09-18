export interface DiscountRulesData {
  key: string;
  RuleID: string;
  RuleName: string;
  DiscountType: string;
  DiscountValue: string;
  MinDealValue: string;
  ApplicableProduct: string;
  AutoApply: string;
  Status: string;
}

export const DiscountRulesListData: DiscountRulesData[] = [
  {
    key: "1",
    RuleID: "#DIR0020",
    RuleName: "Standard Sales Discount",
    DiscountType: "Percentage",
    DiscountValue: "10%",
    MinDealValue: "$3,000",
    ApplicableProduct: "All Products",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "2",
    RuleID: "#DIR0019",
    RuleName: "Manager Special Discount",
    DiscountType: "Percentage",
    DiscountValue: "20%",
    MinDealValue: "$10,000",
    ApplicableProduct: "Enterprise Deals",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "3",
    RuleID: "#DIR0018",
    RuleName: "New Customer Flat",
    DiscountType: "Flat",
    DiscountValue: "$500",
    MinDealValue: "$5,000",
    ApplicableProduct: "SaaS Basic",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "4",
    RuleID: "#DIR0017",
    RuleName: "High Volume Tier",
    DiscountType: "Percentage",
    DiscountValue: "15%",
    MinDealValue: "$25,000",
    ApplicableProduct: "All Products",
    AutoApply: "Yes",
    Status: "Inactive",
  },
  {
    key: "5",
    RuleID: "#DIR0016",
    RuleName: "Seasonal Clearance",
    DiscountType: "Percentage",
    DiscountValue: "25%",
    MinDealValue: "$1,000",
    ApplicableProduct: "Hardwares",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "6",
    RuleID: "#DIR0015",
    RuleName: "Partner Referral",
    DiscountType: "Flat",
    DiscountValue: "$1,000",
    MinDealValue: "$15,000",
    ApplicableProduct: "Subscriptions",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "7",
    RuleID: "#DIR0014",
    RuleName: "Loyalty Reward",
    DiscountType: "Percentage",
    DiscountValue: "5%",
    MinDealValue: "$500",
    ApplicableProduct: "Custom Solutions",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "8",
    RuleID: "#DIR0013",
    RuleName: "Executive Override",
    DiscountType: "Percentage",
    DiscountValue: "30%",
    MinDealValue: "$50,000",
    ApplicableProduct: "All Products",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "9",
    RuleID: "#DIR0012",
    RuleName: "Bundle Discount",
    DiscountType: "Flat",
    DiscountValue: "$200",
    MinDealValue: "$2,500",
    ApplicableProduct: "Accessories",
    AutoApply: "Yes",
    Status: "Active",
  },
  {
    key: "10",
    RuleID: "#DIR0011",
    RuleName: "End of Quarter",
    DiscountType: "Percentage",
    DiscountValue: "12%",
    MinDealValue: "$10,000",
    ApplicableProduct: "Cloud Storage",
    AutoApply: "Yes",
    Status: "Active",
  },
];
