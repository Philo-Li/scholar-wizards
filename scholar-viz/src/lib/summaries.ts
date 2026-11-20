// Build-time summaries computed once per page and passed to client views.

import { getDiscipline, getRows } from './data';
import type { ScholarRow } from './types';
import { CITES_SINCE, concentrationCurve, countBy, gini, median, quantile, topShare } from './stats';

export interface FieldSummary {
  slug: string;
  fetchedAt: string;
  core: ScholarRow[];
  rising: ScholarRow[];
  n: number;
  hyperCount: number;
  medianH: number;
  medianAge: number;
  medianCites: number;
  gini: number;
  top10: number;
  curve: { x: number; y: number }[];
  subfields: { key: string; n: number; q1: number; med: number; q3: number }[];
  countries: { key: string; count: number }[];
  institutions: { key: string; count: number }[];
  trajectories: { id: string; name: string; series: [number, number][] }[];
}

export function fieldSummary(slug: string): FieldSummary {
  const file = getDiscipline(slug);
  const rows = getRows(slug);
  const core = rows.filter(r => r.group === 'core');
  const ranked = core.filter(r => !r.hyper);
  const rising = rows.filter(r => r.group === 'rising');
  const cites = ranked.map(r => r.cites);

  const bySub = new Map<string, number[]>();
  for (const r of ranked) {
    if (!r.subfield) continue;
    bySub.set(r.subfield, [...(bySub.get(r.subfield) ?? []), r.h]);
  }
  const subfields = [...bySub.entries()]
    .filter(([, v]) => v.length >= 5)
    .map(([key, v]) => {
      const s = [...v].sort((a, b) => a - b);
      return { key, n: s.length, q1: quantile(s, 0.25), med: quantile(s, 0.5), q3: quantile(s, 0.75) };
    })
    .sort((a, b) => b.med - a.med);

  const top = [...ranked].sort((a, b) => b.cites - a.cites).slice(0, 12);
  const trajectories = top.map(r => {
    const raw = file.scholars.find(s => s.id === r.id)!;
    const series: [number, number][] = [];
    for (let y = CITES_SINCE; y <= 2025; y++) {
      const hit = raw.years.find(v => v[0] === y);
      series.push([y, hit ? hit[2] : 0]);
    }
    return { id: r.id, name: r.name, series };
  });

  return {
    slug,
    fetchedAt: file.fetchedAt,
    core,
    rising,
    n: ranked.length,
    hyperCount: core.length - ranked.length,
    medianH: median(ranked.map(r => r.h)),
    medianAge: median(ranked.filter(r => r.age).map(r => r.age!)),
    medianCites: median(cites),
    gini: gini(cites),
    top10: topShare(cites, 0.1),
    curve: concentrationCurve(cites),
    subfields,
    countries: countBy(ranked, r => r.country).slice(0, 10),
    institutions: countBy(ranked, r => r.inst).slice(0, 10),
    trajectories,
  };
}
