export type CostMapping = Record<string, number | string>;

export const COST_MAPPING: CostMapping = {
  "site,yes": 150,
  "site,no": 200,
  "site,example": 180,
  "shop,yes": 500,
  "shop,no": 700,
  "shop,example": 600,
  "tg_bot,yes": 250,
  "tg_bot,no": 350,
  "tg_bot,example": 300,
  "tg_miniapp,yes": 500,
  "tg_miniapp,no": 700,
  "tg_miniapp,example": 600,
  "web3,yes": 600,
  "web3,no": 900,
  "web3,example": 800,
};

export function getApproximateCost(selectedOptionIds: string[]): string {
  const key = selectedOptionIds.join(",");
  const value = COST_MAPPING[key];
  if (value !== undefined && value !== null) {
    return typeof value === "number" ? `${value} USD` : String(value);
  }
  return "—";
}
