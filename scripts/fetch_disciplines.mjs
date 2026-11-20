#!/usr/bin/env node
/**
 * Build the per-discipline scholar datasets from OpenAlex.
 *
 *   node scripts/fetch_disciplines.mjs            # all disciplines
 *   node scripts/fetch_disciplines.mjs physics    # one discipline
 *
 * Every API response is cached under data/openalex_cache/, so re-running the
 * script after a tweak to the selection logic costs nothing. Delete the cache
 * folder to pull fresh numbers.
 *
 * Output: scholar-viz/src/data/disciplines/<slug>.json
 *
 * Selection, per discipline (an OpenAlex "field"):
 *   - Established scholars: authors who have published in the field, sorted by
 *     total citations, kept only when at least 40% of their topic-tagged works
 *     sit inside the field (so a statistician who once wrote about galaxies is
 *     not listed under physics).
 *   - Subfield leaders: the same pass run inside each of the discipline's
 *     largest subfields, keeping authors whose main subfield it is. Citation
 *     volume differs enormously between subfields (statistics vs. algebra),
 *     so without this step a few high-citation subfields fill every slot.
 *   - Rising scholars: first and last authors of the field's most-cited papers
 *     from the last ten years, kept when their first indexed paper is no older
 *     than RISING_FIRST_YEAR.
 *   - Hyper-authorship flag: an average of 40+ papers per active year usually
 *     means membership in very large collaborations (particle physics,
 *     consortium genomics, multicentre trials). Those authors are kept but
 *     flagged, and excluded from the default rankings.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(ROOT, 'data', 'openalex_cache');
const OUT_DIR = path.join(ROOT, 'scholar-viz', 'src', 'data', 'disciplines');
const API = 'https://api.openalex.org';
const API_KEY = process.env.OPENALEX_API_KEY || '';

export const DISCIPLINES = [
  { slug: 'mathematics', fieldId: 26 },
  { slug: 'physics', fieldId: 31 },
  { slug: 'chemistry', fieldId: 16 },
  { slug: 'biology', fieldId: 13 },
  { slug: 'computer-science', fieldId: 17 },
  { slug: 'medicine', fieldId: 27 },
  { slug: 'neuroscience', fieldId: 28 },
  { slug: 'psychology', fieldId: 32 },
  { slug: 'economics', fieldId: 20 },
  { slug: 'earth-sciences', fieldId: 19 },
];

const CORE_TARGET = 100;          // field-wide top scholars kept per discipline
const SUBFIELD_LIMIT = 12;        // largest subfields scanned per discipline
const PER_SUBFIELD = 12;          // leaders kept per subfield
const CORE_MAX_PAGES = 15;        // 200 authors per page
const RISING_TARGET = 40;
const RISING_FIRST_YEAR = 2012;
const RISING_WORK_PAGES = 4;      // most-cited recent works scanned
const MIN_FIELD_SHARE = 0.4;
const MIN_FIELD_SHARE_RISING = 0.3;
const HYPER_WORKS_PER_YEAR = 40;
const CURRENT_YEAR = 2026;

const AUTHOR_SELECT = [
  'id', 'display_name', 'orcid', 'works_count', 'cited_by_count',
  'summary_stats', 'last_known_institutions', 'topics', 'counts_by_year',
].join(',');

let spent = 0;
let calls = 0;

async function get(url) {
  const full = API_KEY ? `${url}${url.includes('?') ? '&' : '?'}api_key=${API_KEY}` : url;
  const key = crypto.createHash('sha1').update(url).digest('hex');
  const file = path.join(CACHE_DIR, `${key}.json`);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch { /* not cached */ }

  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${API}${full}`);
    if (res.ok) {
      const json = await res.json();
      calls++;
      spent += json.meta?.cost_usd ?? 0;
      await fs.writeFile(file, JSON.stringify(json));
      await new Promise(r => setTimeout(r, 150));
      return json;
    }
    if (res.status === 429 || res.status >= 500) {
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    throw new Error(`${res.status} ${url}\n${await res.text()}`);
  }
  throw new Error(`Gave up on ${url}`);
}

const shortId = id => (id || '').split('/').pop();

function fieldShare(author, fieldId) {
  const topics = author.topics || [];
  const total = topics.reduce((a, t) => a + (t.count || 0), 0);
  if (!total) return 0;
  const inField = topics
    .filter(t => shortId(t.field?.id) === String(fieldId))
    .reduce((a, t) => a + (t.count || 0), 0);
  return inField / total;
}

/** "PAUL S. F. YIP" -> "Paul S. F. Yip"; mixed-case names are left alone. */
function tidyName(name) {
  if (name !== name.toUpperCase()) return name;
  return name.toLowerCase().replace(/(^|[\s'.-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

function compact(author, fieldId, group) {
  const years = (author.counts_by_year || [])
    .filter(y => y.year <= CURRENT_YEAR)
    .sort((a, b) => a.year - b.year);
  const published = years.filter(y => y.works_count > 0).map(y => y.year);

  // First year: the earliest year followed by at least one more paper within
  // five years. A lone stray record decades before a career starts is usually
  // a disambiguation error.
  let first = published[0] ?? null;
  for (let i = 0; i < published.length; i++) {
    if (published[i + 1] !== undefined && published[i + 1] - published[i] <= 5) {
      first = published[i];
      break;
    }
  }
  const last = published.at(-1) ?? null;
  const activeYears = first ? Math.max(1, CURRENT_YEAR - first + 1) : 1;
  const inst = author.last_known_institutions?.[0];

  const subfields = {};
  for (const t of author.topics || []) {
    const sf = t.subfield?.display_name;
    if (sf && shortId(t.field?.id) === String(fieldId)) subfields[sf] = (subfields[sf] || 0) + (t.count || 0);
  }
  const subfield = Object.entries(subfields).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    id: shortId(author.id),
    name: tidyName(author.display_name),
    orcid: author.orcid ? author.orcid.replace('https://orcid.org/', '') : null,
    inst: inst?.display_name ?? null,
    country: inst?.country_code ?? null,
    works: author.works_count,
    cites: author.cited_by_count,
    h: author.summary_stats?.h_index ?? 0,
    i10: author.summary_stats?.i10_index ?? 0,
    c2y: Math.round((author.summary_stats?.['2yr_mean_citedness'] ?? 0) * 100) / 100,
    first,
    last,
    share: Math.round(fieldShare(author, fieldId) * 100) / 100,
    subfield,
    hyper: author.works_count / activeYears >= HYPER_WORKS_PER_YEAR,
    group,
    topics: (author.topics || []).slice(0, 6).map(t => ({
      n: t.display_name,
      sf: t.subfield?.display_name ?? null,
      c: t.count,
    })),
    // [year, works, citations received]; citations-by-year only exist from 2012.
    years: years
      .filter(y => y.works_count > 0 || y.cited_by_count > 0)
      .map(y => [y.year, y.works_count, y.cited_by_count]),
  };
}

/**
 * Hyper-authorship check. Authors with many papers, or a high yearly rate,
 * get one extra request: how many of their works list more than 100 authors.
 * If at least a quarter do, their counts mostly reflect collaboration size.
 */
const BIG_TEAM = 100;
const BIG_TEAM_SHARE = 0.25;
// Fields where papers with 100+ authors are common enough to check for.
const BIG_TEAM_FIELDS = new Set([31, 13, 27, 28, 19]);
async function markHyper(s, fieldId) {
  if (s.hyper || !BIG_TEAM_FIELDS.has(fieldId)) return s;
  const rate = s.first ? s.works / Math.max(1, CURRENT_YEAR - s.first + 1) : 0;
  if (s.works < 1000 && rate < 25) return s;
  const json = await get(`/works?filter=author.id:${s.id},authors_count:>${BIG_TEAM}&per_page=1&select=id`);
  const big = json.meta?.count ?? 0;
  s.bigTeamShare = Math.round((big / Math.max(1, s.works)) * 100) / 100;
  if (s.bigTeamShare >= BIG_TEAM_SHARE) s.hyper = true;
  return s;
}

function plausible(a) {
  const name = a.display_name || '';
  if (!name || name.length < 4) return false;
  if (/collaboration|consortium|group|team|investigators|network|committee|^null$/i.test(name)) return false;
  if (!/\s/.test(name.trim())) return false; // single-token names are mostly broken records
  return true;
}

async function fetchCore({ fieldId }) {
  const kept = [];
  const seen = new Set();
  for (let page = 1; page <= CORE_MAX_PAGES; page++) {
    const json = await get(`/authors?filter=topics.field.id:${fieldId}&sort=cited_by_count:desc&per_page=200&page=${page}&select=${AUTHOR_SELECT}`);
    for (const a of json.results) {
      if (seen.has(a.id) || !plausible(a)) continue;
      seen.add(a.id);
      if (fieldShare(a, fieldId) < MIN_FIELD_SHARE) continue;
      kept.push(await markHyper(compact(a, fieldId, 'core'), fieldId));
    }
    if (kept.filter(s => !s.hyper).length >= CORE_TARGET) break;
  }
  // Keep the top CORE_TARGET non-flagged authors plus any flagged authors who
  // rank above the last of them, so the flag stays visible in context.
  const clean = kept.filter(s => !s.hyper).slice(0, CORE_TARGET);
  const floor = clean.at(-1)?.cites ?? 0;
  const flagged = kept.filter(s => s.hyper && s.cites >= floor).slice(0, 60);
  const out = new Map([...clean, ...flagged].map(s => [s.id, s]));

  // Subfield leaders
  const subs = await get(`/subfields?filter=field.id:${fieldId}&per_page=100&select=id,display_name,works_count`);
  const largest = subs.results.sort((a, b) => b.works_count - a.works_count).slice(0, SUBFIELD_LIMIT);
  for (const sub of largest) {
    const json = await get(`/authors?filter=topics.subfield.id:${shortId(sub.id)}&sort=cited_by_count:desc&per_page=200&select=${AUTHOR_SELECT}`);
    let n = 0;
    for (const a of json.results) {
      if (n >= PER_SUBFIELD) break;
      if (!plausible(a) || fieldShare(a, fieldId) < MIN_FIELD_SHARE) continue;
      const s = compact(a, fieldId, 'core');
      if (s.subfield !== sub.display_name) continue;
      await markHyper(s, fieldId);
      if (s.hyper) continue;
      n++;
      if (!out.has(s.id)) out.set(s.id, s);
    }
  }
  return [...out.values()].sort((a, b) => b.cites - a.cites);
}

async function fetchRising({ fieldId }, exclude) {
  const ids = new Set();
  for (let page = 1; page <= RISING_WORK_PAGES; page++) {
    const json = await get(`/works?filter=topics.field.id:${fieldId},publication_year:${CURRENT_YEAR - 10}-${CURRENT_YEAR},type:article&sort=cited_by_count:desc&per_page=200&page=${page}&select=id,authorships`);
    for (const w of json.results) {
      const auths = w.authorships || [];
      if (auths.length > 30) continue; // consortium papers say little about individuals
      for (const au of [auths[0], auths.at(-1)]) {
        const id = shortId(au?.author?.id);
        if (id && !exclude.has(id)) ids.add(id);
      }
    }
  }
  const all = [...ids];
  const out = [];
  for (let i = 0; i < all.length; i += 100) {
    const batch = all.slice(i, i + 100).join('|');
    const json = await get(`/authors?filter=ids.openalex:${batch}&per_page=100&select=${AUTHOR_SELECT}`);
    for (const a of json.results) {
      if (!plausible(a)) continue;
      if (fieldShare(a, fieldId) < MIN_FIELD_SHARE_RISING) continue;
      const s = compact(a, fieldId, 'rising');
      if (!s.first || s.first < RISING_FIRST_YEAR || s.hyper) continue;
      if (s.works < 5) continue;
      // An h-index growing by more than six a year from a recent start is
      // almost always two people merged into one record.
      if (s.h / (CURRENT_YEAR - s.first + 1) > 6) continue;
      out.push(s);
    }
  }
  return out.sort((a, b) => b.cites - a.cites).slice(0, RISING_TARGET);
}

async function fetchFieldMeta(fieldId) {
  const json = await get(`/fields/${fieldId}`);
  return {
    name: json.display_name,
    worksCount: json.works_count,
    citedByCount: json.cited_by_count,
    subfields: (json.subfields || []).map(s => s.display_name),
  };
}

async function buildDiscipline(d) {
  const meta = await fetchFieldMeta(d.fieldId);
  const core = await fetchCore(d);
  const rising = await fetchRising(d, new Set(core.map(s => s.id)));
  const out = {
    slug: d.slug,
    fieldId: d.fieldId,
    openAlexName: meta.name,
    fieldWorks: meta.worksCount,
    subfields: meta.subfields,
    fetchedAt: new Date().toISOString().slice(0, 10),
    scholars: [...core, ...rising],
  };
  await fs.writeFile(path.join(OUT_DIR, `${d.slug}.json`), JSON.stringify(out));
  const flagged = core.filter(s => s.hyper).length;
  console.log(`${d.slug.padEnd(18)} core ${core.length - flagged} (+${flagged} flagged)  rising ${rising.length}`);
}

/**
 * The original curated computational-neuroscience list (100 scholars picked
 * by hand in 2025), refreshed with current OpenAlex numbers.
 */
async function buildCollection() {
  const legacy = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'comp_neuro_ids.json'), 'utf8'));
  const out = [];
  for (let i = 0; i < legacy.length; i += 100) {
    const json = await get(`/authors?filter=ids.openalex:${legacy.slice(i, i + 100).join('|')}&per_page=100&select=${AUTHOR_SELECT}`);
    for (const a of json.results) out.push(compact(a, 28, 'collection'));
  }
  out.sort((a, b) => b.cites - a.cites);
  const dir = path.join(ROOT, 'scholar-viz', 'src', 'data', 'collections');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'computational-neuroscience.json'), JSON.stringify({
    slug: 'computational-neuroscience',
    fieldId: 28,
    openAlexName: 'Computational Neuroscience (curated)',
    fieldWorks: 0,
    subfields: [],
    fetchedAt: new Date().toISOString().slice(0, 10),
    scholars: out,
  }));
  console.log(`collection         ${out.length} of ${legacy.length} legacy scholars`);
}

async function main() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
  const only = process.argv[2];
  for (const d of DISCIPLINES) {
    if (only && d.slug !== only) continue;
    await buildDiscipline(d);
  }
  if (!only || only === 'collection') await buildCollection();
  console.log(`\n${calls} uncached API calls, ~$${spent.toFixed(4)} of OpenAlex budget`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
