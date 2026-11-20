// Data access for server components. Everything here runs at build time;
// pages pass only the slices they need down to client components.

import mathematics from '@/data/disciplines/mathematics.json';
import physics from '@/data/disciplines/physics.json';
import chemistry from '@/data/disciplines/chemistry.json';
import biology from '@/data/disciplines/biology.json';
import computerScience from '@/data/disciplines/computer-science.json';
import medicine from '@/data/disciplines/medicine.json';
import neuroscience from '@/data/disciplines/neuroscience.json';
import psychology from '@/data/disciplines/psychology.json';
import economics from '@/data/disciplines/economics.json';
import earthSciences from '@/data/disciplines/earth-sciences.json';
import compNeuro from '@/data/collections/computational-neuroscience.json';

import { DISCIPLINES } from './disciplines';
import type { DisciplineFile, RawScholar, ScholarRow } from './types';
import { CURRENT_YEAR, RECENT_YEARS } from './stats';

const FILES: Record<string, DisciplineFile> = {
  mathematics: mathematics as unknown as DisciplineFile,
  physics: physics as unknown as DisciplineFile,
  chemistry: chemistry as unknown as DisciplineFile,
  biology: biology as unknown as DisciplineFile,
  'computer-science': computerScience as unknown as DisciplineFile,
  medicine: medicine as unknown as DisciplineFile,
  neuroscience: neuroscience as unknown as DisciplineFile,
  psychology: psychology as unknown as DisciplineFile,
  economics: economics as unknown as DisciplineFile,
  'earth-sciences': earthSciences as unknown as DisciplineFile,
};

export const COLLECTION = compNeuro as unknown as DisciplineFile;

export function getDiscipline(slug: string): DisciplineFile {
  return FILES[slug];
}

export function toRow(s: RawScholar): ScholarRow {
  const age = s.first ? CURRENT_YEAR - s.first + 1 : null;
  const recent = s.years
    .filter(([y]) => RECENT_YEARS.includes(y))
    .reduce((a, [, , c]) => a + c, 0);
  return {
    id: s.id,
    name: s.name,
    inst: s.inst,
    country: s.country,
    subfield: s.subfield,
    works: s.works,
    cites: s.cites,
    h: s.h,
    i10: s.i10,
    c2y: s.c2y,
    first: s.first,
    age,
    m: age ? Math.round((s.h / age) * 100) / 100 : null,
    recent,
    hyper: s.hyper,
    group: s.group,
  };
}

export function getRows(slug: string): ScholarRow[] {
  return getDiscipline(slug).scholars.map(toRow);
}

/** Scholars who count towards a discipline's statistics: established, not hyper-authored. */
export function rankedRows(slug: string): ScholarRow[] {
  return getRows(slug).filter(r => r.group === 'core' && !r.hyper);
}

export interface Membership {
  slug: string;
  scholar: RawScholar;
}

let index: Map<string, Membership[]> | null = null;

/** Every scholar id mapped to the disciplines (and collection) that list them. */
export function scholarIndex(): Map<string, Membership[]> {
  if (index) return index;
  index = new Map();
  for (const d of DISCIPLINES) {
    for (const s of FILES[d.slug].scholars) {
      const list = index.get(s.id) ?? [];
      list.push({ slug: d.slug, scholar: s });
      index.set(s.id, list);
    }
  }
  for (const s of COLLECTION.scholars) {
    const list = index.get(s.id) ?? [];
    list.push({ slug: 'collection', scholar: s });
    index.set(s.id, list);
  }
  return index;
}
