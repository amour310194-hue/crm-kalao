import { describe, expect, it } from "vitest";
import { toExpenseInsert, validateExpenseInput, type ExpenseInput } from "@/lib/expenses";
import { qtyForItemAtLocation } from "@/lib/stock";

const base: ExpenseInput = {
  category: "carburant",
  label: "Essence",
  amount: 15000,
  spent_at: "2026-09-27",
  method: "cash",
};

describe("validateExpenseInput", () => {
  it("accepte une dépense hors stock", () => {
    expect(validateExpenseInput(base)).toBeNull();
  });

  it("refuse un achat de stock sans article ni quantité", () => {
    expect(validateExpenseInput({ ...base, category: "achat_stock" })).toBe(
      "Choisissez un article pour un achat de stock."
    );
    expect(
      validateExpenseInput({
        ...base,
        category: "achat_stock",
        catalog_item_id: "item-1",
        qty: 0,
      })
    ).toBe("Indiquez une quantité positive.");
  });

  it("n’envoie article et quantité que pour un achat de stock", () => {
    const payload = toExpenseInsert({
      ...base,
      catalog_item_id: "item-1",
      qty: 4,
      stock_location_id: "loc-1",
    });
    expect(payload.catalog_item_id).toBeNull();
    expect(payload.qty).toBeNull();
    expect(
      toExpenseInsert({
        ...base,
        category: "achat_stock",
        catalog_item_id: "item-1",
        qty: 4,
        stock_location_id: "loc-1",
      }).qty
    ).toBe(4);
  });
});

describe("qtyForItemAtLocation", () => {
  const rows = [
    { id: "1", catalog_item_id: "a", location_id: "x", qty: 10, reason: null, created_at: "" },
    { id: "2", catalog_item_id: "a", location_id: "y", qty: -3, reason: null, created_at: "" },
    { id: "3", catalog_item_id: "b", location_id: "x", qty: 2, reason: null, created_at: "" },
  ];

  it("somme tous les sites ou un site précis", () => {
    expect(qtyForItemAtLocation(rows, "a")).toBe(7);
    expect(qtyForItemAtLocation(rows, "a", "x")).toBe(10);
  });
});
