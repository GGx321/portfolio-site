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
  yes: 100,
  no: 200,
  example: 200,
};

export function getApproximateCost(selectedOptionIds: string[]): string {
  const key = selectedOptionIds.join(',');
  const value = COST_MAPPING[key];
  if (value !== undefined && value !== null) {
    return typeof value === 'number' ? `${value} USD` : String(value);
  }
  return '—';
}
