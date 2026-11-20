/** A scholar record as written by scripts/fetch_disciplines.mjs. */
export interface RawScholar {
  id: string;
  name: string;
  orcid: string | null;
  inst: string | null;
  country: string | null;
  works: number;
  cites: number;
  h: number;
  i10: number;
  /** OpenAlex 2-year mean citedness. */
  c2y: number;
  first: number | null;
  last: number | null;
  /** Share of the scholar's topic-tagged works inside the discipline (0–1). */
  share: number;
  subfield: string | null;
  /** Hyper-authorship flag: 40+ papers per active year on average. */
  hyper: boolean;
  group: 'core' | 'rising' | 'collection';
  topics: { n: string; sf: string | null; c: number }[];
  /** [year, works published, citations received]. Citations per year start in 2012. */
  years: [number, number, number][];
}

export interface DisciplineFile {
  slug: string;
  fieldId: number;
  openAlexName: string;
  fieldWorks: number;
  subfields: string[];
  fetchedAt: string;
  scholars: RawScholar[];
}

/** Table row: the raw record minus the bulky series, plus derived metrics. */
export interface ScholarRow {
  id: string;
  name: string;
  inst: string | null;
  country: string | null;
  subfield: string | null;
  works: number;
  cites: number;
  h: number;
  i10: number;
  c2y: number;
  first: number | null;
  /** Academic age in years, counting the first year as year one. */
  age: number | null;
  /** Hirsch's m-quotient: h / academic age. */
  m: number | null;
  /** Citations received in the last three complete years. */
  recent: number;
  hyper: boolean;
  group: RawScholar['group'];
}
