/** A string in both site languages. */
export interface Bi {
  en: string;
  zh: string;
}

export type Dated = Bi & { year: number };

/** A hand-written person file in src/content/people/. Schema: docs/concept.md §5. */
export interface PersonFile {
  slug: string;
  name: Bi;
  wiki: { en: string; zh: string | null };
  disciplines: string[];
  themes: string[];
  reasons: string[];
  born: number;
  keyWork: Dated;
  why: Bi;
  summary: Bi;
  style: Bi[];
  timeline: Dated[];
  works: (Dated & { title: string })[];
  quotes: { text: string; zh: string; source: string; url: string }[];
  links: { kind: string; title: string; publisher: string; year: number | null; url: string; lang: string }[];
  lessons: (Bi & { key: string })[];
  openalex?: string;
}

export interface PartialDate {
  year: number;
  month: number | null;
  day: number | null;
}

/** Facts pulled from Wikidata and Commons by scripts/fetch_people.mjs. */
export interface PersonMeta {
  qid: string | null;
  born: PartialDate | null;
  died: PartialDate | null;
  prizes: { id: string; en: string; zh: string; year: number | null; declined?: boolean }[];
  portrait: {
    src: string;
    width: number | null;
    height: number | null;
    page: string;
    artist: string | null;
    licence: string;
  } | null;
  openalex: string | null;
}

export interface Person extends PersonFile {
  meta: PersonMeta;
  bornYear: number;
  diedYear: number | null;
  /** Age in the year of the key work. */
  keyAge: number;
  /** First top-tier prize, if any, and the age at which it came. */
  prize: { en: string; zh: string; year: number; age: number } | null;
}

/** The slice of a person that lists and charts need. */
export interface PersonCard {
  slug: string;
  name: Bi;
  disciplines: string[];
  themes: string[];
  bornYear: number;
  diedYear: number | null;
  keyYear: number;
  keyAge: number;
  keyWork: Bi;
  prize: Person['prize'];
  why: Bi;
  portrait: string | null;
}
