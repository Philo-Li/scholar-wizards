// Build-time access to the hand-written person files and their fetched facts.
// Server components only: this reads the content folder from disk.

import fs from 'node:fs';
import path from 'node:path';
import metaJson from '@/data/people-meta.json';
import type { Person, PersonCard, PersonFile, PersonMeta } from './people-types';
import { CURRENT_YEAR } from './stats';

export type { Bi, Person, PersonCard } from './people-types';

const DIR = path.join(process.cwd(), 'src', 'content', 'people');
const META = metaJson as unknown as Record<string, PersonMeta>;

const TOP_PRIZE = /Nobel|Fields Medal|Abel Prize|Turing Award|Wolf Prize|Crafoord|Kyoto Prize|Lasker|Breakthrough Prize|Shaw Prize|Kavli|Japan Prize|Gruber Prize|Balzan Prize/i;

const EMPTY_META: PersonMeta = { qid: null, born: null, died: null, prizes: [], portrait: null, openalex: null };

let cache: Person[] | null = null;

export function allPeople(): Person[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort() : [];
  cache = files.map(f => {
    const file = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as PersonFile;
    const meta = META[file.slug] ?? EMPTY_META;
    const bornYear = meta.born?.year ?? file.born;
    const diedYear = meta.died?.year ?? null;
    const top = meta.prizes.find(p => p.year && !p.declined && TOP_PRIZE.test(p.en));
    return {
      ...file,
      meta,
      bornYear,
      diedYear,
      keyAge: file.keyWork.year - bornYear,
      prize: top ? { en: top.en, zh: top.zh, year: top.year!, age: top.year! - bornYear } : null,
    };
  });
  cache.sort((a, b) => a.bornYear - b.bornYear);
  return cache;
}

export function getPerson(slug: string): Person | undefined {
  return allPeople().find(p => p.slug === slug);
}

export function toCard(p: Person): PersonCard {
  return {
    slug: p.slug,
    name: p.name,
    disciplines: p.disciplines,
    themes: p.themes,
    bornYear: p.bornYear,
    diedYear: p.diedYear,
    keyYear: p.keyWork.year,
    keyAge: p.keyAge,
    keyWork: { en: p.keyWork.en, zh: p.keyWork.zh },
    prize: p.prize,
    why: p.why,
    portrait: p.meta.portrait?.src ?? null,
  };
}

export function peopleInTheme(slug: string): Person[] {
  return allPeople().filter(p => p.themes.includes(slug));
}

/** Person slug for an OpenAlex author id, so data pages can link to the chapter. */
export function personForOpenAlex(id: string): Person | undefined {
  return allPeople().find(p => p.meta.openalex === id);
}

export function ageNow(p: Person): number {
  return (p.diedYear ?? CURRENT_YEAR) - p.bornYear;
}
