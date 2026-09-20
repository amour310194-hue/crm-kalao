export interface ProductsListInterface {
  key: string;
  ProductID: string;
  ProductName: string;
  Category: string;
  Kind: string;
  SKU: string;
  UnitPrice: string;
  Tax: string;
  Status: string;
}

export const ProductsListData: ProductsListInterface[] = [
  {
    key: "1",
    ProductID: "#PRD114",
    ProductName: "Barcode Scanner",
    Category: "Hardware",
    Kind: "Produit",
    SKU: "BARHARD",
    UnitPrice: "FCFA 7500",
    Tax: "18",
    Status: "Active",
  },
  {
    key: "2",
    ProductID: "#PRD115",
    ProductName: "Cyber Security Suite",
    Category: "Cloud",
    Kind: "Produit",
    SKU: "CLDPLAN",
    UnitPrice: "FCFA 2000",
    Tax: "16",
    Status: "Active",
  },
  {
    key: "3",
    ProductID: "#PRD116",
    ProductName: "Digital Marketing Pack",
    Category: "Security",
    Kind: "Produit",
    SKU: "SECSTD",
    UnitPrice: "FCFA 1600",
    Tax: "12",
    Status: "Active",
  },
  {
    key: "4",
    ProductID: "#PRD117",
    ProductName: "Marketing Reporting Tool",
    Category: "Marketing",
    Kind: "Produit",
    SKU: "MRKTPKG",
    UnitPrice: "FCFA 600",
    Tax: "4",
    Status: "Inactive",
  },
  {
    key: "5",
    ProductID: "#PRD118",
    ProductName: "Financial Reporting Tool",
    Category: "Finance",
    Kind: "Produit",
    SKU: "FINREP",
    UnitPrice: "FCFA 2800",
    Tax: "6",
    Status: "Active",
  },
  {
    key: "6",
    ProductID: "#PRD119",
    ProductName: "Logistics Tracking System",
    Category: "Logistics",
    Kind: "Produit",
    SKU: "LOGTRK",
    UnitPrice: "FCFA 6955",
    Tax: "4",
    Status: "Active",
  },
  {
    key: "7",
    ProductID: "#PRD120",
    ProductName: "User Training Program",
    Category: "Training",
    Kind: "Service",
    SKU: "TRNPRO",
    UnitPrice: "FCFA 4785",
    Tax: "8",
    Status: "Active",
  },
  {
    key: "8",
    ProductID: "#PRD121",
    ProductName: "Annual Maintenance Service",
    Category: "Service",
    Kind: "Service",
    SKU: "AMS001",
    UnitPrice: "FCFA 2145",
    Tax: "12",
    Status: "Inactive",
  },
  {
    key: "9",
    ProductID: "#PRD122",
    ProductName: "Technical Support Plan",
    Category: "Support",
    Kind: "Service",
    SKU: "SUPSTD",
    UnitPrice: "FCFA 3652",
    Tax: "10",
    Status: "Active",
  },
  {
    key: "10",
    ProductID: "#PRD123",
    ProductName: "Cloud Backup Solution",
    Category: "Cloud",
    Kind: "Produit",
    SKU: "CLDBKP",
    UnitPrice: "FCFA 1452",
    Tax: "16",
    Status: "Active",
  },
];
