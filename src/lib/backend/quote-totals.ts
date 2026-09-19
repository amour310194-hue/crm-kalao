export type QuoteLineAmounts = {
  ht: number;
  tva: number;
  ttc: number;
};

export type QuoteLineInput = {
  quantity?: number;
  unitPrice?: number;
  taxRate?: number;
  discountRate?: number;
};

export function roundMoney(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function lineAmounts(line: QuoteLineInput): QuoteLineAmounts {
  const quantity = Math.max(0, Number(line.quantity) || 0);
  const unitPrice = Math.max(0, Number(line.unitPrice) || 0);
  const taxRate = Math.max(0, Number(line.taxRate) || 0);
  const discountRate = Math.min(100, Math.max(0, Number(line.discountRate) || 0));
  const ht = roundMoney(quantity * unitPrice * (1 - discountRate / 100));
  const tva = roundMoney(ht * (taxRate / 100));
  return { ht, tva, ttc: roundMoney(ht + tva) };
}

export function quoteTotalsFromLines(lines: QuoteLineInput[]): QuoteLineAmounts {
  return lines.reduce(
    (totals, line) => {
      const amounts = lineAmounts(line);
      return {
        ht: roundMoney(totals.ht + amounts.ht),
        tva: roundMoney(totals.tva + amounts.tva),
        ttc: roundMoney(totals.ttc + amounts.ttc),
      };
    },
    { ht: 0, tva: 0, ttc: 0 }
  );
}

export function discountLabelFromLines(lines: Array<{ discountRate?: number }>) {
  const rates = [...new Set(lines.map((line) => roundMoney(Number(line.discountRate) || 0)))];
  if (rates.length === 0 || (rates.length === 1 && rates[0] === 0)) return "0%";
  if (rates.length === 1) return `${rates[0]}%`;
  return "Mixte";
}
