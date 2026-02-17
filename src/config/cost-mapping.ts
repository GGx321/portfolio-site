export type CostMapping = Record<string, number | string>;

export const COST_MAPPING: CostMapping = {
  "site,yes": 300,
  "site,no": 400,
  "site,example": 400,
  "shop,yes": 700,
  "shop,no": 800,
  "shop,example": 800,
  "tg_bot,yes": 400,
  "tg_bot,no": 500,
  "tg_bot,example": 500,
  "tg_miniapp,yes": 800,
  "tg_miniapp,no": 1000,
  "tg_miniapp,example": 900,
  "web3,yes": 800,
  "web3,no": 1000,
  "web3,example": 900,
};

export function getApproximateCost(selectedOptionIds: string[]): string {
  const key = selectedOptionIds.join(",");
  const value = COST_MAPPING[key];
  if (value !== undefined && value !== null) {
    return typeof value === "number" ? `${value} USD` : String(value);
  }
  return "—";
}
