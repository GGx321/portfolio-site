/**
 * Map selected option IDs to an approximate cost (in any currency/units).
 * Key: comma-separated option IDs in order of ORDER_QUESTIONS (e.g. "site,yes").
 * Value: number or string for display.
 * Fill in real values as needed; default is "—" when no match.
 */
export type CostMapping = Record<string, number | string>;

export const COST_MAPPING: CostMapping = {
  site: 200,
  shop: 600,
  tg_bot: 300,
  tg_miniapp: 600,
  web3: 800,
  yes: 0,
  no: 0,
  example: 0,
  // комбинации: тип,дизайн (примерные цены в USD)
  'site,yes': 300,
  'site,no': 400,
  'site,example': 400,
  'shop,yes': 700,
  'shop,no': 900,
  'shop,example': 800,
  'tg_bot,yes': 400,
  'tg_bot,no': 500,
  'tg_bot,example': 500,
  'tg_miniapp,yes': 800,
  'tg_miniapp,no': 1000,
  'tg_miniapp,example': 900,
  'web3,yes': 900,
  'web3,no': 1000,
  'web3,example': 1000,
};

export function getApproximateCost(selectedOptionIds: string[]): string {
  const key = selectedOptionIds.join(',');
  const value = COST_MAPPING[key];
  if (value !== undefined && value !== null) {
    return typeof value === 'number' ? `${value} USD` : String(value);
  }
  return '—';
}
