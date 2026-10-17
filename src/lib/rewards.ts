export const REWARD_TIERS = [
  { at: 5, name: "Dark Chocolate" },
  { at: 10, name: "Ramen Set" },
  { at: 15, name: "Earbuds" },
  { at: 20, name: "Smartwatch" },
] as const;

/** Rewards unlocked for a given monthly meeting count. */
export function unlockedRewards(count: number) {
  return REWARD_TIERS.filter((t) => count >= t.at).map((t) => t.name);
}

/** Months from September 2026 up to the current month (inclusive), as YYYY-MM. */
export function rewardMonths(now = new Date()) {
  const out: string[] = [];
  let y = 2026,
    m = 9;
  const ey = now.getFullYear(),
    em = now.getMonth() + 1;
  while (y < ey || (y === ey && m <= em) || out.length === 0) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}
