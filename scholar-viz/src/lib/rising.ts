import { DISCIPLINES } from './disciplines';
import { getRows } from './data';
import type { RisingRow } from '@/components/views/ThemeView';

const PER_DISCIPLINE = 3;
const MIN_AGE = 5;

/** Rising scholars ranked by m-quotient within each discipline. */
export function risingCohort(slug: string) {
  return getRows(slug)
    .filter(r => r.group === 'rising' && !r.hyper && r.age && r.age >= MIN_AGE && r.m !== null)
    .sort((a, b) => b.m! - a.m!);
}

/** Top m-quotients per discipline. A scholar listed in two disciplines appears once, under the first. */
export function risingRows(): RisingRow[] {
  const seen = new Set<string>();
  return DISCIPLINES.flatMap(d => {
    const cohort = risingCohort(d.slug);
    const out: RisingRow[] = [];
    cohort.forEach((r, i) => {
      if (out.length >= PER_DISCIPLINE || seen.has(r.id)) return;
      seen.add(r.id);
      out.push({ id: r.id, name: r.name, inst: r.inst, slug: d.slug, first: r.first!, h: r.h, cites: r.cites, m: r.m!, rank: i + 1, n: cohort.length });
    });
    return out;
  });
}
