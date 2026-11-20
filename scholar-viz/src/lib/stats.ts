export const CURRENT_YEAR = 2026;
/** Last three complete calendar years, used for "recent citations". */
export const RECENT_YEARS = [2023, 2024, 2025];
/** OpenAlex only reports citations received per year from this year on. */
export const CITES_SINCE = 2012;

export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function median(values: number[]): number {
  return quantile([...values].sort((a, b) => a - b), 0.5);
}

/** Share of values strictly below x, as a percentile 0–100. */
export function percentileOf(values: number[], x: number): number {
  if (!values.length) return 0;
  let below = 0;
  let equal = 0;
  for (const v of values) {
    if (v < x) below++;
    else if (v === x) equal++;
  }
  return ((below + equal / 2) / values.length) * 100;
}

/** Gini coefficient of non-negative values. */
export function gini(values: number[]): number {
  const v = [...values].sort((a, b) => a - b);
  const n = v.length;
  const total = v.reduce((a, b) => a + b, 0);
  if (!n || !total) return 0;
  let weighted = 0;
  v.forEach((x, i) => { weighted += (i + 1) * x; });
  return (2 * weighted) / (n * total) - (n + 1) / n;
}

/** Lorenz curve points, ordered from the most-cited scholar down:
 *  x = share of scholars, y = share of citations they hold. */
export function concentrationCurve(values: number[], steps = 50): { x: number; y: number }[] {
  const v = [...values].sort((a, b) => b - a);
  const total = v.reduce((a, b) => a + b, 0) || 1;
  const pts = [{ x: 0, y: 0 }];
  let acc = 0;
  let next = 1;
  v.forEach((x, i) => {
    acc += x;
    const share = (i + 1) / v.length;
    if (share * steps >= next || i === v.length - 1) {
      pts.push({ x: Math.round(share * 1000) / 10, y: Math.round((acc / total) * 1000) / 10 });
      next = Math.floor(share * steps) + 1;
    }
  });
  return pts;
}

/** Share of the total held by the top `frac` of values. */
export function topShare(values: number[], frac: number): number {
  const v = [...values].sort((a, b) => b - a);
  const total = v.reduce((a, b) => a + b, 0) || 1;
  const k = Math.max(1, Math.round(v.length * frac));
  return v.slice(0, k).reduce((a, b) => a + b, 0) / total;
}

export function countBy<T>(items: T[], key: (t: T) => string | null | undefined): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count);
}

export function formatCompact(n: number, lang: 'en' | 'zh' = 'en'): string {
  if (lang === 'zh') {
    if (n >= 1e8) return `${(n / 1e8).toFixed(1).replace(/\.0$/, '')}亿`;
    if (n >= 1e4) return `${(n / 1e4).toFixed(1).replace(/\.0$/, '')}万`;
    return n.toLocaleString('zh-CN');
  }
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1e4) return `${Math.round(n / 1e3)}k`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(n));
}

export function formatInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
