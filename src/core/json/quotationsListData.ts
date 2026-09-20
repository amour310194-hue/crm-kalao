export interface QuotationsListItem {
  key: string;
  quoteId: string;
  client: string;
  clientImage: string;
  quoteDate: string;
  validTill: string;
  totalAmount: string;
  discount: string;
  finalAmount: string;
}

export const QuotationsListData: QuotationsListItem[] = [
  {
    key: "1",
    quoteId: "#QUO0020",
    client: "NovaWave LLC",
    clientImage: "assets/img/icons/company-icon-01.svg",
    quoteDate: "15 Dec 2026",
    validTill: "15 Dec 2027",
    totalAmount: "FCFA 200000",
    discount: "10%",
    finalAmount: "FCFA 250,000",
  },
  {
    key: "2",
    quoteId: "#QUO0019",
    client: "BlueSky Industries",
    clientImage: "assets/img/icons/company-icon-02.svg",
    quoteDate: "12 Nov 2026",
    validTill: "12 Nov 2027",
    totalAmount: "FCFA 300000",
    discount: "30%",
    finalAmount: "FCFA 50,000",
  },
  {
    key: "3",
    quoteId: "#QUO0018",
    client: "SilverHawk",
    clientImage: "assets/img/icons/company-icon-03.svg",
    quoteDate: "06 Oct 2026",
    validTill: "06 Oct 2027",
    totalAmount: "FCFA 200000",
    discount: "60%",
    finalAmount: "FCFA 45,000",
  },
  {
    key: "4",
    quoteId: "#QUO0017",
    client: "SummitPeak",
    clientImage: "assets/img/icons/company-icon-04.svg",
    quoteDate: "14 Sep 2026",
    validTill: "14 Sep 2027",
    totalAmount: "FCFA 300000",
    discount: "80%",
    finalAmount: "FCFA 780,000",
  },
  {
    key: "5",
    quoteId: "#QUO0016",
    client: "RiverStone Ventur",
    clientImage: "assets/img/icons/company-icon-05.svg",
    quoteDate: "23 Aug 2026",
    validTill: "23 Aug 2027",
    totalAmount: "FCFA 120000",
    discount: "40%",
    finalAmount: "FCFA 80,000",
  },
  {
    key: "6",
    quoteId: "#QUO0015",
    client: "CoastalStar Co.",
    clientImage: "assets/img/icons/company-icon-06.svg",
    quoteDate: "16 Jul 2026",
    validTill: "16 Jul 2027",
    totalAmount: "FCFA 200000",
    discount: "70%",
    finalAmount: "FCFA 40,000",
  },
  {
    key: "7",
    quoteId: "#QUO0014",
    client: "HarborView",
    clientImage: "assets/img/icons/company-icon-07.svg",
    quoteDate: "09 Jun 2026",
    validTill: "09 Jun 2027",
    totalAmount: "FCFA 200000",
    discount: "90%",
    finalAmount: "FCFA 7,000",
  },
  {
    key: "8",
    quoteId: "#QUO0013",
    client: "Golden Gate Ltd",
    clientImage: "assets/img/icons/company-icon-08.svg",
    quoteDate: "15 May 2026",
    validTill: "15 May 2027",
    totalAmount: "FCFA 45,000",
    discount: "30%",
    finalAmount: "FCFA 01,23,000",
  },
  {
    key: "9",
    quoteId: "#QUO0012",
    client: "Consulting Services",
    clientImage: "assets/img/icons/company-icon-06.svg",
    quoteDate: "19 Apr 2026",
    validTill: "19 Apr 2027",
    totalAmount: "FCFA 200000",
    discount: "20%",
    finalAmount: "FCFA 780,000",
  },
  {
    key: "10",
    quoteId: "#QUO0011",
    client: "Redwood Inc",
    clientImage: "assets/img/icons/company-icon-09.svg",
    quoteDate: "28 Mar 2026",
    validTill: "28 Mar 2027",
    totalAmount: "FCFA 80,000",
    discount: "10%",
    finalAmount: "FCFA 04,10,000",
  },
  {
    key: "11",
    quoteId: "#QUO0010",
    client: "Redwood Inc",
    clientImage: "assets/img/icons/company-icon-09.svg",
    quoteDate: "25 Jan 2026",
    validTill: "25 Jan 2027",
    totalAmount: "FCFA 780,000",
    discount: "60%",
    finalAmount: "FCFA 02,19,000",
  },
  {
    key: "12",
    quoteId: "#QUO0009",
    client: "Ventur",
    clientImage: "assets/img/icons/company-icon-08.svg",
    quoteDate: "29 Jan 2026",
    validTill: "29 Jan 2027",
    totalAmount: "FCFA 300000",
    discount: "60%",
    finalAmount: "FCFA 60,000",
  },
];

export const QuotationClientOptions = [
  "Select",
  "NovaWave LLC",
  "Silver Hawk",
  "Harbor View",
];

export const QuotationCurrencyOptions = [
  "Select",
  "Dollar",
  "Euro",
  "Pound",
  "Rupee",
];

export const QuotationProductOptions = [
  "Select",
  "Barcode Scanner",
  "Cyber Security Suite",
  "Digital Marketing Pack",
  "Financial Reporting Tool",
];

export const QuotationEditProductOptions = [
  "Select",
  "Barcode Scanner",
  "Cyber Security Suite",
  "Digital Marketing Pack",
  "CRM License Pro",
];

export const QuotationDiscountOptions = [
  "0 %",
  "50 %",
  "60 %",
  "80 %",
  "100 %",
];

export const QuotationEditDiscountOptions = [
  "0 %",
  "10 %",
  "60 %",
  "80 %",
  "100 %",
];

export const QuotationClientPickList = [
  { key: "1", name: "NovaWave LLC", image: "assets/img/icons/company-icon-01.svg" },
  { key: "2", name: "BlueSky Industries", image: "assets/img/icons/company-icon-02.svg" },
  { key: "3", name: "Silver Hawk", image: "assets/img/icons/company-icon-03.svg" },
  { key: "4", name: "Summit Peak", image: "assets/img/icons/company-icon-04.svg" },
  { key: "5", name: "RiverStone Ventur", image: "assets/img/icons/company-icon-05.svg" },
  { key: "6", name: "Bright Bridge Grp", image: "assets/img/icons/company-icon-06.svg" },
];

export const QuotationFilterClientList = [
  { key: "1", name: "NovaWave LLC", image: "assets/img/icons/company-icon-01.svg" },
  { key: "2", name: "BlueSky Industries", image: "assets/img/icons/company-icon-02.svg" },
  { key: "3", name: "SilverHawk", image: "assets/img/icons/company-icon-03.svg" },
  { key: "4", name: "SummitPeak", image: "assets/img/icons/company-icon-04.svg" },
  { key: "5", name: "RiverStone Ventur", image: "assets/img/icons/company-icon-05.svg" },
];
